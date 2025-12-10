import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Code, 
  Users, 
  BookOpen, 
  Trophy, 
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Target,
  Zap,
  Award,
  Crown,
  Rocket,
  TrendingUp,
  Globe,
  Shield
} from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
  onShowAuth: () => void;
  user: any;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onShowAuth, user }) => {
  const features = [
    {
      icon: <Database className="h-8 w-8 text-slate-700 dark:text-slate-300" />,
      title: "Complete SQL Curriculum",
      description: "From database fundamentals to advanced analytics and performance optimization"
    },
    {
      icon: <Code className="h-8 w-8 text-green-600" />,
      title: "500+ Interactive Exercises",
      description: "Hands-on practice with instant feedback and progressive difficulty levels"
    },
    {
      icon: <Award className="h-8 w-8 text-orange-500" />,
      title: "Industry Certificates",
      description: "Earn recognized certificates to showcase your SQL expertise to employers"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Progress Analytics",
      description: "Track your learning journey with detailed analytics and personalized insights"
    }
  ];

  const stats = [
    { number: "20+", label: "Course Modules", icon: <BookOpen className="h-5 w-5" /> },
    { number: "500+", label: "Practice Exercises", icon: <Target className="h-5 w-5" /> },
    { number: "5", label: "Skill Levels", icon: <Star className="h-5 w-5" /> },
    { number: "3", label: "Certificate Types", icon: <Award className="h-5 w-5" /> }
  ];

  const learningPath = [
    {
      title: "Database Fundamentals",
      description: "Learn database concepts, RDBMS principles, and data modeling basics",
      level: 1,
      lessons: 3,
      badge: "Beginner"
    },
    {
      title: "SQL Querying Mastery",
      description: "Master SELECT, WHERE, JOIN operations and data retrieval techniques",
      level: 2,
      lessons: 6,
      badge: "Intermediate"
    },
    {
      title: "Advanced Analytics",
      description: "Window functions, subqueries, and complex analytical operations",
      level: 3,
      lessons: 4,
      badge: "Advanced"
    },
    {
      title: "Performance & Security",
      description: "Query optimization, indexing strategies, and database security",
      level: 4,
      lessons: 3,
      badge: "Expert"
    },
    {
      title: "Business Intelligence",
      description: "Data warehousing, ETL processes, and enterprise-level SQL",
      level: 5,
      lessons: 4,
      badge: "Professional"
    }
  ];

  const subscriptionPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Access to 10 lessons",
        "100 practice exercises",
        "Basic progress tracking",
        "Community support"
      ],
      buttonText: "Get Started Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      description: "For serious learners",
      features: [
        "All 20+ lessons unlocked",
        "500+ practice exercises",
        "Advanced analytics",
        "Industry certificates",
        "Priority support",
        "Offline access"
      ],
      buttonText: "Start Pro Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "Custom learning paths",
        "Advanced reporting",
        "SSO integration",
        "Dedicated support"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                <Rocket className="h-3 w-3 mr-1" />
                Professional SQL Training Platform
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                Master SQL with
                <span className="block bg-gradient-to-r from-slate-700 via-blue-600 to-slate-800 bg-clip-text text-transparent">
                  Interactive Learning
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Build database expertise through hands-on practice, earn industry-recognized certificates, 
                and advance your career with our comprehensive SQL curriculum
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" onClick={onGetStarted} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                  <Play className="h-5 w-5 mr-2" />
                  Continue Learning
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={onShowAuth} className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                    <Play className="h-5 w-5 mr-2" />
                    Start Learning Free
                  </Button>
                  <Button size="lg" variant="outline" onClick={onGetStarted} className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                    Explore Curriculum
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.number}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Why Choose Our Platform?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Professional-grade SQL education designed for real-world success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center card-hover border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Structured Learning Path</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Progress from beginner to expert with our carefully designed curriculum
            </p>
          </div>

          <div className="space-y-6">
            {learningPath.map((step, index) => (
              <Card key={index} className="card-hover border-slate-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-slate-900 dark:bg-slate-100 rounded-full flex items-center justify-center text-white dark:text-slate-900 font-bold">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                        <Badge variant="outline" className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300">
                          {step.badge}
                        </Badge>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                          {step.lessons} lessons
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
                    </div>
                    
                    <ArrowRight className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Choose Your Plan</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Start free and upgrade as you grow your SQL expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, index) => (
              <Card key={index} className={`relative card-hover border-slate-200 dark:border-slate-700 ${plan.popular ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl text-slate-900 dark:text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-slate-600 dark:text-slate-400">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-400">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200'}`}
                    onClick={user ? onGetStarted : onShowAuth}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-800 dark:bg-slate-700 rounded-full">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Become a SQL Expert?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of professionals who have advanced their careers with our SQL training
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={user ? onGetStarted : onShowAuth}
              className="bg-white text-slate-900 hover:bg-slate-100"
            >
              <Play className="h-5 w-5 mr-2" />
              {user ? 'Continue Learning' : 'Start Free Today'}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Shield className="h-5 w-5 mr-2" />
              View Certificates
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};