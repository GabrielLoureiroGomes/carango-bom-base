import { removeStorageToken, setStorageToken } from "../utils/auth";
import UserService from "../services/UserService";

export async function logout({ dispatch }) {
  removeStorageToken();
  return dispatch({ type: "logout" });
}

export async function login({ dispatch, user }) {
  try {
    const { token } = await UserService.auth(user);
    dispatch({ type: "auth", payload: user });
    setStorageToken(token);
  } catch (e) {
    dispatch({ type: "logout" });
    removeStorageToken();
    throw new Error(e.message);
  }
}

export async function signup({ user }) {
  try {
    return await UserService.signup(user);
  } catch (e) {
    throw new Error(e.message);
  }
}
