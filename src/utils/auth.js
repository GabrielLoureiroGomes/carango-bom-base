import jwtDecode from "jwt-decode";
const storageToken = "token";

export const getToken = () => {
  return localStorage.getItem(storageToken);
};

export const setStorageToken = (token) => {
  return localStorage.setItem(storageToken, token);
};

export const removeStorageToken = () => {
  return localStorage.removeItem(storageToken);
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  return jwtDecode(token);
};

export const logout = () => {
  removeStorageToken();
  window.location.href = "/login";
};
