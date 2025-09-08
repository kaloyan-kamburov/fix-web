import React from "react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../Logo/Logo.component";

const navigationLinks = [
  { text: "Начало", href: "/" },
  { text: "Търсене на услуга", href: "/services" },
  { text: "Спешни ситуации", href: "/emergency" },
];

const socialIcons = [
  {
    src: "/facebook.svg",
    alt: "Facebook",
    href: "https://facebook.com",
    name: "Facebook",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12.3038C22 6.74719 17.5229 2.24268 12 2.24268C6.47715 2.24268 2 6.74719 2 12.3038C2 17.3255 5.65684 21.4879 10.4375 22.2427V15.2121H7.89844V12.3038H10.4375V10.0872C10.4375 7.56564 11.9305 6.1728 14.2146 6.1728C15.3088 6.1728 16.4531 6.36931 16.4531 6.36931V8.84529H15.1922C13.95 8.84529 13.5625 9.6209 13.5625 10.4166V12.3038H16.3359L15.8926 15.2121H13.5625V22.2427C18.3432 21.4879 22 17.3257 22 12.3038Z" fill="#F9F9F9" />
    </svg>`
  },
  {
    src: "/instagram.svg",
    alt: "Instagram",
    href: "https://instagram.com",
    name: "Instagram",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M16 3.24268H8C5.23858 3.24268 3 5.48126 3 8.24268V16.2427C3 19.0041 5.23858 21.2427 8 21.2427H16C18.7614 21.2427 21 19.0041 21 16.2427V8.24268C21 5.48126 18.7614 3.24268 16 3.24268ZM19.25 16.2427C19.2445 18.0353 17.7926 19.4872 16 19.4927H8C6.20735 19.4872 4.75549 18.0353 4.75 16.2427V8.24268C4.75549 6.45003 6.20735 4.99817 8 4.99268H16C17.7926 4.99817 19.2445 6.45003 19.25 8.24268V16.2427ZM16.75 8.49268C17.3023 8.49268 17.75 8.04496 17.75 7.49268C17.75 6.9404 17.3023 6.49268 16.75 6.49268C16.1977 6.49268 15.75 6.9404 15.75 7.49268C15.75 8.04496 16.1977 8.49268 16.75 8.49268ZM12 7.74268C9.51472 7.74268 7.5 9.7574 7.5 12.2427C7.5 14.728 9.51472 16.7427 12 16.7427C14.4853 16.7427 16.5 14.728 16.5 12.2427C16.5027 11.0484 16.0294 9.90225 15.1849 9.05776C14.3404 8.21327 13.1943 7.74002 12 7.74268ZM9.25 12.2427C9.25 13.7615 10.4812 14.9927 12 14.9927C13.5188 14.9927 14.75 13.7615 14.75 12.2427C14.75 10.7239 13.5188 9.49268 12 9.49268C10.4812 9.49268 9.25 10.7239 9.25 12.2427Z" fill="#F9F9F9" />
    </svg>`
  },
];

const legalLinks = [
  { text: "Privacy Policy", href: "/privacy" },
  { text: "Terms of Service", href: "/terms" },
  { text: "Cookies Settings", href: "/cookies" },
];

export const SiteFooterSection = () => {
  return (
    <footer className="flex flex-col w-full items-center gap-20 py-20 relative bg-gray-100 px-[16px]">
      <div
        className="absolute w-full h-[339px] top-6 left-0 bg-gray-100 opacity-20 bg-gray-100"
        style={{
          backgroundImage: "url('/footer-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />

      <div className="flex flex-col w-full max-w-[1440px] mx-auto items-center justify-center gap-8 relative w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 relative w-full">
          <div className="relative flex-1 flex items-center justify-start">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-3 relative flex-1">
            {socialIcons.map((icon, index) => (
              <Link
                key={index}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-8 h-8 bg-gray-90 rounded-full flex items-center justify-center hover:bg-gray-80 transition-colors"
                aria-label={icon.name}
                dangerouslySetInnerHTML={{ __html: icon.icon }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between relative w-full">
          <div className="inline-flex flex-col lg:flex-row items-center gap-8 relative">
            {navigationLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="inline-flex items-center justify-center gap-1 relative hover:text-accentaccent transition-colors"
              >
                <div className="relative w-fit mt-[-1.00px] font-semibold text-gray-00 text-lg text-center tracking-[0] leading-[normal]">
                  {link.text}
                </div>
              </Link>
            ))}
          </div>

          <div className="relative w-px h-[25px]" />

          <div className="items-center inline-flex justify-center gap-2 relative">
            <div className="inline-flex items-center gap-3 relative">
              <Link
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-36 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/appStore.svg"
                  alt="Download on the App Store"
                  width={144}
                  height={48}
                  className="object-contain"
                />
              </Link>

              <Link
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[162px] h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/googlePlay.svg"
                  alt="Get it on Google Play"
                  width={162}
                  height={48}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 relative w-full">
          <Separator className="w-full" />

          <div className="inline-flex flex-col-reverse lg:flex-row items-start gap-6 relative">
            <div className="relative w-fit mt-[-1.00px] font-body-s font-[number:var(--body-s-font-weight)] text-gray-00 text-[length:var(--body-s-font-size)] tracking-[var(--body-s-letter-spacing)] leading-[var(--body-s-line-height)] [font-style:var(--body-s-font-style)]">
              © 2025 All rights reserved.
            </div>

            <div className="inline-flex flex-col lg:flex-row justify-center lg:justify-start mx-auto lg:mx-0 items-start gap-6 relative">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-center lg:text-start mx-auto lg:mx-0 relative w-fit mt-[-1.00px] font-body-s font-[number:var(--body-s-font-weight)] text-gray-00 text-[length:var(--body-s-font-size)] tracking-[var(--body-s-letter-spacing)] leading-[var(--body-s-line-height)] [font-style:var(--body-s-font-style)] hover:text-accentaccent transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
