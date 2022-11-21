import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";
//import { getBaseUrl } from "src/utils/trpc";

export const config = {
  runtime: "experimental-edge",
};

//const a = getBaseUrl();

export default function handler(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const handle = searchParams.get("handle");
    const image = searchParams.get("image");

    if (!handle || !image) {
      throw new Error("no handle or image");
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontSize: 60,
            color: "black",
            background: "#f6f6f6",
            width: "100%",
            height: "100%",
            paddingTop: 50,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text*/}
          <img
            width="256"
            height="256"
            src={image}
            style={{
              borderRadius: 128,
            }}
          />
          <p>{handle} / Musker</p>
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
