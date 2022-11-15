"use client";

import { useId, useState } from "react";
import { Button } from "src/ui/Button";
import { trpc } from "src/utils/trpc";

type Props = {
  className?: string;
};

export function UserHandleChoose({ className = "" }: Props) {
  const utils = trpc.useContext();
  const id = useId();
  const [text, setText] = useState("");
  const { data: myHandle } = trpc.handle.getMy.useQuery();
  const { data: textHandle } = trpc.handle.getByText.useQuery({ text });

  const { mutateAsync: updateHandle } = trpc.handle.update.useMutation({
    onSuccess: () => {
      //utils.handle.invalidate();
    },
  });
  const { mutateAsync: createHandle } = trpc.handle.create.useMutation({
    onSuccess: () => {
      //utils.handle.invalidate();
    },
  });

  return (
    <div className={className}>
      <label htmlFor={id} className="block">
        choose handle
      </label>
      <input type="text" placeholder={myHandle?.text || "name"} onChange={(e) => setText(e.target.value)} />
      <Button
        disabled={!!textHandle || text.length < 3}
        onClick={async () => {
          try {
            if (myHandle) {
              updateHandle({ text });
            } else {
              createHandle({ text });
            }
          } catch (error) {}
        }}
      >
        {myHandle ? "Update" : "Create"}
      </Button>
    </div>
  );
}
