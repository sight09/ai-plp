import React, { useState } from 'react';
import { Briefcase, Plus, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { JobBoostButton } from '../components/JobBoostButton';

export const PostJob: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary_range: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [enhancedDescription, setEnhancedDescription] = useState('');
  const [postedJobId, setPostedJobId] = useState<string>('');

  const enhanceJobDescription = async (title: string, description: string) => {
    // Simulate AI enhancement
    const enhanced = `
🚀 Exciting Opportunity: ${title}

We are seeking a talented ${title} to join our dynamic team. This role offers the perfect blend of challenge and growth opportunities in a collaborative environment.

🎯 What You'll Do:
${description}

💼 What We Offer:
• Competitive salary and comprehensive benefits package
• Flexible work arrangements and remote-friendly culture
• Professional development opportunities and learning stipend
• Collaborative team environment with growth potential
• Modern tools and technology stack
• Health, dental, and vision insurance
• Generous PTO and work-life balance focus

🌟 Why Join Us:
Be part of a forward-thinking organization that values innovation, diversity, and professional growth. We're committed to creating an inclusive workplace where every team member can thrive and make a meaningful impact.

Ready to take your career to the next level? We'd love to hear from you!
    `;

    return enhanced.trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Enhance job description with AI
      const enhanced = await enhanceJobDescription(formData.title, formData.description);
      setEnhancedDescription(enhanced);

      // Parse requirements
      const requirements = formData.requirements
        .split(',')
        .map(req => req.trim())
        .filter(req => req.length > 0);

      // Save to database
      const { data: jobData, error: dbError } = await supabase
        .from('jobs')
        .insert({
          employer_id: user.id,
          title: formData.title,
          description: enhanced,
          requirements,
          salary_range: formData.salary_range,
          location: formData.location,
        });
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      setPostedJobId(jobData.id);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        requirements: '',
        salary_range: '',
        location: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to post a job
          </h2>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Job Posted Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your job has been enhanced with AI and is now live
              </p>
            </div>

            {enhancedDescription && (
              <div className="text-left mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <span>AI-Enhanced Job Description</span>
                </h3>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {enhancedDescription}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSuccess(false);
                  setEnhancedDescription('');
                  setPostedJobId('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Post Another Job
              </button>
              {postedJobId && (
                <JobBoostButton 
                  jobId={postedJobId}
                  onBoostSuccess={() => {
                    // Optionally refresh or show additional success message
                  }}
                />
              )}
              <button
                className="border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                View Job Board
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Post a Job
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Our AI will enhance your job description for maximum reach
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="e.g., San Francisco, CA / Remote"
                  />
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary Range
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="salary_range"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="e.g., $80,000 - $120,000"
                  />
                  <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requirements (comma-separated)
              </label>
              <input
                type="text"
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="e.g., React, TypeScript, 3+ years experience"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Posting Job...</span>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Post Job with AI Enhancement</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};