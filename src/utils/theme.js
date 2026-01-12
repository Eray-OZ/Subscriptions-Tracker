import { styles, colors } from '../styles/index.js';

// Medium-dark, muted colors for cards
export const gradients = [
    ['#2563eb', '#1d4ed8'], // Medium Blue
    ['#dc2626', '#b91c1c'], // Medium Red
    ['#059669', '#047857'], // Medium Emerald
    ['#d97706', '#b45309'], // Medium Amber
    ['#7c3aed', '#6d28d9'], // Medium Violet
    ['#475569', '#334155'], // Medium Slate
    ['#db2777', '#be123c'], // Medium Pink
    ['#0891b2', '#0e7490'], // Medium Cyan
];

export const getGradientForId = (id) => {
    return gradients[id % gradients.length];
};

export const getIconForCategory = (category) => {
    switch (category) {
        case 'Bills': return 'receipt';
        case 'Movie Streaming': return 'movie';
        case 'Music': return 'music-note';
        case 'Gaming': return 'gamepad-variant';
        case 'Software': return 'code-braces';
        case 'Cloud': return 'cloud';
        case 'Reading': return 'book-open-page-variant';
        case 'Shopping': return 'cart';
        case 'Gym': return 'dumbbell';
        case 'Others': return 'shape-outline';
        default: return 'help-circle';
    }
}

export const getStatusStyle = (remainingDays, isPast) => {
    if (isPast || remainingDays <= 2) {
        return { dot: styles.statusDotUrgent, text: styles.statusTextUrgent, color: colors.red500 };
    } else if (remainingDays <= 7) {
        return { dot: styles.statusDotWarning, text: styles.statusTextWarning, color: '#f59e0b' };
    } else if (remainingDays <= 14) {
        return { dot: styles.statusDotGood, text: styles.statusTextGood, color: colors.emerald500 };
    }
    return { dot: styles.statusDotNeutral, text: styles.statusTextNeutral, color: colors.slate500 };
};
