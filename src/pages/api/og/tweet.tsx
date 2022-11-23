/* eslint-disable jsx-a11y/alt-text */
import type { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import { Client } from "@planetscale/database";
import type { User, Tweet } from "@prisma/client";
import { absUrl } from "src/components/SEO";
import { numberFromHashid } from "src/utils/hashids";
import { ENCODED_SVG_HEART, ENCODED_SVG_RETWEET, ENCODED_SVG_REPLY } from "src/icons/urlencoded";

/*
note to self:

- vercel/og only works in edge runtime,
  https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation#limits 

- because function makes db requst, its better to only run this in the region closest to db
  https://vercel.com/docs/concepts/edge-network/regions#setting-edge-function-regions
  available strings: https://vercel.com/docs/concepts/edge-network/regions#region-list

- because edge runtime, can not use prisma, but planetscales has "fetch compatible" driver (with raw query strings)
  https://github.com/planetscale/database-js
  example: https://github.com/planetscale/f1-championship-stats/blob/main/examples/vercel/api/data.json.ts

- tailwind is more or less allowed via "tw" attribute.
  https://vercel.com/docs/concepts/functions/edge-functions/og-image-examples#using-tailwind-css---experimental  
  intellisense: add "tw" in tailwind extension settings

- also, if this was not an edge function we could just use a trpc procedure
  https://create.t3.gg/en/usage/trpc#expose-a-single-procedure-externally

- also, is encodeURIComponent(svgString) the only way to use svg?
*/

export const config = {
  runtime: "experimental-edge",
  regions: "iad1",
};

type QueryData = Omit<User & Tweet, "createdAt"> & { createdAt: string };

const db = new Client({
  url: process.env.DATABASE_URL,
});

/**
 * return an image from url such as `/api/og/tweet?hashId=abcdef`
 */
export default async function handler(req: NextRequest) {
  try {
    const hashId = req.nextUrl.searchParams.get("hashId");
    if (!hashId) {
      throw "bad id";
    }
    const id = numberFromHashid(hashId);
    if (!id) {
      throw "bad id";
    }

    //important note: This is a public api endpoint after all. We have made sure id is in fact just a number.
    const queryString = `SELECT * FROM User JOIN Tweet ON Tweet.authorId = User.id WHERE Tweet.id = ${id};`;

    const conn = db.connection();
    const { rows } = await conn.execute(queryString);
    const data = rows[0] as QueryData;
    const dateStr = dateformat(data.createdAt);

    if (data.retweetedToTweetId) {
      //show that this is a retweet?
      //note: at the moment retweets themselves have no links to them in the ui,
      //retweets link to the original tweet and actions are related to the original tweet
    }
    if (data.repliedToTweetId) {
      //maybe fetch the repliedTo tweet aswell?
      //show that this is a reply?
    }

    if (!data.image || !data.handle || !data.text) {
      throw "bad data";
    }

    const image = absUrl(data.image); //needed only for seedusers which uses relative urls

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAFAFA",
          }}
        >
          <div tw="flex">
            <img tw="h-8 w-8 rounded-full mt-4" src={image} />
            <div tw="flex flex-col pl-4 pt-4 w-96">
              <p
                tw="font-bold p-0 m-0"
                style={{
                  fontWeight: "bold",
                }}
              >
                {data.handle} - {dateStr}
              </p>
              <p tw="p-0 m-0">{data.text}</p>
              <div tw="flex mt-4 mb-2">
                <img tw="mr-24" width={24} height={24} src={`data:image/svg+xml,${ENCODED_SVG_REPLY}`} />
                <img tw="mr-24" width={24} height={24} src={`data:image/svg+xml,${ENCODED_SVG_RETWEET}`} />
                <img tw="mr-24" width={24} height={24} src={`data:image/svg+xml,${ENCODED_SVG_HEART}`} />
              </div>
              <div tw="my-2 w-full border-b-2 border-gray-200"></div>
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 315,
      },
    );
  } catch {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

function dateformat(date: string) {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const v = date
    .split(" ")[0]
    ?.split("-")
    .map((x) => parseInt(x, 10));
  if (!v) {
    return "";
  }

  const [, month, day] = v;
  if (month && day) {
    return `${MONTHS.at(month - 1)} ${day}`;
  }
  return "";
}
