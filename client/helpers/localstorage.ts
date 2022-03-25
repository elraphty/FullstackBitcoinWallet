export const getFromStorage = (key: string): string | null => {
    let token: string | null = '';
    if (typeof window !== 'undefined') {
        token = window.localStorage.getItem(key)
    }
    return token;
};

export const setToStorage = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
        return window.localStorage.setItem(key, value)
    }
};

