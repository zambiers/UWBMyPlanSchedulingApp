SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Section;
TRUNCATE TABLE Students;
TRUNCATE TABLE Professors;
TRUNCATE TABLE Courses;
TRUNCATE TABLE DegreeProgram;
SET FOREIGN_KEY_CHECKS = 1;

-- Inserting data into DegreeProgram Table
INSERT INTO DegreeProgram (DegreeName, DegreeType, SchoolDivision, EnrolledStudentsMax, Description) VALUES
('Computer Science', 'Major', 'School of STEM', 150, 'Focuses on the theory and practice of computation.'),
('Business Administration', 'Major', 'School of Business', 200, 'Provides a broad overview of business operations.'),
('Psychology', 'Major', 'School of Interdisciplinary Arts & Sciences', 120, 'The scientific study of the human mind and its functions.'),
('Mechanical Engineering', 'Major', 'School of STEM', 100, 'An engineering branch that combines engineering physics and mathematics principles with materials science.'),
('Nursing', 'Major', 'School of Nursing & Health Studies', 180, 'Prepares students for a career in nursing.'),
('Mathematics', 'Major', 'School of STEM', 80, 'The study of topics such as quantity, structure, space, and change.'),
('English Literature', 'Major', 'School of Interdisciplinary Arts & Sciences', 90, 'The study of literature written in the English language.'),
('Electrical Engineering', 'Major', 'School of STEM', 110, 'Deals with the study, design, and application of equipment, devices, and systems which use electricity, electronics, and electromagnetism.'),
('Marketing', 'Minor', 'School of Business', 50, 'The action or business of promoting and selling products or services.'),
('Data Science', 'Minor', 'School of STEM', 60, 'An inter-disciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data.'),
('History', 'Minor', 'School of Interdisciplinary Arts & Sciences', 40, 'The study of past events.'),
('Physics', 'Minor', 'School of STEM', 30, 'The natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force.'),
('Creative Writing', 'Minor', 'School of Interdisciplinary Arts & Sciences', 45, 'The art of making things up in a stylish and imaginative way.'),
('Finance', 'Minor', 'School of Business', 55, 'The management of large amounts of money, especially by governments or large companies.'),
('Cybersecurity', 'Major', 'School of STEM', 130, 'The practice of defending computers, servers, mobile devices, electronic systems, networks, and data from malicious attacks.'),
('Biology', 'Major', 'School of STEM', 140, 'The study of living organisms, divided into many specialized fields.'),
('Chemistry', 'Major', 'School of STEM', 95, 'The branch of science that deals with the identification of the substances of which matter is composed.'),
('Art History', 'Minor', 'School of Interdisciplinary Arts & Sciences', 35, 'The study of artistic objects and expression in historical and stylistic contexts.'),
('Economics', 'Minor', 'School of Business', 65, 'The branch of knowledge concerned with the production, consumption, and transfer of wealth.'),
('Environmental Science', 'Major', 'School of Interdisciplinary Arts & Sciences', 85, 'An interdisciplinary academic field that integrates physical, biological and information sciences to the study of the environment, and the solution of environmental problems.');

