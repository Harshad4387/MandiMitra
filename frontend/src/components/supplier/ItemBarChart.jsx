import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ItemBarChart({ items }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-80">
      <h2 className="font-semibold mb-2">🥇 Most Ordered Items</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
