export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

export function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatDateTime(dateString) {
    const date = new Date(dateString);
    return `${formatDate(date)} ${formatTime(date)}`;
}

export function getCurrentMonthName() {
    const date = new Date();
    return date.toLocaleString('vi-VN', { month: 'long' });
}

export function getCurrentMonthYear() {
    const date = new Date();
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
}