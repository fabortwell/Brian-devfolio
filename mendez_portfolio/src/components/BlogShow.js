import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaClock, FaCalendar, FaTag, FaShare } from "react-icons/fa";
import { sanityClient } from "../lib/sanityClient";
import { PortableText } from "@portabletext/react";
import "./Blog.css";

const BlogShow = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id || id === "undefined") {
        setError("Invalid blog post ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const query = `*[_type == "post" && (slug.current == $id || _id == $id)][0]{
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          body[]{
            ...,
            _type == "image" => {
              ...,
              asset->{
                _id,
                url
              }
            }
          },
          category,
          mainImage {
            asset->{
              url
            }
          },
          author->{
            name,
            image {
              asset->{
                url
              }
            }
          }
        }`;

        const post = await sanityClient.fetch(query, { id });
        if (post) setBlogPost(post);
        else setError("Blog post not found.");
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(`Failed to load blog post: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  const calculateReadingTime = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return 5;
    const wordCount = blocks.reduce((count, block) => {
      if (block._type === "block" && block.children) {
        return count + block.children.reduce((childCount, child) => {
          const text = child?.text || "";
          return childCount + text.trim().split(/\s+/).filter(Boolean).length;
        }, 0);
      }
      return count;
    }, 0);
    return Math.ceil(wordCount / 200) || 1;
  };

  const getCategory = (post) => post.category || "Uncategorized";

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown Date";
    }
  };

  const components = {
    types: {
      image: ({ value }) => (
        <figure className="blog-content-image">
          <img
            src={value?.asset?.url}
            alt={value?.alt || "Blog image"}
            loading="lazy"
          />
          {value?.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ),
    },
    block: {
      h1: ({ children }) => <h1 className="blog-content-heading main-heading">{children}</h1>,
      h2: ({ children }) => <h2 className="blog-content-heading sub-heading">{children}</h2>,
      h3: ({ children }) => <h3 className="blog-content-heading topic-heading">{children}</h3>,
      normal: ({ children }) => <p className="blog-content-paragraph">{children}</p>,
      blockquote: ({ children }) => <blockquote className="blog-content-blockquote">{children}</blockquote>,
    },
  };

  if (loading) {
    return (
      <div className="blog-show-loading">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="blog-show-error">
        <div className="container">
          <h2>Article Not Found</h2>
          <p>{error || "The article you're looking for doesn't exist."}</p>
          <Link to="/blog" className="back-to-blog">
            <FaArrowLeft /> Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  const title = blogPost.title || "Untitled Blog";
  const date = formatDate(blogPost.publishedAt);
  const readingTime = calculateReadingTime(blogPost.body);
  const category = getCategory(blogPost);
  const imageUrl = blogPost.mainImage?.asset?.url;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Check out this article: ${title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="blog-show-page">
      <div className="container">
        <div className="blog-show-nav">
          <Link to="/blog" className="blog-show-back">
            <FaArrowLeft /> All Articles
          </Link>
        </div>

        <article className="blog-show-article">
          <header className="blog-show-header">
            <div className="blog-show-category">
              <FaTag className="category-icon" /> {category}
            </div>
            <h1 className="blog-show-title">{title}</h1>
            <div className="blog-show-meta">
              <span><FaCalendar /> {date}</span>
              <span><FaClock /> {readingTime} min read</span>
              <button className="blog-show-share" onClick={handleShare}>
                <FaShare /> Share
              </button>
            </div>
          </header>

          {imageUrl && (
            <div className="blog-show-hero-image">
              <img src={imageUrl} alt={title} loading="eager" />
            </div>
          )}

          <div className="blog-show-content">
            <PortableText value={blogPost.body} components={components} />
          </div>

          <footer className="blog-show-footer">
            <div className="blog-show-tags">
              <strong>Tags:</strong> <span className="blog-tag">{category}</span>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogShow;
