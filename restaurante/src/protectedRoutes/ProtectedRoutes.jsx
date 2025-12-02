import {Navigate} from 'react-router-dom'
import {AuthContext} from '../contexts/AuthContext';
import {useContext} from 'react';

export default function ProtectedRoutes({children, allowedRoles}){
    const {user} = useContext(AuthContext);

      if (!user) {
    return <Navigate to="/login" replace />;
  }

    if (allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to= '/login' replace/>
    } return (children)
}