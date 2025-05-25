import React, { useState, useEffect } from "react";

const navLinks = [
  { name: "Work", path: "/work" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Ideas", path: "/ideas" },
  { name: "Careers", path: "/careers" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [transparent, setTransparent] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const cachedLogoUrl = localStorage.getItem("logoUrl");

        if (cachedLogoUrl) {
          setLogoUrl(cachedLogoUrl);
          return;
        }

        const response = await fetch("/logo.json");
        const data = await response.json();
        const imgUrl = data.logo.image_url;

        localStorage.setItem("logoUrl", imgUrl);
        setLogoUrl(imgUrl);
      } catch (err) {
        console.error("Error fetching logo:", err);
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isScrollingUp = prevScrollPos > currentScrollPos;

      setVisible(isScrollingUp || currentScrollPos < 10);
      setTransparent(isScrollingUp && currentScrollPos > 10);
      setPrevScrollPos(currentScrollPos);
    };

    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", handlePathChange);

    handlePathChange();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePathChange);
    };
  }, [prevScrollPos]);

  return (
    <div
      className={`fixed w-full h-[104px] grid grid-cols-[30%_70%] items-center transition-all duration-300 z-50 ${
        visible ? "top-0" : "-top-[104px]"
      } ${transparent ? "bg-oranges-transparent" : "bg-oranges"}`}
    >
      <div className="flex justify-center items-center">
        <img
          src={logoUrl}
          alt="Site Logo"
          className="w-[100px] h-auto filter brightness-0 invert"
        />
      </div>
      <div className="h-full flex justify-center items-center gap-[34px]">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.path}
            className="text-white relative text-lg"
            onClick={() => setCurrentPath(link.path)}
          >
            {link.name}
            {currentPath === link.path && (
              <span className="absolute top-full left-0 w-full h-[4px] bg-white rounded-[8px] mt-1"></span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
