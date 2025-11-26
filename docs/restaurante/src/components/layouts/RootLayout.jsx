import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import './rootLayout.css';

export default function RootLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav>
        <h2>SORA</h2>
        <div>
          <p><Link to="/">Home</Link></p>
          
          {!user && (
            <>
              <p><Link to="/login">Login</Link></p>
              <p><Link to="/signup">Sign Up</Link></p>
            </>
          )}

          {user && user.role === 'bar' && (
            <p><Link to="/bar">Bar</Link></p>
          )}

          {user && user.role === 'kitchen' && (
            <p><Link to="/kitchen">Kitchen</Link></p>
          )}

          {user && user.role === 'client' && (
            <p><Link to="/client">Menu</Link></p>
          )}

          {user && (
            <p>
              <button onClick={handleLogout}>Logout</button>
            </p>
          )}
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>&copy; 2024 SORA. All rights reserved</p>
      </footer>
    </>
  );
}