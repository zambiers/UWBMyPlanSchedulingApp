import { Link } from 'react-router-dom';
import './NavBarStyles.css';

const links = [
  { to: '/', label: 'Overview' },
  { to: '/students', label: 'Students' },
  { to: '/student', label: 'Student Portal' },
  { to: '/professors', label: 'Professors' },
  { to: '/courses', label: 'Courses' },
  { to: '/sections', label: 'Sections' },
  { to: '/programs', label: 'Degree Programs' },
  { to: '/student-sections', label: 'Student Sections' },
  { to: '/student-degrees', label: 'Student Degrees' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">UWB Planner</div>
      <div className="nav-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="nav-link">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
