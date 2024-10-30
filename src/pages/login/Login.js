// Login.js
import { useContext, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import './login.scss';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLogin from '../../components/GoogleLogin/GoogleLogin';
import { AuthContext } from '../../context/authContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('uritisaiabhishek@gmail.com');
  const [password, setPassword] = useState('uritisaiabhishek@gmail.com');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get user info from Firebase
      console.log(user);
      // Call login function from context
      login({ name: user.displayName, email: user.email, uid: user.uid });
      navigate('/');
      toast.success("Logged in successfully");

    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className='login-form'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span className='auth-re-route'>No account <Link to="/signup">Signup here</Link></span>
        <button className='login-button' type="submit">Login</button>
      </form>

      <hr />

      <GoogleLogin />

    </div>
  );
};

export default Login;
