import { useEffect, useRef } from "react";
import { incrementViews } from "@/lib/posts";

export function usePostViewTracker(postId: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !postId) return;

    // Check localStorage first
    const viewedPostsRaw = localStorage.getItem("viewed_posts");
    const viewedPosts = viewedPostsRaw ? JSON.parse(viewedPostsRaw) : {};

    if (viewedPosts[postId]) {
      // Already viewed
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Mark as viewed
          viewedPosts[postId] = true;
          localStorage.setItem("viewed_posts", JSON.stringify(viewedPosts));
          
          // Increment in Firestore
          incrementViews(postId).catch(console.error);

          // Stop observing
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 } // Fire when 50% of the post is visible
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [postId]);

  return ref;
}
