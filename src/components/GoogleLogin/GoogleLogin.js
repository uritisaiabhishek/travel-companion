import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import './googlelogin.scss';

const GoogleLogin = ()=>{
    
    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error('Google login failed:', err);
        }
    };
    
    return(
        <button className="google-login-button" onClick={handleGoogleLogin}>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google icon"
                className="google-icon"
            />
            Login with Google
        </button>
    )
}


export default GoogleLogin;