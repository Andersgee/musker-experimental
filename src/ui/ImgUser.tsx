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
    <Link href={href} className={`flex h-8 w-8 items-center justify-center ${className}`}>
      <img className="h-full w-full rounded-full border-4 border-neutral-50" src={image} alt={alt} />
    </Link>
  );
}
