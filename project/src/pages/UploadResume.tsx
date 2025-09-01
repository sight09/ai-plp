import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { ParsedResume } from '../types';

export const UploadResume: React.FC = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF or DOCX file');
        setFile(null);
      }
    }
  }, []);

  const parseResume = async (fileContent: string): Promise<ParsedResume> => {
    // Simulate AI parsing with realistic data extraction
    const skills = [];
    const experience = [];

    // Extract skills (simple keyword matching for demo)
    const skillKeywords = [
      'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 
      'Kubernetes', 'TypeScript', 'Vue', 'Angular', 'MongoDB', 'PostgreSQL',
      'Machine Learning', 'Data Analysis', 'Project Management', 'Agile'
    ];

    skillKeywords.forEach(skill => {
      if (fileContent.toLowerCase().includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });

    // Extract experience (simple pattern matching)
    const experiencePatterns = [
      /(\w+\s+\w+)\s+at\s+(\w+)/gi,
      /(\w+\s+\w+)\s+-\s+(\w+)/gi,
      /(Senior|Junior|Lead|Principal)\s+(\w+)/gi
    ];

    experiencePatterns.forEach(pattern => {
      const matches = fileContent.match(pattern);
      if (matches) {
        experience.push(...matches.slice(0, 5)); // Limit to 5 experiences
      }
    });

    // Add some default data if nothing found
    if (skills.length === 0) {
      skills.push('Communication', 'Problem Solving', 'Team Work');
    }
    if (experience.length === 0) {
      experience.push('Professional Experience', 'Project Leadership');
    }

    return { skills: skills.slice(0, 10), experience: experience.slice(0, 8) };
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Simulate file reading (in real app, you'd use FileReader or send to backend)
      const fileText = `Sample resume content for ${file.name}. 
        Experience: Senior Developer at TechCorp, Frontend Engineer at StartupXYZ.
        Skills: JavaScript, React, Node.js, Python, SQL, AWS, Docker.
        Education: Computer Science degree.
        Projects: E-commerce platform, Mobile app development.`;

      // Parse resume content
      const parsed = await parseResume(fileText);
      setParsedData(parsed);

      // Save to Supabase
      const { error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          original_text: fileText,
          skills: parsed.skills,
          experience: parsed.experience,
        });

      if (dbError) {
        throw new Error(dbError.message);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to upload your resume
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Your Resume
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Let our AI analyze your skills and experience
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          {!success ? (
            <>
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-8 text-center mb-6">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    Choose a file or drag and drop
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    PDF or DOCX up to 10MB
                  </p>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {file && (
                <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-400">{error}</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Upload & Analyze</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Resume Uploaded Successfully!
              </h3>
              
              {parsedData && (
                <div className="text-left max-w-2xl mx-auto space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Extracted Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Experience Highlights
                    </h4>
                    <div className="space-y-2">
                      {parsedData.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-gray-700 dark:text-gray-300"
                        >
                          {exp}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onPageChange('matches')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Find Job Matches
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFile(null);
                    setParsedData(null);
                  }}
                  className="border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Upload Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};