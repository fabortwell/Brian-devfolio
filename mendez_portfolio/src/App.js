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
  <div className="w-full overflow-x-hidden">
    <Hero />
    <About />
    <Service />
    <Portfolio />
    <Testimonial />
    <Blog />
    <Contact />
  </div>
);

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
        <div className="App min-h-screen w-full overflow-x-hidden">
          <ScrollToTop />
          <ScrollToTopOnRouteChange />
          <Navbar />
          <main className="w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio/all" element={<PortfolioList />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogShow />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;