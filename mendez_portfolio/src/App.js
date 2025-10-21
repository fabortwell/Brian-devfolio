import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Service from "./components/Service";
import Portfolio from "./components/Portfolio";
import PortfolioList from "./components/PortfolioList";
import Testimonial from "./components/Testimonial";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import BlogList from "./components/BlogList";
import BlogShow from "./components/BlogShow";
import Footer from "./components/Footer";

import "./App.css";

const HomePage = () => (
  <>
    <Hero />
    <About />
    <Service />
    <Portfolio />
    <Testimonial />
    <Blog />
    <Contact />
  </>
);

// Scroll to top on route change
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          <ScrollToTopOnRouteChange />
          <Navbar />
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* Portfolio listing page */}
            <Route path="/portfolio/all" element={<PortfolioList />} />

            {/* Blog listing page */}
            <Route path="/blog" element={<BlogList />} />

            {/* Blog single page - using ID */}
            <Route path="/blog/:id" element={<BlogShow />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;