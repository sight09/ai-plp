import React from 'react';
import { MapPin, DollarSign, Star, ExternalLink, Calendar } from 'lucide-react';
import { JobBoostButton } from './JobBoostButton';
import { useAuth } from '../hooks/useAuth';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
  matchScore?: number;
  matchingSkills?: string[];
  onClick?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  matchScore, 
  matchingSkills = [], 
  onClick 
}) => {
  const { user } = useAuth();
  const isOwner = user?.id === job.employer_id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group relative ${
        job.boosted ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''
      }`}
      onClick={onClick}
    >
      {job.boosted && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          BOOSTED
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            {job.location && (
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>
            )}
            {job.salary_range && (
              <div className="flex items-center space-x-1">
                <DollarSign size={16} />
                <span>{job.salary_range}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{formatDate(job.created_at)}</span>
            </div>
          </div>
        </div>

        {matchScore && (
          <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400 fill-current" />
            <span className="text-yellow-700 dark:text-yellow-300 font-semibold text-sm">
              {matchScore}%
            </span>
          </div>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
        {job.description}
      </p>

      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Requirements:
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 4).map((req, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  matchingSkills.includes(req)
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 4 && (
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                +{job.requirements.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {matchingSkills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Your Matching Skills:
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchingSkills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {matchingSkills.length > 3 && (
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                +{matchingSkills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
          <ExternalLink size={16} />
          <span>Apply</span>
        </button>
        {isOwner && !job.boosted && (
          <JobBoostButton jobId={job.id} />
        )}
        <button className="border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors">
          Save
        </button>
      </div>
    </div>
  );
};