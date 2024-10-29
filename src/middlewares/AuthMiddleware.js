import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Loading from '../components/Loading/Loading';

const AuthMiddleware = ({ component: WrappedComponent, authRequired }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on authentication requirement and status
    if (isLoggedIn !== undefined) {
      if ((authRequired && !isLoggedIn) || (!authRequired && isLoggedIn)) {
        navigate(authRequired ? '/login' : '/');
      }
    }
  }, [isLoggedIn, authRequired, navigate]);

  // Render the loading screen while checking authentication status
  if (isLoggedIn === undefined) {
    return <Loading />;
  }

  // Render the wrapped component if user meets authentication requirements
  return <WrappedComponent />;
};

export default AuthMiddleware;
