import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#60a5fa', '#a78bfa', '#f472b6', '#facc15'];

export default function CategoryPieChart({ categories }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-80">
      <h2 className="font-semibold mb-2">🧃 Category Stats</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={categories} dataKey="quantity" nameKey="category" outerRadius={80} label>
            {categories.map((entry, index) => (
              <Cell key={`cat-cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
