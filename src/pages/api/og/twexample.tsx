import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler() {
  //anders
  const image = "https://lh3.googleusercontent.com/a/ALm5wu1o8vscH0Z-lGyE8x2IPSs6lsFT91u-_7S1GlzBlw=s96-c";
  const handle = "andy";
  const datestr = "Nov 21";
  return new ImageResponse(
    (
      // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
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
          <img tw="h-16 w-16 rounded-full mt-4" src={image} />
          <div tw="flex flex-col pl-4 pt-4">
            <h3 tw="text-2xl font-normal p-0 m-0">
              {handle} - {datestr}
            </h3>
            <p tw="text-lg max-w-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quae est dolore explicabo dignissimos
              tempore quisquam atque nesciunt repellendus ex.
            </p>
            <div tw="flex">
              <div tw="mr-2">replyicon</div>
              <div tw="mr-2">retweeticon</div>
              <div tw="mr-2">hearticon</div>
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
