import React, { useState } from 'react';
import { Crown, Check, Sparkles, Zap, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PremiumButton } from '../components/PremiumButton';

export const Premium: React.FC = () => {
  const { appUser } = useAuth();

  const features = [
    { title: 'AI-Powered CV Rewriting', included: true },
    { title: 'Unlimited Job Matches', included: true },
    { title: 'Priority Support', included: true },
    { title: 'Advanced Analytics', included: true },
    { title: 'Resume Templates', included: true },
    { title: 'Interview Preparation', included: true },
  ];

  if (appUser?.premium) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-8 text-center text-white">
            <Crown className="mx-auto h-16 w-16 mb-4" />
            <h1 className="text-3xl font-bold mb-4">You're Already Premium!</h1>
            <p className="text-xl mb-6">
              Enjoy unlimited access to all our AI-powered features
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                  <Check className="h-5 w-5 text-green-300" />
                  <span>{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Crown className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock Premium Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Take your job search to the next level with AI-powered tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">$0</div>
              <p className="text-gray-600 dark:text-gray-400">per month</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Resume upload & parsing</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Basic job matching</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Job posting</span>
              </li>
            </ul>

            <button className="w-full border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-2">$19</div>
              <p className="text-blue-100">per month</p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-300" />
                  <span>{feature.title}</span>
                </li>
              ))}
            </ul>

            <PremiumButton size="lg" />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Why Upgrade to Premium?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI Enhancement
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Transform your resume with professional AI rewriting and optimization
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Matching
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get more accurate job matches with our premium AI algorithms
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Priority Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get dedicated support and faster response times
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};