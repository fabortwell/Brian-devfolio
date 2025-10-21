
import React, { useState, useEffect, useRef } from 'react';
import { FaQuoteLeft, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Testimonial.css';

const Testimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const headerRef = useRef(null);
  const cardRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      quote:
        'The designs he crafted are top-notch, and the design system he integrated allows for straightforward fixes and bulk updates throughout almost every area of the app.',
      name: 'Benjamin Morgan',
      position: 'CEO at goPuff',
      avatar: '👨‍💼',
    },
    {
      id: 2,
      quote:
        'Exceptional attention to detail and user experience. Brian transformed our platform into something truly remarkable that our users love.',
      name: 'Sarah Johnson',
      position: 'Product Director at InnoTech',
      avatar: '👩‍💼',
    },
    {
      id: 3,
      quote:
        'Working with Brian was a game-changer for our startup. His designs not only look beautiful but also drive real business results.',
      name: 'Michael Chen',
      position: 'Founder at TechStart',
      avatar: '👨‍🚀',
    },
    {
      id: 4,
      quote:
        'Brian exceeded every expectation. He delivered a modern, responsive design that boosted our engagement metrics overnight.',
      name: 'Olivia Njeser',
      position: 'Marketing Manager at EduPro',
      avatar: '👩‍💻',
    },
    {
      id: 5,
      quote:
        'His ability to merge creativity with clean, efficient code is unmatched. We now have a site that’s as fast as it is stunning.',
      name: 'Daniel Jacobs',
      position: 'CTO at FinEdge',
      avatar: '👨‍💻',
    },
    {
      id: 6,
      quote:
        'I was impressed by Brian’s professionalism and communication throughout the entire project. The end result was flawless.',
      name: 'Emily Carter',
      position: 'Operations Lead at Techyny',
      avatar: '👩‍💼',
    },
    {
      id: 7,
      quote:
        'From concept to launch, Brian handled everything with precision and creativity. I’d hire him again in a heartbeat.',
      name: 'James Anderson',
      position: 'Freelance Entrepreneur',
      avatar: '👨‍🎨',
    },
  ];

  useEffect(() => {
    const headerElement = headerRef.current;
    const cardElement = cardRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (headerElement) observer.observe(headerElement);
    if (cardElement) observer.observe(cardElement);

    return () => {
      if (headerElement) observer.unobserve(headerElement);
      if (cardElement) observer.unobserve(cardElement);
      observer.disconnect();
    };
  }, []);

  const nextTestimonial = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);

    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToTestimonial = (index) => {
    if (isAnimating || index === currentTestimonial) return;

    setIsAnimating(true);
    setCurrentTestimonial(index);

    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="testimonial" id="testimonial">
      <div className="container">
        <div className="testimonial-content">
          <div ref={headerRef} className="testimonial-header">
            <h2>
              <span>What People Are </span>
              <span className="highlight">Saying About My Work</span>
            </h2>
            <div className="navigation-controls">
              <button
                className="nav-btn prev-btn"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
                disabled={isAnimating}
              >
                <FaArrowLeft />
              </button>
              <button
                className="nav-btn next-btn active"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
                disabled={isAnimating}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>

          {/* Testimonial Card */}
          <div ref={cardRef} className="testimonial-card">
            <div className="quote-icon">
              <FaQuoteLeft />
            </div>

            <div key={currentTestimonial} className="testimonial-content-wrapper">
              <blockquote className="testimonial-text">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>

              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="author-info">
                  <h4>{testimonials[currentTestimonial].name}</h4>
                  <p>{testimonials[currentTestimonial].position}</p>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${
                    index === currentTestimonial ? 'active' : ''
                  }`}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  disabled={isAnimating}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
