"use client";
import { useTranslations } from "next-intl";
import * as React from "react";

interface ImageUploadProps extends React.ComponentProps<"input"> {}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    { className, type = "file", multiple = true, accept = "image/*", ...props },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const t = useTranslations();
    const onTriggerClick = () => {
      const target =
        (ref as React.RefObject<HTMLInputElement>)?.current || inputRef.current;
      target?.click();
    };

    return (
      <>
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref && typeof ref === "object")
              (ref as any).current = node;
          }}
          type={type}
          multiple={multiple}
          accept={accept}
          className="hidden cursor-pointer"
          {...props}
        />
        <section
          className="flex flex-col gap-2 justify-center items-center self-stretch p-5 rounded-xl border border-dashed bg-stone-50 border-zinc-400 max-sm:p-4 cursor-pointer"
          onClick={onTriggerClick}
          role="button"
          tabIndex={0}
          aria-label={t("addPhotos")}
        >
          <div>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="upload-icon"
            >
              <path
                d="M21.2797 13.72L17.613 18.44L14.9997 15.2933L11.333 20H25.9997L21.2797 13.72ZM3.99967 6.66665H1.33301V28C1.33301 29.4666 2.53301 30.6666 3.99967 30.6666H25.333V28H3.99967V6.66665ZM27.9997 1.33331H9.33301C7.86634 1.33331 6.66634 2.53331 6.66634 3.99998V22.6666C6.66634 24.1333 7.86634 25.3333 9.33301 25.3333H27.9997C29.4663 25.3333 30.6663 24.1333 30.6663 22.6666V3.99998C30.6663 2.53331 29.4663 1.33331 27.9997 1.33331ZM27.9997 22.6666H9.33301V3.99998H27.9997V22.6666Z"
                fill="#959499"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1 justify-center items-center">
            <div className="flex gap-1.5 items-start">
              <span className="text-base font-semibold tracking-wide text-sky-500">
                {t("addPhotos")}
              </span>
            </div>
          </div>
        </section>
      </>
    );
  }
);
ImageUpload.displayName = "ImageUpload";

export { ImageUpload };
