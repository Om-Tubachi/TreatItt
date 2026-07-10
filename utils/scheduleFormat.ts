interface ScheduleItem {
    day: string;
    time_window?: string;
}

/**
 * Parses dynamic structural schedule data strings safely into clear text representations.
 */
export const formatSchedule = (schedules: any): string => {
    if (!schedules) return '—';
    
    try {
        const parsed = typeof schedules === 'string' ? JSON.parse(schedules) : schedules;
        
        if (Array.isArray(parsed)) {
            return parsed
                .map((s: ScheduleItem) => s.day + (s.time_window ? ` (${s.time_window})` : ''))
                .join(', ');
        }
        
        if (typeof parsed === 'object' && parsed !== null) {
            if (parsed.day) {
                return parsed.day + (parsed.time_window ? ` (${parsed.time_window})` : '');
            }
            return Object.entries(parsed)
                .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
                .join(', ');
        }
    } catch (e) {
        if (typeof schedules === 'string') return schedules;
    }
    
    return '—';
};