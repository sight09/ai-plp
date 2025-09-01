import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Shield, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { 
  generatePaymentRef, 
  PAYMENT_AMOUNTS, 
  getCurrencyForRegion, 
  convertAmount,
  type PaymentData 
} from '../lib/payments';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'premium' | 'job_boost';
  jobId?: string;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  type,
  jobId,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<'stripe' | 'paystack'>('stripe');
  const [loading, setLoading] = useState(false);
  const [userCountry, setUserCountry] = useState<string>('US');

  useEffect(() => {
    // Detect user's country (simplified - in production use proper geolocation)
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserCountry(data.country_code || 'US');
        
        // Auto-select Paystack for African countries
        const africanCountries = ['NG', 'GH', 'KE', 'ZA', 'EG', 'MA', 'TN'];
        if (africanCountries.includes(data.country_code)) {
          setSelectedProvider('paystack');
        }
      } catch (error) {
        console.log('Could not detect country, defaulting to US');
      }
    };

    if (isOpen) {
      detectCountry();
    }
  }, [isOpen]);

  const getPaymentDetails = () => {
    const currency = getCurrencyForRegion(userCountry);
    const baseAmount = type === 'premium' ? PAYMENT_AMOUNTS.PREMIUM_MONTHLY : PAYMENT_AMOUNTS.JOB_BOOST;
    const amount = convertAmount(baseAmount, currency);

    return {
      amount,
      currency,
      description: type === 'premium' ? 'Premium Monthly Subscription' : 'Job Post Boost',
      title: type === 'premium' ? 'Upgrade to Premium' : 'Boost Your Job Post',
      features: type === 'premium' 
        ? ['AI-Powered CV Rewriting', 'Unlimited Job Matches', 'Priority Support', 'Advanced Analytics']
        : ['Featured in Search Results', '3x More Visibility', 'Highlighted Badge', '30-Day Boost Duration']
    };
  };

  const handleStripePayment = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const paymentDetails = getPaymentDetails();
      
      // Create payment record
      const paymentRef = generatePaymentRef();
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: paymentDetails.amount,
          status: 'pending',
          type,
          description: paymentDetails.description,
          provider: 'stripe',
          job_id: jobId || null,
          stripe_payment_id: paymentRef,
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Simulate Stripe payment (in production, use Stripe Elements)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment status
      await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      // Update user/job based on payment type
      if (type === 'premium') {
        await supabase
          .from('users')
          .update({ 
            premium: true,
            subscription_status: 'active',
            subscription_id: paymentRef
          })
          .eq('id', user.id);
      } else if (jobId) {
        await supabase
          .from('jobs')
          .update({ boosted: true })
          .eq('id', jobId);
      }

      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaystackPayment = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const paymentDetails = getPaymentDetails();
      const paymentRef = generatePaymentRef();

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: paymentDetails.amount,
          status: 'pending',
          type,
          description: paymentDetails.description,
          provider: 'paystack',
          job_id: jobId || null,
          stripe_payment_id: paymentRef,
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Simulate Paystack payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment status
      await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      // Update user/job based on payment type
      if (type === 'premium') {
        await supabase
          .from('users')
          .update({ 
            premium: true,
            subscription_status: 'active',
            subscription_id: paymentRef
          })
          .eq('id', user.id);
      } else if (jobId) {
        await supabase
          .from('jobs')
          .update({ boosted: true })
          .eq('id', jobId);
      }

      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (selectedProvider === 'stripe') {
      handleStripePayment();
    } else {
      handlePaystackPayment();
    }
  };

  if (!isOpen) return null;

  const paymentDetails = getPaymentDetails();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {paymentDetails.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price Display */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {paymentDetails.currency === 'NGN' ? '₦' : '$'}
              {(paymentDetails.amount / (paymentDetails.currency === 'NGN' ? 100 : 100)).toLocaleString()}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {type === 'premium' ? 'per month' : 'one-time boost'}
            </p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              What's included:
            </h3>
            <div className="space-y-2">
              {paymentDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Provider Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Choose Payment Method:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedProvider('stripe')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedProvider === 'stripe'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                }`}
              >
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">Stripe</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Cards, Apple Pay, Google Pay</div>
              </button>

              <button
                onClick={() => setSelectedProvider('paystack')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedProvider === 'paystack'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                }`}
              >
                <Smartphone className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">Paystack</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Mobile Money, Bank Transfer</div>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">Secure Payment</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <CreditCard size={20} />
                <span>
                  Pay with {selectedProvider === 'stripe' ? 'Stripe' : 'Paystack'}
                </span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};