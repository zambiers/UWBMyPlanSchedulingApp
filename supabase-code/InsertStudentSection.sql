-- ============================================================
-- JUNCTION TABLE: StudentSection
-- ============================================================
INSERT INTO StudentSection (StudentID, CourseCode, SectionLetter, MeetingDay, StartTime, Grade) VALUES
-- Computer Science Students
-- John Smith (8952211)
(8952211, 'CSS 142', 'A', 'Monday Wednesday', '11:00:00', 'A'),    -- completed
(8952211, 'CSS 143', 'A', 'Tuesday Thursday', '15:30:00', 'A-'),   -- completed
(8952211, 'CSS 342', 'B', 'Tuesday Thursday', '11:00:00', NULL),   -- current
(8952211, 'CSS 360', 'A', 'Tuesday Thursday', '20:00:00', NULL),   -- current

-- James Moore (3441667)
(3441667, 'CSS 142', 'B', 'Tuesday Thursday', '11:00:00', 'B+'),   -- completed
(3441667, 'CSS 143', 'B', 'Monday Wednesday', '11:00:00', 'A'),    -- completed
(3441667, 'CSS 342', 'A', 'Monday Wednesday', '13:15:00', NULL),   -- current
(3441667, 'CSS 421', 'A', 'Monday Wednesday', '11:00:00', NULL),   -- current

-- Joseph Thompson (5804435)
(5804435, 'CSS 142', 'C', 'Monday Wednesday', '15:30:00', 'A-'),   -- completed
(5804435, 'CSS 301', 'B', 'Monday Wednesday', '15:30:00', 'B+'),   -- completed
(5804435, 'CSS 475', 'A', 'Monday Wednesday', '11:00:00', NULL),   -- current

-- Business Administration Students
-- Jane Doe (4445222)
(4445222, 'B BUS 210', 'A', 'Monday Wednesday', '11:00:00', 'A'),  -- completed
(4445222, 'B BUS 215', 'A', 'Tuesday Thursday', '15:30:00', 'A'),  -- completed
(4445222, 'B BUS 220', 'A', 'Monday Wednesday', '08:45:00', NULL), -- current
(4445222, 'B BUS 310', 'A', 'Monday Wednesday', '08:45:00', NULL), -- current

-- Patricia Taylor (6291713)
(6291713, 'B BUS 210', 'B', 'Tuesday Thursday', '13:15:00', 'B+'), -- completed
(6291713, 'B BUS 215', 'C', 'Monday Wednesday', '11:00:00', 'A-'), -- completed
(6291713, 'B BUS 320', 'A', 'Tuesday Thursday', '13:15:00', NULL), -- current
(6291713, 'B BUS 350', 'A', 'Tuesday Thursday', '08:45:00', NULL), -- current

-- Jennifer Garcia (2250529)
(2250529, 'B BUS 210', 'C', 'Tuesday Thursday', '08:45:00', 'A'),  -- completed
(2250529, 'B BUS 221', 'A', 'Wednesday', '08:45:00', 'B'),         -- completed
(2250529, 'B BUS 300', 'A', 'Monday Wednesday', '11:00:00', NULL), -- current

-- Psychology Students
-- Peter Jones (4416478)
(4416478, 'BIS 170', 'A', 'Tuesday Thursday', '08:45:00', 'A'),    -- completed
(4416478, 'BIS 220', 'A', 'Monday', '15:30:00', 'A-'),             -- completed
(4416478, 'BIS 225', 'A', 'Monday Wednesday', '13:15:00', NULL),   -- current
(4416478, 'BIS 369', 'A', 'Tuesday Thursday', '11:00:00', NULL),   -- current

-- Robert Anderson (8374420)
(8374420, 'BIS 170', 'A', 'Tuesday Thursday', '08:45:00', 'B+'),   -- completed
(8374420, 'BIS 312', 'A', 'Tuesday Thursday', '08:45:00', 'B'),    -- completed
(8374420, 'BIS 348', 'A', 'Tuesday Thursday', '13:15:00', NULL),   -- current

-- Charles Martinez (9742868)
(9742868, 'BIS 170', 'A', 'Tuesday Thursday', '08:45:00', 'A-'),   -- completed
(9742868, 'BIS 312', 'B', 'Monday Wednesday', '13:15:00', 'B+'),   -- completed
(9742868, 'BIS 449', 'A', 'Monday Wednesday', '15:30:00', NULL),   -- current

-- Mechanical Engineering Students
-- Mary Williams (9311809)
(9311809, 'STMATH 124', 'A', 'Monday Wednesday Friday', '08:45:00', 'A'),  -- completed
(9311809, 'STMATH 124', 'C', 'Tuesday Thursday Friday', '10:15:00', 'A-'), -- completed
(9311809, 'STMATH 125', 'E', 'Monday Wednesday', '08:45:00', NULL),        -- current
(9311809, 'B ME 222', 'A', 'Tuesday Thursday', '13:15:00', NULL),          -- current

