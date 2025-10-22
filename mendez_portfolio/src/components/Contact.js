import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedinIn,
  faTwitter,
  faInstagram,
  faGithub
} from '@fortawesome/free-brands-svg-icons';
import emailjs from '@emailjs/browser';
import confetti from 'canvas-confetti';
import './ContactSection.css';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
};

const EMAIL_SETTINGS = {
  toEmail: process.env.REACT_APP_EMAILJS_TO_EMAIL,
  toName: process.env.REACT_APP_EMAILJS_TO_NAME,
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const mapRef = useRef(null);

  useEffect(() => {
    if (EMAILJS_CONFIG.publicKey) {
      emailjs.init(EMAILJS_CONFIG.publicKey);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const mapInstance = L.map('map').setView([-1.286389, 36.817223], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      L.marker([-1.286389, 36.817223])
        .addTo(mapInstance)
        .bindPopup('BrianDev<br>Nairobi, Kenya')
        .openPopup();

      mapRef.current = mapInstance;

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setStatusMessage('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      setSubmitStatus('error');
      setStatusMessage('Email service is not configured. Please contact the website administrator.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage('');

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject || 'New Contact Form Message from BrianDev Website',
        message: formData.message,
        to_email: EMAIL_SETTINGS.toEmail,
        to_name: EMAIL_SETTINGS.toName,
        reply_to: formData.email,
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setStatusMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
        triggerConfetti();

        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      setSubmitStatus('error');
      setStatusMessage('Sorry, there was an error sending your message. Please try again or contact us directly at briansittt@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setStatusMessage('');
      }, submitStatus === 'success' ? 8000 : 10000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="section-title">
          <h2>Get In Touch</h2>
          <p>Have a project in mind or want to discuss opportunities? Reach out and let's start a conversation.</p>
        </div>

        {submitStatus && (
          <div className={`form-status ${submitStatus}`}>
            <div className="status-content">
              <div className="status-icon">
                {submitStatus === 'success' ? (
                  <div className="success-checkmark">
                    <div className="check-icon">
                      <span className="icon-line line-tip"></span>
                      <span className="icon-line line-long"></span>
                      <div className="icon-circle"></div>
                      <div className="icon-fix"></div>
                    </div>
                  </div>
                ) : (
                  <div className="error-xmark">
                    <div className="xmark-icon">
                      <span className="line left"></span>
                      <span className="line right"></span>
                    </div>
                  </div>
                )}
              </div>
              <div className="status-text">
                <h4>{submitStatus === 'success' ? 'Message Sent!' : 'Oops! Something went wrong'}</h4>
                <p>{statusMessage}</p>
              </div>
              <button
                className="status-close"
                onClick={() => {
                  setSubmitStatus(null);
                  setStatusMessage('');
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="contact-wrapper">
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <div className="info-content">
                <h3>Our Location</h3>
                <p>Nairobi, Kenya<br />East Africa</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div className="info-content">
                <h3>Phone Number</h3>
                <p>+254 704 712 885<br />+254 788 785 678</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div className="info-content">
                <h3>Email Address</h3>
                <p>briansittt@gmail.com</p>
              </div>
            </div>

            <div className="social-links">
              <a href="https://www.linkedin.com/in/brian-sitati-675435198/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="https://x.com/itsme_brian" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://github.com/fabortwell" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>
          </div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="form-control"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  placeholder="Tell us about your project or inquiry..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <FontAwesomeIcon icon={faPaperPlane} />
                  </>
                )}
              </button>
            </form>

            <div className="map-container">
              <div id="map" className="interactive-map"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
