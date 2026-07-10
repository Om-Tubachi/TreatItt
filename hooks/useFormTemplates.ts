import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { FormTemplate } from '../types/formTemplates';

const getAllFormTemplates = async (): Promise<FormTemplate[]> => {
    const res = await api.get('/form-templates');
    const rows = res.data.data as any[];

    // metrics_schema comes back from the DB as a JSON string, not a parsed array — must parse here.
    return rows.map(row => ({
        ...row,
        metrics_schema: typeof row.metrics_schema === 'string'
            ? JSON.parse(row.metrics_schema)
            : (row.metrics_schema ?? []),
    }));
};

export const useFormTemplates = (options = {}) =>
    useQuery({
        queryKey: ['form-templates'],
        queryFn: getAllFormTemplates,
        staleTime: 1000 * 60 * 60, // 1hr — treat as near-static config, not live data
        ...options,
    });

/**
 * Pure selector — filters an already-fetched template list to ones applicable
 * to a given entity type ('product' | 'waste' | 'requirement' as stored in applies_to).
 * Not a hook itself; call with the data from useFormTemplates().
 */
export const getTemplatesFor = (
    templates: FormTemplate[] | undefined,
    entityType: string
): FormTemplate[] => {
    if (!templates) return [];
    return templates.filter(t => t.applies_to?.includes(entityType));
};

export const findTemplateById = (
    templates: FormTemplate[] | undefined,
    id: string | null | undefined
): FormTemplate | undefined => {
    if (!templates || !id) return undefined;
    return templates.find(t => t.id === id);
};
