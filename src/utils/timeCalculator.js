export function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 0;

    const start = startTime instanceof Date ? startTime : new Date(startTime);
    const end = endTime instanceof Date ? endTime : new Date(endTime);

    // Duration in milliseconds
    const durationMs = end - start;

    // Convert to minutes and round to 2 decimal places
    return Math.round((durationMs / 1000 / 60) * 100) / 100;
}

export function formatDuration(minutes) {
    if (!minutes || isNaN(minutes)) return '0h 0m';

    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours === 0) {
        return `${mins}m`;
    } else if (mins === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h ${mins}m`;
    }
}

export function getElapsedTime(startTime) {
    if (!startTime) return null;

    const start = startTime instanceof Date ? startTime : new Date(startTime);
    const now = new Date();

    const elapsedMs = now - start;
    const elapsedMinutes = elapsedMs / 1000 / 60;

    return formatDuration(elapsedMinutes);
}