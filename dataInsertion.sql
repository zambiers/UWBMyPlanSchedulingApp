-- =========================
-- Students INSERT
-- =========================
INSERT INTO Students VALUES
(1, 'Alice', 'Smith', 'Computer Science', 'alice1@uw.edu'),
(2, 'Bob', 'Johnson', 'Electrical Engineering', 'bob2@uw.edu'),
(3, 'Carol', 'Williams', 'Mathematics', 'carol3@uw.edu'),
(4, 'David', 'Brown', 'Biology', 'david4@uw.edu'),
(5, 'Eve', 'Jones', 'Chemistry', 'eve5@uw.edu'),
(6, 'Frank', 'Garcia', 'Physics', 'frank6@uw.edu'),
(7, 'Grace', 'Miller', 'Civil Engineering', 'grace7@uw.edu'),
(8, 'Hank', 'Davis', 'Computer Engineering', 'hank8@uw.edu'),
(9, 'Ivy', 'Rodriguez', 'Nursing', 'ivy9@uw.edu'),
(10, 'Jack', 'Martinez', 'Business', 'jack10@uw.edu'),
(11, 'Kara', 'Hernandez', 'Computer Science', 'kara11@uw.edu'),
(12, 'Leo', 'Lopez', 'Mathematics', 'leo12@uw.edu'),
(13, 'Mia', 'Gonzalez', 'Physics', 'mia13@uw.edu'),
(14, 'Nina', 'Wilson', 'Chemistry', 'nina14@uw.edu'),
(15, 'Owen', 'Anderson', 'Biology', 'owen15@uw.edu'),
(16, 'Paul', 'Thomas', 'Business', 'paul16@uw.edu'),
(17, 'Quinn', 'Taylor', 'Computer Engineering', 'quinn17@uw.edu'),
(18, 'Rita', 'Moore', 'Nursing', 'rita18@uw.edu'),
(19, 'Sam', 'Jackson', 'Civil Engineering', 'sam19@uw.edu'),
(20, 'Tina', 'Martin', 'Electrical Engineering', 'tina20@uw.edu');

-- =========================
-- Professors INSERT
-- =========================
INSERT INTO Professors VALUES
(1001, 'Alan', 'Kim', 'alan.kim@uw.edu', 'Computer Science'),
(1002, 'Betty', 'Nguyen', 'betty.nguyen@uw.edu', 'Electrical Engineering'),
(1003, 'Charles', 'Lee', 'charles.lee@uw.edu', 'Mathematics'),
(1004, 'Diana', 'Patel', 'diana.patel@uw.edu', 'Physics'),
(1005, 'Edward', 'Harris', 'edward.harris@uw.edu', 'Chemistry'),
(1006, 'Fiona', 'Young', 'fiona.young@uw.edu', 'Biology'),
(1007, 'George', 'Clark', 'george.clark@uw.edu', 'Computer Engineering'),
(1008, 'Holly', 'Walker', 'holly.walker@uw.edu', 'Civil Engineering'),
(1009, 'Ian', 'Hall', 'ian.hall@uw.edu', 'Business'),
(1010, 'Julia', 'Allen', 'julia.allen@uw.edu', 'Nursing'),
(1011, 'Kevin', 'Scott', 'kevin.scott@uw.edu', 'Computer Science'),
(1012, 'Laura', 'Adams', 'laura.adams@uw.edu', 'Mathematics'),
(1013, 'Mark', 'Baker', 'mark.baker@uw.edu', 'Physics'),
(1014, 'Nora', 'Gomez', 'nora.gomez@uw.edu', 'Chemistry'),
(1015, 'Oscar', 'Phillips', 'oscar.phillips@uw.edu', 'Biology'),
(1016, 'Pam', 'Evans', 'pam.evans@uw.edu', 'Business'),
(1017, 'Quincy', 'Turner', 'quincy.turner@uw.edu', 'Computer Engineering'),
(1018, 'Rachel', 'Carter', 'rachel.carter@uw.edu', 'Nursing'),
(1019, 'Steve', 'Mitchell', 'steve.mitchell@uw.edu', 'Civil Engineering'),
(1020, 'Tara', 'Perez', 'tara.perez@uw.edu', 'Electrical Engineering');

