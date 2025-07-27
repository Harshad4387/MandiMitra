import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function StatusPieChart({ statusData }) {
  const data = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow h-80">
      <h2 className="font-semibold mb-2">📊 Order Status Breakdown</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
