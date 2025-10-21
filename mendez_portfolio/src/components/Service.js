import React, { useEffect, useRef } from 'react';
import { FaPuzzlePiece, FaDraftingCompass, FaCloud, FaRobot, FaGlobe, FaGraduationCap } from 'react-icons/fa';
import './Services.css';

const Service = () => {
  const services = [
    {
      icon: <FaPuzzlePiece />,
      title: "System Architect",
      description: "I design and implement scalable, resilient systems rooted in clean architecture and long-term maintainability — ensuring every solution grows with its users."
    },
    {
      icon: <FaDraftingCompass />,
      title: "Analytical Engineer",
      description: "I approach development with precision and structure, blending creativity with logic to deliver code that solves problems intelligently and efficiently."
    },
    {
      icon: <FaCloud />,
      title: "Cloud & DevOps Expertise",
      description: "From AWS to CI/CD, I build reliable cloud infrastructures that streamline deployment, enhance performance, and ensure continuous scalability."
    },
    {
      icon: <FaRobot />,
      title: "Cognitive Computing Specialist",
      description: "I integrate intelligent automation and advanced AI models to craft systems that learn, adapt, and deliver meaningful user experiences."
    },
    {
      icon: <FaGlobe />,
      title: "Global Collaborator",
      description: "My experience with international clients has refined my communication, empathy, and adaptability — key traits for building lasting professional partnerships."
    },
    {
      icon: <FaGraduationCap />,
      title: "Lifelong Learner",
      description: "Guided by curiosity and craftsmanship, I continuously expand my technical and theoretical knowledge to merge innovation with academic depth."
    }
  ];

  const cardsRef = useRef([]);

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
        rootMargin: '0px 0px -50px 0px'
      }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <section className="why-hire-me" id="service">
      <div className="container">
        <div className="services-header">
          <div className="header-content centered">
            <div className="header-text">
              <h2>
                <span className="line-1">Why Hire Me?</span>
                <span className="line-2">A Foundation of Trust and Excellence</span>
              </h2>
              <p className="header-description">
                I am committed to delivering not just code, but value. My work is built on a foundation of reliability, 
                quality, and a proven ability to solve complex problems with data-driven results.
              </p>
            </div>
          </div>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={index} 
              ref={addToRefs}
              className="service-item"
            >
              <div className="service-icon-left">
                {service.icon}
              </div>
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;