import { getInitials } from "../../utils/format";

interface HeaderProps {
  collapsed: boolean;
  userName: string;
  userEmail: string;
}

export function Header({ collapsed, userName, userEmail }: HeaderProps) {
  return (
    <header
      className={`fixed right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border-subtle bg-surface-base px-4 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] transition-[left] duration-200 sm:px-8 ${
        collapsed ? "left-18" : "left-65"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[18px] font-semibold tracking-tight text-text-primary">Comared</span>
        <span aria-hidden="true" className="text-caption text-text-secondary">
          •
        </span>
        <span className="hidden text-label-sm text-text-secondary sm:inline">Portal Transaccional</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-full border border-indigo-100 bg-secondary-container text-label-sm font-bold text-on-secondary-fixed-variant"
        >
          {getInitials(userName)}
        </div>
        <div className="hidden flex-col text-left sm:flex">
          <span className="text-label-sm font-semibold leading-tight text-text-primary">{userName}</span>
          <span className="text-caption leading-tight text-text-secondary">{userEmail}</span>
        </div>
      </div>
    </header>
  );
}
