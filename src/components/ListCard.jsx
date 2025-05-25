import React, { useState } from "react";

function ListCard({ post, index }) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getImageUrl = () => {
    if (imageError) return null;

    if (post.medium_image) {
      if (Array.isArray(post.medium_image) && post.medium_image.length > 0) {
        const imageObj = post.medium_image[0];
        if (imageObj && imageObj.url && imageObj.url.trim() !== "") {
          return imageObj.url;
        }
      } else if (
        typeof post.medium_image === "string" &&
        post.medium_image.trim() !== ""
      ) {
        return post.medium_image;
      } else if (post.medium_image.url && post.medium_image.url.trim() !== "") {
        return post.medium_image.url;
      }
    }

    if (post.small_image) {
      if (Array.isArray(post.small_image) && post.small_image.length > 0) {
        const imageObj = post.small_image[0];
        if (imageObj && imageObj.url && imageObj.url.trim() !== "") {
          return imageObj.url;
        }
      } else if (
        typeof post.small_image === "string" &&
        post.small_image.trim() !== ""
      ) {
        return post.small_image;
      } else if (post.small_image.url && post.small_image.url.trim() !== "") {
        return post.small_image.url;
      }
    }

    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="w-[240px] h-[320px] flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 mb-4">
      <div className="h-[160px] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl && !imageError ? (
          <img
            className="w-full h-full object-cover"
            src={imageUrl}
            alt={post.title || "Post image"}
            loading="lazy"
            onError={(e) => {
              setImageError(true);
            }}
          />
        ) : (
          <div className="text-center">
            <svg
              className="w-8 h-8 text-gray-400 mx-auto mb-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs text-gray-400">No Image</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-3 flex flex-col justify-between">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
          {post.title || "No Title"}
        </h3>

        <div className="flex items-center text-xs text-gray-500 space-x-4 mt-auto">
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            {post.published_at ? formatDate(post.published_at) : "No Date"}
          </span>
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            {post.author || "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ListCard;
