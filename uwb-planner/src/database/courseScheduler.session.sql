-- ============================================================
-- UWB MyPlan Scheduling App - Master PostgreSQL/Supabase Setup
-- ============================================================
-- Drop existing tables (if any) in correct order to respect foreign keys
-- DROP TABLE IF EXISTS Section CASCADE;
-- DROP TABLE IF EXISTS DegreeProgram CASCADE;
-- DROP TABLE IF EXISTS Students CASCADE;
-- DROP TABLE IF EXISTS Courses CASCADE;
-- DROP TABLE IF EXISTS Professors CASCADE;
-- ============================================================
-- TABLE DEFINITIONS 
-- ============================================================
-- Students Table
CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Major VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL
);

-- Courses Table
CREATE TABLE Courses (
    CourseCode VARCHAR(12) PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    Credits INT NOT NULL,
    Major VARCHAR(100) NOT NULL,
    Description TEXT
);

-- Professors Table
CREATE TABLE Professors (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100),
    MajorOfInstruction VARCHAR(100) NOT NULL
);

-- Section Table
CREATE TABLE Section (
    SectionID SERIAL PRIMARY KEY,
    CourseCode VARCHAR(12) NOT NULL,
    SectionLetter CHAR(1) NOT NULL DEFAULT 'A',
    MaxEnrolled INT NOT NULL,
    EnrolledStudents INT DEFAULT 0,
    RoomNum VARCHAR(20),
    Instructor INT,
    MeetingDay VARCHAR(30),
    StartTime TIME,
    EndTime TIME,
    FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode),
    FOREIGN KEY (Instructor) REFERENCES Professors(EmployeeID),
    UNIQUE (CourseCode, SectionLetter, StartTime, MeetingDay)
);

-- DegreeProgram Table
CREATE TABLE DegreeProgram (
    DegreeName VARCHAR(200) PRIMARY KEY NOT NULL,
    DegreeType VARCHAR(5) NOT NULL CHECK (DegreeType IN ('Major', 'Minor')),
    SchoolDivision VARCHAR(100) NOT NULL,
    EnrolledStudentsMax INT DEFAULT 0,
    Description TEXT
);
-- ============================================================
-- END OF MASTER SQL FILE
-- Total tables: 5 (Students, Courses, Professors, Section, DegreeProgram)
-- ============================================================

-- ============================================================
-- JUNCTION TABLES
-- ============================================================
--SudentCourses
CREATE TABLE StudentSection(
    StudentID INT,
    SectionID INT,
    PRIMARY KEY (StudentID, SectionID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (SectionID) REFERENCES Section(SectionID),
    Grade VARCHAR(2)
);

--StudentDegreeProgram
CREATE TABLE StudentDegreeProgram (
    StudentID INT,
    DegreeName VARCHAR(200),
    PRIMARY KEY (StudentID, DegreeName),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (DegreeName) REFERENCES DegreeProgram(DegreeName)
);