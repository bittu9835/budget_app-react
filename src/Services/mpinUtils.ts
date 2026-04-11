// Hash the PIN using SHA-256 salted with the user's email
// Stored locally — never sent to server
const hashMpin = async (pin: string): Promise<string> => {
    const email = JSON.parse(localStorage.getItem('userDetails') || '{}').email || 'user';
    const data = new TextEncoder().encode(pin + email);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

export const saveMpin = async (pin: string): Promise<void> => {
    const hash = await hashMpin(pin);
    localStorage.setItem('mpin', hash);
    localStorage.setItem('mpinSet', 'true');
    sessionStorage.setItem('mpinVerified', 'true');
};

export const verifyMpin = async (pin: string): Promise<boolean> => {
    const stored = localStorage.getItem('mpin');
    if (!stored) return false;
    const hash = await hashMpin(pin);
    const valid = hash === stored;
    if (valid) sessionStorage.setItem('mpinVerified', 'true');
    return valid;
};

export const isMpinSet = (): boolean => localStorage.getItem('mpinSet') === 'true';

export const isMpinVerified = (): boolean => sessionStorage.getItem('mpinVerified') === 'true';

export const clearMpin = (): void => {
    localStorage.removeItem('mpin');
    localStorage.removeItem('mpinSet');
    sessionStorage.removeItem('mpinVerified');
};
