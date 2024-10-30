import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import Loading from '../components/Loading/Loading';

const AuthMiddleware = ({ component: WrappedComponent, authRequired }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(isLoggedIn);
    // console.log(authRequired);
    if (isLoggedIn === null || isLoggedIn === undefined) {
      
      if (authRequired && !isLoggedIn) {
        navigate('/login');
      } else if (!authRequired && isLoggedIn) {
        navigate('/');
      }

    }

  }, [isLoggedIn, authRequired, navigate]);

  // Render Loading component until authentication state is determined
  if (isLoggedIn === undefined) {
    return <Loading />;
  }

  // Render the wrapped component if authentication checks are passed
  return <WrappedComponent />;
};

export default AuthMiddleware;
