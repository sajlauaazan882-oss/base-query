import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Trophy,
  Clock,
  Target,
  Code,
  Award,
  Star
} from 'lucide-react';
import { useAuth } from './Auth';
import { useToast } from '@/hooks/use-toast';

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

interface Exercise {
  id: string;
  lesson_id: string;
  title: string;
  description: string;
  question: string;
  correct_answer: string;
  hints: string[];
  difficulty_level: number;
  points: number;
  order_index: number;
}

interface LessonViewProps {
  lesson: Lesson;
  onBack: () => void;
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

export const LessonView: React.FC<LessonViewProps> = ({ lesson, onBack }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [exerciseResults, setExerciseResults] = useState<Record<string, boolean>>({});
  const [completedExercises, setCompletedExercises] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchExercises();
  }, [lesson.id]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('order_index');

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const currentExercise = exercises[currentExerciseIndex];

  const checkAnswer = async () => {
    if (!currentExercise || !user) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentExercise.correct_answer.toLowerCase();
    
    // Record attempt
    try {
      await supabase
        .from('exercise_attempts')
        .insert({
          user_id: user.id,
          exercise_id: currentExercise.id,
          user_answer: userAnswer,
          is_correct: isCorrect,
          hints_used: hintsUsed
        });
    } catch (error) {
      console.error('Error recording attempt:', error);
    }

    // Update results
    setExerciseResults(prev => ({
      ...prev,
      [currentExercise.id]: isCorrect
    }));

    if (isCorrect) {
      const points = Math.max(currentExercise.points - (hintsUsed * 2), 1);
      setTotalScore(prev => prev + points);
      setCompletedExercises(prev => prev + 1);
      
      toast({
        title: "Correct!",
        description: `You earned ${points} points`,
      });

      // Move to next exercise after delay
      setTimeout(() => {
        if (currentExerciseIndex < exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setUserAnswer('');
          setShowHints(false);
          setHintsUsed(0);
        } else {
          // Lesson completed
          completeLesson();
        }
      }, 1500);
    } else {
      toast({
        title: "Incorrect",
        description: "Try again or use a hint to help you",
        variant: "destructive",
      });
    }
  };

  const completeLesson = async () => {
    if (!user) return;

    try {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          score: totalScore,
          time_spent: lesson.estimated_time
        });

      setLessonCompleted(true);
      
      toast({
        title: "Lesson Complete!",
        description: `Congratulations! You earned ${totalScore} points`,
      });
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const useHint = () => {
    setShowHints(true);
    setHintsUsed(prev => prev + 1);
  };

  const renderContent = () => {
    if (!lesson.content?.sections) return null;

    return (
      <div className="space-y-6">
        {lesson.content.sections.map((section: any, index: number) => (
          <Card key={index} className="border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 dark:text-white">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert text-slate-700 dark:text-slate-300">
                <p className="whitespace-pre-wrap leading-relaxed">{section.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderExercise = () => {
    if (!currentExercise) return null;

    const isAnswered = exerciseResults[currentExercise.id] !== undefined;
    const isCorrect = exerciseResults[currentExercise.id];

    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Code className="h-5 w-5" />
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </CardTitle>
            <Badge 
              variant="secondary" 
              className={`${difficultyColors[currentExercise.difficulty_level]} text-white`}
            >
              {currentExercise.points} points
            </Badge>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">{currentExercise.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-medium mb-2 text-slate-900 dark:text-white">Question:</h4>
            <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{currentExercise.question}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-white">Your Answer:</label>
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer here..."
              className="sql-code border-slate-300 dark:border-slate-600"
              disabled={isAnswered}
            />
          </div>

          {showHints && currentExercise.hints.length > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Lightbulb className="h-4 w-4" />
                  Hints
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {currentExercise.hints.map((hint, index) => (
                    <li key={index} className="text-sm text-blue-700 dark:text-blue-300">
                      • {hint}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {isAnswered && (
            <Card className={isCorrect ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                {!isCorrect && (
                  <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                    Correct answer: <code className="bg-red-100 dark:bg-red-900/50 px-1 rounded font-mono">{currentExercise.correct_answer}</code>
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            {!isAnswered && (
              <>
                <Button onClick={checkAnswer} disabled={!userAnswer.trim()} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                  Check Answer
                </Button>
                {!showHints && currentExercise.hints.length > 0 && (
                  <Button variant="outline" onClick={useHint} className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Get Hint
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCompletion = () => {
    if (!lessonCompleted) return null;

    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full">
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800 dark:text-green-200">Lesson Complete!</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Congratulations on completing this lesson. You've earned {totalScore} points!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">{completedExercises}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Exercises Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">{totalScore}</div>
              <div className="text-sm text-green-600 dark:text-green-400">Points Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {Math.round((completedExercises / exercises.length) * 100)}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Accuracy</div>
            </div>
          </div>
          <Button onClick={onBack} className="bg-green-600 hover:bg-green-700 text-white">
            <Award className="h-4 w-4 mr-2" />
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lessons
        </Button>
      </div>

      {/* Lesson Info */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-slate-900 dark:text-white">{lesson.title}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">{lesson.description}</CardDescription>
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
                <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                  <Target className="h-4 w-4" />
                  {exercises.length} exercises
                </div>
              </div>
            </div>
            
            {exercises.length > 0 && !lessonCompleted && (
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalScore}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">points</div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      {exercises.length > 0 && !lessonCompleted && (
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-900 dark:text-white">Exercise Progress</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {completedExercises} of {exercises.length}
              </span>
            </div>
            <Progress value={(completedExercises / exercises.length) * 100} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {!lessonCompleted && (
        <div className="flex gap-2">
          <Button 
            variant={showContent ? "default" : "outline"}
            onClick={() => setShowContent(true)}
            className={showContent ? "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200" : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Theory
          </Button>
          {exercises.length > 0 && (
            <Button 
              variant={!showContent ? "default" : "outline"}
              onClick={() => setShowContent(false)}
              className={!showContent ? "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200" : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"}
            >
              <Trophy className="h-4 w-4 mr-2" />
              Exercises
            </Button>
          )}
        </div>
      )}

      <Separator className="bg-slate-200 dark:bg-slate-700" />

      {/* Content */}
      {lessonCompleted ? renderCompletion() : showContent ? renderContent() : renderExercise()}
    </div>
  );
};