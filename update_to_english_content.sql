-- Clear existing content and add English content
DELETE FROM public.exercises;
DELETE FROM public.lessons;

-- Add certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    certificate_type TEXT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    certificate_url TEXT,
    skills_covered JSONB DEFAULT '[]',
    UNIQUE(user_id, certificate_type)
);

-- Add subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro', 'enterprise')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    features JSONB DEFAULT '[]'
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for certificates
CREATE POLICY "Users can view own certificates" ON public.certificates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates" ON public.certificates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert comprehensive English lessons
INSERT INTO public.lessons (title, slug, description, content, difficulty_level, category, order_index, estimated_time) VALUES
-- Fundamentals
('Database Fundamentals', 'database-fundamentals', 'Understanding databases, DBMS, and relational concepts', '{"sections": [{"title": "What is a Database?", "content": "A database is an organized collection of structured information stored electronically in a computer system, managed by a Database Management System (DBMS)."}, {"title": "Types of Databases", "content": "Relational (SQL), Document (MongoDB), Graph (Neo4j), Key-Value (Redis), and Column-family (Cassandra) databases serve different purposes."}, {"title": "RDBMS Concepts", "content": "Tables, rows, columns, primary keys, foreign keys, and relationships form the foundation of relational databases."}]}', 1, 'Fundamentals', 1, 30),

('Introduction to SQL', 'intro-to-sql', 'SQL basics and core concepts', '{"sections": [{"title": "What is SQL?", "content": "SQL (Structured Query Language) is the standard language for managing and manipulating relational databases."}, {"title": "SQL Categories", "content": "DDL (Data Definition), DML (Data Manipulation), DCL (Data Control), and TCL (Transaction Control) languages."}, {"title": "Basic Syntax", "content": "SQL statements are case-insensitive, end with semicolons, and follow a structured syntax pattern."}]}', 1, 'Fundamentals', 2, 25),

('Table Structure & Data Types', 'table-structure', 'Understanding table design and data types', '{"sections": [{"title": "Table Components", "content": "Tables consist of rows (records) and columns (fields) with defined data types and constraints."}, {"title": "Common Data Types", "content": "INTEGER, VARCHAR, DATE, BOOLEAN, DECIMAL, TEXT, and TIMESTAMP are fundamental SQL data types."}, {"title": "Constraints", "content": "PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK, and DEFAULT constraints ensure data integrity."}]}', 1, 'Fundamentals', 3, 35),

-- Querying Data
('SELECT Statements', 'select-statements', 'Master data retrieval with SELECT', '{"sections": [{"title": "Basic SELECT", "content": "SELECT column1, column2 FROM table_name; retrieves specific columns from a table."}, {"title": "SELECT ALL", "content": "SELECT * FROM table_name; retrieves all columns from a table."}, {"title": "Column Aliases", "content": "SELECT column1 AS alias1 FROM table_name; creates readable column names in results."}]}', 2, 'Querying', 4, 40),

('Filtering with WHERE', 'where-clause', 'Filter data using WHERE conditions', '{"sections": [{"title": "Basic Filtering", "content": "WHERE clause filters records based on specified conditions before returning results."}, {"title": "Comparison Operators", "content": "=, !=, <>, >, <, >=, <= compare values in WHERE conditions."}, {"title": "Logical Operators", "content": "AND, OR, NOT combine multiple conditions for complex filtering."}]}', 2, 'Querying', 5, 45),

('Sorting with ORDER BY', 'order-by', 'Sort query results effectively', '{"sections": [{"title": "Basic Sorting", "content": "ORDER BY sorts results by one or more columns in ascending or descending order."}, {"title": "ASC and DESC", "content": "ASC (ascending) is default, DESC sorts in descending order."}, {"title": "Multiple Columns", "content": "ORDER BY col1 ASC, col2 DESC sorts by multiple criteria with different directions."}]}', 2, 'Querying', 6, 35),

