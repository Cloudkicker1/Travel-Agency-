const LOCAL_STORAGE_TOKEN_KEY = 'token';

export function saveToken(token: string): void {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
}

export function clearToken(): void {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
}