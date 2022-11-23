import { SEO } from "src/components/SEO";

export default function Head() {
  return (
    <SEO
      url="/"
      title="Musker"
      description="A Twitter clone built with experimental nextjs 13 features."
      image="/api/og/home"
    />
  );
}
