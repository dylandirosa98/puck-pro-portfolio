interface StepIndicatorProps {
  currentStep: number; // 1-indexed
  totalSteps?: number;
}

const LABELS = ["Info", "Details", "Photos", "Stats", "Links", "Review"];

export default function StepIndicator({ currentStep, totalSteps = 6 }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* Dot */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-xs font-semibold ${
                  isCompleted
                    ? "bg-[#b91c1c] text-white"
                    : isActive
                    ? "bg-transparent border-2 border-white text-white"
                    : "bg-white/10 text-white/30"
                }`}
              >
                {isCompleted ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-white" : isCompleted ? "text-[#b91c1c]" : "text-white/20"
                }`}
              >
                {LABELS[i]}
              </span>
            </div>

            {/* Connector line */}
            {step < totalSteps && (
              <div
                className={`w-8 h-px mb-5 mx-1 transition-colors duration-300 ${
                  isCompleted ? "bg-[#b91c1c]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
