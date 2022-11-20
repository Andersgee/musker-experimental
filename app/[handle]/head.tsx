import type { Params } from "src/utils/param";
import { SEO } from "src/components/SEO";

type Props = {
  params?: Params;
};

export default async function Head({ params }: Props) {
  const handle = params?.handle as string;
  return <SEO url={`/${handle}`} title="Musker" description="some descr" image="/icons/icon-192x192.png" />;
}
