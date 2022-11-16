"use client";

import { formatCreatedAt } from "src/utils/date";

type Props = {
  createdAtNumber: number;
  className?: string;
};

export function CreatedAtText({ createdAtNumber, className = "" }: Props) {
  return <span className={className}>{formatCreatedAt(new Date(createdAtNumber))}</span>;
}
