import { ComposePost } from "src/components/ComposePost";
import { PersonalizedPostsFeed } from "src/components/PersonalizedPostsFeed";
import { DividerFull } from "src/ui/Divider";
//import { SigninButtons } from "src/components/SigninButtons";

export default function Page() {
  return (
    <div className="">
      <ComposePost />
      <DividerFull />
      <PersonalizedPostsFeed />
    </div>
  );
}
