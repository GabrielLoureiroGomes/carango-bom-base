import { client } from "../utils";

const userUrl = "/api/user";
const UserService = {
  auth(user) {
    return client(`api/auth`, { body: user, method: "POST" });
  },
  signup(user) {
    return client(userUrl, { body: user, method: "POST" });
  },
  getAll() {
    return client(userUrl);
  },
  updatePassword({ id, ...newPasswordPayload }) {
    return client(`${userUrl}/${id}`, {
      body: newPasswordPayload,
      method: "PATCH",
    });
  },
  delete(id) {
    return client(`${userUrl}/${id}`, { method: "DELETE" });
  },
};

export default UserService;
