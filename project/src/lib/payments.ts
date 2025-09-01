import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  type: 'subscription' | 'job_boost';
  jobId?: string;
}

export interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  callback: (response: any) => void;
  onClose: () => void;
}

// Stripe payment processing
export const processStripePayment = async (paymentData: PaymentData) => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  try {
    // Create payment intent on the server
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const { clientSecret } = await response.json();

    // Confirm payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: {
          // This would be populated by Stripe Elements
        },
      },
    });

    return result;
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw error;
  }
};

// Paystack payment processing
export const processPaystackPayment = (config: PaystackConfig) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore - Paystack is loaded via script tag
    if (typeof PaystackPop === 'undefined') {
      reject(new Error('Paystack not loaded'));
      return;
    }

    // @ts-ignore
    const handler = PaystackPop.setup({
      ...config,
      callback: (response: any) => {
        config.callback(response);
        resolve(response);
      },
      onClose: () => {
        config.onClose();
        reject(new Error('Payment cancelled'));
      },
    });

    handler.openIframe();
  });
};

// Generate payment reference
export const generatePaymentRef = () => {
  return `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Payment amounts (in cents for Stripe, kobo for Paystack)
export const PAYMENT_AMOUNTS = {
  PREMIUM_MONTHLY: 1900, // $19.00
  JOB_BOOST: 2900, // $29.00
};

// Currency conversion for different regions
export const getCurrencyForRegion = (country?: string) => {
  const africanCountries = ['NG', 'GH', 'KE', 'ZA', 'EG', 'MA', 'TN'];
  
  if (country && africanCountries.includes(country)) {
    return 'NGN'; // Nigerian Naira for African countries
  }
  
  return 'USD'; // Default to USD
};

// Convert amounts based on currency
export const convertAmount = (amount: number, currency: string) => {
  const conversionRates = {
    USD: 1,
    NGN: 1600, // Approximate conversion rate
  };

  return Math.round(amount * (conversionRates[currency as keyof typeof conversionRates] || 1));
};