DROP TABLE IF EXISTS Section;
DROP TABLE IF EXISTS DegreeProgram;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Professors;


CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Major VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE Courses (
    CourseCode VARCHAR(12) PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    Credits INT NOT NULL,
    Major VARCHAR(100) NOT NULL,
    Description TEXT
);
CREATE TABLE Professors (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100),
    MajorOfInstruction VARCHAR(100) NOT NULL
);
CREATE TABLE Section (
    SectionID INTEGER PRIMARY KEY AUTOINCREMENT,
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
CREATE TABLE DegreeProgram (
    DegreeName VARCHAR(70) PRIMARY KEY NOT NULL,
    DegreeType VARCHAR(5) NOT NULL CHECK (DegreeType IN ('Major', 'Minor')),
    SchoolDivision VARCHAR(100) NOT NULL,
    EnrolledStudentsMax INT DEFAULT 0,
    Description TEXT
);
