import React, { useEffect, useState, useMemo } from "react";

function Banner() {
  const [bannerImage, setBannerImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fetchBannerImage = async () => {
      try {
        const cachedImageUrl = localStorage.getItem("bannerImageUrl");

        if (cachedImageUrl) {
          setBannerImage(cachedImageUrl);
          setLoading(false);
          return;
        }

        const response = await fetch("/banner.json");
        const data = await response.json();
        const imgUrl = data.banner.image_url;

        localStorage.setItem("bannerImageUrl", imgUrl);
        setBannerImage(imgUrl);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBannerImage();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `url(${bannerImage})`,
      clipPath: "polygon(0 0, 100% 0%, 100% 65%, 0% 100%)",
      filter: "grayscale(10%)",
      objectFit: "cover",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }),
    [bannerImage]
  );

  const contentStyle = useMemo(
    () => ({
      filter: "grayscale(0%)",
      transform: `translateY(${scrollY * 0.1}px)`,
      transition: "transform 0.1s ease-out, opacity 0.3s ease-out",
      opacity: Math.max(0, 1 - scrollY / 500),
    }),
    [scrollY]
  );

  if (loading) {
    return <div>Loading banner...</div>;
  }

  if (error) {
    return <div>Error loading banner: {error}.</div>;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="w-full h-full flex flex-col justify-center items-center z-10 relative"
        style={contentStyle}
      >
        <h1 className="text-white text-9xl font-bold">Ideas</h1>
        <p className="text-white text-6xl">Where all our great things begin</p>
      </div>
      <div
        className="banner-container inset-0 absolute"
        style={backgroundStyle}
      ></div>
    </div>
  );
}

export default Banner;
