/**
 * Settings Service
 * ================
 * Centralized service that fetches global settings and caches them.
 * All form pages (AddInvoice, EditInvoice, AddQuote, EditQuote, AddPayment, etc.)
 * should use this service to read and apply settings consistently.
 *
 * The cache lasts for the session (or until explicitly invalidated).
 */
import api from './api';

// In-memory cache: key → { data, timestamp }
const cache = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Available settings endpoints
const ENDPOINTS = {
    general: '/settings/general/',
    business: '/settings/business/',
    quotes: '/settings/quotes/',
    invoices: '/settings/invoices/',
    payments: '/settings/payments/',
    tax: '/settings/tax/',
    emails: '/settings/emails/',
    pdf: '/settings/pdf/',
    translate: '/settings/translate/',
    extras: '/settings/extras/',
    licenses: '/settings/licenses/',
};

/**
 * Fetch a single settings group (e.g. 'invoices', 'quotes', 'payments', 'tax').
 * Results are cached for CACHE_TTL_MS to avoid duplicate requests.
 */
export async function fetchSettingsGroup(group) {
    const endpoint = ENDPOINTS[group];
    if (!endpoint) {
        console.warn(`[settingsService] Unknown settings group: "${group}"`);
        return {};
    }

    const cached = cache[group];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
    }

    try {
        const res = await api.get(endpoint);
        const data = res.data || {};
        cache[group] = { data, timestamp: Date.now() };
        return data;
    } catch (err) {
        console.error(`[settingsService] Failed to fetch "${group}" settings:`, err);
        return cached ? cached.data : {};
    }
}

/**
 * Fetch multiple settings groups in parallel.
 * Returns an object keyed by group name.
 *
 * Example: const { invoices, payments, tax } = await fetchMultipleSettings(['invoices', 'payments', 'tax']);
 */
export async function fetchMultipleSettings(groups) {
    const results = await Promise.allSettled(
        groups.map(g => fetchSettingsGroup(g))
    );

    const out = {};
    groups.forEach((g, i) => {
        out[g] = results[i].status === 'fulfilled' ? results[i].value : {};
    });
    return out;
}

/**
 * Invalidate cached settings (e.g. after saving settings).
 * Pass a group name to invalidate just that group, or omit to clear all.
 */
export function invalidateSettingsCache(group) {
    if (group) {
        delete cache[group];
    } else {
        Object.keys(cache).forEach(k => delete cache[k]);
    }
}

/**
 * Helper: Build invoice number from settings.
 */
export function buildInvoiceNumber(settings) {
    const prefix = settings.prefix || '';
    const suffix = settings.suffix || '';
    const nextNum = settings.nextNumber || String(Math.floor(Math.random() * 900) + 100);
    return prefix + nextNum + suffix;
}

/**
 * Helper: Build quote number from settings.
 */
export function buildQuoteNumber(settings) {
    const prefix = settings.prefix || '';
    const suffix = settings.suffix || '';
    const nextNum = settings.nextNumber || String(Math.floor(Math.random() * 900) + 100);
    return prefix + nextNum + suffix;
}

/**
 * Helper: Calculate due date from settings.
 */
export function calculateDueDate(fromDate, dueDays) {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + (parseInt(dueDays) || 14));
    return d.toISOString().split('T')[0];
}

/**
 * Helper: Get currency symbol from payment settings.
 */
export function getCurrencySymbol(paymentSettings) {
    return paymentSettings?.currencySymbol || '₹';
}

/**
 * Helper: Format a numeric amount using payment settings.
 */
export function formatAmount(amount, paymentSettings = {}) {
    const symbol = paymentSettings.currencySymbol || '₹';
    const position = paymentSettings.currencyPosition || 'left';
    const thousandSep = paymentSettings.thousandSeparator || ',';
    const decimalSep = paymentSettings.decimalSeparator || '.';
    const decimals = parseInt(paymentSettings.numberOfDecimals) || 2;

    let num = Number(amount).toFixed(decimals);
    // Split into integer and decimal parts
    const [intPart, decPart] = num.split('.');
    // Add thousand separators
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
    const formattedNum = decPart ? formattedInt + decimalSep + decPart : formattedInt;

    switch (position) {
        case 'right': return formattedNum + symbol;
        case 'left_space': return symbol + ' ' + formattedNum;
        case 'right_space': return formattedNum + ' ' + symbol;
        default: return symbol + formattedNum;
    }
}

export default {
    fetchSettingsGroup,
    fetchMultipleSettings,
    invalidateSettingsCache,
    buildInvoiceNumber,
    buildQuoteNumber,
    calculateDueDate,
    getCurrencySymbol,
    formatAmount,
};
