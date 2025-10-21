import React, { useEffect, useRef } from 'react';
import { FaAward, FaProjectDiagram, FaSmile, FaTrophy } from 'react-icons/fa';
import './About.css';

const About = () => {
  const textRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const textElement = textRef.current;
    const statsElement = statsRef.current;

    if (textElement) observer.observe(textElement);
    if (statsElement) observer.observe(statsElement);

    return () => {
      if (textElement) observer.unobserve(textElement);
      if (statsElement) observer.unobserve(statsElement);
    };
  }, []);

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-content">
          <div ref={textRef} className="about-text">
            <h2>About Me</h2>
              <p className="intro-text">
              Welcome to my creative space! I'm Brian,<br />
              a passionate Software Developer crafting<br />
              clean, efficient, and scalable digital solutions.<br />
              I merge code with UI/UX design to create<br />
              seamless and engaging user experiences.
            </p>
            <div className="skills-grid">
              <div className="skill-category">
                <h4>UI/UX Design</h4>
                <p>Intuitive Interfaces</p>
              </div>
              <div className="skill-category">
                <h4>Software Dev</h4>
                <p>Web Design</p>
              </div>
            </div>

            <div className="about-actions">
              <a href="#portfolio" className="btn-secondary">Learn More</a>
            </div>
          </div>

          <div ref={statsRef} className="about-stats">
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon">
                  <FaAward />
                </div>
                <div className="stat-content">
                  <h3>2+</h3>
                  <p>Years of Experience</p>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon">
                  <FaProjectDiagram />
                </div>
                <div className="stat-content">
                  <h3>20+</h3>
                  <p>Projects Completed</p>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon">
                  <FaSmile />
                </div>
                <div className="stat-content">
                  <h3>100%</h3>
                  <p>Client Satisfactions</p>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon">
                  <FaTrophy />
                </div>
                <div className="stat-content">
                  <h3>2+</h3>
                  <p>Award Winner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
