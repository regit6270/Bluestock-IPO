export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

export const getUser = (): any | null => {
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user: any): void => {
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'admin';
};
