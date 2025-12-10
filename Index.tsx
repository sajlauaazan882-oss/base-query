import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HomePage } from '@/components/HomePage';
import { LessonsList } from '@/components/LessonsList';
import { LessonView } from '@/components/LessonView';
import { AuthModal, useAuth } from '@/components/Auth';

interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: any;
  difficulty_level: number;
  category: string;
  order_index: number;
  estimated_time: number;
}

type ViewType = 'home' | 'lessons' | 'lesson';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'lesson') {
      setSelectedLesson(null);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lesson');
  };

  const handleGetStarted = () => {
    setCurrentView('lessons');
  };

  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentView={currentView}
        onNavigate={handleNavigate}
        onShowAuth={handleShowAuth}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <HomePage 
            onGetStarted={handleGetStarted}
            onShowAuth={handleShowAuth}
            user={user}
          />
        )}
        
        {currentView === 'lessons' && (
          <LessonsList onSelectLesson={handleSelectLesson} />
        )}
        
        {currentView === 'lesson' && selectedLesson && (
          <LessonView 
            lesson={selectedLesson}
            onBack={() => handleNavigate('lessons')}
          />
        )}
      </main>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleCloseAuth}
      />
    </div>
  );
};

export default Index;
