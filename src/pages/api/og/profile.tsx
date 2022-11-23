/* eslint-disable jsx-a11y/alt-text */
import type { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { Client } from "@planetscale/database";
import type { User } from "@prisma/client";
import { absUrl } from "src/components/SEO";
import { ENCODED_SVG_MUSKER_DARK } from "src/icons/urlencoded";

export const config = {
  runtime: "experimental-edge",
  regions: "iad1",
};

type QueryData = Omit<User, "createdAt"> & { createdAt: string };

const db = new Client({
  url: process.env.DATABASE_URL,
});

/**
 * return an image from url such as `/api/og/tweet?hashId=abcdef`
 */
export default async function handler(req: NextRequest) {
  try {
    const handle = req.nextUrl.searchParams.get("handle");
    if (!handle) {
      throw "bad handle";
    }

    //important note: is this even safe?
    const queryString = `SELECT * FROM User WHERE handle = '${handle}';`;

    const conn = db.connection();
    const { rows } = await conn.execute(queryString);
    const data = rows[0] as QueryData;

    if (!data.image || !data.handle) {
      throw "bad data";
    }

    const image = absUrl(data.image); //needed only for seedusers which uses relative urls

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
            <div tw="flex items-center justify-center">
              <img tw="h-10 w-10 rounded-full mt-4 border border-white  bg-neutral-50" src={image} />
              <div tw="flex pl-4 pt-4">
                <p
                  tw="font-bold p-0 m-0 max-w-xs"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  profile of {data.handle} / Musker
                </p>
              </div>
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
