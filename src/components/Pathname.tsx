"use client";

//import {useRouter} from "next/navigation"
import { usePathname } from "next/navigation";

type Props = {
  className?: string;
};

export function Pathname({ className }: Props) {
  const pathname = usePathname();
  const name = pathname?.split("/").at(-1);
  return <div className={className}>{name}</div>;
}
