"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

type CanonicalLinkProps = {
  excludePrefixes?: string[];
};

export default function CanonicalLink({
  excludePrefixes = [],
}: CanonicalLinkProps) {
  const pathname = usePathname();
  const [href, setHref] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const origin = window.location.origin;
      const clean = `${origin}${pathname || "/"}`;
      setHref(clean);
    } catch {}
  }, [pathname]);

  const shouldExclude = React.useMemo(() => {
    if (!pathname) return false;
    return excludePrefixes.some((p) => pathname.startsWith(p));
  }, [excludePrefixes, pathname]);

  if (shouldExclude || !href) return null;

  return <link rel="canonical" href={href} />;
}
