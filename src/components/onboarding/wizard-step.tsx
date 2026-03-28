import type { ReactNode } from "react";

interface WizardStepProps {
  title: string;
  description: string;
  children: ReactNode;
  stepNumber: number;
}

export function WizardStep({ title, description, children, stepNumber }: WizardStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
        {stepNumber}
      </div>
      <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
      <p className="mt-1.5 max-w-sm text-[13px] text-zinc-500 leading-relaxed">{description}</p>
      <div className="mt-6 w-full">{children}</div>
    </div>
  );
}
