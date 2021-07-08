import jwtDecode from "jwt-decode";

const storageToken = "token";

export const getToken = () => {
  const tokenString = localStorage.getItem(storageToken);
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
};

export const setStorageToken = (token) => {
  return localStorage.setItem(storageToken, JSON.stringify(token));
};

export const removeStorageToken = () => {
  return localStorage.removeItem(storageToken);
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  return jwtDecode(token);
};
