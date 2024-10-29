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

            <Route path="/" element={<AuthMiddleware component={Homepage} authRequired={true} />} />
            <Route path="/profile" element={<AuthMiddleware component={Profile} />} authRequired={true} />
            <Route path="/groups/:groupId" element={<AuthMiddleware component={GroupIndividual} authRequired={true} />} />
          
        </Routes>
      
      </Layout>
   
    </Router>
  );
}

export default App;
