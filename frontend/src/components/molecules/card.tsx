type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: Props) {
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}