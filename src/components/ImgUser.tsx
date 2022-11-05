"use client";

import Link from "next/link";

type Props = {
  image: string;
  alt: string;
  href: string;
  className?: string;
};

export function ImgUser({ className, href, image, alt }: Props) {
  return (
    <Link href={href} className="flex w-12 items-center justify-center">
      <img className="h-8 w-8 rounded-full shadow-imageborder" src={image} alt={alt} />
    </Link>
  );
}
