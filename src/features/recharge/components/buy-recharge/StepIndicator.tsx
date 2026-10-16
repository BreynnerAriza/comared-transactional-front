import { Icon } from "../../../../shared/components/ui/Icon";

export type Step = "form" | "confirm";

const STEPS: { id: Step; label: string }[] = [
  { id: "form", label: "Datos" },
  { id: "confirm", label: "Confirmación" },
];

export function StepIndicator({ step }: { step: Step }) {
  const currentIndex = STEPS.findIndex((item) => item.id === step);

  return (
    <ol className="mt-1 flex items-center gap-2">
      {STEPS.map((item, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;
        const circleClasses = isActive
          ? "bg-primary-container text-on-primary"
          : isDone
            ? "bg-success text-white"
            : "bg-surface-container text-text-secondary";

        return (
          <li key={item.id} className="flex items-center gap-2">
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[11px] font-semibold ${circleClasses}`}
            >
              {isDone ? <Icon name="check" size={14} /> : index + 1}
            </span>
            <span
              className={`text-caption font-semibold uppercase tracking-wider ${
                isActive ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {item.label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="h-px w-6 bg-border-subtle" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
