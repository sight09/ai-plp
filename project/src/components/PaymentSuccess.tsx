import React from 'react';
import { CheckCircle, Crown, Zap, ArrowRight } from 'lucide-react';

interface PaymentSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'premium' | 'job_boost';
  onContinue: () => void;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  isOpen,
  onClose,
  type,
  onContinue,
}) => {
  if (!isOpen) return null;

  const isPremium = type === 'premium';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
            isPremium 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
              : 'bg-gradient-to-r from-green-400 to-blue-500'
          }`}>
            {isPremium ? (
              <Crown className="h-10 w-10 text-white" />
            ) : (
              <Zap className="h-10 w-10 text-white" />
            )}
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {isPremium ? 'Welcome to Premium!' : 'Job Post Boosted!'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isPremium 
              ? 'You now have access to all premium features including AI-powered CV rewriting and advanced job matching.'
              : 'Your job post is now featured and will receive 3x more visibility for the next 30 days.'
            }
          </p>

          {/* Features List */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {isPremium ? 'Premium Features Unlocked:' : 'Boost Benefits:'}
            </h3>
            <div className="space-y-2 text-sm">
              {isPremium ? (
                <>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">AI-Powered CV Rewriting</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited Job Matches</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Priority Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced Analytics</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Featured in Search Results</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">3x More Visibility</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Highlighted Badge</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">30-Day Duration</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={onContinue}
              className={`w-full font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                isPremium
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
              }`}
            >
              <span>
                {isPremium ? 'Explore Premium Features' : 'View Boosted Job'}
              </span>
              <ArrowRight size={20} />
            </button>
            
            <button
              onClick={onClose}
              className="w-full border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};