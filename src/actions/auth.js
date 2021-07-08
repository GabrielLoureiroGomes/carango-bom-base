import UserService from "../services/UserService";
import { removeStorageToken, setStorageToken } from "../utils/auth";

export async function auth({ dispatch, user }) {
  // TODO: alinhar qual será a resposta com o back-end
  try {
    const token = await UserService.auth(user);
    dispatch({ type: "auth", payload: user });
    setStorageToken(token);
  } catch {
    dispatch({ type: "logout" });
    removeStorageToken();
  }
}
