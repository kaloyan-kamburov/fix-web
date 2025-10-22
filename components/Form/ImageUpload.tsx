"use client";
import { useTranslations } from "next-intl";
import * as React from "react";

interface ImageUploadProps extends React.ComponentProps<"input"> {}

const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      className,
      type = "file",
      multiple = true,
      accept = "image/*",
      onChange,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const t = useTranslations();
    const [previews, setPreviews] = React.useState<
      Array<{ id: string; url: string; file: File }>
    >([]);

    const handleFiles = (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const next: Array<{ id: string; url: string; file: File }> = [];
      Array.from(files).forEach((file) => {
        const id = `${file.name}-${file.size}-${
          file.lastModified
        }-${Math.random().toString(36).slice(2)}`;
        const url = URL.createObjectURL(file);
        next.push({ id, url, file });
      });
      setPreviews((prev) => [...prev, ...next]);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };

    const onTriggerClick = () => {
      const target =
        (ref as React.RefObject<HTMLInputElement>)?.current || inputRef.current;
      target?.click();
    };

    const removeImage = (id: string) => {
      setPreviews((prev) => {
        const removed = prev.find((p) => p.id === id);
        const next = prev.filter((p) => p.id !== id);
        if (removed) {
          try {
            URL.revokeObjectURL(removed.url);
          } catch {}
        }
        return next;
      });
    };

    // Handle onChange callback when previews change
    const prevPreviewsRef = React.useRef<
      Array<{ id: string; url: string; file: File }>
    >([]);
    const onChangeRef = React.useRef(onChange);

    React.useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    React.useEffect(() => {
      if (
        onChangeRef.current &&
        previews.length !== prevPreviewsRef.current.length
      ) {
        try {
          const dataTransfer = new DataTransfer();
          previews.forEach((p) => dataTransfer.items.add(p.file));
          const synthetic = {
            target: { files: dataTransfer.files },
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChangeRef.current(synthetic);
          prevPreviewsRef.current = previews;
        } catch {}
      }
    }, [previews]);

    // Revoke object URLs when component unmounts to avoid leaks
    React.useEffect(() => {
      return () => {
        try {
          previews.forEach((p) => URL.revokeObjectURL(p.url));
        } catch {}
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
          onChange={onInputChange}
          {...props}
        />

        {previews.length > 0 ? (
          <section className="self-stretch p-4 rounded-xl border-1 border-dashed bg-stone-50 border-zinc-400 max-sm:p-4">
            <div className="flex flex-wrap gap-2">
              {previews.map((p) => (
                <div
                  key={p.id}
                  className="relative w-[94px] h-[80px] rounded-lg overflow-hidden"
                >
                  <img
                    src={p.url}
                    alt="preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(p.id);
                    }}
                    className="absolute top-[5px] right-[5px] w-6 h-6 rounded-full bg-gray-10 flex items-center justify-center shadow-md"
                    aria-label={t("remove")}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18"
                        stroke="#1C1C1D"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 6L18 18"
                        stroke="#1C1C1D"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={onTriggerClick}
                className="w-[96px] h-[80px] rounded-lg border-1 border-dashed border-zinc-400 flex items-center justify-center"
                aria-label={t("addPhotos")}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="red"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.9997 1.33331C13.0989 1.33331 10.2632 2.1935 7.85132 3.80509C5.4394 5.41669 3.55953 7.70731 2.44945 10.3873C1.33936 13.0673 1.04891 16.0162 1.61483 18.8613C2.18075 21.7064 3.57761 24.3197 5.62878 26.3709C7.67995 28.422 10.2933 29.8189 13.1384 30.3848C15.9834 30.9507 18.9324 30.6603 21.6124 29.5502C24.2924 28.4401 26.583 26.5603 28.1946 24.1483C29.8062 21.7364 30.6663 18.9008 30.6663 16C30.6618 12.1115 29.1151 8.38369 26.3655 5.63415C23.616 2.88461 19.8881 1.3379 15.9997 1.33331ZM22.6663 17.3333H17.333V22.6666C17.333 23.0203 17.1925 23.3594 16.9425 23.6095C16.6924 23.8595 16.3533 24 15.9997 24C15.6461 24 15.3069 23.8595 15.0569 23.6095C14.8068 23.3594 14.6663 23.0203 14.6663 22.6666V17.3333H9.33301C8.97939 17.3333 8.64025 17.1928 8.39021 16.9428C8.14016 16.6927 7.99968 16.3536 7.99968 16C7.99968 15.6464 8.14016 15.3072 8.39021 15.0572C8.64025 14.8071 8.97939 14.6666 9.33301 14.6666H14.6663V9.33331C14.6663 8.97969 14.8068 8.64055 15.0569 8.3905C15.3069 8.14046 15.6461 7.99998 15.9997 7.99998C16.3533 7.99998 16.6924 8.14046 16.9425 8.3905C17.1925 8.64055 17.333 8.97969 17.333 9.33331V14.6666H22.6663C23.02 14.6666 23.3591 14.8071 23.6092 15.0572C23.8592 15.3072 23.9997 15.6464 23.9997 16C23.9997 16.3536 23.8592 16.6927 23.6092 16.9428C23.3591 17.1928 23.02 17.3333 22.6663 17.3333Z"
                    fill="#B3B3B7"
                  />
                </svg>
              </button>
            </div>
          </section>
        ) : (
          <section
            className="flex flex-col gap-2 justify-center items-center self-stretch p-5 rounded-xl border-dashed bg-stone-50 border-1 border-dashed border-zinc-400 bg-stone-50 max-sm:p-4 cursor-pointer"
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
                fill="red"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.9997 1.33331C13.0989 1.33331 10.2632 2.1935 7.85132 3.80509C5.4394 5.41669 3.55953 7.70731 2.44945 10.3873C1.33936 13.0673 1.04891 16.0162 1.61483 18.8613C2.18075 21.7064 3.57761 24.3197 5.62878 26.3709C7.67995 28.422 10.2933 29.8189 13.1384 30.3848C15.9834 30.9507 18.9324 30.6603 21.6124 29.5502C24.2924 28.4401 26.583 26.5603 28.1946 24.1483C29.8062 21.7364 30.6663 18.9008 30.6663 16C30.6618 12.1115 29.1151 8.38369 26.3655 5.63415C23.616 2.88461 19.8881 1.3379 15.9997 1.33331ZM22.6663 17.3333H17.333V22.6666C17.333 23.0203 17.1925 23.3594 16.9425 23.6095C16.6924 23.8595 16.3533 24 15.9997 24C15.6461 24 15.3069 23.8595 15.0569 23.6095C14.8068 23.3594 14.6663 23.0203 14.6663 22.6666V17.3333H9.33301C8.97939 17.3333 8.64025 17.1928 8.39021 16.9428C8.14016 16.6927 7.99968 16.3536 7.99968 16C7.99968 15.6464 8.14016 15.3072 8.39021 15.0572C8.64025 14.8071 8.97939 14.6666 9.33301 14.6666H14.6663V9.33331C14.6663 8.97969 14.8068 8.64055 15.0569 8.3905C15.3069 8.14046 15.6461 7.99998 15.9997 7.99998C16.3533 7.99998 16.6924 8.14046 16.9425 8.3905C17.1925 8.64055 17.333 8.97969 17.333 9.33331V14.6666H22.6663C23.02 14.6666 23.3591 14.8071 23.6092 15.0572C23.8592 15.3072 23.9997 15.6464 23.9997 16C23.9997 16.3536 23.8592 16.6927 23.6092 16.9428C23.3591 17.1928 23.02 17.3333 22.6663 17.3333Z"
                  fill="#B3B3B7"
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
        )}
      </>
    );
  }
);
ImageUpload.displayName = "ImageUpload";

export { ImageUpload };