-- =========================
-- Courses INSERT
-- =========================
INSERT INTO Courses (CourseCode, CourseName, Credits, Major, Description) VALUES
(101, 'Intro to Computer Science', 3, 'Computer Science', 'Foundational concepts of computing.'),
(102, 'Data Structures', 4, 'Computer Science', 'Covers linked lists, trees, and graphs.'),
(103, 'Algorithms', 4, 'Computer Science', 'Algorithm design and analysis.'),
(104, 'Operating Systems', 4, 'Computer Science', 'OS principles and process management.'),
(105, 'Database Systems', 3, 'Computer Science', 'SQL, normalization, transactions.'),
(106, 'Discrete Mathematics', 3, 'Mathematics', 'Logic, set theory, combinatorics.'),
(107, 'Calculus I', 4, 'Mathematics', 'Limits, derivatives, applications.'),
(108, 'Calculus II', 4, 'Mathematics', 'Integration and series.'),
(109, 'Linear Algebra', 3, 'Mathematics', 'Matrices, vector spaces.'),
(110, 'Statistics I', 3, 'Mathematics', 'Probability, distributions.'),
(111, 'General Chemistry I', 4, 'Chemistry', 'Atoms, bonding, reactions.'),
(112, 'General Chemistry II', 4, 'Chemistry', 'Thermodynamics and kinetics.'),
(113, 'Organic Chemistry I', 4, 'Chemistry', 'Carbon compounds and reactions.'),
(114, 'Biology I', 4, 'Biology', 'Cells, genetics, evolution.'),
(115, 'Biology II', 4, 'Biology', 'Organ systems and ecology.'),
(116, 'Microeconomics', 3, 'Economics', 'Consumer theory and markets.'),
(117, 'Macroeconomics', 3, 'Economics', 'GDP, inflation, fiscal policy.'),
(118, 'Accounting I', 3, 'Business', 'Financial accounting basics.'),
(119, 'Marketing Principles', 3, 'Business', 'Foundations of marketing.'),
(120, 'Business Law', 3, 'Business', 'Legal principles affecting business.');


-- =========================
-- Sections INSERT
-- Notes:
--      Fix this
-- =========================
-- INSERT INTO Section (CourseCode, SectionLetter, MaxEnrolled, EnrolledStudents, RoomNum, Instructor) VALUES
-- (101, 'A', 30, 25, 'R101', 1001),
-- (102, 'B', 35, 30, 'R102', 1002),
-- (103, 'C', 30, 28, 'R103', 1003),
-- (104, 'D', 40, 33, 'R104', 1004),
-- (105, 'E', 25, 20, 'R105', 1005),
-- (106, 'F', 30, 26, 'R106', 1006),
-- (107, 'G', 35, 32, 'R107', 1007),
-- (108, 'H', 40, 37, 'R108', 1008),
-- (109, 'I', 20, 18, 'R109', 1009),
-- (110, 'J', 25, 24, 'R110', 1010),
-- (111, 'K', 30, 27, 'R201', 1011),
-- (112, 'L', 35, 31, 'R202', 1012),
-- (113, 'M', 40, 38, 'R203', 1013),
-- (114, 'N', 25, 22, 'R204', 1014),
-- (115, 'O', 30, 30, 'R205', 1015),
-- (116, 'P', 35, 33, 'R301', 1016),
-- (117, 'Q', 40, 39, 'R302', 1017),
-- (118, 'R', 25, 24, 'R303', 1018),
-- (119, 'S', 30, 29, 'R304', 1019),
-- (120, 'T', 35, 34, 'R305', 1020);

-- =========================
-- Section Times INSERT
-- =========================
INSERT INTO DegreeProgram (DegreeName, DegreeType, SchoolDivision, EnrolledStudentsMax, Description) VALUES
('Computer Science BS', 'Major', 'STEM', 400, 'Study of computation and programming.'),
('Computer Science Minor', 'Minor', 'STEM', 120, 'Foundational CS concepts.'),
('Mathematics BA', 'Major', 'STEM', 300, 'Mathematical theory and applications.'),
('Mathematics Minor', 'Minor', 'STEM', 150, 'Introductory math courses.'),
('Biology BS', 'Major', 'Science', 350, 'Life sciences and lab work.'),
('Biology Minor', 'Minor', 'Science', 150, 'Biology fundamentals.'),
('Chemistry BS', 'Major', 'Science', 280, 'Chemical theory and practice.'),
('Chemistry Minor', 'Minor', 'Science', 130, 'Introductory chemistry focus.'),
('Economics BA', 'Major', 'Social Science', 320, 'Micro and macro economics.'),
('Economics Minor', 'Minor', 'Social Science', 120, 'Economics foundation courses.'),
('Business Administration BS', 'Major', 'Business', 500, 'Management principles.'),
('Business Minor', 'Minor', 'Business', 200, 'Introduction to business concepts.'),
('Accounting BS', 'Major', 'Business', 300, 'Financial reporting and auditing.'),
('Finance BS', 'Major', 'Business', 320, 'Financial markets and analysis.'),
('Marketing BA', 'Major', 'Business', 280, 'Marketing and consumer behavior.'),
('Physics BS', 'Major', 'STEM', 200, 'Classical and modern physics.'),
('English BA', 'Major', 'Humanities', 250, 'Literature and writing.'),
('Psychology BA', 'Major', 'Social Science', 350, 'Human behavior and cognition.'),
('History BA', 'Major', 'Humanities', 200, 'Historical events and analysis.'),
('Philosophy BA', 'Major', 'Humanities', 180, 'Logic and ethical reasoning.');