-- Functions & Aggregation
('Aggregate Functions', 'aggregate-functions', 'COUNT, SUM, AVG, MIN, MAX functions', '{"sections": [{"title": "COUNT Function", "content": "COUNT(*) counts all rows, COUNT(column) counts non-NULL values in a column."}, {"title": "Mathematical Functions", "content": "SUM() calculates totals, AVG() computes averages for numeric columns."}, {"title": "MIN and MAX", "content": "MIN() finds smallest values, MAX() finds largest values in a column."}]}', 3, 'Functions', 7, 50),

('GROUP BY & HAVING', 'group-by-having', 'Group data and filter groups', '{"sections": [{"title": "GROUP BY Basics", "content": "GROUP BY groups rows with identical values in specified columns for aggregation."}, {"title": "HAVING Clause", "content": "HAVING filters groups created by GROUP BY, similar to WHERE for individual rows."}, {"title": "Grouping Rules", "content": "All non-aggregate columns in SELECT must appear in GROUP BY clause."}]}', 3, 'Functions', 8, 55),

-- Joins
('INNER JOIN', 'inner-join', 'Combine tables with INNER JOIN', '{"sections": [{"title": "JOIN Concept", "content": "JOINs combine rows from multiple tables based on related columns between them."}, {"title": "INNER JOIN", "content": "INNER JOIN returns only rows with matching values in both tables."}, {"title": "JOIN Syntax", "content": "SELECT columns FROM table1 INNER JOIN table2 ON table1.column = table2.column;"}]}', 4, 'Joins', 9, 60),

('OUTER JOINs', 'outer-joins', 'LEFT, RIGHT, and FULL OUTER JOINs', '{"sections": [{"title": "LEFT JOIN", "content": "LEFT JOIN returns all rows from left table and matching rows from right table."}, {"title": "RIGHT JOIN", "content": "RIGHT JOIN returns all rows from right table and matching rows from left table."}, {"title": "FULL OUTER JOIN", "content": "FULL OUTER JOIN returns all rows when there is a match in either table."}]}', 4, 'Joins', 10, 65),

-- Advanced Topics
('Subqueries', 'subqueries', 'Nested queries and subqueries', '{"sections": [{"title": "Subquery Basics", "content": "A subquery is a query nested inside another query, executed first to provide results to the outer query."}, {"title": "Scalar Subqueries", "content": "Scalar subqueries return single values and can be used anywhere a single value is expected."}, {"title": "IN and EXISTS", "content": "IN checks if a value exists in subquery results, EXISTS checks if subquery returns any rows."}]}', 5, 'Advanced', 11, 70),

('Window Functions', 'window-functions', 'ROW_NUMBER, RANK, and analytical functions', '{"sections": [{"title": "Window Function Concept", "content": "Window functions perform calculations across related rows without grouping the result set."}, {"title": "ROW_NUMBER and RANK", "content": "ROW_NUMBER() assigns unique numbers, RANK() handles ties by giving same rank to equal values."}, {"title": "PARTITION BY", "content": "PARTITION BY divides result set into partitions for window function calculations."}]}', 5, 'Advanced', 12, 80),

-- Data Modification
('INSERT Statements', 'insert-data', 'Adding new records to tables', '{"sections": [{"title": "Basic INSERT", "content": "INSERT INTO table_name (columns) VALUES (values) adds new records to tables."}, {"title": "Multiple Inserts", "content": "INSERT INTO table_name VALUES (row1), (row2), (row3) inserts multiple rows efficiently."}, {"title": "INSERT with SELECT", "content": "INSERT INTO table1 SELECT columns FROM table2 WHERE condition; copies data between tables."}]}', 2, 'Data Modification', 13, 40),

('UPDATE Statements', 'update-data', 'Modifying existing records', '{"sections": [{"title": "Basic UPDATE", "content": "UPDATE table_name SET column1 = value1 WHERE condition modifies existing records."}, {"title": "Multiple Columns", "content": "UPDATE table_name SET col1 = val1, col2 = val2 WHERE condition updates multiple columns."}, {"title": "UPDATE Safety", "content": "Always use WHERE clause with UPDATE to avoid modifying all rows accidentally."}]}', 2, 'Data Modification', 14, 35),

