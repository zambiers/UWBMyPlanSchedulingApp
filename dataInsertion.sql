-- -- =========================
-- -- Students INSERT
-- -- =========================
-- INSERT INTO Students VALUES
-- (1, 'Alice', 'Smith', 'Computer Science', 'alice1@uw.edu'),
-- (2, 'Bob', 'Johnson', 'Electrical Engineering', 'bob2@uw.edu'),
-- (3, 'Carol', 'Williams', 'Mathematics', 'carol3@uw.edu'),
-- (4, 'David', 'Brown', 'Biology', 'david4@uw.edu'),
-- (5, 'Eve', 'Jones', 'Chemistry', 'eve5@uw.edu'),
-- (6, 'Frank', 'Garcia', 'Physics', 'frank6@uw.edu'),
-- (7, 'Grace', 'Miller', 'Civil Engineering', 'grace7@uw.edu'),
-- (8, 'Hank', 'Davis', 'Computer Engineering', 'hank8@uw.edu'),
-- (9, 'Ivy', 'Rodriguez', 'Nursing', 'ivy9@uw.edu'),
-- (10, 'Jack', 'Martinez', 'Business', 'jack10@uw.edu'),
-- (11, 'Kara', 'Hernandez', 'Computer Science', 'kara11@uw.edu'),
-- (12, 'Leo', 'Lopez', 'Mathematics', 'leo12@uw.edu'),
-- (13, 'Mia', 'Gonzalez', 'Physics', 'mia13@uw.edu'),
-- (14, 'Nina', 'Wilson', 'Chemistry', 'nina14@uw.edu'),
-- (15, 'Owen', 'Anderson', 'Biology', 'owen15@uw.edu'),
-- (16, 'Paul', 'Thomas', 'Business', 'paul16@uw.edu'),
-- (17, 'Quinn', 'Taylor', 'Computer Engineering', 'quinn17@uw.edu'),
-- (18, 'Rita', 'Moore', 'Nursing', 'rita18@uw.edu'),
-- (19, 'Sam', 'Jackson', 'Civil Engineering', 'sam19@uw.edu'),
-- (20, 'Tina', 'Martin', 'Electrical Engineering', 'tina20@uw.edu');

-- -- =========================
-- -- Professors INSERT
-- -- =========================
-- INSERT INTO Professors VALUES
-- (1001, 'Alan', 'Kim', 'alan.kim@uw.edu', 'Computer Science'),
-- (1002, 'Betty', 'Nguyen', 'betty.nguyen@uw.edu', 'Electrical Engineering'),
-- (1003, 'Charles', 'Lee', 'charles.lee@uw.edu', 'Mathematics'),
-- (1004, 'Diana', 'Patel', 'diana.patel@uw.edu', 'Physics'),
-- (1005, 'Edward', 'Harris', 'edward.harris@uw.edu', 'Chemistry'),
-- (1006, 'Fiona', 'Young', 'fiona.young@uw.edu', 'Biology'),
-- (1007, 'George', 'Clark', 'george.clark@uw.edu', 'Computer Engineering'),
-- (1008, 'Holly', 'Walker', 'holly.walker@uw.edu', 'Civil Engineering'),
-- (1009, 'Ian', 'Hall', 'ian.hall@uw.edu', 'Business'),
-- (1010, 'Julia', 'Allen', 'julia.allen@uw.edu', 'Nursing'),
-- (1011, 'Kevin', 'Scott', 'kevin.scott@uw.edu', 'Computer Science'),
-- (1012, 'Laura', 'Adams', 'laura.adams@uw.edu', 'Mathematics'),
-- (1013, 'Mark', 'Baker', 'mark.baker@uw.edu', 'Physics'),
-- (1014, 'Nora', 'Gomez', 'nora.gomez@uw.edu', 'Chemistry'),
-- (1015, 'Oscar', 'Phillips', 'oscar.phillips@uw.edu', 'Biology'),
-- (1016, 'Pam', 'Evans', 'pam.evans@uw.edu', 'Business'),
-- (1017, 'Quincy', 'Turner', 'quincy.turner@uw.edu', 'Computer Engineering'),
-- (1018, 'Rachel', 'Carter', 'rachel.carter@uw.edu', 'Nursing'),
-- (1019, 'Steve', 'Mitchell', 'steve.mitchell@uw.edu', 'Civil Engineering'),
-- (1020, 'Tara', 'Perez', 'tara.perez@uw.edu', 'Electrical Engineering');

