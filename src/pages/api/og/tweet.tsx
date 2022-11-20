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
    const id = searchParams.get("id");

    if (!id) {
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
          <p>TODO: render tweet here, id:{id} / Musker</p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
