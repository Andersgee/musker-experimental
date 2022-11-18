import { Nav } from "./Nav";

type Params = Record<string, string | string[]>;

type Props = {
  children: React.ReactNode;
  params?: Params;
};

export default async function Layout({ children, params }: Props) {
  const handle = params?.handle;
  if (typeof handle !== "string") {
    return <div>missing handle</div>;
  }

  return (
    <>
      <Nav handle={handle} />
      {children}
    </>
  );
}
