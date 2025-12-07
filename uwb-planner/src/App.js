import './styling/App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.js';

//pages
import students from './pages/students.jsx';
import professors from './pages/professors.jsx';
import courses from './pages/courses.jsx';
import programs from './pages/programs.jsx';
import sections from './pages/section.jsx';
import home from './pages/overview.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<home />} />
          <Route path="/studs" element={<students />} />
          <Route path="/profs" element={<professors />} />
          <Route path="/courses" element={<courses />} />
          <Route path="/programs" element={<programs />} />
          <Route path="/sections" element={<sections />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;