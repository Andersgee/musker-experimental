import { IconMusker } from "src/icons/Musker";

type Props = {
  className?: string;
};

export default function Messages({ className }: Props) {
  return (
    <div className={className}>
      <div>messages</div>
      <IconMusker className="w-full" />
    </div>
  );
}
