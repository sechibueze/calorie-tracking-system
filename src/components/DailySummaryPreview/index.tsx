const meals = [
  { name: 'Oatmeal with banana', time: '08:10', kcal: 350 },
  { name: 'Jollof rice and chicken', time: '13:05', kcal: 750 },
  { name: 'Grilled fish with plantain', time: '19:30', kcal: 620 },
];

/** Static product preview for the hero. */
export function DailySummaryPreview() {
  const total = meals.reduce((sum, m) => sum + m.kcal, 0);
  const limit = 2100;

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl shadow-primary/10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-neutral-500">Today</p>
          <p className="text-3xl font-semibold">
            {total.toLocaleString()} <span className="text-base font-normal text-neutral-500">/ {limit.toLocaleString()} kcal</span>
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-neutral-900">On track</span>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-neutral-100" role="img" aria-label={`${total} of ${limit} calories`}>
        <div className="h-full rounded-full bg-primary" style={{ width: `${(total / limit) * 100}%` }} />
      </div>
      <ul className="mt-6 divide-y divide-neutral-100">
        {meals.map((meal) => (
          <li key={meal.name} className="flex items-center justify-between py-3 text-sm">
            <span>
              <span className="block font-medium">{meal.name}</span>
              <span className="text-xs text-neutral-500">{meal.time}</span>
            </span>
            <span className="font-semibold text-primary-700">{meal.kcal} kcal</span>
          </li>
        ))}
      </ul>
    </div>
  );
}