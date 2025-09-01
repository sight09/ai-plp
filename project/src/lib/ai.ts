// AI utility functions for the platform

export const parseResumeText = async (text: string): Promise<{skills: string[], experience: string[]}> => {
  // In a real implementation, this would call an AI service like OpenAI
  // For demo purposes, we'll use pattern matching and keyword extraction
  
  const skills: string[] = [];
  const experience: string[] = [];

  // Common skills to look for
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Vue', 'Angular',
    'Node.js', 'Express', 'Django', 'Flask', 'SQL', 'MongoDB', 'PostgreSQL',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum',
    'Machine Learning', 'Data Science', 'AI', 'Project Management'
  ];

  // Extract skills
  skillKeywords.forEach(skill => {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  });

  // Extract experience using patterns
  const experiencePatterns = [
    /(?:Senior|Junior|Lead|Principal)\s+[\w\s]+/gi,
    /[\w\s]+\s+at\s+[\w\s]+/gi,
    /[\w\s]+\s+Engineer/gi,
    /[\w\s]+\s+Developer/gi,
    /[\w\s]+\s+Manager/gi,
    /[\w\s]+\s+Analyst/gi
  ];

  experiencePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      experience.push(...matches.slice(0, 3));
    }
  });

  return {
    skills: [...new Set(skills)].slice(0, 10),
    experience: [...new Set(experience)].slice(0, 8)
  };
};

export const enhanceJobDescription = async (title: string, description: string): Promise<string> => {
  // In a real implementation, this would call an AI service
  // For demo purposes, we'll create a professional template
  
  return `
🚀 Exciting Opportunity: ${title}

${description}

What We Offer:
• Competitive compensation package
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements and remote options
• Professional development opportunities
• Modern technology stack and tools
• Collaborative and inclusive work environment

About the Role:
Join our innovative team where you'll have the opportunity to make a significant impact while growing your career. We value creativity, collaboration, and continuous learning.

Ready to take the next step in your career? We'd love to hear from you!
  `.trim();
};

export const calculateJobMatchScore = (userSkills: string[], jobRequirements: string[]): number => {
  if (jobRequirements.length === 0) return Math.floor(Math.random() * 30) + 70;

  const matchingSkills = userSkills.filter(skill => 
    jobRequirements.some(req => 
      req.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(req.toLowerCase())
    )
  );

  const baseScore = (matchingSkills.length / jobRequirements.length) * 100;
  const randomVariance = Math.random() * 20 - 10; // ±10% variance
  
  return Math.min(Math.max(Math.round(baseScore + randomVariance), 30), 95);
};