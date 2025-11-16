type Props = {
  children: React.ReactNode;
  variant?: "primary" | "success";
};

export default function Button({ children, variant = "primary" }: Props) {
  const base = "inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles = variant === "primary"
    ? "bg-primary text-white hover:bg-light-blue focus:ring-light-blue"
    : "bg-success text-primary hover:bg-hover-success focus:ring-success";

  return <button className={`${base} ${styles}`}>{children}</button>;
}