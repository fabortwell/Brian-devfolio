
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faLinkedinIn,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-section">
            <div className="footer-brand">
              <h3 className="footer-logo">Brian<span>Dev</span></h3>
              <p className="footer-tagline">Crafting Digital Excellence</p>
            </div>
            <p className="footer-description">
              Full-stack developer passionate about creating innovative web solutions 
              and delivering exceptional user experiences through clean code and modern design.
            </p>
            <div className="social-links">
              <a href="https://github.com/fabortwell" aria-label="GitHub" className="social-link">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="https://www.linkedin.com/in/brian-sitati-675435198/" aria-label="LinkedIn" className="social-link">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="https://x.com/itsme_brian" aria-label="Twitter" className="social-link">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#service">Services</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#testimonial">Testimonials</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><span>Web Development</span></li>
              <li><span>Mobile Applications</span></li>
              <li><span>UI/UX Design</span></li>
              <li><span>API Development</span></li>
              <li><span>Technical Consulting</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} BrianDev. All rights reserved. 
              <span className="made-with-love">
              Made with<span className="love-emoji">❤️</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;