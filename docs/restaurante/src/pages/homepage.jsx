import { Link, useLocation } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';


export default function Homepage() {
    const { user, logout } = useContext(AuthContext);
    return (<div>
        {!user ? <div>
            <Link to="/signup">Sign Up</Link> <br />
            <Link to="/login">Login</Link><br />
        </div> : <button onClick={logout}>logout</button>}
        {(user && user.role == 'client') &&
            <Link to="/client">Menu</Link>}<br />
        {(user && user.role == 'kitchen') &&
            <Link to="/kitchen">Kitchen</Link>}<br />
        {(user && user.role == 'bar') &&
            <Link to="/bar">Bar</Link>}<br />
    </div>)


}