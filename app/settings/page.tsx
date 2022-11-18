import { SignoutButton } from "src/components/SignoutButton";
import { ThemeToggleButton } from "src/components/ThemeToggleButton";
import { UserHandleChoose } from "src/components/UserHandleChoose";

export default function Page() {
  return (
    <div className="">
      <h2 className="">settings page</h2>
      <p>some buttons here</p>
      <UserHandleChoose />
      <ThemeToggleButton className="block" />
      <SignoutButton className="block" />
    </div>
  );
}