('DELETE Statements', 'delete-data', 'Removing records from tables', '{"sections": [{"title": "Basic DELETE", "content": "DELETE FROM table_name WHERE condition removes specific records from tables."}, {"title": "DELETE vs TRUNCATE", "content": "DELETE removes specific rows, TRUNCATE removes all rows and resets identity columns."}, {"title": "DELETE Safety", "content": "Always use WHERE clause with DELETE to avoid removing all data accidentally."}]}', 2, 'Data Modification', 15, 30),

-- Database Design
('CREATE TABLE', 'create-table', 'Creating database tables', '{"sections": [{"title": "CREATE TABLE Syntax", "content": "CREATE TABLE table_name (column1 datatype constraints, column2 datatype constraints) defines new tables."}, {"title": "Column Constraints", "content": "PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK, DEFAULT ensure data integrity."}, {"title": "Table Relationships", "content": "Foreign keys create relationships between tables, enforcing referential integrity."}]}', 3, 'Database Design', 16, 50),

('Indexes & Performance', 'indexes-performance', 'Optimizing query performance', '{"sections": [{"title": "Index Basics", "content": "Indexes speed up data retrieval by creating shortcuts to table data, like book indexes."}, {"title": "Index Types", "content": "Clustered indexes physically order data, non-clustered indexes point to data locations."}, {"title": "Performance Impact", "content": "Indexes speed up SELECT queries but slow down INSERT, UPDATE, DELETE operations."}]}', 4, 'Performance', 17, 60),

-- Business Intelligence
('Analytical Queries', 'analytical-queries', 'Business intelligence and reporting', '{"sections": [{"title": "Reporting Queries", "content": "Analytical queries aggregate and summarize data for business insights and decision making."}, {"title": "Time-based Analysis", "content": "Date functions and time periods enable trend analysis and temporal reporting."}, {"title": "KPI Calculations", "content": "Key Performance Indicators use SQL aggregations to measure business metrics."}]}', 4, 'Business Intelligence', 18, 70),

('Data Warehousing', 'data-warehousing', 'ETL processes and data modeling', '{"sections": [{"title": "Data Warehouse Concepts", "content": "Data warehouses store historical data from multiple sources for analytical processing."}, {"title": "ETL Processes", "content": "Extract, Transform, Load processes move and clean data from operational systems to warehouses."}, {"title": "Dimensional Modeling", "content": "Star and snowflake schemas organize data for efficient analytical queries."}]}', 5, 'Business Intelligence', 19, 85),

-- Security & Administration
('Database Security', 'database-security', 'User management and access control', '{"sections": [{"title": "User Authentication", "content": "Database users require proper authentication and authorization for secure access."}, {"title": "Permissions & Roles", "content": "GRANT and REVOKE statements control user permissions on database objects."}, {"title": "SQL Injection Prevention", "content": "Parameterized queries and input validation prevent SQL injection attacks."}]}', 4, 'Security', 20, 55);

-- Insert comprehensive exercises (500+ total)
-- Fundamentals exercises
INSERT INTO public.exercises (lesson_id, title, description, question, correct_answer, hints, difficulty_level, points, order_index) VALUES
-- Database Fundamentals
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'Database Definition', 'What is a database?', 'A database is an organized collection of _____ information.', 'structured', '["Think about how data is organized", "Data must be organized in a specific way"]', 1, 10, 1),
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'DBMS Purpose', 'What does DBMS stand for?', 'DBMS stands for Database _____ System.', 'Management', '["DBMS manages databases", "It is a system that manages databases"]', 1, 10, 2),
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'Relational Database', 'What structure do relational databases use?', 'Relational databases organize data in _____.', 'tables', '["Think about rows and columns", "Data is organized in a grid-like structure"]', 1, 10, 3),
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'Primary Key', 'What uniquely identifies each record?', 'A _____ key uniquely identifies each record in a table.', 'primary', '["This key is the main identifier", "It must be unique for each record"]', 1, 15, 4),
((SELECT id FROM public.lessons WHERE slug = 'database-fundamentals'), 'Table Components', 'Tables consist of rows and what?', 'Tables consist of rows and _____.', 'columns', '["Think about the vertical structure", "Data is organized vertically in these"]', 1, 10, 5),

