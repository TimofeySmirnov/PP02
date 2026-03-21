"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
};

export function SubmitButton({ idleLabel, pendingLabel, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button className={className} disabled={pending} type="submit">
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
