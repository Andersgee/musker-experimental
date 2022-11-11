import { ComposePost } from "src/components/ComposePost";
import { HomeFeed } from "src/components/HomeFeed";
import { DividerFull } from "src/ui/Divider";

export default function Page() {
  return (
    <div className="">
      <ComposePost />
      <DividerFull />
      <HomeFeed />
    </div>
  );
}
