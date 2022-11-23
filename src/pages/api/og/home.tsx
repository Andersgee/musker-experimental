/* eslint-disable jsx-a11y/alt-text */
import type { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { ENCODED_SVG_MUSKER_DARK } from "src/icons/urlencoded";

export const config = {
  runtime: "experimental-edge",
};

/**
 * return an image from url such as `/api/og/tweet?hashId=abcdef`
 */
export default async function handler(req: NextRequest) {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "black",
            backgroundSize: "150px 150px",
            height: "100%",
            width: "100%",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            flexWrap: "nowrap",
          }}
        >
          <div tw="flex flex-col text-white items-center">
            <img tw="" width={240} height={240} src={`data:image/svg+xml,${ENCODED_SVG_MUSKER_DARK}`} />
            <div tw="flex flex-col items-center justify-center pt-6">
              <p tw="font-bold p-0 m-0 text-xl">Musker / A Twitter clone built with</p>
              <p tw="font-bold p-0 m-0 mt-1 text-xl">experimental nextjs 13 features</p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
