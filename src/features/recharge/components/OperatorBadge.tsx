import { getOperatorStyle } from "../utils/operator-styles";

export function OperatorBadge({ name }: { name: string }) {
  const style = getOperatorStyle(name);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-label-sm font-medium ${style.badge}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${style.dot}`} />
      {name}
    </span>
  );
}
