import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext';
import './profile.scss';
import { updateProfile, getAuth, updateEmail } from 'firebase/auth';

const Profile = () => {
  const { loggedUser, logout, login } = useContext(AuthContext);
  const auth = getAuth(); // Get the auth object
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(loggedUser.name);
  const [email, setEmail] = useState(loggedUser.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  const handleEdit = async () => {
    if (isEditing) {
      // Get the current user
      const user = auth.currentUser;

      // Check if user is authenticated
      if (user) {
        try {
          // Update user's display name
          await updateProfile(user, {
            displayName: name,
          });

          // Update user's email
          if (email !== user.email) {
            await updateEmail(user, email);
          }

          // Call login function from context
          login({ name: name, email: email, uid: user.uid }); // Pass user data
      

        } catch (error) {
          console.error('Error updating profile:', error);
        }
      } else {
        console.error('No user is currently signed in.');
      }
    }
    setIsEditing(!isEditing);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      // Implement password change logic here
      // Example: await changePassword(newPassword);
      setPasswordChangeMessage('Password changed successfully.');
    } else {
      setPasswordChangeMessage('Passwords do not match.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{name}'s Profile</h2>
      </div>

      <div className="profile-picture-section">
        <div className="profile-picture-wrapper">
          <img
            src="https://dummyimage.com/1280x720/fff/aaa" // Replace with user's profile picture
            alt="Profile"
            className="profile-picture"
          />
          <label className="upload-label" htmlFor="file-input">Change Picture</label>
          <input type="file" id="file-input" style={{ display: 'none' }} />
        </div>
      </div>

      <div className="user-details">
        <p className="user-id">User ID: <strong>{loggedUser.uid}</strong></p> {/* Display User ID */}
        <div className="profile-edit-section position-relative">
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </form>
          <button className={`btn-primary position-absolute edit-profile ${isEditing ? 'active' : ''}`} onClick={handleEdit}>
            {isEditing ? '💾' : '✏️'}
          </button>
        </div>

        <div className="password-change-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="change-password-button">Change Password</button>
          </form>
          {passwordChangeMessage && <p>{passwordChangeMessage}</p>}
        </div>
      </div>
      
      <button className="logout-button" onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
