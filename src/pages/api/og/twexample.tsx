import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler() {
  //anders
  const image = "https://lh3.googleusercontent.com/a/ALm5wu1o8vscH0Z-lGyE8x2IPSs6lsFT91u-_7S1GlzBlw=s96-c";

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
          backgroundColor: "white",
        }}
      >
        <div tw="flex">
          <img tw="h-16 w-16 rounded-full mt-4" src={image} />
          <div tw="flex flex-col">
            <h3 tw="text-xl font-normal">username here - datestr here</h3>
            <p tw="text-lg max-w-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum quae est dolore explicabo dignissimos
              tempore quisquam atque nesciunt repellendus ex. Libero ab atque animi quidem? Adipisci, architecto.
              Voluptas, nesciunt qui?
            </p>
            <div tw="flex gap-4">
              <div>replyicon</div>
              <div>retweeticon</div>
              <div>hearticon</div>
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