-- Inserting data into Students Table
INSERT INTO Students (StudentID, FirstName, LastName, Major, Email) VALUES
(1, 'John', 'Smith', 'Computer Science', 'john.smith@example.com'),
(2, 'Jane', 'Doe', 'Business Administration', 'jane.doe@example.com'),
(3, 'Peter', 'Jones', 'Psychology', 'peter.jones@example.com'),
(4, 'Mary', 'Williams', 'Mechanical Engineering', 'mary.williams@example.com'),
(5, 'David', 'Brown', 'Nursing', 'david.brown@example.com'),
(6, 'Susan', 'Davis', 'Mathematics', 'susan.davis@example.com'),
(7, 'Michael', 'Miller', 'English Literature', 'michael.miller@example.com'),
(8, 'Karen', 'Wilson', 'Electrical Engineering', 'karen.wilson@example.com'),
(9, 'James', 'Moore', 'Computer Science', 'james.moore@example.com'),
(10, 'Patricia', 'Taylor', 'Business Administration', 'patricia.taylor@example.com'),
(11, 'Robert', 'Anderson', 'Psychology', 'robert.anderson@example.com'),
(12, 'Linda', 'Thomas', 'Mechanical Engineering', 'linda.thomas@example.com'),
(13, 'William', 'Jackson', 'Nursing', 'william.jackson@example.com'),
(14, 'Elizabeth', 'White', 'Mathematics', 'elizabeth.white@example.com'),
(15, 'Richard', 'Harris', 'English Literature', 'richard.harris@example.com'),
(16, 'Barbara', 'Martin', 'Electrical Engineering', 'barbara.martin@example.com'),
(17, 'Joseph', 'Thompson', 'Computer Science', 'joseph.thompson@example.com'),
(18, 'Jennifer', 'Garcia', 'Business Administration', 'jennifer.garcia@example.com'),
(19, 'Charles', 'Martinez', 'Psychology', 'charles.martinez@example.com'),
(20, 'Jessica', 'Robinson', 'Mechanical Engineering', 'jessica.robinson@example.com');

-- Inserting data into Professors Table
INSERT INTO Professors (EmployeeID, FirstName, LastName, Email, MajorOfInstruction) VALUES
(1, 'Emily', 'Johnson', 'emily.johnson@example.com', 'Computer Science'),
(2, 'James', 'Williams', 'james.williams@example.com', 'Business Administration'),
(3, 'Sarah', 'Brown', 'sarah.brown@example.com', 'Psychology'),
(4, 'Daniel', 'Jones', 'daniel.jones@example.com', 'Mechanical Engineering'),
(5, 'Laura', 'Garcia', 'laura.garcia@example.com', 'Nursing'),
(6, 'Robert', 'Miller', 'robert.miller@example.com', 'Mathematics'),
(7, 'Linda', 'Davis', 'linda.davis@example.com', 'English Literature'),
(8, 'John', 'Rodriguez', 'john.rodriguez@example.com', 'Electrical Engineering'),
(9, 'Mary', 'Martinez', 'mary.martinez@example.com', 'Computer Science'),
(10, 'Michael', 'Hernandez', 'michael.hernandez@example.com', 'Business Administration'),
(11, 'Patricia', 'Lopez', 'patricia.lopez@example.com', 'Psychology'),
(12, 'David', 'Gonzalez', 'david.gonzalez@example.com', 'Mechanical Engineering'),
(13, 'Jennifer', 'Wilson', 'jennifer.wilson@example.com', 'Nursing'),
(14, 'Richard', 'Anderson', 'richard.anderson@example.com', 'Mathematics'),
(15, 'Susan', 'Thomas', 'susan.thomas@example.com', 'English Literature'),
(16, 'Joseph', 'Taylor', 'joseph.taylor@example.com', 'Electrical Engineering'),
(17, 'Karen', 'Moore', 'karen.moore@example.com', 'Computer Science'),
(18, 'Charles', 'Jackson', 'charles.jackson@example.com', 'Business Administration'),
(19, 'Jessica', 'White', 'jessica.white@example.com', 'Psychology'),
(20, 'William', 'Harris', 'william.harris@example.com', 'Mechanical Engineering');

