import React from 'react';
import { Upload, Search, FileEdit, Briefcase, Crown, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PremiumButton } from '../components/PremiumButton';

interface HomeProps {
  onPageChange: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onPageChange }) => {
  const { user, appUser } = useAuth();

  const features = [
    {
      id: 'upload',
      title: 'Upload Resume',
      description: 'AI-powered resume parsing and analysis',
      icon: Upload,
      color: 'bg-blue-500',
    },
    {
      id: 'matches',
      title: 'Find Job Matches',
      description: 'Get personalized job recommendations',
      icon: Search,
      color: 'bg-green-500',
    },
    {
      id: 'rewrite',
      title: 'Rewrite CV',
      description: 'Premium AI-enhanced resume optimization',
      icon: FileEdit,
      color: 'bg-purple-500',
      premium: true,
    },
    {
      id: 'post-job',
      title: 'Post Job',
      description: 'Hire top talent with AI-refined job posts',
      icon: Briefcase,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI-Powered Job Matching
              <span className="block text-2xl md:text-4xl mt-2 text-blue-200">
                for Modern Professionals
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Upload your resume, get matched with perfect jobs, and enhance your CV with cutting-edge AI technology.
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!appUser?.premium && (
                  <PremiumButton size="lg" />
                )}
                <button
                  onClick={() => onPageChange('upload')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Upload size={20} />
                  <span>Upload Resume</span>
                </button>
                <button
                  onClick={() => onPageChange('matches')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center space-x-2"
                >
                  <Search size={20} />
                  <span>Find Matches</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onPageChange('auth')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform streamlines your job search with intelligent matching and professional enhancement tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isPremiumLocked = feature.premium && !appUser?.premium;
            
            return (
              <div
                key={feature.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative"
                onClick={() => onPageChange(feature.id)}
              >
                {isPremiumLocked && (
                  <div className="absolute top-3 right-3">
                    <Crown size={20} className="text-yellow-500" />
                  </div>
                )}
                
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                  <span>Learn more</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
              <div className="text-gray-600 dark:text-gray-400">Match Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Companies Hiring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};