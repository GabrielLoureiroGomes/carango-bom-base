import { removeStorageToken, setStorageToken } from "../utils/auth";
import UserService from "../services/UserService";

export async function auth({ dispatch, user, method }) {
  // TODO: alinhar qual será a resposta com o back-end
  try {
    const service = UserService[method];
    if (!service) throw new Error("Unkown UserService method");
    const token = await service(user);
    dispatch({ type: "auth", payload: user });
    setStorageToken(token);
  } catch (e) {
    dispatch({ type: "logout" });
    removeStorageToken();
    return e;
  }
}
