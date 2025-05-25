import { useEffect, useState } from "react";
import axios from "axios";
import ListCard from "./ListCard";

export default function ListPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? Number(savedPage) : 1;
  });
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const savedItemsPerPage = localStorage.getItem("itemsPerPage");
    return savedItemsPerPage ? Number(savedItemsPerPage) : 10;
  });
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState(() => {
    const savedSortBy = localStorage.getItem("sortBy");
    return savedSortBy ? savedSortBy : "-published_at";
  });

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
    localStorage.setItem("itemsPerPage", itemsPerPage);
    localStorage.setItem("sortBy", sortBy);

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/ideas", {
          params: {
            "page[number]": currentPage,
            "page[size]": itemsPerPage,
            append: ["small_image", "medium_image"],
            sort: sortBy,
            "filter[publish_status]": "published"
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        setPosts(response.data.data || []);
        const totalCount = response.data.meta?.total_count || 0;
        setTotalItems(totalCount);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } catch (err) {
        setError(err.message);
        setPosts([]);
        setTotalItems(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, itemsPerPage, sortBy]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l = 0;

    if (totalPages <= 1) return [];

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }
    if (totalPages > 1) {
      range.push(totalPages);
    }

    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);
    for (let i of uniqueRange) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pageNumbers = getPaginationRange();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-700">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col p-6 font-sans min-h-screen">
      <div className="w-full max-w-6xl bg-white rounded-t-lg p-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0 text-gray-700 text-sm sm:text-base">
          Showing {startItem}-{endItem} of {totalItems}
        </div>

        <div className="flex items-center space-x-4 ">
          <div className="flex items-center border-1 rounded-full border-gray-400 p-[8px]">
            <label
              htmlFor="itemsPerPage"
              className="mr-2 text-gray-700 text-sm"
            >
              Show per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 rounded-md bg-white text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center border-1 rounded-full border-gray-400 p-[8px]">
            <label htmlFor="sortBy" className="mr-2 text-gray-700 text-sm">
              Sort by:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1 rounded-md bg-white text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="-published_at">Newest</option>
              <option value="published_at">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-b-lg p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => <ListCard post={post} key={post.id} />)
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No posts found
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="mt-6" aria-label="Pagination Navigation">
          <ul className="inline-flex items-center space-x-1">
            <li>
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-white hover:bg-gray-100 disabled:text-gray-400"
              >
                &laquo;
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-white hover:bg-gray-100 disabled:text-gray-400"
              >
                &lsaquo;
              </button>
            </li>

            {pageNumbers.map((page, index) => (
              <li key={typeof page === "number" ? page : `ellipsis-${index}`}>
                <button
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  disabled={page === "..." || currentPage === page}
                  className={`px-3 py-2 rounded-md text-sm ${
                    currentPage === page
                      ? "bg-orange-500 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-700"
                  } disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                  {page}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md bg-white hover:bg-gray-100 disabled:text-gray-400"
              >
                &rsaquo;
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md bg-white hover:bg-gray-100 disabled:text-gray-400"
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
