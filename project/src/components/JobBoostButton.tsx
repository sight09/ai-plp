import React, { useState } from 'react';
import { Zap, Crown } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { PaymentSuccess } from './PaymentSuccess';

interface JobBoostButtonProps {
  jobId: string;
  isBoosted?: boolean;
  onBoostSuccess?: () => void;
}

export const JobBoostButton: React.FC<JobBoostButtonProps> = ({
  jobId,
  isBoosted = false,
  onBoostSuccess,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
    onBoostSuccess?.();
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
  };

  if (isBoosted) {
    return (
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <Crown className="h-4 w-4" />
        <span className="font-medium">Boosted</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowPaymentModal(true)}
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg"
      >
        <Zap className="h-4 w-4" />
        <span>Boost Job ($29)</span>
      </button>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        type="job_boost"
        jobId={jobId}
        onSuccess={handlePaymentSuccess}
      />

      <PaymentSuccess
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="job_boost"
        onContinue={handleSuccessContinue}
      />
    </>
  );
};