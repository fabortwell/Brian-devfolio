import React, { useEffect, useState, useRef } from "react";
import {
  FaArrowRight,
  FaClock,
  FaHeart,
  FaHome,
  FaCompass,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchBlogPosts } from "../lib/sanityClient";
import "./Blog.css";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const ctaRef = useRef(null);
  const emptyStateRef = useRef(null);

  // Fetch posts from Sanity
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

  // Animate sections on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const header = headerRef.current;
    const cards = [...cardsRef.current];
    const cta = ctaRef.current;
    const emptyState = emptyStateRef.current;

    const observeElements = () => {
      if (header) observer.observe(header);

      if (blogPosts.length > 0) {
        cards.forEach((card) => card && observer.observe(card));
        if (cta) observer.observe(cta);
      } else if (emptyState) observer.observe(emptyState);
    };

    setTimeout(observeElements, 100);

    return () => {
      if (header) observer.unobserve(header);
      cards.forEach((card) => card && observer.unobserve(card));
      if (cta) observer.unobserve(cta);
      if (emptyState) observer.unobserve(emptyState);
    };
  }, [blogPosts]);

  // Add blog card refs dynamically
  const addCardToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  // Calculate reading time from content
  const calculateReadingTime = (content) => {
    if (!content) return 1;
    try {
      let wordCount = 0;
      if (typeof content === "string") {
        wordCount = content.trim().split(/\s+/).length;
      } else if (Array.isArray(content)) {
        wordCount = content.reduce((count, block) => {
          if (block._type === "block" && block.children) {
            return (
              count +
              block.children.reduce((c, child) => {
                const text = child?.text || "";
                return c + text.trim().split(/\s+/).filter(Boolean).length;
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

  // Get short excerpt
  const getExcerpt = (post) => {
    if (post.excerpt)
      return post.excerpt.length > 120
        ? post.excerpt.substring(0, 120) + "..."
        : post.excerpt;

    if (post.body && Array.isArray(post.body)) {
      const firstBlock = post.body.find(
        (b) => b._type === "block" && b.children
      );
      if (firstBlock) {
        const text = firstBlock.children.map((c) => c.text).join(" ");
        return text.length > 120 ? text.substring(0, 120) + "..." : text;
      }
    }

    return "Read more about this topic...";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown Date";
    }
  };

  // Helpers
  const getCategory = (post) => post.category || "Uncategorized";
  const getImageUrl = (post) => post.mainImage?.asset?.url || null;

  const featuredPosts = blogPosts.slice(0, 4);

  return (
    <section className="blog-section" id="blog">
      <div className="container">
        {/* Header */}
        <div ref={headerRef} className="blog-header-modern">
          <h2 className="blog-title-modern">
            Blog & <span className="blog-title-accent-modern">Articles</span>
          </h2>
          <p className="blog-description-modern">
            Discover the latest trends, insights, and stories from the world of
            development and design
          </p>
          <div className="blog-header-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="blog-loading-state">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Curating articles for you...</p>
            </div>
          </div>
        )}

        {/* Blog Cards */}
        {!loading && blogPosts.length > 0 && (
          <>
            <div className="blog-grid-modern">
              {featuredPosts.map((post, index) => {
                const {
                  _id,
                  title = "Untitled Blog",
                  slug,
                  publishedAt,
                  body,
                } = post;

                const category = getCategory(post);
                const date = formatDate(publishedAt);
                const excerpt = getExcerpt(post);
                const readingTime = calculateReadingTime(body);
                const imageUrl = getImageUrl(post);

                return (
                  <article
                    key={_id}
                    ref={addCardToRefs}
                    className="blog-card-modern"
                    data-index={index}
                  >
                    <div className="blog-card-image-modern">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="blog-image-modern"
                        />
                      ) : (
                        <div className="blog-image-placeholder-modern">
                          <span>No Image</span>
                        </div>
                      )}
                      <div className="blog-card-category-modern">
                        <span>{category}</span>
                      </div>
                      <div className="blog-card-overlay"></div>
                    </div>

                    <div className="blog-card-content-modern">
                      <div className="blog-card-meta-modern">
                        <span className="blog-date-modern">{date}</span>
                        <span className="blog-meta-separator-modern">•</span>
                        <span className="blog-reading-time-modern">
                          <FaClock className="clock-icon-modern" />{" "}
                          {readingTime} min read
                        </span>
                      </div>

                      <h3 className="blog-card-title-modern">{title}</h3>
                      <p className="blog-card-excerpt-modern">{excerpt}</p>

                      <div className="blog-card-footer">
                        <Link
                          to={`/blog/${slug?.current || _id}`}
                          className="blog-card-link-modern"
                        >
                          Read More
                          <div className="link-arrow">
                            <FaArrowRight className="arrow-icon-modern" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="blog-cta-modern">
              <div className="cta-content">
                <Link to="/blog" className="cta-button-modern">
                  <span>View All Articles</span>
                  <div className="button-arrow">
                    <FaArrowRight />
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && blogPosts.length === 0 && (
          <div ref={emptyStateRef} className="blog-empty-state">
            <div className="empty-state-content">
              <div className="empty-state-icon">
                <FaCompass />
              </div>
              <h3 className="empty-state-title">No Articles Available Yet</h3>
              <p className="empty-state-description">
                We're currently brewing some fresh insights and stories for you.
                Great content takes time to create, and we want to make sure
                everything we share is valuable and meaningful.
              </p>
              <div className="empty-state-actions">
                <Link to="/" className="empty-state-btn primary">
                  <FaHome className="btn-icon" /> Back to Home
                </Link>
                <Link to="/portfolio" className="empty-state-btn secondary">
                  <FaHeart className="btn-icon" /> Explore My Work
                </Link>
              </div>
              <div className="empty-state-note">
                <p>In the meantime, feel free to explore my portfolio or get in touch!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
