import jwtDecode from "jwt-decode";

export const getToken = () => {
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;
  return jwtDecode(token);
};
