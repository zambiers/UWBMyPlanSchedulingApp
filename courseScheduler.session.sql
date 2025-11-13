CREATE TABLE Students (
    StudentID INT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Major VARCHAR(100) UNIQUE NOT NULL Email VARCHAR(100) UNIQUE NOT NULL
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