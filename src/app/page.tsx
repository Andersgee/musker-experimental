import { ComposePost } from "src/components/ComposePost";
import { HomeFeed } from "src/components/HomeFeed";
import { DividerFull } from "src/ui/Divider";
import { SigninButtons } from "src/components/SigninButtons";

export default function Page() {
  console.log("HELLO FROM HOME PAGE");
  return (
    <div className="">
      <ComposePost />
      <DividerFull />
      <SigninButtons />
      <HomeFeed />
    </div>
  );
}
