"use client";

//import {useRouter} from "next/navigation"
import { usePathname } from "next/navigation";

export default function Page() {
  const pathname = usePathname();
  //const name = pathname?.split("/").at(-1);
  return (
    <div className="">
      <div>followers page</div>
      <div>pathname: {pathname}</div>
    </div>
  );
}
