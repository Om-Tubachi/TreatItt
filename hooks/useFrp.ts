import { useQuery } from '@tanstack/react-query';
import { getAllFrp } from '../services/frp';

export interface Lookups {
  compositions: Record<string, { id: string; label: string }>;
  categories: Record<string, { id: string; label: string }>;
  grades: Record<string, { id: string; label: string }>;
  resins: Record<string, { id: string; label: string }>;
   rawEntries: any[];
}

export const useFrp = () =>
  useQuery({
    queryKey: ['frp'],
    queryFn: getAllFrp,
    staleTime: Infinity,
    gcTime: Infinity,
    select: (data: any[]): Lookups => {
      const lookups: Lookups = {
        compositions: {},
        categories: {},
        grades: {},
        resins: {},
        rawEntries: data,
      };

      data.forEach((entry) => {
        if (entry.composition) {
          lookups.compositions[entry.composition.id] = {
            id: entry.composition.id,
            label: entry.composition.composition_name,
          };
        }
        if (entry.category) {
          lookups.categories[entry.category.id] = {
            id: entry.category.id,
            label: entry.category.category_name,
          };
        }
        if (entry.grade) {
          lookups.grades[entry.grade.id] = {
            id: entry.grade.id,
            label: entry.grade.grade_name,
          };
        }
        if (entry.resin) {
          lookups.resins[entry.resin.id] = {
            id: entry.resin.id,
            label: entry.resin.resin_name,
          };
        }
      });

      return lookups;
    },
  });