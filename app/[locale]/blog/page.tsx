import { getTranslations } from "next-intl/server";
import { api } from "@/lib/api";
import BlogList from "@/components/Blog/BlogList";
import type { Metadata } from "next";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  let data: unknown = null;
  let items: Array<{
    id: number;
    title: string;
    content?: string;
    excerpt?: string;
    picture?: string;
    slug?: string;
    publishedAt?: string;
    author?: string;
  }> = [];
  let test = null;
  try {
    const res = await api.get("blogs");
    data = res.data;
    test = res.data;
    const root: any = data;
    const arr: any[] = Array.isArray(root)
      ? root
      : Array.isArray(root?.data)
      ? root.data
      : [];
    items = arr.map((blog: any) => {
      const id = Number(blog?.id ?? 0) || 0;
      const title = String(blog?.title ?? "");
      const content = String(blog?.content ?? "");
      const excerpt = String(blog?.excerpt ?? "");
      // Use featured image from images object, fallback to picture field
      const images = blog?.images;
      const featuredImage = images?.featured;
      const picture =
        featuredImage?.thumb ||
        featuredImage?.medium ||
        featuredImage?.original ||
        String(blog?.picture ?? "");
      const slug = String(blog?.slug ?? "");
      const publishedAt = blog?.updated_at
        ? String(blog.updated_at)
        : undefined;
      const author = blog?.author ? String(blog.author) : undefined;

      return {
        id,
        title,
        content,
        excerpt,
        picture,
        slug,
        publishedAt,
        author,
      };
    });
  } catch (_) {
    data = { error: true };
  }

  const { locale } = await params;
  const lang = (locale || "bg").split("-")[0];
  const t = await getTranslations({ locale: lang });

  return (
    <section className="flex flex-col justify-center pb-10 text-base font-semibold text-center bg-gray-10 text-zinc-900 pt-[130px] max-md:pt-[76px]">
      <BlogList items={items} t={t} />
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = (locale || "bg").split("-")[0];
  try {
    const t = await getTranslations({ locale: lang });
    return {
      // Layout template will prefix with "FIX |"; if this is empty, layout default "FIX" will be used
      title: t("blog"),
      description: t("blog"),
      openGraph: {
        title: `FIX | ${t("blog")}`,
        description: t("blog"),
        type: "website",
        locale: lang,
      },
    };
  } catch {
    return {
      // Let layout default to just "FIX"
      title: undefined,
      description: undefined,
    };
  }
}
