import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.scss';
import Layout from './Layout';
import Homepage from './pages/homepage/homepage';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import AuthMiddleware from './middlewares/AuthMiddleware';
import GroupIndividual from './pages/groupIndividual/GroupIndividual';
import Profile from './pages/profile/profile';

function App() {
  return (
    <Router>

      <Layout>

        <Routes>

            <Route path="/login" element={<AuthMiddleware component={Login} authRequired={false} />} />            
            <Route path="/signup" element={<AuthMiddleware component={Signup} authRequired={false} />} />

            <Route path="/" element={<AuthMiddleware authRequired={true} component={Homepage} />} />
            <Route path="/profile" element={<AuthMiddleware authRequired={true} component={Profile} />} />
            <Route path="/groups/:groupId" element={<AuthMiddleware authRequired={true} component={GroupIndividual} />} />
          
        </Routes>
      
      </Layout>
   
    </Router>
  );
}

export default App;