-- Inserting data into Courses Table
INSERT INTO Courses (CourseCode, CourseName, Credits, Major, Description) VALUES
(101, 'Introduction to Programming', 5, 'Computer Science', 'A first course in programming for students with no prior experience.'),
(102, 'Principles of Microeconomics', 5, 'Business Administration', 'An introduction to the behavior of individual economic agents.'),
(103, 'Introduction to Psychology', 5, 'Psychology', 'A survey of the major areas of psychology.'),
(104, 'Calculus I', 5, 'Mathematics', 'An introduction to differential calculus.'),
(201, 'Data Structures and Algorithms', 5, 'Computer Science', 'A second course in programming focusing on data structures and algorithms.'),
(202, 'Financial Accounting', 5, 'Business Administration', 'An introduction to the principles and practices of financial accounting.'),
(203, 'Social Psychology', 5, 'Psychology', 'The study of how individuals perceive, influence, and relate to others.'),
(204, 'Statics', 5, 'Mechanical Engineering', 'The study of forces on and in structures that are in equilibrium.'),
(301, 'Database Systems', 5, 'Computer Science', 'An introduction to the design and implementation of database systems.'),
(302, 'Marketing Management', 5, 'Business Administration', 'An overview of marketing principles and practices.'),
(303, 'Abnormal Psychology', 5, 'Psychology', 'The study of unusual patterns of behavior, emotion and thought.'),
(304, 'Thermodynamics', 5, 'Mechanical Engineering', 'The study of the relations between heat, work, temperature, and energy.'),
(401, 'Operating Systems', 5, 'Computer Science', 'An introduction to the principles of operating systems.'),
(402, 'Corporate Finance', 5, 'Business Administration', 'An introduction to the principles of corporate finance.'),
(403, 'Cognitive Psychology', 5, 'Psychology', 'The study of mental processes such as attention, language use, memory, perception, problem solving, creativity, and thinking.'),
(404, 'Fluid Mechanics', 5, 'Mechanical Engineering', 'The study of fluids (liquids, gases, and plasmas) and the forces on them.'),
(110, 'Introduction to Biology', 5, 'Biology', 'A foundational course in the study of life and living organisms.'),
(120, 'General Chemistry I', 5, 'Chemistry', 'First part of a two-semester sequence covering fundamental principles of chemistry.'),
(130, 'Introduction to Cybersecurity', 5, 'Cybersecurity', 'An overview of the cybersecurity landscape.'),
(140, 'Introduction to Nursing', 5, 'Nursing', 'Provides a foundation for the practice of nursing.');

-- Inserting data into Section Table
INSERT INTO Section (CourseCode, SectionLetter, MaxEnrolled, EnrolledStudents, RoomNum, Instructor, MeetingDay, StartTime, EndTime) VALUES
(101, 'A', 50, 45, 'UW1-101', 1, 'MWF', '09:30:00', '10:20:00'),
(101, 'B', 50, 48, 'UW1-102', 9, 'TTh', '11:00:00', '12:20:00'),
(102, 'C', 40, 35, 'UW2-201', 2, 'MWF', '10:30:00', '11:20:00'),
(102, 'Z', 40, 38, 'UW2-202', 10, 'TTh', '13:30:00', '14:50:00'),
(103, 'D', 60, 55, 'UW1-210', 3, 'MWF', '11:30:00', '12:20:00'),
(104, 'E', 30, 28, 'UW2-305', 6, 'TTh', '09:00:00', '10:20:00'),
(201, 'F', 45, 42, 'UW1-110', 1, 'MWF', '13:30:00', '14:20:00'),
(202, 'G', 35, 33, 'UW2-211', 2, 'TTh', '15:00:00', '16:20:00'),
(203, 'H', 55, 50, 'UW1-220', 3, 'MWF', '14:30:00', '15:20:00'),
(204, 'I', 25, 23, 'UW2-310', 4, 'TTh', '11:00:00', '12:20:00'),
(301, 'J', 40, 39, 'UW1-120', 17, 'MWF', '08:30:00', '09:20:00'),
(302, 'K', 30, 29, 'UW2-221', 18, 'TTh', '09:30:00', '10:50:00'),
(303, 'L', 50, 47, 'UW1-230', 19, 'MWF', '12:30:00', '13:20:00'),
(304, 'M', 20, 18, 'UW2-320', 20, 'TTh', '14:00:00', '15:20:00'),
(401, 'N', 35, 35, 'UW1-130', 1, 'MWF', '10:30:00', '11:20:00'),
(402, 'O', 28, 25, 'UW2-231', 10, 'TTh', '11:30:00', '12:50:00'),
(403, 'P', 48, 45, 'UW1-240', 11, 'MWF', '15:30:00', '16:20:00'),
(404, 'Q', 22, 20, 'UW2-330', 12, 'TTh', '16:00:00', '17:20:00'),
(110, 'R', 60, 58, 'BB-110', 5, 'MWF', '09:00:00', '10:20:00'),
(120, 'S', 60, 59, 'BB-120', 7, 'TTh', '10:00:00', '11:20:00');
