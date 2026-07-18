import { useMemo, useState } from 'react';
import { useAuth } from '../context/auth';

export function useOwnershipTabs<T extends { recycler_id?: string | null }>(items: T[] | undefined) {
    const { user } = useAuth();
    const [tab, setTab] = useState<'all' | 'mine'>('all');

    const filtered = useMemo(() => {
        if (!items) return [];
        if (tab === 'all') return items;
        return items.filter((i) => i.recycler_id === user?.id);
    }, [items, tab, user?.id]);

    return { tab, setTab, filtered };
}