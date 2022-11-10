"use client";

//import {useRouter} from "next/navigation"
import { usePathname } from "next/navigation";

type Props = {
  className?: string;
};

export function Pathname({ className }: Props) {
  const pathname = usePathname();
  return <div className={className}>{pathname?.slice(1)}</div>;
}
