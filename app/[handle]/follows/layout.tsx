import type { Params } from "src/utils/param";
import { Nav } from "./Nav";

type Props = {
  children: React.ReactNode;
  params?: Params;
};

export default async function Layout({ children, params }: Props) {
  const handle = params?.handle as string;

  return (
    <div>
      <Nav handle={handle} />
      {children}
    </div>
  );
}
