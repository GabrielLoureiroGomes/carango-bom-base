import { removeStorageToken, setStorageToken } from "../utils/auth";
import UserService from "../services/UserService";

export async function logout({ dispatch }) {
  removeStorageToken();
  return dispatch({ type: "logout" });
}

export async function login({ dispatch, user }) {
  try {
    const token = await UserService.auth(user);
    dispatch({ type: "auth", payload: user });
    setStorageToken(token);
  } catch (e) {
    dispatch({ type: "logout" });
    removeStorageToken();
    const invalidCredentials = e.message.includes("401");
    const errorMsg = invalidCredentials
      ? "Usuário ou senha inválidos"
      : "Houve um erro ao fazer login";
    throw new Error(errorMsg);
  }
}

export async function signup({ user }) {
  try {
    const teste = await UserService.signup(user);
    console.log({ teste });
    return teste;
  } catch (e) {
    console.log({ e });
    const invalidUsername = e.message.includes("400");
    const errorMsg = invalidUsername
      ? "Usuário já existe"
      : "Houve um erro ao cadastrar";
    throw new Error(errorMsg);
  }
}
