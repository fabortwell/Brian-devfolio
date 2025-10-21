
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaClock, FaCalendar, FaTag, FaShare } from "react-icons/fa";
import { sanityClient } from "../lib/sanityClient";
import "./Blog.css";

const BlogShow = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("DocumentId from URL:", id);

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

        console.log("Making Sanity API call for blog:", id);
        const query = `*[_type == "post" && (slug.current == $id || _id == $id)][0] {
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          body,
          category,
          mainImage {
            asset->{
              url,
              metadata {
                dimensions
              }
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

        console.log("Sanity Blog API Response:", post);

        if (post) {
          setBlogPost(post);
        } else {
          setError("Blog post not found in Sanity");
        }
      } catch (err) {
        console.error("Error fetching blog post from Sanity:", err);
        setError(`Failed to load blog post: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);
  const renderRichText = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return null;

    return blocks.map((block, index) => {
      if (block._type === "block") {
        const text = block.children.map((child) => child.text).join(" ");
        const isFirstParagraph = index === 0;
        const style = block.style || "normal";
        
        if (style === "h1") {
          return <h1 key={index} className="blog-content-heading main-heading">{text}</h1>;
        }
        if (style === "h2") {
          return <h2 key={index} className="blog-content-heading sub-heading">{text}</h2>;
        }
        if (style === "h3") {
          return <h3 key={index} className="blog-content-heading topic-heading">{text}</h3>;
        }
        if (style === "blockquote") {
          return <blockquote key={index} className="blog-content-blockquote">{text}</blockquote>;
        }
        return (
          <div 
            key={index} 
            className={`blog-content-paragraph ${isFirstParagraph ? 'first-paragraph' : ''}`}
          >
            {isFirstParagraph && <span className="paragraph-indicator">¶</span>}
            {text}
          </div>
        );
      }
      
      if (block._type === "list") {
        const ListTag = block.listItem === "number" ? "ol" : "ul";
        
        return (
          <ListTag key={index} className="blog-content-list">
            {block.children.map((listItem, listIndex) => (
              <li key={listIndex}>
                {listItem.children.map((child) => child.text).join(" ")}
              </li>
            ))}
          </ListTag>
        );
      }

      if (block._type === "image" && block.asset) {
        return (
          <div key={index} className="blog-content-image">
            <img 
              src={block.asset.url} 
              alt={block.alt || "Blog content image"} 
            />
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </div>
        );
      }

      return null;
    });
  };

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
    
    const readingTime = Math.ceil(wordCount / 200);
    return readingTime < 1 ? 1 : readingTime;
  };

  const getCategory = (post) => {
    if (post.category) {
      return post.category;
    }
    return "Uncategorized";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "Unknown Date";
    }
  };

  const getExcerpt = (post) => {
    if (post.excerpt) {
      return post.excerpt;
    }
    
    if (post.body && Array.isArray(post.body)) {
      const firstBlock = post.body.find(block => block._type === "block");
      if (firstBlock && firstBlock.children) {
        return firstBlock.children.map(child => child.text).join(" ");
      }
    }
    
    return "";
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
          <div className="error-content">
            <h2>Article Not Found</h2>
            <p>{error || "The article you're looking for doesn't exist."}</p>
            <p className="error-debug">Blog DocumentId: {id}</p>
            <Link to="/blog" className="back-to-blog">
              <FaArrowLeft /> Back to All Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = blogPost.title || "Untitled Blog";
  const category = getCategory(blogPost);
  const date = formatDate(blogPost.publishedAt);
  const readingTime = calculateReadingTime(blogPost.body);
  const excerpt = getExcerpt(blogPost);
  const imageUrl = blogPost.mainImage?.asset?.url;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: excerpt || `Check out this article: ${title}`,
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
        <header className="blog-show-header">
          <div className="blog-show-category">
            <FaTag className="category-icon" />
            {category}
          </div>

          <h1 className="blog-show-title">{title}</h1>

          {excerpt && (
            <div className="blog-show-excerpt">
              <p>{excerpt}</p>
            </div>
          )}

          <div className="blog-show-meta">
            <div className="blog-show-meta-item">
              <FaCalendar className="meta-icon" />
              <span>{date}</span>
            </div>
            <div className="blog-show-meta-item">
              <FaClock className="meta-icon" />
              <span>{readingTime} min read</span>
            </div>
            <button className="blog-show-share" onClick={handleShare}>
              <FaShare className="share-icon" />
              Share
            </button>
          </div>
        </header>

        {imageUrl && (
          <div className="blog-show-image">
            <img src={imageUrl} alt={title} />
          </div>
        )}

        <article className="blog-show-content">
          <div className="blog-content-wrapper">
            {blogPost.body && blogPost.body.length > 0 ? (
              <div className="blog-content-inner">
                {renderRichText(blogPost.body)}
              </div>
            ) : (
              <div className="no-content">
                <p>No content available for this article.</p>
              </div>
            )}
          </div>
        </article>

        <footer className="blog-show-footer">
          <div className="blog-show-tags">
            <strong>Tags: </strong>
            <span className="blog-tag">{category}</span>
          </div>

          <div className="blog-show-actions">
            <button className="blog-show-action-btn" onClick={handleShare}>
              <FaShare /> Share Article
            </button>
            <Link to="/blog" className="blog-show-action-btn">
              <FaArrowLeft /> More Articles
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogShow;