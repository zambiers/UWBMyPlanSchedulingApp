import './styling/App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

import Overview from './pages/overview';
import Students from './pages/students';
import Professors from './pages/professors';
import Courses from './pages/courses';
import Programs from './pages/programs';
import Sections from './pages/section';
import StudentSections from './pages/studentSections';
import StudentDegrees from './pages/studentDegrees';
import StudentDashboard from './pages/studentDashboard';
import SampleQueries from './pages/sampleQueries';
import ProfessorDashboard from './pages/professorDashboard';
import AdminPortal from './pages/adminPortal';

function App() {
  return (
    <div className="app-shell">
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/students" element={<Students />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/professors" element={<Professors />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/sections" element={<Sections />} />
            <Route path="/student-sections" element={<StudentSections />} />
            <Route path="/student-degrees" element={<StudentDegrees />} />
            <Route path="/sample-queries" element={<SampleQueries />} />
            <Route path="/professor" element={<ProfessorDashboard />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
