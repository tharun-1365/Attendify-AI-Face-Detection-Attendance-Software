type Props = {
  title: string;
  value: string;
};

export default function DashboardCard({ title, value }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}