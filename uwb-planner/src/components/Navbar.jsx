import { Link } from "react-router-dom";
import './NavBarStyles.css'; 

export default function Navbar() {
  return (
    <div className="navbar">
        <Link to="/" className="nav-button">UWB Overview</Link>
      <Link to="/studs" className="nav-button">Students</Link>
      <Link to="/profs" className="nav-button">Professors</Link>
      <Link to="/courses" className="nav-button">Courses</Link>
      <Link to="/programs" className="nav-button">Degree Programs</Link>
    </div>
  );
}