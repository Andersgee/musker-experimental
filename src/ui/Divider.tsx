"use client";

export function DividerFull() {
  return <hr className=" h-px border-0 bg-gray-200 dark:bg-gray-700" />;
}

export function DividerShort() {
  return <hr className="mx-auto h-1 w-48 rounded border-0 bg-gray-100 dark:bg-gray-700 md:my-10" />;
}

export function DividerText({ text }: { text: string }) {
  return (
    <div className="inline-flex w-full items-center justify-center">
      <hr className="my-8 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
      <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 font-medium text-gray-900 dark:bg-gray-900 dark:text-white">
        {text}
      </span>
    </div>
  );
}