-- Linda Thomas (5225610)
(5225610, 'STMATH 124', 'B', 'Monday Wednesday Friday', '11:45:00', 'B+'), -- completed
(5225610, 'STMATH 125', 'B', 'Monday Wednesday Friday', '10:15:00', 'B'),  -- completed
(5225610, 'B ME 315', 'A', 'Tuesday Thursday', '08:45:00', NULL),          -- current
(5225610, 'B ME 332', 'A', 'Monday Wednesday', '08:45:00', NULL),          -- current

-- Jessica Robinson (2064219)
(2064219, 'STMATH 125', 'A', 'Monday Wednesday Friday', '08:45:00', 'A-'),  -- completed
(2064219, 'B ME 332', 'B', 'Monday Wednesday', '11:00:00', 'A'),            -- completed
(2064219, 'B ME 341', 'A', 'Tuesday Thursday', '11:00:00', NULL),           -- current

-- Nursing Students
-- David Brown (5413952)
(5413952, 'B NURS 360', 'A', 'Tuesday', '08:30:00', 'A'),       -- completed
(5413952, 'B NURS 420', 'A', 'Thursday', '13:15:00', 'A'),      -- completed
(5413952, 'B NURS 421', 'A', 'Tuesday', '13:15:00', NULL),      -- current
(5413952, 'B NURS 460', 'A', 'Thursday', '08:30:00', NULL),     -- current

-- William Jackson (5672644)
(5672644, 'B NURS 360', 'A', 'Tuesday', '08:30:00', 'B+'),      -- completed
(5672644, 'B NURS 420', 'B', 'Friday', '13:15:00', 'A-'),       -- completed
(5672644, 'B NURS 460', 'B', 'Thursday', '08:30:00', NULL),     -- current

-- Mathematics Students
-- Susan Davis (2197767)
(2197767, 'STMATH 124', 'A', 'Monday Wednesday Friday', '08:45:00', 'A'),  -- completed
(2197767, 'STMATH 125', 'A', 'Monday Wednesday Friday', '08:45:00', 'A'),  -- completed
(2197767, 'STMATH 207', 'A', 'Monday Wednesday Friday', '08:45:00', NULL), -- current
(2197767, 'STMATH 341', 'A', 'Monday Wednesday', '15:30:00', NULL),        -- current

-- Elizabeth White (4853836)
(4853836, 'STMATH 124', 'C', 'Tuesday Thursday Friday', '10:15:00', 'A-'), -- completed
(4853836, 'STMATH 125', 'C', 'Tuesday Thursday', '13:15:00', 'B+'),        -- completed
(4853836, 'STMATH 208', 'B', 'Tuesday Thursday', '13:15:00', NULL),        -- current
(4853836, 'STMATH 301', 'A', 'Tuesday Thursday', '13:15:00', NULL),        -- current

-- Electrical Engineering Students
-- Karen Wilson (9192983)
(9192983, 'B EE 233', 'A', 'Monday Wednesday', '08:45:00', 'A'),           -- completed
(9192983, 'B EE 271', 'A', 'Monday Wednesday', '15:30:00', 'A-'),          -- completed
(9192983, 'B EE 331', 'A', 'Monday Wednesday', '08:45:00', NULL),          -- current
(9192983, 'B EE 341', 'A', 'Thursday Friday', '08:45:00', NULL),           -- current

-- Barbara Martin (8812468)
(8812468, 'B EE 233', 'A', 'Monday Wednesday', '08:45:00', 'B+'),          -- completed
(8812468, 'B EE 271', 'A', 'Monday Wednesday', '15:30:00', 'A'),           -- completed
(8812468, 'B EE 425', 'A', 'Tuesday Thursday', '13:15:00', NULL),          -- current
(8812468, 'B EE 450', 'A', 'Tuesday Thursday', '13:15:00', NULL),          -- current

-- English Literature students (cross-registration)
-- Michael Miller (4517432)
(4517432, 'B WRIT 134', 'A', 'Monday Wednesday', '08:45:00', 'A'),         -- completed
(4517432, 'B WRIT 135', 'A', 'Wednesday', '08:45:00', 'A-'),               -- completed
(4517432, 'B WRIT 135', 'B', 'Monday', '11:00:00', NULL),                  -- current

-- Richard Harris (8951872)
(8951872, 'B WRIT 134', 'B', 'Monday Wednesday', '13:15:00', 'B+'),        -- completed
(8951872, 'B WRIT 135', 'E', 'Monday', '15:30:00', 'A-'),                  -- completed
(8951872, 'BIS 136', 'A', 'Monday Wednesday', '15:30:00', NULL);           -- current