import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AuthForm } from './components/AuthForm';
import { Home } from './pages/Home';
import { UploadResume } from './pages/UploadResume';
import { FindMatches } from './pages/FindMatches';
import { RewriteCV } from './pages/RewriteCV';
import { PostJob } from './pages/PostJob';
import { Premium } from './pages/Premium';
import { PaymentHistory } from './pages/PaymentHistory';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user && currentPage !== 'home' && currentPage !== 'auth') {
    setCurrentPage('auth');
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthForm />;
      case 'upload':
        return <UploadResume />;
      case 'matches':
        return <FindMatches />;
      case 'rewrite':
        return <RewriteCV onPageChange={setCurrentPage} />;
      case 'post-job':
        return <PostJob />;
      case 'premium':
        return <Premium />;
      case 'payments':
        return <PaymentHistory />;
      default:
        return <Home onPageChange={setCurrentPage} />;
    }
  };

  if (currentPage === 'auth') {
    return <AuthForm />;
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        {renderPage()}
      </div>
    </div>
  );
}

export default App;