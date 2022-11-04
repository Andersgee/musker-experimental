import { CreatePost } from "src/components/CreatePost";
import { SigninButtons } from "src/components/SigninButtons";

export default function Page() {
  return (
    <div className="">
      <div>Home</div>
      <SigninButtons />
      <CreatePost />
    </div>
  );
}
