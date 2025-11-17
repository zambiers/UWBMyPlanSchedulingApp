CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Major VARCHAR(100) NOT NULL ,
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
    CourseCode INT NOT NULL,
    SectionLetter CHAR(1) NOT NULL DEFAULT 'A',
    RoomNum VARCHAR(10) UNIQUE NOT NULL,
    Instructor INT NOT NULL,
    EnrolledStudents INT DEFAULT 0,
    MaxEnrolled INT NOT NULL,
    PRIMARY KEY (CourseCode, SectionLetter),
    FOREIGN KEY (CourseCode) REFERENCES Courses(CourseCode),
    FOREIGN KEY (Instructor) REFERENCES Professors(EmployeeID)
);
CREATE TABLE SectionTime (
    CourseCode INT NOT NULL,
    SectionLetter CHAR(1) NOT NULL,
    MeetingDay VARCHAR(10) NOT NULL,   -- e.g., 'Monday', 'Wed', etc.
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    PRIMARY KEY (CourseCode, SectionLetter, MeetingDay, StartTime),
    FOREIGN KEY (CourseCode, SectionLetter) REFERENCES Section(CourseCode, SectionLetter)
);
CREATE TABLE DegreeProgram (
    CourseCode INT PRIMARY KEY FOREIGN KEY(CourseCode) REFERENCES Courses(CourseCode),
    SectionLetter INT NOT NULL DEFAULT 'A',
    RoomNum VARCHAR(10) UNIQUE NOT NULL,
    Instructor VARCHAR(50) NOT NULL FOREIGN KEY(EmployeeID) REFERENCES Professors(EmployeeID),
    EnrolledStudents INT DEFAULT '0',
    MaxEnrolled INT NOT NULL
);