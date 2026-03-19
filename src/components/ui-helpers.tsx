import Link from "next/link";

export function EntityLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`text-indigo-600 hover:text-indigo-800 hover:underline ${className || ""}`}
    >
      {children}
    </Link>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className || ""}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 mb-3">{children}</h2>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-sm text-gray-500 italic py-3">{message}</p>
  );
}

export function PageHeader({
  title,
  subtitle,
  badges,
}: {
  title: string;
  subtitle?: string;
  badges?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      {badges && <div className="mt-2 flex flex-wrap gap-2">{badges}</div>}
    </div>
  );
}
