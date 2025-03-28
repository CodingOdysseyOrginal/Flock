"use client";
import { useState, useEffect, Suspense } from "react";
import EventCarousel from "../components/Events/EventsCarousel";
import styles from "./SingleHub.module.css";
import { useSearchParams } from "next/navigation";

interface Post {
  post_id: string;
  post_text: string;
  post_title: string;
  comments: string[];
}

// Create a separate component that uses useSearchParams
function SingleHubContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const color = searchParams.get("color");
  const hubNumber = searchParams.get("hubNumber");

  const initialHub = hubNumber ? parseInt(hubNumber, 10) : 4;

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [currentHub, setCurrentHub] = useState(initialHub);
  const [currentUser, setCurrentUser] = useState(
    "3c0e53ff-25d9-4425-830a-6804b3194455"
  );

  useEffect(() => {
    if (hubNumber) {
      const hubNumberInt = parseInt(hubNumber, 10);
      if (!isNaN(hubNumberInt)) {
        setCurrentHub(hubNumberInt);
      }
    }
    setCurrentUser("3c0e53ff-25d9-4425-830a-6804b3194455");
  }, [hubNumber]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?interest_id=${currentHub}`);
        const fetchedPosts = await response.json();
        setPosts(
          Array.isArray(fetchedPosts)
            ? fetchedPosts.map((post) => ({
                ...post,
                comments: Array.isArray(post.comments) ? post.comments : [],
              }))
            : []
        );
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, [currentHub]);

  const handleAddPost = async () => {
    try {
      // Log what we're sending
      console.log("Sending post data:", {
        user_id: currentUser,
        interest_id: currentHub,
        post_title: newPostTitle,
        post_text: newPostContent,
      });
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser,
          interest_id: currentHub,
          post_title: newPostTitle,
          post_text: newPostContent,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
      }

      // Create a new post object that matches your Post interface
      const newPost: Post = {
        post_id: data.post.post_id,
        post_title: data.post.post_title,
        post_text: data.post.post_text,
        comments: [], // Initialize with empty comments array
      };

      // Update posts array with new post
      setPosts((prevPosts) => [newPost, ...prevPosts]);

      // Clear form
      setNewPostTitle("");
      setNewPostContent("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div
        className={styles.ForumContainer}
        style={{ backgroundColor: color as string }}
      >
        <div className={styles.titleContainer}>
          <p className={styles.hubName}>{title}</p>
        </div>
        <div className={styles.boardContainer}>
          <div className={styles.scrollContainer}>
            <div className={styles.ForumBoard}>
              {posts.map((post) => (
                <div key={post.post_id} className={styles.post}>
                  <h2>{post.post_title}</h2>
                  <p>{post.post_text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Create Post Section */}
          <div className={styles.PostCreator}>
            <div className={styles.inputContainer}>
              <div className={styles.titleButtonContainer}>
                <input
                  className={styles.titleBox}
                  type="text"
                  placeholder="Post title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <button className={styles.submitButton} onClick={handleAddPost}>
                  Post
                </button>
              </div>
              <textarea
                className={styles.bodyInputBox}
                placeholder="Write your post..."
                rows={4}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.eventCarouselLogoDiv}>
        <p className={styles.flockLogo}>FLOCK</p>
        <div className={styles.eventCarouselDiv}>
          <EventCarousel hubId={currentHub} />
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the content in a Suspense boundary
export default function SingleHub() {
  return (
    <Suspense fallback={<div>Loading hub details...</div>}>
      <SingleHubContent />
    </Suspense>
  );
}
