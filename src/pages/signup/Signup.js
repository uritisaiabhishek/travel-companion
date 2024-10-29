// Signup.jsx
import { useState, useContext } from 'react';
import './signup.scss';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Adjust the import path as necessary
import { AuthContext } from '../../context/authContext'; // Adjust the import path as necessary
import GoogleLogin from '../../components/GoogleLogin/GoogleLogin';

const Signup = () => {
  const { login } = useContext(AuthContext); // Access login function from context

  const isUser = sessionStorage.getItem('isLoggedIn');
  const navigate = useNavigate();

  if(isUser){
    navigate('/');
  }

  const [formData, setFormData] = useState({
    name: 'uritisaiabhishek@gmail.com',
    email: 'uritisaiabhishek@gmail.com',
    password: 'uritisaiabhishek@gmail.com',
    confirmPassword: 'uritisaiabhishek@gmail.com',
  });
  const [error, setError] = useState(''); // State for handling errors
  const [success, setSuccess] = useState(''); // State for success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user; // Get user info from Firebase

      // Update user's display name
      await updateProfile(user, {
        displayName: formData.name, // Set the display name from form data
      });

      // Call login function from context
      login({ name: formData.name, email: formData.email, uid: user.uid }); // Pass user data
      
      setSuccess('Signup successful! You can now log in.');
      setError('');
      
    } catch (err) {
      setError(err.message);
      setSuccess(''); 
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <span className="auth-re-route">
          Have an account? <Link to="/login">Login here</Link>
        </span>
        
        {error && <p className="error-message">{error}</p>} {/* Show error message */}
        {success && <p className="success-message">{success}</p>} {/* Show success message */}
      
        <button type="submit" className="signup-button">
          Sign Up
        </button>

        <hr />

        <GoogleLogin />
        
      </form>

    </div>
  );
};

export default Signup;