-- -- =========================
-- -- Courses INSERT
-- -- =========================
-- INSERT INTO Courses (CourseCode, CourseName, Credits, Major, Description) VALUES
-- (101, 'Intro to Computer Science', 3, 'Computer Science', 'Foundational concepts of computing.'),
-- (102, 'Data Structures', 4, 'Computer Science', 'Covers linked lists, trees, and graphs.'),
-- (103, 'Algorithms', 4, 'Computer Science', 'Algorithm design and analysis.'),
-- (104, 'Operating Systems', 4, 'Computer Science', 'OS principles and process management.'),
-- (105, 'Database Systems', 3, 'Computer Science', 'SQL, normalization, transactions.'),
-- (106, 'Discrete Mathematics', 3, 'Mathematics', 'Logic, set theory, combinatorics.'),
-- (107, 'Calculus I', 4, 'Mathematics', 'Limits, derivatives, applications.'),
-- (108, 'Calculus II', 4, 'Mathematics', 'Integration and series.'),
-- (109, 'Linear Algebra', 3, 'Mathematics', 'Matrices, vector spaces.'),
-- (110, 'Statistics I', 3, 'Mathematics', 'Probability, distributions.'),
-- (111, 'General Chemistry I', 4, 'Chemistry', 'Atoms, bonding, reactions.'),
-- (112, 'General Chemistry II', 4, 'Chemistry', 'Thermodynamics and kinetics.'),
-- (113, 'Organic Chemistry I', 4, 'Chemistry', 'Carbon compounds and reactions.'),
-- (114, 'Biology I', 4, 'Biology', 'Cells, genetics, evolution.'),
-- (115, 'Biology II', 4, 'Biology', 'Organ systems and ecology.'),
-- (116, 'Microeconomics', 3, 'Economics', 'Consumer theory and markets.'),
-- (117, 'Macroeconomics', 3, 'Economics', 'GDP, inflation, fiscal policy.'),
-- (118, 'Accounting I', 3, 'Business', 'Financial accounting basics.'),
-- (119, 'Marketing Principles', 3, 'Business', 'Foundations of marketing.'),
-- (120, 'Business Law', 3, 'Business', 'Legal principles affecting business.');


