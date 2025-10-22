import React, { useEffect, useState, useRef } from "react";
import { FaArrowRight, FaArrowLeft, FaClock, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchBlogPosts } from "../lib/sanityClient";
import "./Blog.css";

const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 4;

  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const paginationRef = useRef(null);

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        setLoading(true);
        const posts = await fetchBlogPosts();
        setBlogPosts(posts || []);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    getBlogPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );
    
    const headerEl = headerRef.current;
    const cardsEls = [...cardsRef.current];
    const paginationEl = paginationRef.current;

    setTimeout(() => {
      if (headerEl) observer.observe(headerEl);

      cardsEls.forEach((card) => {
        if (card) observer.observe(card);
      });

      if (paginationEl) observer.observe(paginationEl);
    }, 100);

    return () => {
      if (headerEl) observer.unobserve(headerEl);
      cardsEls.forEach((card) => {
        if (card) observer.unobserve(card);
      });
      if (paginationEl) observer.unobserve(paginationEl);
    };
  }, [blogPosts, currentPage]);

  const addCardToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const calculateReadingTime = (content) => {
    if (!content) return 1;

    try {
      let wordCount = 0;

      if (typeof content === "string") {
        wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      } else if (Array.isArray(content)) {
        wordCount = content.reduce((count, block) => {
          if (block._type === "block" && block.children) {
            return (
              count +
              block.children.reduce((childCount, child) => {
                const text = child?.text || "";
                return (
                  childCount +
                  text.trim().split(/\s+/).filter(Boolean).length
                );
              }, 0)
            );
          }
          return count;
        }, 0);
      }

      return Math.max(1, Math.ceil(wordCount / 200));
    } catch (error) {
      console.warn("Error calculating reading time:", error);
      return 1;
    }
  };

  const getExcerpt = (post) => {
    if (post.excerpt) {
      return post.excerpt.length > 120
        ? post.excerpt.substring(0, 120) + "..."
        : post.excerpt;
    }

    if (post.body && Array.isArray(post.body)) {
      const firstBlock = post.body.find(
        (block) => block._type === "block" && block.children
      );
      if (firstBlock && firstBlock.children) {
        const text = firstBlock.children.map((child) => child.text).join(" ");
        return text.length > 120 ? text.substring(0, 120) + "..." : text;
      }
    }

    return "Read more about this topic...";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "Unknown Date";
    }
  };

  const getCategory = (post) => {
    if (post.category) {
      return post.category;
    }
    return "Uncategorized";
  };

  const getImageUrl = (post) => {
    if (post.mainImage?.asset?.url) {
      return post.mainImage.asset.url;
    }
    return null;
  };

  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <section className="blog-list-section">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading articles...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-list-section" id="blog-all">
      <div className="container">
        <div className="blog-list-nav">
          <Link to="/" className="back-to-home-btn">
            <FaHome className="btn-icon" />
            Back to Home
          </Link>
        </div>

        <div ref={headerRef} className="blog-list-header">
          <div className="blog-list-header-content">
            <div className="blog-list-header-text">
              <h1 className="blog-list-title">
                <span className="blog-list-title-main">All</span>
                <span className="blog-list-title-accent">Articles</span>
              </h1>
              <p className="blog-list-description">
                Explore our complete collection of articles, insights, and
                stories about development, design, and technology.
              </p>
              <div className="blog-list-stats">
                <div className="stat-item">
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="blog-list-grid">
          {currentPosts.map((post, index) => {
            const title = post?.title || "Untitled Blog";
            const category = getCategory(post);
            const date = formatDate(post?.publishedAt);
            const excerpt = getExcerpt(post);
            const readingTime = calculateReadingTime(post?.body);
            const imageUrl = getImageUrl(post);
            const slug = post?.slug?.current;

            return (
              <article
                key={post._id}
                ref={addCardToRefs}
                className="blog-list-card"
                data-index={index}
              >
                <div className="blog-list-card-image">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="blog-list-image"
                    />
                  ) : (
                    <div className="blog-list-image-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="blog-list-card-category">
                    <span>{category}</span>
                  </div>
                  <div className="blog-list-card-overlay"></div>
                </div>

                <div className="blog-list-card-content">
                  <div className="blog-list-card-meta">
                    <span className="blog-list-date">{date}</span>
                    <span className="blog-list-meta-separator">•</span>
                    <span className="blog-list-reading-time">
                      <FaClock className="blog-list-clock-icon" />
                      {readingTime} min read
                    </span>
                  </div>

                  <h3 className="blog-list-card-title">{title}</h3>

                  <p className="blog-list-card-excerpt">{excerpt}</p>

                  <div className="blog-list-card-footer">
                    <Link
                      to={`/blog/${slug || post._id}`}
                      className="blog-list-card-link"
                    >
                      Read More
                      <div className="blog-list-link-arrow">
                        <FaArrowRight className="blog-list-arrow-icon" />
                      </div>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {blogPosts.length > postsPerPage && (
          <div ref={paginationRef} className="blog-list-pagination">
            <div className="pagination-summary">
              <span className="pagination-info">
                Showing {currentPosts.length} of {blogPosts.length} articles
              </span>
              <span className="pagination-page-info">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="pagination-main-controls">
              <button
                className="pagination-nav-btn"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <FaArrowLeft />
                <span>Previous</span>
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`pagination-number ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className="pagination-nav-btn"
                onClick={nextPage}
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
                onChange={(e) => {
                  setCurrentPage(Number(e.target.value));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="page-select"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        )}

        {blogPosts.length === 0 && !loading && (
          <div className="no-posts-message">
            <div className="no-posts-content">
              <h3>No articles found</h3>
              <p>
                There are no blog posts available at the moment. Please check
                back later.
              </p>
              <Link to="/" className="back-home-btn">
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;
