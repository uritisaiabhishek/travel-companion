// Header.js
import { Link } from 'react-router-dom';
import './header.scss';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext); // Get the logout function from context

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <header className="flex align-items-center justify-content-between">

      <Link className='logo' to='/'>Travel Companion</Link>

      <nav className="navigation">
        {isLoggedIn && <Link to="/">Home</Link>}

        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/signup">Signup</Link>}

        {isLoggedIn && <Link to="/profile">Profile</Link>}

        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        
      </nav>

    </header>
  );
};

export default Header;
