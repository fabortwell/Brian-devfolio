
import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const skills = {
    languages: ['JavaScript', 'React', 'Ruby', 'Ruby on Rails'],
    databases: ['PostgreSQL', 'MySQL', 'MongoDB'],
    tools: ['AWS', 'Figma', 'Git', 'GitHub']
  };

  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <div className="hero-left">
            <div className="greeting">
              <span className="greeting-text">Hello!</span>
              <span className="greeting-emoji">👋</span>
            </div>
            
            <h1 className="hero-name">
              <span className="name-first">Brian </span>
              <span className="name-last">Sitati</span>
            </h1>
            
            <h2 className="hero-title">
              Full-Stack Developer & UI/UX Enthusiast
            </h2>
            
            <p className="hero-description">
              Building elegant solutions to complex problems with modern technologies.
            </p>
            
            <div className="hero-actions">
              <div className="action-buttons">
                <a href="#contact" className="btn btn-contact">
                  Contact Me
                </a>
                <a href="#portfolio" className="btn btn-projects">
                  View Projects
                </a>
              </div>
              
              <div className="social-icons">
                <a href="https://github.com/fabortwell" className="social-icon" aria-label="GitHub">
                  <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/brian-sitati-675435198/" className="social-icon" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="mailto:your@email.com" className="social-icon" aria-label="Email">
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="code-display">
              <div className="code-header">
                <div className="code-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="code-filename">developer.js</span>
              </div>
              
              <div className="code-content">
                <div className="code-line comment">// Software Engineer</div>
                <div className="code-line">
             <span className="keyword">const&nbsp;</span>developer = {"{"}
                </div>
                <div className="code-line indent">
                  <span className="property">name</span>: 
                  <span className="string"> 'Brian Sitati'</span>,
                </div>
                <div className="code-line indent">
                  <span className="property">skills</span>: [
                  {skills.languages.map((skill, index) => (
                    <span key={skill}>
                      <span className="string"> '{skill}'</span>
                      {index < skills.languages.length - 1 && ','}
                    </span>
                  ))}
                  ],
                </div>
                <div className="code-line indent">
                  <span className="property">databases</span>: [
                  {skills.databases.map((db, index) => (
                    <span key={db}>
                      <span className="string"> '{db}'</span>
                      {index < skills.databases.length - 1 && ','}
                    </span>
                  ))}
                  ],
                </div>
                <div className="code-line indent">
                  <span className="property">tools:</span>: [
                  {skills.tools.map((tool, index) => (
                    <span key={tool}>
                      <span className="string"> '{tool}'</span>
                      {index < skills.tools.length - 1 && ','}
                    </span>
                  ))}
                  ],
                </div>
                <div className="code-line indent">
                  <span className="property">focuses</span>: [
                  <span className="string"> 'Full-Stack'</span>,
                  <span className="string"> 'UI/UX'</span>
                  ],
                </div>
                <div className="code-line indent">
                  <span className="property">learning</span>: 
                  <span className="string"> 'Always'</span>
                </div>
                <div className="code-line">{'};'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;