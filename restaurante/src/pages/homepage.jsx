import { Link, useLocation } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import '../app.css'
import './homepage.css';


export default function Homepage() {
    const { user, logout } = useContext(AuthContext);
    return ( <div className="homepage">
            {!user && (
                <>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/login">Login</Link>
                </>
            )}
            {user && user.role === 'client' && <Link to="/client">Menu</Link>}
            {user && user.role === 'kitchen' && <Link to="/kitchen">Kitchen</Link>}
            {user && user.role === 'bar' && <Link to="/bar">Bar</Link>}
        </div>)
}