import { ToastContainer } from "react-toastify";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import 'react-toastify/dist/ReactToastify.css';

// layout.js
function Layout({ children }) {
  return (
    <div className="layout-container">
        <Header />

        <main className="main-content">
            {children}
        </main>

        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          newestOnTop={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          closeOnClick
          theme="colored"
          // hideProgressBar 
        />

        <Footer />
    </div>
  );
}

export default Layout;
