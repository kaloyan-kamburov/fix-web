import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const lang = (locale || "bg").split("-")[0];
  const t = await getTranslations({ locale: lang });
  let blog: unknown = null;

  try {
    const res = await api.get(`blogs/${slug}`);
    blog = res.data;
  } catch (_) {
    blog = { error: true };
  }

  const b: any = blog || {};
  const title = String(b?.title || "");
  const content = String(b?.content || "");
  const excerpt = String(b?.excerpt || "");
  const publishedAt = b?.published_at
    ? new Date(b.published_at).toLocaleDateString()
    : "";
  const author = String(b?.author || "");
  const wordCount = b?.word_count || 0;
  const readingTime = b?.reading_time || 0;

  // Get featured image
  const images = b?.images;
  const featuredImage = images?.featured;
  const picture =
    featuredImage?.original ||
    featuredImage?.medium ||
    featuredImage?.thumb ||
    "";

  return (
    <section className="flex flex-col justify-start w-full pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[88px] max-md:pt-[76px] mx-auto gap-4 px-[16px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <Link
          href={`/${locale}/blog/`}
          className="flex relative gap-2 items-center self-stretch cursor-pointer max-sm:gap-1.5 w-fit mt-4"
          aria-label={t("back")}
        >
          <svg
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 7.5H3.83L9.42 1.91L8 0.5L0 8.5L8 16.5L9.41 15.09L3.83 9.5H16V7.5Z"
              fill="#1C1C1D"
            />
          </svg>
          <div className="relative text-lg font-bold text-center text-zinc-900 max-md:text-base max-sm:text-sm">
            <div className="text-lg font-bold text-zinc-900 max-md:text-base max-sm:text-sm">
              {t("back")}
            </div>
          </div>
        </Link>
      </div>
      <div className="max-w-[960px] mx-auto mt-[20px] max-md:mt-0">
        <h1 className="text-2xl font-bold text-neutral-700 text-center">
          {title}
        </h1>

        {/* Blog meta information */}
        <div className="flex flex-col gap-2 justify-center items-center mt-4 text-sm text-zinc-500">
          {publishedAt && <p className="text-center">{publishedAt}</p>}
          {author && (
            <p className="text-center">
              {t("author")}: {author}
            </p>
          )}
          {readingTime > 0 && (
            <p className="text-center">
              {readingTime} {t("minRead")}
            </p>
          )}
        </div>

        {picture && (
          <Image
            src={picture}
            alt={title}
            width={1200}
            height={506}
            sizes="100vw"
            className="object-contain mt-6 w-full rounded-xl"
          />
        )}

        {excerpt && (
          <div className="mt-6 text-lg text-zinc-600 max-md:max-w-full text-left font-normal">
            <p className="text-xl font-medium text-zinc-700 mb-4">{excerpt}</p>
          </div>
        )}

        <div
          className="mt-6 text-lg text-zinc-600 max-md:max-w-full text-left font-normal prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = (locale || "bg").split("-")[0];
  try {
    const res = await api.get(`blogs/${slug}`);
    const b: any = res?.data || {};
    const title = String(b?.title || "");
    const description = String(b?.excerpt || b?.meta_description || "");
    const canonicalUrl = String(b?.canonical_url || "");

    // Get featured image for OpenGraph
    const images = b?.images;
    const featuredImage = images?.featured;
    const picture =
      featuredImage?.original ||
      featuredImage?.medium ||
      featuredImage?.thumb ||
      "";

    return {
      title: title || undefined,
      description: description || undefined,
      alternates: {
        canonical: canonicalUrl || undefined,
      },
      openGraph: {
        title: `FIX | ${title}`,
        description: description || undefined,
        type: "article",
        locale: lang,
        images: picture ? [{ url: picture }] : undefined,
        publishedTime: b?.published_at || undefined,
        authors: b?.author ? [b.author] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: title || undefined,
        description: description || undefined,
        images: picture ? [picture] : undefined,
      },
    };
  } catch (e) {
    return {
      title: "FIX",
      description: "FIX",
    };
  }
}
