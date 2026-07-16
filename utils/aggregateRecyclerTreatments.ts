export function aggregateRecyclerTreatments(treatments: any[]) {
  const methodBreakdown: Record<string, number> = {};
  const frpTags = new Set<string>();

  for (const t of treatments) {
    const method = t.treatment_processes?.treatment_methods?.method;
    if (method) methodBreakdown[method] = (methodBreakdown[method] ?? 0) + 1;
    const comp = t.frp?.composition?.composition_name;
    const cat = t.frp?.category?.category_name;
    if (comp) frpTags.add(comp);
    if (cat) frpTags.add(cat);
  }

  return { methodBreakdown, frpTags: Array.from(frpTags), totalCount: treatments.length };
}
