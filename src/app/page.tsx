import { CreatePost } from "src/components/CreatePost";
import { DebugTrpc } from "src/components/DebugTrpc";
import { SigninButtons } from "src/components/SigninButtons";

export default function Page() {
  return (
    <div className="">
      <div>Home</div>
      <SigninButtons />
      <CreatePost />
      <DebugTrpc />
    </div>
  );
}
