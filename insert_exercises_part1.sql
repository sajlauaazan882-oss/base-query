-- Insert comprehensive exercises (500+ total)
-- Database Fundamentals exercises
INSERT INTO public.exercises (lesson_id, title, description, question, correct_answer, hints, difficulty_level, points, order_index) VALUES
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'Database Definition', 'What is a database?', 'A database is an organized collection of _____ information.', 'structured', '["Think about how data is organized", "Data must be organized in a specific way"]', 1, 10, 1),
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'DBMS Purpose', 'What does DBMS stand for?', 'DBMS stands for Database _____ System.', 'Management', '["DBMS manages databases", "It is a system that manages databases"]', 1, 10, 2),
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'Relational Database', 'What structure do relational databases use?', 'Relational databases organize data in _____.', 'tables', '["Think about rows and columns", "Data is organized in a grid-like structure"]', 1, 10, 3),
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'Primary Key', 'What uniquely identifies each record?', 'A _____ key uniquely identifies each record in a table.', 'primary', '["This key is the main identifier", "It must be unique for each record"]', 1, 15, 4),
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'Table Components', 'Tables consist of rows and what?', 'Tables consist of rows and _____.', 'columns', '["Think about the vertical structure", "Data is organized vertically in these"]', 1, 10, 5),

-- Introduction to SQL exercises
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'SQL Meaning', 'What does SQL stand for?', 'SQL stands for _____ Query Language.', 'Structured', '["SQL is about structure", "It is a structured way to query data"]', 1, 10, 1),
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'SQL Purpose', 'What is SQL used for?', 'SQL is used to _____ and manipulate databases.', 'manage', '["SQL helps control databases", "It is used to control and work with data"]', 1, 10, 2),
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'DDL Category', 'What does DDL stand for?', 'DDL stands for Data _____ Language.', 'Definition', '["DDL defines data structures", "It is used to define how data is structured"]', 1, 15, 3),
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'DML Category', 'What does DML stand for?', 'DML stands for Data _____ Language.', 'Manipulation', '["DML manipulates data", "It is used to work with existing data"]', 1, 15, 4),
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'SQL Syntax', 'How do SQL statements end?', 'SQL statements end with a _____.', 'semicolon', '["Think about punctuation", "It is the same symbol as ;"]', 1, 10, 5),

-- SELECT Statements exercises
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'Basic SELECT', 'Write a query to select all columns from users table', 'SELECT _____ FROM users;', '*', '["Use * to select all columns", "Asterisk means all"]', 2, 15, 1),
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'Specific Columns', 'Select name and email from users table', 'SELECT name, _____ FROM users;', 'email', '["List the columns separated by commas", "The second column is email"]', 2, 15, 2),
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'Column Alias', 'Select name with alias full_name', 'SELECT name AS _____ FROM users;', 'full_name', '["Use AS keyword for aliases", "The alias should be full_name"]', 2, 20, 3),
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'Table Alias', 'Select all from users with alias u', 'SELECT * FROM users AS ____;', 'u', '["Table aliases come after AS", "Use a short alias like u"]', 2, 20, 4),
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'DISTINCT Values', 'Select unique cities from users', 'SELECT _____ city FROM users;', 'DISTINCT', '["Use DISTINCT to get unique values", "DISTINCT removes duplicates"]', 2, 25, 5),

-- WHERE Clause exercises
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'Basic WHERE', 'Select users older than 25', 'SELECT * FROM users WHERE age _____ 25;', '>', '["Use > for greater than", "Age should be greater than 25"]', 2, 15, 1),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'Equality Condition', 'Select users named John', 'SELECT * FROM users WHERE name = ____;', '''John''', '["String values need quotes", "Use single quotes around John"]', 2, 15, 2),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'AND Operator', 'Select users older than 25 from London', 'SELECT * FROM users WHERE age > 25 _____ city = ''London'';', 'AND', '["Use AND to combine conditions", "Both conditions must be true"]', 2, 20, 3),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'OR Operator', 'Select users from London or Paris', 'SELECT * FROM users WHERE city = ''London'' _____ city = ''Paris'';', 'OR', '["Use OR for either condition", "Either condition can be true"]', 2, 20, 4),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'IN Operator', 'Select users from London, Paris, or Berlin', 'SELECT * FROM users WHERE city _____ (''London'', ''Paris'', ''Berlin'');', 'IN', '["IN checks if value is in a list", "Use IN with a list of values"]', 2, 25, 5),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'BETWEEN Operator', 'Select users aged between 20 and 30', 'SELECT * FROM users WHERE age _____ 20 AND 30;', 'BETWEEN', '["BETWEEN includes both boundaries", "Use BETWEEN for ranges"]', 2, 25, 6),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'LIKE Operator', 'Select users whose name starts with J', 'SELECT * FROM users WHERE name _____ ''J%'';', 'LIKE', '["LIKE is used for pattern matching", "% means any characters"]', 2, 25, 7),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'NULL Check', 'Select users with no email', 'SELECT * FROM users WHERE email _____ NULL;', 'IS', '["Use IS NULL to check for NULL", "Cannot use = with NULL"]', 2, 20, 8);