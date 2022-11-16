import { TweetCompose } from "src/components/TweetCompose";
import { Tweets } from "./Tweets";
import { DividerFull } from "src/ui/Divider";

export default function Page() {
  return (
    <div className="">
      <TweetCompose />
      <DividerFull />
      <Tweets />
    </div>
  );
}
