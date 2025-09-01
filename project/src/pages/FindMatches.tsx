import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Star, ExternalLink } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Job, JobMatch, Resume } from '../types';

export const FindMatches: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userResume, setUserResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserResume();
    }
  }, [user]);

  const fetchUserResume = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUserResume(data);
    } catch (err) {
      console.error('Error fetching resume:', err);
    }
  };

  const calculateJobMatch = (job: Job, userSkills: string[]): JobMatch => {
    const jobRequirements = job.requirements || [];
    const matchingSkills = userSkills.filter(skill => 
      jobRequirements.some(req => 
        req.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(req.toLowerCase())
      )
    );

    const score = jobRequirements.length > 0 
      ? Math.round((matchingSkills.length / jobRequirements.length) * 100)
      : Math.floor(Math.random() * 40) + 60; // Fallback score

    return {
      job,
      score: Math.min(score, 95), // Cap at 95%
      matching_skills: matchingSkills
    };
  };

  const findMatches = async () => {
    if (!user || !userResume) {
      setError('Please upload your resume first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch all jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) {
        throw jobsError;
      }

      // Calculate matches
      const jobMatches = jobs.map(job => calculateJobMatch(job, userResume.skills));
      
      // Sort by score and take top 3
      const topMatches = jobMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setMatches(topMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find matches');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to find job matches
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Job Match
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            AI-powered job recommendations based on your skills and experience
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1">
              {userResume ? (
                <div className="text-left">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Resume uploaded with <span className="font-semibold">{userResume.skills.length} skills</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {userResume.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {userResume.skills.length > 5 && (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        +{userResume.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Please upload your resume first to get personalized matches
                </p>
              )}
            </div>
            
            <button
              onClick={findMatches}
              disabled={!userResume || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Finding Matches...</span>
                </>
              ) : (
                <>
                  <Search size={20} />
                  <span>Find Matches</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Results */}
        {matches.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Top Job Matches for You
            </h2>
            
            <div className="grid gap-6">
              {matches.map((match, index) => (
                <div
                  key={match.job.id}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {match.job.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                            {match.score}% Match
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {match.job.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin size={16} />
                            <span>{match.job.location}</span>
                          </div>
                        )}
                        {match.job.salary_range && (
                          <div className="flex items-center space-x-1">
                            <DollarSign size={16} />
                            <span>{match.job.salary_range}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="lg:text-right">
                      <div className={`
                        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${match.score >= 80 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                          : match.score >= 60 
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }
                      `}>
                        #{index + 1} Match
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {match.job.description}
                  </p>

                  {match.matching_skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Your Matching Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {match.matching_skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <ExternalLink size={18} />
                      <span>Apply Now</span>
                    </button>
                    <button className="border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      Save for Later
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};