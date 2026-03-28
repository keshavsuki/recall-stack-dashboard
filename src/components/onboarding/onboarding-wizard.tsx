"use client";

import { useState } from "react";
import { WizardStep } from "./wizard-step";
import { DetectionChecks } from "./detection-checks";

interface OnboardingWizardProps {
  visible: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: "Welcome to Recall Stack",
    description: "Your visual control plane for Claude Code memory. Let's make sure everything is set up correctly.",
  },
  {
    title: "Layer Detection",
    description: "Checking which memory layers are configured in your environment.",
  },
  {
    title: "Gates Configuration",
    description: "Safety gates intercept dangerous operations before they execute. You can customize rules in gates.json.",
  },
  {
    title: "You're All Set",
    description: "Your recall stack is configured. The dashboard will show real-time updates as Claude Code runs.",
  },
];

export function OnboardingWizard({ visible, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!visible) return null;

  function handleNext() {
    if (currentStep === STEPS.length - 1) {
      localStorage.setItem("recall-stack-onboarded", "true");
      onClose();
      return;
    }
    setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(0, s - 1));
  }

  function handleSkip() {
    localStorage.setItem("recall-stack-onboarded", "true");
    onClose();
  }

  const step = STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                i === currentStep
                  ? "bg-violet-500 w-6"
                  : i < currentStep
                    ? "bg-violet-300"
                    : "bg-zinc-200"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="px-8 py-8">
          <WizardStep title={step.title} description={step.description} stepNumber={currentStep + 1}>
            {currentStep === 1 && <DetectionChecks />}
            {currentStep === 2 && (
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-300/60" />
                    <div className="h-2 w-2 rounded-full bg-amber-300/60" />
                    <div className="h-2 w-2 rounded-full bg-emerald-300/60" />
                  </div>
                  <span className="text-[9px] text-zinc-300 font-medium">gates.json</span>
                </div>
                <pre className="text-[11px] text-zinc-600 font-mono leading-relaxed">
{`{
  "gates": [
    {
      "name": "no-force-push",
      "tool": "Bash",
      "level": "block"
    }
  ]
}`}
                </pre>
              </div>
            )}
            {currentStep === 3 && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-emerald-600">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>
            )}
          </WizardStep>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-8 py-4">
          <div>
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="text-[12px] font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {currentStep === 1 && (
              <button
                onClick={handleSkip}
                className="text-[12px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              className="rounded-lg bg-violet-600 px-5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-violet-700"
            >
              {currentStep === STEPS.length - 1 ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
