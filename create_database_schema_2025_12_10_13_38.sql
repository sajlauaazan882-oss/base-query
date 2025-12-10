-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles_2025_12_10_13_38 (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    lessons_completed INTEGER DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons_2025_12_10_13_38 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    content JSONB NOT NULL,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    category TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    estimated_time INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises_2025_12_10_13_38 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons_2025_12_10_13_38(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    hints JSONB DEFAULT '[]',
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    points INTEGER DEFAULT 10,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS public.user_progress_2025_12_10_13_38 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons_2025_12_10_13_38(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0,
    UNIQUE(user_id, lesson_id)
);

-- Create exercise attempts table
CREATE TABLE IF NOT EXISTS public.exercise_attempts_2025_12_10_13_38 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises_2025_12_10_13_38(id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    hints_used INTEGER DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles_2025_12_10_13_38 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons_2025_12_10_13_38 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises_2025_12_10_13_38 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress_2025_12_10_13_38 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_attempts_2025_12_10_13_38 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User profiles: users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles_2025_12_10_13_38
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles_2025_12_10_13_38
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles_2025_12_10_13_38
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Lessons: public read access
CREATE POLICY "Anyone can view lessons" ON public.lessons_2025_12_10_13_38
    FOR SELECT USING (true);

-- Exercises: public read access
CREATE POLICY "Anyone can view exercises" ON public.exercises_2025_12_10_13_38
    FOR SELECT USING (true);

-- User progress: users can only see their own progress
CREATE POLICY "Users can view own progress" ON public.user_progress_2025_12_10_13_38
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress_2025_12_10_13_38
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress_2025_12_10_13_38
    FOR UPDATE USING (auth.uid() = user_id);

-- Exercise attempts: users can only see their own attempts
CREATE POLICY "Users can view own attempts" ON public.exercise_attempts_2025_12_10_13_38
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON public.exercise_attempts_2025_12_10_13_38
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_2025_12_10_13_38()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles_2025_12_10_13_38 (id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created_2025_12_10_13_38
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_2025_12_10_13_38();

-- Insert sample lessons and exercises
INSERT INTO public.lessons_2025_12_10_13_38 (title, slug, description, content, difficulty_level, category, order_index, estimated_time) VALUES
('Введение в базы данных', 'intro-to-databases', 'Основные понятия баз данных и СУБД', '{"sections": [{"title": "Что такое база данных?", "content": "База данных - это организованная коллекция структурированной информации или данных, которые обычно хранятся в электронном виде в компьютерной системе."}, {"title": "Типы баз данных", "content": "Существует несколько типов баз данных: реляционные, документные, графовые, колоночные и другие."}]}', 1, 'Основы', 1, 45),
('Основы SQL', 'sql-basics', 'Изучение основных команд SQL', '{"sections": [{"title": "Что такое SQL?", "content": "SQL (Structured Query Language) - это стандартный язык для работы с реляционными базами данных."}, {"title": "Основные команды", "content": "SELECT, INSERT, UPDATE, DELETE - основные команды для работы с данными."}]}', 1, 'Основы', 2, 60),
('SELECT запросы', 'select-queries', 'Изучение команды SELECT для выборки данных', '{"sections": [{"title": "Синтаксис SELECT", "content": "SELECT column1, column2 FROM table_name;"}, {"title": "Фильтрация данных", "content": "Использование WHERE для фильтрации результатов."}]}', 2, 'Запросы', 3, 75);

-- Insert sample exercises
INSERT INTO public.exercises_2025_12_10_13_38 (lesson_id, title, description, question, correct_answer, hints, difficulty_level, points, order_index) VALUES
((SELECT id FROM public.lessons_2025_12_10_13_38 WHERE slug = 'intro-to-databases'), 'Определение базы данных', 'Выберите правильное определение базы данных', 'Что такое база данных?', 'Организованная коллекция структурированной информации', '["База данных хранит информацию", "Данные должны быть структурированы"]', 1, 10, 1),
((SELECT id FROM public.lessons_2025_12_10_13_38 WHERE slug = 'sql-basics'), 'Расшифровка SQL', 'Что означает аббревиатура SQL?', 'Расшифруйте SQL:', 'Structured Query Language', '["SQL - это язык", "Используется для запросов"]', 1, 10, 1),
((SELECT id FROM public.lessons_2025_12_10_13_38 WHERE slug = 'select-queries'), 'Простой SELECT', 'Напишите запрос для выборки всех данных из таблицы users', 'Выберите все данные из таблицы users:', 'SELECT * FROM users;', '["Используйте * для выбора всех колонок", "Не забудьте точку с запятой"]', 2, 15, 1);