import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";

// layout.js
function Layout({ children }) {
  return (
    <div className="layout-container">
        <Header />

        <main className="main-content">
            {children}
        </main>

        <Footer />
    </div>
  );
}

export default Layout;
