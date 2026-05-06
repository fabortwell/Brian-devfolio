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
    const query = `*[_type == "project"] 
      | order(publishedAt desc, _createdAt desc){
      _id,
      title,
      summary,
      publishedAt,
      mainImage,
      liveUrl,
      repoUrl,
      tech,
      category
    }`;

    sanityClient
      .fetch(query)
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

 
  const featuredProjects = [...projects]
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a._createdAt);
      const dateB = new Date(b.publishedAt || b._createdAt);
      return dateB - dateA;
    })
    .slice(0, maxHomeProjects);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // ✅ FIX: store stable references (prevents .current cleanup issue)
    const headerEl = headerRef.current;
    const buttonEl = buttonRef.current;
    const projectEls = [...projectsRef.current];

    setTimeout(() => {
      if (headerEl) observer.observe(headerEl);
      projectEls.forEach((el) => el && observer.observe(el));
      if (buttonEl) observer.observe(buttonEl);
    }, 100);

    return () => {
      if (headerEl) observer.unobserve(headerEl);
      projectEls.forEach((el) => el && observer.unobserve(el));
      if (buttonEl) observer.unobserve(buttonEl);
    };
  }, []); 

  const addProjectToRefs = (el) => {
    if (el && !projectsRef.current.includes(el)) {
      projectsRef.current.push(el);
    }
  };

  return (
    <section className="portfolio-section" id="portfolio">
      <div className="portfolio-container">

        {/* HEADER */}
        <div ref={headerRef} className="portfolio-header">
          <div className="portfolio-header-content">
            <div className="portfolio-header-text">
              <h2 className="portfolio-title">
                <span className="portfolio-title-main">Featured</span>
                <span className="portfolio-title-accent">Projects</span>
              </h2>
              <p className="portfolio-description">
                A collection of my recent work showcasing innovative solutions
                and creative designs
              </p>
              <div className="portfolio-decoration">
                <div className="portfolio-decoration-line"></div>
                <div className="portfolio-decoration-dot"></div>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECT GRID */}
        <div className="portfolio-grid">
          {featuredProjects.map((project, index) => {
            const imageUrl = project.mainImage
              ? urlFor(project.mainImage).width(800).url()
              : null;

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
                        {project.summary}
                      </p>

                      <div className="portfolio-overlay-actions">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-overlay-btn"
                          >
                            <FaExternalLinkAlt />
                            <span>Live Demo</span>
                          </a>
                        )}

                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-overlay-btn"
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
                  <h3 className="portfolio-item-title">{project.title}</h3>

                  <p className="portfolio-item-description">
                    {project.summary}
                  </p>

                  {project.tech?.length > 0 && (
                    <div className="portfolio-tags">
                      {project.tech.map((tag, i) => (
                        <span key={i} className="portfolio-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="portfolio-item-actions">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-action-btn portfolio-action-primary"
                      >
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
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

        {/* VIEW ALL BUTTON */}
        {projects.length > maxHomeProjects && (
          <div ref={buttonRef} className="portfolio-view-all">
            <Link to="/portfolio/all" className="view-all-btn">
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