import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaGithub, FaArrowRight, FaArrowLeft, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { sanityClient } from "../lib/sanityClient";
import { urlFor } from "../lib/imageBuilder";
import "./PortfolioList.css";

const PortfolioList = () => {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

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

  const categories = ["all", ...new Set(projects.map(project => project.category).filter(Boolean))];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="portfolio-list-section" id="portfolio-all">
      <div className="portfolio-list-container">
        <div className="portfolio-list-nav">
          <Link to="/" className="back-to-home-btn">
            <FaHome className="btn-icon" />
            Back to Home
          </Link>
        </div>

        <div className="portfolio-list-header">
          <div className="portfolio-list-header-content">
            <div className="portfolio-list-header-text">
              <h1 className="portfolio-list-title">
                <span className="portfolio-list-title-main">All</span>
                <span className="portfolio-list-title-accent">Projects</span>
              </h1>
              <p className="portfolio-list-description">
                Explore my complete portfolio of projects, showcasing innovative solutions and creative designs across various technologies and domains.
              </p>
              <div className="portfolio-list-stats">
                <div className="stat-item">
                </div>
                <div className="stat-item">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="portfolio-list-filters">
          <div className="filters-header">
            <h3 className="filters-title">Filter by Category</h3>
            <span className="filter-count">
              {filteredProjects.length} projects
            </span>
          </div>
          <div className="filters-container">
            {categories.map(category => (
              <button
                key={category}
                className={`portfolio-list-filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {activeFilter === category && (
                  <span className="filter-indicator"></span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="portfolio-list-grid">
          {currentProjects.map((project, index) => {
            const imageUrl = project.mainImage ? urlFor(project.mainImage).width(800).url() : null;
            const liveLink = project.liveUrl;
            const githubLink = project.repoUrl;

            return (
              <div 
                key={project._id} 
                className="portfolio-list-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="portfolio-list-item-image-container">
                  {imageUrl && (
                    <div className="portfolio-list-item-image">
                      <img 
                        src={imageUrl} 
                        alt={project.title || "Project"} 
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="portfolio-list-category-label">
                    <span>{project.category}</span>
                  </div>

                  <div className="portfolio-list-item-overlay">
                    <div className="portfolio-list-overlay-content">
                      <h4 className="portfolio-list-overlay-title">Project Overview</h4>
                      <p className="portfolio-list-overlay-description">
                        {project.summary?.substring(0, 120)}...
                      </p>
                      <div className="portfolio-list-overlay-actions">
                        {liveLink && (
                          <a
                            href={liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="portfolio-list-overlay-btn"
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
                            className="portfolio-list-overlay-btn"
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

                <div className="portfolio-list-item-content">
                  <div className="portfolio-list-item-header">
                    <h3 className="portfolio-list-item-title">{project.title}</h3>
                    <div className="portfolio-list-item-links">
                      {liveLink && (
                        <a
                          href={liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="portfolio-list-icon-link"
                          title="Live Demo"
                        >
                          <FaExternalLinkAlt />
                        </a>
                      )}
                      {githubLink && (
                        <a
                          href={githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="portfolio-list-icon-link"
                          title="Source Code"
                        >
                          <FaGithub />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="portfolio-list-item-description">
                    {project.summary}
                  </p>

                  {project.tech && project.tech.length > 0 && (
                    <div className="portfolio-list-tags">
                      {project.tech.map((tag, i) => (
                        <span key={i} className="portfolio-list-tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="portfolio-list-item-actions">
                    {liveLink && (
                      <a
                        href={liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-list-action-btn portfolio-list-action-primary"
                      >
                        <FaExternalLinkAlt /> View Project
                      </a>
                    )}
                    {githubLink && (
                      <a
                        href={githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-list-action-btn portfolio-list-action-secondary"
                      >
                        <FaGithub /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length > projectsPerPage && (
          <div className="portfolio-list-pagination">
            <div className="pagination-summary">
              <span className="pagination-info">
                Showing {currentProjects.length} of {filteredProjects.length} projects
              </span>
              <span className="pagination-page-info">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            
            <div className="pagination-main-controls">
              <button
                className="pagination-nav-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaArrowLeft />
                <span>Previous</span>
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                className="pagination-nav-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span>Next</span>
                <FaArrowRight />
              </button>
            </div>

            <div className="pagination-jump">
              <span>Go to page:</span>
              <select 
                value={currentPage} 
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="page-select"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {currentProjects.length === 0 && (
          <div className="no-projects-message">
            <div className="no-projects-content">
              <h3>No projects found</h3>
              <p>No projects match the current filter. Try selecting a different category.</p>
              <button 
                className="reset-filters-btn"
                onClick={() => setActiveFilter("all")}
              >
                Show All Projects
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioList;
