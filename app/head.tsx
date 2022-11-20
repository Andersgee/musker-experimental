import { SEO } from "src/components/SEO";

type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
};

export default async function Head({ params }: Props) {
  //const post = await getPost(params.slug);

  return (
    <SEO
      title="Musker"
      description="A twitter clone built with the latest nextjs 13 experimental features."
      url="/"
      image="/images/"
    />
  );
}
