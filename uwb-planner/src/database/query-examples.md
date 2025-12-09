# Query Examples Using Course Scheduler Schema

Use these as a checklist to cover every table in your report. Adjust filters as needed.

## Single‑table reads (cover all base tables)
- All students: `SELECT * FROM Students;`
- All courses: `SELECT * FROM Courses;`
- All professors: `SELECT * FROM Professors;`
- All sections: `SELECT * FROM Section;`
- All degree programs: `SELECT * FROM DegreeProgram;`

## Two‑table joins
- Student to degree program:  
  ```sql
  SELECT s.StudentID, s.FirstName, s.LastName, d.DegreeName
  FROM StudentDegreeProgram sdp
  JOIN Students s ON sdp.StudentID = s.StudentID
  JOIN DegreeProgram d ON sdp.DegreeName = d.DegreeName;
  ```
- Student to section enrollment:  
  ```sql
  SELECT ss.StudentID, ss.CourseCode, ss.SectionLetter, ss.MeetingDay, ss.StartTime, ss.Grade
  FROM StudentSection ss;
  ```

## Three‑ and four‑table joins
- Section with instructor and course (3 tables):  
  ```sql
  SELECT c.CourseCode, c.CourseName,
         sec.SectionLetter, sec.MeetingDay, sec.StartTime,
         p.FirstName AS ProfFirst, p.LastName AS ProfLast
  FROM Section sec
  JOIN Courses c ON sec.CourseCode = c.CourseCode
  JOIN Professors p ON sec.Instructor = p.EmployeeID;
  ```
- Student enrolled in a section of a course (3 tables):  
  ```sql
  SELECT s.FirstName, s.LastName, c.CourseCode, c.CourseName,
         ss.SectionLetter, ss.MeetingDay, ss.StartTime, ss.Grade
  FROM StudentSection ss
  JOIN Students s ON ss.StudentID = s.StudentID
  JOIN Courses c ON ss.CourseCode = c.CourseCode;
  ```
- Student schedule (5 tables; satisfies join 3–4 tables requirement):  
  ```sql
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
  ```

## Four‑table join (student, program, section, course)
```sql
SELECT s.FirstName, s.LastName,
       d.DegreeName,
       c.CourseCode, c.CourseName,
       ss.SectionLetter, ss.MeetingDay, ss.StartTime, ss.Grade
FROM StudentSection ss
JOIN Students s ON ss.StudentID = s.StudentID
JOIN Courses c ON ss.CourseCode = c.CourseCode
JOIN StudentDegreeProgram sdp ON s.StudentID = sdp.StudentID
JOIN DegreeProgram d ON sdp.DegreeName = d.DegreeName;
```

## Aggregation / GROUP BY examples
- Sections per course:  
  ```sql
  SELECT CourseCode, COUNT(*) AS SectionCount
  FROM Section
  GROUP BY CourseCode;
  ```
- Students per degree program:  
  ```sql
  SELECT d.DegreeName,
         d.DegreeType,
         COUNT(sdp.StudentID) AS EnrolledStudents
  FROM DegreeProgram d
  LEFT JOIN StudentDegreeProgram sdp ON d.DegreeName = sdp.DegreeName
  GROUP BY d.DegreeName, d.DegreeType
  ORDER BY EnrolledStudents DESC, d.DegreeName;
  ```
- Instructor teaching load:  
  ```sql
  SELECT p.EmployeeID,
         p.FirstName || ' ' || p.LastName AS InstructorName,
         COUNT(se.CourseCode) AS NumberOfSections,
         COALESCE(SUM(se.MaxEnrolled), 0) AS TotalCapacity
  FROM Professors p
  LEFT JOIN Section se ON p.EmployeeID = se.Instructor
  GROUP BY p.EmployeeID, p.FirstName, p.LastName
  ORDER BY NumberOfSections DESC;
  ```
- Average grade per course (ignoring NULL grades):  
  ```sql
  SELECT CourseCode, AVG(
           CASE Grade
             WHEN 'A'  THEN 4.0 WHEN 'A-' THEN 3.7
             WHEN 'B+' THEN 3.3 WHEN 'B'  THEN 3.0 WHEN 'B-' THEN 2.7
             WHEN 'C+' THEN 2.3 WHEN 'C'  THEN 2.0
             ELSE NULL
           END
         ) AS GPA_Avg
  FROM StudentSection
  GROUP BY CourseCode;
  ```

## Nested query / filtering
- Students not enrolled in any section:  
  ```sql
  SELECT *
  FROM Students s
  WHERE NOT EXISTS (
    SELECT 1 FROM StudentSection ss WHERE ss.StudentID = s.StudentID
  );
  ```
- Open sections for a major that a student is not already in:  
  ```sql
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
    );
  ```

## Parameterized patterns (examples)
- All sections for a given course code: `... WHERE sec.CourseCode = ?;`
- All enrollments for a given student id: `... WHERE ss.StudentID = ?;`
- All degree programs of type major: `... WHERE d.DegreeType = 'Major';`
- Search courses by major and keyword:  
  ```sql
  SELECT CourseCode, CourseName, Credits, Major, Description
  FROM Courses
  WHERE Major = :major
    AND (:keyword IS NULL
         OR CourseName LIKE '%' || :keyword || '%'
         OR Description LIKE '%' || :keyword || '%');
  ```
