type Params = Record<string, string | string[]>;

type Props = {
  params?: Params;
  searchParams?: Params;
};

export default function Page({ params }: Props) {
  return <div>params: {JSON.stringify(params)}</div>;
}
