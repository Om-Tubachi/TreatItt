export interface CompositionAggregate {
  compositionId: string;
  compositionName: string;
  compositionDescription?: string;
  supplyCount: number;
  supplyQuantity: number;
  supplyAvgPrice: number | null;
  supplyMinPrice: number | null;
  supplyMaxPrice: number | null;
  demandCount: number;
  demandEstMonthly: number;
  demandActMonthly: number;
  demandAvgPrice: number | null;
  urgencyBreakdown: Record<string, number>;
  ratioLabel: 'Oversupplied' | 'High demand' | 'Balanced' | 'No data';
}

export function aggregateByComposition(results: any[]): CompositionAggregate[] {
  const map = new Map<string, any>();

  for (const r of results) {
    const comp = r.frp?.composition;
    if (!comp) continue;
    const entry = map.get(comp.id) ?? {
      compositionId: comp.id,
      compositionName: comp.composition_name,
      compositionDescription: comp.composition_description,
      supplyCount: 0, supplyQuantity: 0, supplyPrices: [] as number[],
      demandCount: 0, demandEstMonthly: 0, demandActMonthly: 0, demandPrices: [] as number[],
      urgencyBreakdown: {} as Record<string, number>,
    };

    if (r.__entityType === 'product' || r.__entityType === 'waste') {
      entry.supplyCount += 1;
      entry.supplyQuantity += Number(r.quantity ?? 0);
      const price = r.price ?? r.price_per_kg;
      if (price != null) entry.supplyPrices.push(Number(price));
    } else if (r.__entityType === 'requirement') {
      entry.demandCount += 1;
      entry.demandEstMonthly += Number(r.est_req_per_month ?? 0);
      entry.demandActMonthly += Number(r.act_req_per_month ?? 0);
      if (r.price_per_kg != null) entry.demandPrices.push(Number(r.price_per_kg));
      if (r.urgency) entry.urgencyBreakdown[r.urgency] = (entry.urgencyBreakdown[r.urgency] ?? 0) + 1;
    }

    map.set(comp.id, entry);
  }

  return Array.from(map.values()).map((e) => {
    const supply = e.supplyQuantity;
    const demand = e.demandActMonthly;
    let ratioLabel: CompositionAggregate['ratioLabel'] = 'No data';
    if (supply > 0 && demand > 0) {
      const ratio = supply / demand;
      ratioLabel = ratio > 1.15 ? 'Oversupplied' : ratio < 0.85 ? 'High demand' : 'Balanced';
    }
    return {
      compositionId: e.compositionId,
      compositionName: e.compositionName,
      compositionDescription: e.compositionDescription,
      supplyCount: e.supplyCount,
      supplyQuantity: e.supplyQuantity,
      supplyAvgPrice: e.supplyPrices.length ? e.supplyPrices.reduce((a: number, b: number) => a + b, 0) / e.supplyPrices.length : null,
      supplyMinPrice: e.supplyPrices.length ? Math.min(...e.supplyPrices) : null,
      supplyMaxPrice: e.supplyPrices.length ? Math.max(...e.supplyPrices) : null,
      demandCount: e.demandCount,
      demandEstMonthly: e.demandEstMonthly,
      demandActMonthly: e.demandActMonthly,
      demandAvgPrice: e.demandPrices.length ? e.demandPrices.reduce((a: number, b: number) => a + b, 0) / e.demandPrices.length : null,
      urgencyBreakdown: e.urgencyBreakdown,
      ratioLabel,
    };
  });
}
