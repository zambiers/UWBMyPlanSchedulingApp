CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Major VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL
);
CREATE TABLE Courses (
    CourseCode INT PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    Credits INT NOT NULL CHECK (Credits > 0),
    Major VARCHAR(100) NOT NULL,
    Description TEXT
);
CREATE TABLE Professors (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    MajorOfInstruction VARCHAR(100) NOT NULL
);
CREATE TABLE Section (
    SectionID INT AUTO_INCREMENT PRIMARY KEY,
    CourseCode INT NOT NULL,
    SectionLetter CHAR(1) NOT NULL DEFAULT 'A',
    MaxEnrolled INT NOT NULL,
    EnrolledStudents INT DEFAULT 0,
    RoomNum VARCHAR(10) NOT NULL,
    Instructor INT NOT NULL,
    MeetingDay VARCHAR(10) NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode),
    FOREIGN KEY (Instructor) REFERENCES Professors(EmployeeID)
);
CREATE TABLE DegreeProgram (
    DegreeName VARCHAR(70) PRIMARY KEY UNIQUE NOT NULL,
    DegreeType VARCHAR(5) NOT NULL CHECK (DegreeType IN ('Major', 'Minor')),
    SchoolDivision VARCHAR(100) NOT NULL,
    EnrolledStudentsMax INT DEFAULT 0,
    Description TEXT
);