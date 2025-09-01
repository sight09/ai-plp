import React, { useState } from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { PaymentSuccess } from './PaymentSuccess';
import { useAuth } from '../hooks/useAuth';

interface PremiumButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onUpgradeSuccess?: () => void;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onUpgradeSuccess,
}) => {
  const { appUser } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
    onUpgradeSuccess?.();
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
    // Reload page to update auth state
    window.location.reload();
  };

  if (appUser?.premium) {
    return (
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <Crown className="h-4 w-4" />
        <span className="font-medium">Premium Active</span>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg',
    secondary: 'border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
  };

  return (
    <>
      <button
        onClick={() => setShowPaymentModal(true)}
        className={`
          inline-flex items-center space-x-2 font-semibold rounded-lg transition-all transform hover:scale-105
          ${sizeClasses[size]} ${variantClasses[variant]}
        `}
      >
        <Sparkles className="h-4 w-4" />
        <span>Go Premium</span>
      </button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        type="premium"
        onSuccess={handlePaymentSuccess}
      />

      <PaymentSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="premium"
        onContinue={handleSuccessContinue}
      />
    </>
  );
};