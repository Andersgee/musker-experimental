"use client";

//import {useRouter} from "next/navigation"
import { usePathname } from "next/navigation";
import { IconMusker } from "src/icons/Musker";

export default function Page() {
  const pathname = usePathname();
  //const name = pathname?.split("/").at(-1);
  return (
    <div className="">
      <div>{pathname}</div>
      <div>TODO</div>
      <IconMusker className="w-full" />
    </div>
  );
}
