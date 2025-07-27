export default function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
