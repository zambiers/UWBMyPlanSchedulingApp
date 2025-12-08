DROP TABLE IF EXISTS StudentSection;                                                                                                                                                                    
DROP TABLE IF EXISTS StudentDegreeProgram;                                                                                                                                                              
DROP TABLE IF EXISTS Section;                                                                                                                                                                           
DROP TABLE IF EXISTS DegreeProgram;                                                                                                                                                                     
DROP TABLE IF EXISTS Professors;                                                                                                                                                                        
DROP TABLE IF EXISTS Courses;                                                                                                                                                                           
DROP TABLE IF EXISTS Students;                                                                                                                                                                          

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

CREATE TABLE Section (
    CourseCode VARCHAR(12) NOT NULL,
    SectionLetter CHAR(1) NOT NULL DEFAULT 'A',
    MaxEnrolled INT NOT NULL,
    EnrolledStudents INT DEFAULT 0,
    RoomNum VARCHAR(20),
    Instructor INT,
    MeetingDay VARCHAR(30) NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME,
    PRIMARY KEY (CourseCode, SectionLetter, MeetingDay, StartTime),
    FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode),
    FOREIGN KEY (Instructor) REFERENCES Professors(EmployeeID)
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
    CourseCode VARCHAR(12),
    SectionLetter CHAR(1) DEFAULT 'A',
    MeetingDay VARCHAR(30),
    StartTime TIME,
    Grade VARCHAR(2),
    PRIMARY KEY (StudentID, CourseCode, SectionLetter, MeetingDay, StartTime),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CourseCode, SectionLetter, MeetingDay, StartTime) REFERENCES Section(CourseCode, SectionLetter, MeetingDay, StartTime)
);

--StudentDegreeProgram
CREATE TABLE StudentDegreeProgram (
    StudentID INT,
    DegreeName VARCHAR(200),
    PRIMARY KEY (StudentID, DegreeName),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (DegreeName) REFERENCES DegreeProgram(DegreeName)
);
