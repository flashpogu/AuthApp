import { NavLink } from "react-router-dom";
import { useState } from "react";
import Ham from "./ui/Ham";
import { TbBrandAmongUs } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  interface RootState {
    user: {
      currentUser: {
        profilePicture: string;
      };
    };
  }
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <TbBrandAmongUs size={40} />
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          <Ham />
        </div>
        <div className={`nav-elements  ${showNavbar && "active"}`}>
          <ul className="flex items-center">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
              <NavLink to="/projects">Projects</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              {currentUser ? (
                <img
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer w-10 h-10 rounded-full object-cover"
                  src={currentUser.profilePicture}
                  alt=""
                />
              ) : (
                <NavLink to="/register">Join Us</NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
