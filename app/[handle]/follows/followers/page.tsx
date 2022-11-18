type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
};

export default async function Page({ params }: Props) {
  const handle = params?.handle;
  if (typeof handle !== "string") {
    return <div>missing handle</div>;
  }
  return (
    <div>
      <div>followers page</div>
      <div>params: {JSON.stringify(params)}</div>
    </div>
  );
}
