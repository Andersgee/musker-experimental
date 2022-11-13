import { TweetCompose } from "src/components/TweetCompose";
import { HomeFeed } from "src/components/HomeFeed";
import { DividerFull } from "src/ui/Divider";

export default function Page() {
  return (
    <div className="">
      <TweetCompose />
      <DividerFull />
      <HomeFeed />
    </div>
  );
}
