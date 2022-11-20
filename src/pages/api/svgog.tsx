import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    //note to self:
    //1. make sure to encodeURIComponent(svg) before sending it as param
    //2. searchParams.get("svg") will undo the encoding
    //3. make sure to encode it again when passing to img src below.
    const svgstr = searchParams.get("svg");
    console.log("svgstr:", svgstr);

    const title = searchParams.get("title");
    if (!svgstr || !title) {
      throw new Error("no svgstr or title");
    }

    /*
    return new ImageResponse(
      <img width="240" height="240" alt={title} src={`data:image/svg+xml,${encodeURIComponent(svgstr)}`} />,
      {
        width: 240,
        height: 240,
      },
    );
    */

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "#171717",
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={title}
              width={240}
              height={240}
              src={`data:image/svg+xml,${encodeURIComponent(svgstr)}`}
              style={{ margin: "0 30px", outlineColor: "#404040", outlineWidth: "1px" }}
            />
          </div>
          <div
            style={{
              fontSize: 40,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              color: "white",
              marginTop: 30,
              padding: "0 120px",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