-- Introduction to SQL
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'SQL Meaning', 'What does SQL stand for?', 'SQL stands for _____ Query Language.', 'Structured', '["SQL is about structure", "It is a structured way to query data"]', 1, 10, 1),
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'SQL Purpose', 'What is SQL used for?', 'SQL is used to _____ and manipulate databases.', 'manage', '["SQL helps control databases", "It is used to control and work with data"]', 1, 10, 2),
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'DDL Category', 'What does DDL stand for?', 'DDL stands for Data _____ Language.', 'Definition', '["DDL defines data structures", "It is used to define how data is structured"]', 1, 15, 3),
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'DML Category', 'What does DML stand for?', 'DML stands for Data _____ Language.', 'Manipulation', '["DML manipulates data", "It is used to work with existing data"]', 1, 15, 4),
((SELECT id FROM public.lessons WHERE slug = 'intro-to-sql'), 'SQL Syntax', 'How do SQL statements end?', 'SQL statements end with a _____.', 'semicolon', '["Think about punctuation", "It is the same symbol as ;"]', 1, 10, 5),

-- SELECT Statements
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'Basic SELECT', 'Write a query to select all columns from users table', 'SELECT _____ FROM users;', '* FROM users', '["Use * to select all columns", "Do not forget the FROM clause"]', 2, 15, 1),
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'Specific Columns', 'Select name and email from users table', 'SELECT name, _____ FROM users;', 'email', '["List the columns separated by commas", "The second column is email"]', 2, 15, 2),
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'Column Alias', 'Select name with alias full_name', 'SELECT name AS _____ FROM users;', 'full_name', '["Use AS keyword for aliases", "The alias should be full_name"]', 2, 20, 3),
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'Table Alias', 'Select all from users with alias u', 'SELECT * FROM users AS ____;', 'u', '["Table aliases come after AS", "Use a short alias like u"]', 2, 20, 4),
((SELECT id FROM public.lessons WHERE slug = 'select-statements'), 'DISTINCT Values', 'Select unique cities from users', 'SELECT _____ city FROM users;', 'DISTINCT', '["Use DISTINCT to get unique values", "DISTINCT removes duplicates"]', 2, 25, 5),

-- WHERE Clause
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'Basic WHERE', 'Select users older than 25', 'SELECT * FROM users WHERE age _____ 25;', '> 25', '["Use > for greater than", "Age should be greater than 25"]', 2, 15, 1),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'Equality Condition', 'Select users named John', 'SELECT * FROM users WHERE name = _____;', '''John''', '["String values need quotes", "Use single quotes around John"]', 2, 15, 2),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'AND Operator', 'Select users older than 25 from London', 'SELECT * FROM users WHERE age > 25 _____ city = ''London'';', 'AND', '["Use AND to combine conditions", "Both conditions must be true"]', 2, 20, 3),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'OR Operator', 'Select users from London or Paris', 'SELECT * FROM users WHERE city = ''London'' _____ city = ''Paris'';', 'OR', '["Use OR for either condition", "Either condition can be true"]', 2, 20, 4),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'IN Operator', 'Select users from London, Paris, or Berlin', 'SELECT * FROM users WHERE city _____ (''London'', ''Paris'', ''Berlin'');', 'IN', '["IN checks if value is in a list", "Use IN with a list of values"]', 2, 25, 5),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'BETWEEN Operator', 'Select users aged between 20 and 30', 'SELECT * FROM users WHERE age _____ 20 AND 30;', 'BETWEEN', '["BETWEEN includes both boundaries", "Use BETWEEN for ranges"]', 2, 25, 6),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'LIKE Operator', 'Select users whose name starts with J', 'SELECT * FROM users WHERE name _____ ''J%'';', 'LIKE', '["LIKE is used for pattern matching", "% means any characters"]', 2, 25, 7),
((SELECT id FROM public.lessons WHERE slug = 'where-clause'), 'NULL Check', 'Select users with no email', 'SELECT * FROM users WHERE email _____ NULL;', 'IS', '["Use IS NULL to check for NULL", "Cannot use = with NULL"]', 2, 20, 8),

-- Continue with more exercises for remaining lessons...
-- This represents a sample of the 500+ exercises that would be included