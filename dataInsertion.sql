-- =========================
-- Students INSERT
-- =========================
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

-- =========================
-- Professors INSERT
-- =========================
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

-- =========================
-- Courses INSERT
-- =========================
INSERT INTO Courses VALUES
-- (101, 'Intro to CS', 4, 'Computer Science', 'Programming fundamentals'),
(102, 'Data Structures', 4, 'Computer Science', 'Advanced programming'),
--(201, 'Circuits I', 3, 'Electrical Engineering', 'Basics of circuits'),
(202, 'Digital Logic', 4, 'Electrical Engineering', 'Logic design'),
--(301, 'Calculus I', 4, 'Mathematics', 'Differential calculus'),
(302, 'Calculus II', 4, 'Mathematics', 'Integral calculus'),
(401, 'Physics I', 4, 'Physics', 'Mechanics'),
(402, 'Physics II', 4, 'Physics', 'Electricity & magnetism'),
(501, 'Organic Chemistry', 4, 'Chemistry', 'Carbon-based chemistry'),
(502, 'General Chemistry', 4, 'Chemistry', 'Chemistry fundamentals'),
(601, 'Intro to Biology', 4, 'Biology', 'Cells and organisms'),
(602, 'Human Biology', 4, 'Biology', 'Human anatomy'),
(701, 'Business 101', 4, 'Business', 'Intro to business'),
(702, 'Accounting I', 4, 'Business', 'Basic accounting'),
(801, 'Civil Eng 1', 4, 'Civil Engineering', 'Structures'),
(802, 'Civil Eng 2', 4, 'Civil Engineering', 'Materials'),
(901, 'Computer Eng 1', 4, 'Computer Engineering', 'Computer systems'),
(902, 'Computer Eng 2', 4, 'Computer Engineering', 'Embedded hardware'),
(1001, 'Nursing 1', 4, 'Nursing', 'Health basics'),
(1002, 'Nursing 2', 4, 'Nursing', 'Clinical practice');

-- =========================
-- Sections INSERT
-- =========================
INSERT INTO Section VALUES
-- (101, 'A', 'R101', 1001, 25, 40),
-- (102, 'A', 'R102', 1011, 30, 40),
-- (201, 'A', 'R201', 1002, 20, 35),
(202, 'A', 'R202', 1020, 22, 35),
(301, 'A', 'R301', 1003, 28, 40),
(302, 'A', 'R302', 1012, 25, 40),
(401, 'A', 'R401', 1004, 26, 40),
(402, 'A', 'R402', 1013, 24, 40),
(501, 'A', 'R501', 1005, 30, 40),
(502, 'A', 'R502', 1014, 21, 40),
(601, 'A', 'R601', 1006, 23, 40),
(602, 'A', 'R602', 1015, 22, 40),
(701, 'A', 'R701', 1009, 29, 40),
(702, 'A', 'R702', 1016, 30, 40),
(801, 'A', 'R801', 1008, 20, 40),
(802, 'A', 'R802', 1019, 18, 40),
(901, 'A', 'R901', 1007, 27, 40),
(902, 'A', 'R902', 1017, 26, 40),
(1001, 'A', 'R1001', 1010, 32, 40),
(1002, 'A', 'R1002', 1018, 28, 40);

-- =========================
-- Section Times INSERT
-- =========================
INSERT INTO SectionTime VALUES
-- (101, 'A', 'Monday', '09:00:00', '10:20:00'),
-- (102, 'A', 'Monday', '10:30:00', '11:50:00'),
-- (201, 'A', 'Tuesday', '09:00:00', '10:20:00'),
(202, 'A', 'Tuesday', '10:30:00', '11:50:00'),
(301, 'A', 'Wednesday', '09:00:00', '10:20:00'),
(302, 'A', 'Wednesday', '10:30:00', '11:50:00'),
(401, 'A', 'Thursday', '09:00:00', '10:20:00'),
(402, 'A', 'Thursday', '10:30:00', '11:50:00'),
(501, 'A', 'Friday', '09:00:00', '10:20:00'),
(502, 'A', 'Friday', '10:30:00', '11:50:00'),
(601, 'A', 'Monday', '14:00:00', '15:20:00'),
(602, 'A', 'Tuesday', '14:00:00', '15:20:00'),
(701, 'A', 'Wednesday', '14:00:00', '15:20:00'),
(702, 'A', 'Thursday', '14:00:00', '15:20:00'),
(801, 'A', 'Friday', '14:00:00', '15:20:00'),
(802, 'A', 'Monday', '16:00:00', '17:20:00'),
(901, 'A', 'Tuesday', '16:00:00', '17:20:00'),
(902, 'A', 'Wednesday', '16:00:00', '17:20:00'),
(1001, 'A', 'Thursday', '16:00:00', '17:20:00'),
(1002, 'A', 'Friday', '16:00:00', '17:20:00');
