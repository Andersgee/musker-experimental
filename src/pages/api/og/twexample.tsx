import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  //const tweetId = searchParams.get("id");
  const tweetId = 99;

  //get tweet here

  //anders
  const image = "https://lh3.googleusercontent.com/a/ALm5wu1o8vscH0Z-lGyE8x2IPSs6lsFT91u-_7S1GlzBlw=s96-c";
  const handle = "andy";
  const datestr = "Nov 21";

  //https://vercel.com/docs/concepts/functions/edge-functions/og-image-examples#using-tailwind-css---experimental
  //also, for intellisense, "tw" in tailwind extension settings
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
          <img tw="h-8 w-8 rounded-full mt-4" src={image} alt={`${tweetId}`} />
          <div tw="flex flex-col pl-4 pt-4">
            <p
              tw="font-bold p-0 m-0"
              style={{
                fontWeight: "bold",
              }}
            >
              {handle} - {datestr}
            </p>
            <p tw="max-w-sm p-0 m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quae est dolore explicabo dignissimos
              tempore quisquam atque nesciunt repellendus ex.
            </p>
            <div tw="flex mt-4 mb-2">
              <img tw="mr-24" width={24} height={24} src={`data:image/svg+xml,${SVG_REPLY}`} />
              <img tw="mr-24" width={24} height={24} src={`data:image/svg+xml,${SVG_RETWEET}`} />
              <img tw="mr-24" width={24} height={24} src={`data:image/svg+xml,${SVG_HEART}`} />
            </div>
            <div tw="my-2 w-full border-b-2 border-gray-200"></div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

//result of encodeURIComponent(svgString)
const SVG_HEART =
  "%3Csvg%20fill%3D%22none%22%20stroke%3D%22black%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20stroke%3D%22none%22%20fill%3D%22black%22%20d%3D%22M16.697%205.5c-1.222-.06-2.679.51-3.89%202.16l-.805%201.09-.806-1.09C9.984%206.01%208.526%205.44%207.304%205.5c-1.243.07-2.349.78-2.91%201.91-.552%201.12-.633%202.78.479%204.82%201.074%201.97%203.257%204.27%207.129%206.61%203.87-2.34%206.052-4.64%207.126-6.61%201.111-2.04%201.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187%207.69c-1.351%202.48-4.001%205.12-8.379%207.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79%202.647-2.91%204.601-3.01%201.651-.09%203.368.56%204.798%202.01%201.429-1.45%203.146-2.1%204.796-2.01%201.954.1%203.714%201.22%204.601%203.01.896%201.81.846%204.17-.514%206.67z%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E";

const SVG_REPLY =
  "%3Csvg%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%3Cpath%20stroke%3D%22none%22%20fill%3D%22black%22%20d%3D%22M1.751%2010c0-4.42%203.584-8%208.005-8h4.366c4.49%200%208.129%203.64%208.129%208.13%200%202.96-1.607%205.68-4.196%207.11l-8.054%204.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317%200-6.005%202.69-6.005%206%200%203.37%202.77%206.08%206.138%206.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08%203.163-3.13%203.163-5.36%200-3.39-2.744-6.13-6.129-6.13H9.756z%22%20%2F%3E%20%3C%2Fsvg%3E";

const SVG_RETWEET =
  "%3Csvg%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%3E%20%3Cpath%20stroke%3D%22none%22%20fill%3D%22black%22%20d%3D%22M4.5%203.88l4.432%204.14-1.364%201.46L5.5%207.55V16c0%201.1.896%202%202%202H13v2H7.5c-2.209%200-4-1.79-4-4V7.55L1.432%209.48.068%208.02%204.5%203.88zM16.5%206H11V4h5.5c2.209%200%204%201.79%204%204v8.45l2.068-1.93%201.364%201.46-4.432%204.14-4.432-4.14%201.364-1.46%202.068%201.93V8c0-1.1-.896-2-2-2z%22%20%2F%3E%20%3C%2Fsvg%3E";
/*
<div tw="flex">
          <div tw="">
            <img tw="h-8 w-8 rounded-full shadow-imageborder" src={image} />
          </div>
          <div tw="flex-1 py-2 pl-2 ">
            <div tw="flex flex-col">
              <h3 tw="text-base font-normal">username here - datestr here</h3>
              <p>THE TWEET TEXT GOES HERE</p>
            </div>
            <div tw="flex w-full gap-4">
              <div>replyicon</div>
              <div>retweeticon</div>
              <div>hearticon</div>
            </div>
          </div>
          */
