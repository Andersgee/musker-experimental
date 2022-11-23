import { CreateTweet } from "./CreateTweet";
import { Tweets } from "./Tweets";

export default function Page() {
  return (
    <div>
      <CreateTweet />
      <Tweets />
    </div>
  );
}
