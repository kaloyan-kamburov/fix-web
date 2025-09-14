import React from "react";
import { Card, CardContent } from "../ui/card";

export const MainContentSection = () => {
  const testimonialData = {
    name: "Дарина Пеева",
    service: "Смяна на тръба",
    date: "Май 2024",
    rating: "/stars.svg",
    testimonial:
      "Използвах Fix-App за смяна на електрическо табло – оферти получих за по-малко от час, а работата беше свършена на следващия ден. Отлично обслужване!",
  };

  return (
    <section className="flex items-center gap-20 px-[16px] lg:px-28 lg:py-[104px] relative w-full bg-gray-100">
      <div className=" w-full max-w-[1390px] mx-auto flex  gap-10 flex-col lg:flex-row">
        <header className="w-[440px] font-semibold text-gray-00 text-[28px] lg:text-[64px] leading-[normal] lg:leading-[80px] tracking-[0] mx-auto lg:mx-0">
          Какво казват нашите клиенти
        </header>

        <Card className="flex-1 bg-[#2a2a2c80] border-none rounded-[20px] relative">
          <div className="absolute w-[143px] h-[124px] top-[-58px] right-[-48px] rounded-lg flex items-center justify-center hidden lg:block">
            <span className="text-white text-sm">
              <svg
                width="143"
                height="124"
                viewBox="0 0 143 124"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M44.4555 52.5704C41.0344 51.5855 37.6134 51.0857 34.2856 51.0857C29.1468 51.0857 24.8589 52.2601 21.534 53.6982C24.7394 41.9634 32.4396 21.7153 47.7789 19.4351C49.1995 19.2238 50.3636 18.1966 50.7512 16.8139L54.1037 4.82271C54.3864 3.80863 54.2188 2.72316 53.6404 1.84312C53.062 0.963085 52.1324 0.375909 51.0906 0.233122C49.9585 0.0786784 48.8046 0 47.6609 0C29.2488 0 11.0145 19.218 3.32009 46.7351C-1.1966 62.8788 -2.52101 87.1497 8.60461 102.426C14.8304 110.975 23.9133 115.54 35.6013 115.996C35.6494 115.997 35.696 115.999 35.7441 115.999C50.1654 115.999 62.9535 106.286 66.8437 92.3818C69.1676 84.0696 68.1171 75.3523 63.8831 67.8297C59.6942 60.3917 52.7953 54.9701 44.4555 52.5704Z"
                    fill="#B4B4B4"
                    fillOpacity="0.5"
                  />
                  <g filter="url(#filter0_d_51_2314)">
                    <path
                      d="M134.729 67.8312C130.541 60.3917 123.642 54.9701 115.302 52.5704C111.881 51.5855 108.46 51.0857 105.133 51.0857C99.9946 51.0857 95.7052 52.2601 92.3803 53.6982C95.5857 41.9634 103.286 21.7153 118.627 19.4351C120.047 19.2238 121.21 18.1966 121.599 16.8139L124.952 4.82271C125.234 3.80863 125.067 2.72316 124.488 1.84312C123.911 0.963085 122.982 0.375909 121.938 0.233122C120.808 0.0786784 119.654 0 118.509 0C100.097 0 81.8623 19.218 74.1664 46.7351C69.6512 62.8788 68.3268 87.1497 79.4539 102.429C85.6782 110.976 94.7625 115.543 106.449 115.997C106.497 115.999 106.544 116 106.593 116C121.013 116 133.803 106.288 137.693 92.3833C140.014 84.071 138.962 75.3523 134.729 67.8312Z"
                      fill="#B4B4B4"
                      fillOpacity="0.5"
                      shapeRendering="crispEdges"
                    />
                  </g>
                </g>
                <defs>
                  <filter
                    id="filter0_d_51_2314"
                    x="66.8477"
                    y="0"
                    width="76.0513"
                    height="124"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_51_2314"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_51_2314"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </span>
          </div>
          <CardContent className="flex flex-col items-start gap-2 p-[16px] lg:p-10">
            <div className="inline-flex flex-col items-start gap-1">
              <div className="w-fit mt-[-1.00px] font-normal text-white text-base leading-4 tracking-[0]">
                <span className="font-[number:var(--body-m-font-weight)] font-body-m [font-style:var(--body-m-font-style)] tracking-[var(--body-m-letter-spacing)] leading-[var(--body-m-line-height)] text-[length:var(--body-m-font-size)]">
                  {testimonialData.name}
                </span>
              </div>

              <div className="w-fit font-[number:var(--body-m-font-weight)] text-gray-30 text-[length:var(--body-m-font-size)] leading-[var(--body-m-line-height)] font-body-m tracking-[var(--body-m-letter-spacing)] [font-style:var(--body-m-font-style)]">
                {testimonialData.service}
              </div>

              <div className="inline-flex items-center gap-2">
                <div className="flex-shrink-0 flex items-center gap-1">
                  <span className="text-accentaccent text-sm">★★★★★</span>
                </div>

                <div className="w-fit font-[number:var(--body-s-font-weight)] text-gray-30 text-[length:var(--body-s-font-size)] leading-[var(--body-s-line-height)] font-body-s tracking-[var(--body-s-letter-spacing)] [font-style:var(--body-s-font-style)]">
                  {testimonialData.date}
                </div>
              </div>
            </div>

            <blockquote className="self-stretch font-semibold text-white text-[20px] lg:text-[28px] tracking-[0] leading-[normal]">
              {testimonialData.testimonial}
            </blockquote>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
