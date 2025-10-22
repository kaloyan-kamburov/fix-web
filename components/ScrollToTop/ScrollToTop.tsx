"use client";
import React from "react";

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 50% of viewport height
      if (window.scrollY > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_1136_6474)">
          <rect x="4" y="2" width="64" height="64" rx="32" fill="#F1E180" />
          <rect
            x="4.5"
            y="2.5"
            width="63"
            height="63"
            rx="31.5"
            stroke="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M35.2561 22.3008C35.4535 22.1082 35.7211 22 36 22C36.279 22 36.5465 22.1082 36.7439 22.3008L45.165 30.5297C45.2684 30.6239 45.3513 30.7374 45.4089 30.8636C45.4664 30.9898 45.4973 31.126 45.4998 31.2641C45.5023 31.4022 45.4763 31.5394 45.4234 31.6675C45.3704 31.7956 45.2916 31.9119 45.1917 32.0096C45.0917 32.1073 44.9727 32.1843 44.8416 32.236C44.7105 32.2877 44.5701 32.3131 44.4288 32.3107C44.2875 32.3083 44.1481 32.278 44.0189 32.2218C43.8898 32.1656 43.7736 32.0845 43.6772 31.9835L37.0526 25.5101V44.9714C37.0526 45.2442 36.9417 45.5058 36.7443 45.6987C36.5469 45.8916 36.2792 46 36 46C35.7208 46 35.4531 45.8916 35.2557 45.6987C35.0583 45.5058 34.9474 45.2442 34.9474 44.9714V25.5101L28.3228 31.9835C28.2264 32.0845 28.1102 32.1656 27.9811 32.2218C27.8519 32.278 27.7125 32.3083 27.5712 32.3107C27.4299 32.3131 27.2895 32.2877 27.1584 32.236C27.0273 32.1843 26.9083 32.1073 26.8083 32.0096C26.7084 31.9119 26.6296 31.7956 26.5766 31.6675C26.5237 31.5394 26.4977 31.4022 26.5002 31.2641C26.5027 31.126 26.5336 30.9898 26.5911 30.8636C26.6487 30.7374 26.7316 30.6239 26.835 30.5297L35.2561 22.3008Z"
            fill="black"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_1136_6474"
            x="0"
            y="0"
            width="72"
            height="72"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1136_6474"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1136_6474"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </button>
  );
};
