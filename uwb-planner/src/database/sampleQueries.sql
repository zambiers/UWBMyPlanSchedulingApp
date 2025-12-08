-- Sample query 1: Student weekly schedule (joins 5 tables)
-- Concept: Show everything a single student is taking this term (course, section, time, room, instructor, grade to date).
-- Parameters: :student_id (the student to look up)
SELECT st.StudentID,
       st.FirstName || ' ' || st.LastName AS StudentName,
       c.CourseCode,
       c.CourseName,
       se.SectionLetter,
       se.MeetingDay,
       se.StartTime,
       se.EndTime,
       se.RoomNum,
       p.FirstName || ' ' || p.LastName AS InstructorName,
       ss.Grade
FROM StudentSection ss
JOIN Students st ON ss.StudentID = st.StudentID
JOIN Section se ON ss.CourseCode = se.CourseCode
               AND ss.SectionLetter = se.SectionLetter
               AND ss.MeetingDay = se.MeetingDay
               AND ss.StartTime = se.StartTime
JOIN Courses c ON se.CourseCode = c.CourseCode
LEFT JOIN Professors p ON se.Instructor = p.EmployeeID
WHERE st.StudentID = :student_id
ORDER BY se.MeetingDay, se.StartTime;

-- Sample query 2: Students per degree program (GROUP BY + COUNT)
-- Concept: Count how many students are in each degree, useful for enrollment reports or dashboards.
-- Parameters: optional :degree_type filter if you want only Majors or Minors
SELECT d.DegreeName,
       d.DegreeType,
       COUNT(sdp.StudentID) AS EnrolledStudents
FROM DegreeProgram d
LEFT JOIN StudentDegreeProgram sdp ON d.DegreeName = sdp.DegreeName
GROUP BY d.DegreeName, d.DegreeType
ORDER BY EnrolledStudents DESC, d.DegreeName;

-- Sample query 3: Instructor teaching load (GROUP BY + COUNT + SUM)
-- Concept: Summarize how many sections each instructor is teaching and the total seating capacity they oversee.
-- Parameters: none
SELECT p.EmployeeID,
       p.FirstName || ' ' || p.LastName AS InstructorName,
       COUNT(se.CourseCode) AS NumberOfSections,
       COALESCE(SUM(se.MaxEnrolled), 0) AS TotalCapacity
FROM Professors p
LEFT JOIN Section se ON p.EmployeeID = se.Instructor
GROUP BY p.EmployeeID, p.FirstName, p.LastName
ORDER BY NumberOfSections DESC;

-- Sample query 4: Students not enrolled in any section (nested NOT EXISTS)
-- Concept: Find students who currently have no enrollments, useful for outreach or advising nudges.
-- Parameters: none
SELECT s.StudentID,
       s.FirstName,
       s.LastName,
       s.Major
FROM Students s
WHERE NOT EXISTS (
  SELECT 1
  FROM StudentSection ss
  WHERE ss.StudentID = s.StudentID
);

-- Sample query 5: Open sections in a major a student is not already in (join + nested NOT IN)
-- Concept: Suggest open classes in the student’s major that they are not already taking, ordered by schedule.
-- Parameters: :major (target major), :student_id (student to exclude current enrollments)
SELECT se.CourseCode,
       c.CourseName,
       se.SectionLetter,
       se.MeetingDay,
       se.StartTime,
       se.EndTime,
       (se.MaxEnrolled - se.EnrolledStudents) AS SeatsAvailable
FROM Section se
JOIN Courses c ON se.CourseCode = c.CourseCode
WHERE c.Major = :major
  AND se.EnrolledStudents < se.MaxEnrolled
  AND se.CourseCode NOT IN (
    SELECT ss.CourseCode
    FROM StudentSection ss
    WHERE ss.StudentID = :student_id
  )
ORDER BY c.CourseCode, se.MeetingDay, se.StartTime;
