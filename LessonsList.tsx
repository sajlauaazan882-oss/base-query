import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Clock, Target, ChevronRight, Star, Award, Crown, Lock } from 'lucide-react';
import { useAuth } from './Auth';

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

interface UserProgress {
  lesson_id: string;
  completed_at: string;
  score: number;
}

const difficultyColors = {
  1: 'bg-green-600',
  2: 'bg-blue-600', 
  3: 'bg-orange-500',
  4: 'bg-red-600',
  5: 'bg-purple-600'
};

const difficultyLabels = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
  5: 'Professional'
};

export const LessonsList: React.FC<{ onSelectLesson: (lesson: Lesson) => void }> = ({ onSelectLesson }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Mock subscription status - in real app, fetch from database
  const userSubscription = 'free'; // 'free', 'pro', 'enterprise'
  const freeLimit = 10; // First 10 lessons are free

  useEffect(() => {
    fetchLessons();
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some(progress => progress.lesson_id === lessonId);
  };

  const getLessonScore = (lessonId: string) => {
    const progress = userProgress.find(p => p.lesson_id === lessonId);
    return progress?.score || 0;
  };

  const isLessonLocked = (index: number) => {
    return userSubscription === 'free' && index >= freeLimit;
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const completedLessons = userProgress.length;
  const totalScore = userProgress.reduce((sum, p) => sum + p.score, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-slate-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          SQL Mastery Course
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Master SQL from fundamentals to advanced techniques with hands-on exercises and industry-recognized certificates
        </p>
      </div>

      {user && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Progress Card */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Trophy className="h-5 w-5 text-orange-500" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedLessons}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Lessons Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalScore}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Points Earned</div>
                </div>
              </div>
              <Progress 
                value={(completedLessons / lessons.length) * 100} 
                className="h-2"
              />
              <div className="text-center mt-2 text-sm text-slate-600 dark:text-slate-400">
                {Math.round((completedLessons / lessons.length) * 100)}% Complete
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Crown className="h-5 w-5 text-blue-600" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Current Plan</span>
                  <Badge variant={userSubscription === 'free' ? 'secondary' : 'default'} className="capitalize">
                    {userSubscription}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Access</span>
                  <span className="text-sm text-slate-900 dark:text-white">
                    {userSubscription === 'free' ? `${freeLimit} of ${lessons.length} lessons` : 'All lessons'}
                  </span>
                </div>
                {userSubscription === 'free' && (
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {Object.entries(groupedLessons).map(([category, categoryLessons]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <BookOpen className="h-6 w-6" />
              {category}
            </h2>
            <Badge variant="outline" className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300">
              {categoryLessons.length} lessons
            </Badge>
          </div>
          
          <div className="grid gap-4">
            {categoryLessons.map((lesson, index) => {
              const completed = isLessonCompleted(lesson.id);
              const score = getLessonScore(lesson.id);
              const locked = isLessonLocked(lesson.order_index - 1);
              
              return (
                <Card 
                  key={lesson.id} 
                  className={`cursor-pointer transition-all card-hover border-slate-200 dark:border-slate-700 ${
                    completed ? 'ring-1 ring-green-500/30 bg-green-50/50 dark:bg-green-950/10' : ''
                  } ${locked ? 'opacity-60' : ''}`}
                  onClick={() => !locked && onSelectLesson(lesson)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                          {locked && <Lock className="h-4 w-4 text-slate-400" />}
                          {lesson.title}
                          {completed && <Star className="h-4 w-4 text-orange-500 fill-current" />}
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">{lesson.description}</CardDescription>
                      </div>
                      {!locked && <ChevronRight className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant="secondary" 
                          className={`${difficultyColors[lesson.difficulty_level]} text-white`}
                        >
                          {difficultyLabels[lesson.difficulty_level]}
                        </Badge>
                        
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <Clock className="h-4 w-4" />
                          {lesson.estimated_time} min
                        </div>
                        
                        {completed && (
                          <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                            <Target className="h-4 w-4" />
                            {score} points
                          </div>
                        )}

                        {locked && (
                          <Badge variant="outline" className="border-orange-300 text-orange-700 dark:border-orange-600 dark:text-orange-400">
                            <Crown className="h-3 w-3 mr-1" />
                            Pro Only
                          </Badge>
                        )}
                      </div>
                      
                      <Button variant="ghost" size="sm" disabled={locked} className="text-slate-600 dark:text-slate-400">
                        {locked ? 'Locked' : completed ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {/* Certificate Section */}
      <Card className="border-slate-200 dark:border-slate-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Award className="h-5 w-5 text-orange-500" />
            Earn Your SQL Certificate
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Complete all lessons to earn an industry-recognized SQL proficiency certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                Progress: {completedLessons}/{lessons.length} lessons
              </div>
              <Progress value={(completedLessons / lessons.length) * 100} className="w-64" />
            </div>
            <Button 
              variant="outline" 
              disabled={completedLessons < lessons.length}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950/20"
            >
              <Award className="h-4 w-4 mr-2" />
              {completedLessons >= lessons.length ? 'Claim Certificate' : 'Complete Course'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};