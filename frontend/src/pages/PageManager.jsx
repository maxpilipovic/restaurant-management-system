import React from 'react';
import { motion } from 'framer-motion';

// Reusable Card component
function InfoCard({ title, subtitle, stats, rows }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white/90 dark:bg-slate-800 rounded-2xl shadow-md p-4 min-w-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-right">
          {stats && <div className="text-xl font-bold">{stats}</div>}
        </div>
      </div>

      {/* Small preview table */}
      {rows && rows.length > 0 && (
        <div className="mt-4 w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-left">
                {Object.keys(rows[0]).map((key) => (
                  <th key={key} className="pr-4 pb-2">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 3).map((r, i) => (
                <tr key={i} className="border-t border-slate-100 dark:border-slate-700">
                  {Object.values(r).map((v, j) => (
                    <td key={j} className="py-2 pr-4 truncate max-w-[10rem]">{String(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-400">Updated: {new Date().toLocaleDateString()}</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs rounded-full border border-slate-200 hover:bg-slate-50">View</button>
          <button className="px-3 py-1 text-xs rounded-full border border-slate-200 hover:bg-slate-50">Edit</button>
        </div>
      </div>
    </motion.div>
  );
}

// Sample data for the 10 cards
const sampleTables = Array.from({ length: 10 }).map((_, i) => ({
  id: `table_${i + 1}`,
  title: `Table ${i + 1}`,
  subtitle: `Description for table ${i + 1}`,
  stats: `${Math.floor(Math.random() * 5000)} rows`,
  rows: [
    { id: i * 10 + 1, name: `Row ${i + 1}-A`, value: Math.floor(Math.random() * 100) },
    { id: i * 10 + 2, name: `Row ${i + 1}-B`, value: Math.floor(Math.random() * 100) },
    { id: i * 10 + 3, name: `Row ${i + 1}-C`, value: Math.floor(Math.random() * 100) },
  ],
}));

// Manager page
function PageManager() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Manager Page</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of all tables and quick actions</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-2xl bg-amber-500 text-white font-semibold shadow hover:opacity-95">Admin</button>
          <button className="px-4 py-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50">Menu</button>
        </div>
      </header>

      <main>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sampleTables.map((t) => (
            <InfoCard
              key={t.id}
              title={t.title}
              subtitle={t.subtitle}
              stats={t.stats}
              rows={t.rows}
            />
          ))}
        </section>

      </main>
    </div>
  );
}

export default PageManager;
