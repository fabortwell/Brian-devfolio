import React, { useEffect, useState, useRef } from "react";
import { FaExternalLinkAlt, FaGithub, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { sanityClient } from "../lib/sanityClient";
import { urlFor } from "../lib/imageBuilder";
import "./Portfolio.css";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const maxHomeProjects = 3;

  const headerRef = useRef(null);
  const projectsRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    const query = `*[_type == "project"] | order(publishedAt desc){
      _id,
      title,
      summary,
      mainImage,
      liveUrl,
      repoUrl,
      tech,
      category
    }`;

    sanityClient.fetch(query)
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const featuredProjects = projects.slice(0, maxHomeProjects);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    setTimeout(() => {
      if (headerRef.current) observer.observe(headerRef.current);
      projectsRef.current.forEach((project) => project && observer.observe(project));
      if (buttonRef.current) observer.observe(buttonRef.current);
    }, 100);

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      projectsRef.current.forEach((project) => project && observer.unobserve(project));
      if (buttonRef.current) observer.unobserve(buttonRef.current);
    };
  }, [featuredProjects]);

  const addProjectToRefs = (el) => {
    if (el && !projectsRef.current.includes(el)) {
      projectsRef.current.push(el);
    }
  };

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="portfolio-container">
  
        <div ref={headerRef} className="portfolio-header">
          <div className="portfolio-header-content">
            <div className="portfolio-header-text">
              <h2 className="portfolio-title">
                <span className="portfolio-title-main">Featured</span>
                <span className="portfolio-title-accent">Projects</span>
              </h2>
              <p className="portfolio-description">
                A collection of my recent work showcasing innovative solutions and creative designs
              </p>
              <div className="portfolio-decoration">
                <div className="portfolio-decoration-line"></div>
                <div className="portfolio-decoration-dot"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="portfolio-grid">
          {featuredProjects.map((project, index) => {
            const imageUrl = project.mainImage ? urlFor(project.mainImage).width(800).url() : null;
            const liveLink = project.liveUrl;
            const githubLink = project.repoUrl;

            return (
              <div 
                key={project._id} 
                ref={addProjectToRefs}
                className="portfolio-item"
                data-index={index}
              >
                <div className="portfolio-item-image-container">
                  {imageUrl && (
                    <div className="portfolio-item-image">
                      <img 
                        src={imageUrl} 
                        alt={project.title || "Project"} 
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="portfolio-category-label">
                    <span>{project.category}</span>
                  </div>

                  <div className="portfolio-item-overlay">
                    <div className="portfolio-overlay-content">
                      <h4 className="overlay-title">Project Overview</h4>
                      <p className="overlay-description">
                        {project.summary?.substring(0, 120)}...
                      </p>
                      <div className="portfolio-overlay-actions">
                        {liveLink && (
                          <a
                            href={liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-overlay-btn"
                            title="View Live Demo"
                          >
                            <FaExternalLinkAlt />
                            <span>Live Demo</span>
                          </a>
                        )}
                        {githubLink && (
                          <a
                            href={githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-overlay-btn"
                            title="View Source Code"
                          >
                            <FaGithub />
                            <span>Source Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="portfolio-item-content">
                  <div className="portfolio-item-header">
                    <h3 className="portfolio-item-title">{project.title}</h3>
                  </div>

                  <p className="portfolio-item-description">
                    {project.summary}
                  </p>

                  {project.tech && project.tech.length > 0 && (
                    <div className="portfolio-tags">
                      {project.tech.map((tag, i) => (
                        <span key={i} className="portfolio-tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="portfolio-item-actions">
                    {liveLink && (
                      <a
                        href={liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-action-btn portfolio-action-primary"
                      >
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                    {githubLink && (
                      <a
                        href={githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-action-btn portfolio-action-secondary"
                      >
                        <FaGithub /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {projects.length > maxHomeProjects && (
          <div ref={buttonRef} className="portfolio-view-all">
            <Link 
              to="/portfolio/all" 
              className="view-all-btn"
            >
              <span className="view-all-text">View All Projects</span>
              <FaArrowRight className="view-all-arrow" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;