-- -- =========================
-- -- Sections INSERT
-- -- Notes:
-- --      Fix this
-- -- =========================
-- ALTER TABLE Section
-- ADD COLUMN SectionID INT AUTO_INCREMENT PRIMARY KEY FIRST;
INSERT INTO Section (CourseCode, SectionLetter, MaxEnrolled, EnrolledStudents, RoomNum, Instructor, MeetingDay, StartTime, EndTime) VALUES
(101, 'A', 30, 25, 'UW1-101', 1001, 'MWF', '09:00:00', '09:50:00'),
(102, 'B', 35, 30, 'UW1-102', 1009, 'TTh', '10:00:00', '11:15:00'),
(103, 'C', 30, 28, 'UW2-201', 1002, 'MWF', '11:00:00', '11:50:00'),
(104, 'D', 40, 33, 'UW2-202', 1010, 'TTh', '12:00:00', '13:15:00'),
(105, 'E', 25, 20, 'UW1-210', 1003, 'MWF', '13:00:00', '13:50:00'),
(106, 'F', 30, 26, 'UW2-305', 1006, 'TTh', '14:00:00', '15:15:00'),
(107, 'G', 35, 32, 'UW1-110', 1001, 'MWF', '09:30:00', '10:20:00'),
(108, 'H', 40, 37, 'UW2-211', 1002, 'TTh', '10:30:00', '11:45:00'),
(109, 'I', 20, 18, 'UW1-220', 1003, 'MWF', '12:00:00', '12:50:00'),
(110, 'J', 25, 24, 'UW2-310', 1004, 'TTh', '13:00:00', '14:15:00'),
(111, 'K', 30, 27, 'UW1-120', 1017, 'MWF', '14:00:00', '14:50:00'),
(112, 'L', 35, 31, 'UW2-221', 1018, 'TTh', '15:00:00', '16:15:00'),
(113, 'M', 40, 38, 'UW1-230', 1019, 'MWF', '09:00:00', '09:50:00'),
(114, 'N', 25, 22, 'UW2-320', 1020, 'TTh', '10:00:00', '11:15:00'),
(115, 'O', 30, 30, 'UW1-130', 1001, 'MWF', '11:00:00', '11:50:00'),
(116, 'P', 35, 33, 'UW2-231', 1010, 'TTh', '12:00:00', '13:15:00'),
(117, 'Q', 40, 39, 'UW1-240', 1011, 'MWF', '13:00:00', '13:50:00'),
(118, 'R', 25, 24, 'UW2-330', 1012, 'TTh', '14:00:00', '15:15:00'),
(119, 'S', 30, 29, 'BB-110', 1005, 'MWF', '15:00:00', '15:50:00'),
(120, 'T', 35, 34, 'BB-120', 1007, 'TTh', '16:00:00', '17:15:00');

-- -- =========================
-- -- Section Times INSERT
-- -- =========================
-- INSERT INTO DegreeProgram (DegreeName, DegreeType, SchoolDivision, EnrolledStudentsMax, Description) VALUES
-- ('Computer Science BS', 'Major', 'STEM', 400, 'Study of computation and programming.'),
-- ('Computer Science Minor', 'Minor', 'STEM', 120, 'Foundational CS concepts.'),
-- ('Mathematics BA', 'Major', 'STEM', 300, 'Mathematical theory and applications.'),
-- ('Mathematics Minor', 'Minor', 'STEM', 150, 'Introductory math courses.'),
-- ('Biology BS', 'Major', 'Science', 350, 'Life sciences and lab work.'),
-- ('Biology Minor', 'Minor', 'Science', 150, 'Biology fundamentals.'),
-- ('Chemistry BS', 'Major', 'Science', 280, 'Chemical theory and practice.'),
-- ('Chemistry Minor', 'Minor', 'Science', 130, 'Introductory chemistry focus.'),
-- ('Economics BA', 'Major', 'Social Science', 320, 'Micro and macro economics.'),
-- ('Economics Minor', 'Minor', 'Social Science', 120, 'Economics foundation courses.'),
-- ('Business Administration BS', 'Major', 'Business', 500, 'Management principles.'),
-- ('Business Minor', 'Minor', 'Business', 200, 'Introduction to business concepts.'),
-- ('Accounting BS', 'Major', 'Business', 300, 'Financial reporting and auditing.'),
-- ('Finance BS', 'Major', 'Business', 320, 'Financial markets and analysis.'),
-- ('Marketing BA', 'Major', 'Business', 280, 'Marketing and consumer behavior.'),
-- ('Physics BS', 'Major', 'STEM', 200, 'Classical and modern physics.'),
-- ('English BA', 'Major', 'Humanities', 250, 'Literature and writing.'),
-- ('Psychology BA', 'Major', 'Social Science', 350, 'Human behavior and cognition.'),
-- ('History BA', 'Major', 'Humanities', 200, 'Historical events and analysis.'),
-- ('Philosophy BA', 'Major', 'Humanities', 180, 'Logic and ethical reasoning.');
