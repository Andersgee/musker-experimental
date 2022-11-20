import { Head } from "src/components/Head";

type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
};

export default async function HeadPage({ params }: Props) {
  //const post = await getPost(params.slug);

  return (
    <Head
      title="Musker"
      description="Musker"
      url=""
      imageUrl=""
      twitter_label1=""
      twitter_data1=""
      twitter_label2=""
      twitter_data2=""
    />
  );
}
