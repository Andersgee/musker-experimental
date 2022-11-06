import { ComposePost } from "src/components/ComposePost";
import { HomeFeed } from "src/components/HomeFeed";
import { DividerFull } from "src/ui/Divider";
import { SigninButtons } from "src/components/SigninButtons";

export default function Page() {
  return (
    <div className="">
      <ComposePost />
      <DividerFull />
      <SigninButtons />
      <HomeFeed />
    </div>
  );
}
