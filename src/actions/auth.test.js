import { login, signup, logout } from "./auth";
import UserService from "../services/UserService";
import * as AuthUtils from "../utils/auth";

const authServiceSpy = jest.spyOn(UserService, "auth");
const signupServiceSpy = jest.spyOn(UserService, "signup");

const removeStorageTokenSpy = jest.spyOn(AuthUtils, "removeStorageToken");
const setStorageTokenSpy = jest.spyOn(AuthUtils, "setStorageToken");

const dispatch = jest.fn();
const userMock = {
  username: "test",
  password: "123456",
};

describe("Auth Action", () => {
  let authRes;
  beforeEach(() => {
    authRes = login({
      dispatch,
      user: userMock,
    });
  });

  describe("with resolved value", () => {
    beforeAll(() => {
      authServiceSpy.mockResolvedValue({ token: "ok" });
    });

    it("should call the 'UserService.auth' with correct user", () => {
      expect(authServiceSpy).toBeCalledWith(userMock);
    });
    it("should call dispatch with type 'auth' and correct user", () => {
      expect(dispatch).toBeCalledWith({
        type: "auth",
        payload: userMock,
      });
    });
    it("should call 'setStorageToken' with token from the api call", () => {
      expect(setStorageTokenSpy).toHaveBeenCalledWith("ok");
    });
  });

  describe("with rejected value", () => {
    describe("wrong credentials", () => {
      beforeAll(() => {
        authServiceSpy.mockRejectedValue(
          new Error("Usuário ou senha inválidos")
        );
      });
      it("should respond with the rejected value", async () => {
        await expect(authRes).rejects.toThrowError(
          "Usuário ou senha inválidos"
        );
      });
    });

    describe("other errors", () => {
      beforeAll(() => {
        authServiceSpy.mockRejectedValue(
          new Error("Houve um erro ao fazer login")
        );
      });
      it("should respond with the rejected value", async () => {
        await expect(authRes).rejects.toThrowError(
          "Houve um erro ao fazer login"
        );
      });
    });
  });
});

describe("Signup action", () => {
  let signupRes;
  beforeEach(() => {
    signupRes = signup({ user: userMock });
  });

  describe("with resolved value", () => {
    beforeAll(() => {
      signupServiceSpy.mockResolvedValue("ok");
    });

    it("should call the 'UserService.signup' with correct user", () => {
      expect(signupServiceSpy).toBeCalledWith(userMock);
    });
  });

  describe("with rejected value", () => {
    describe("user already exists", () => {
      beforeAll(() => {
        signupServiceSpy.mockRejectedValue(new Error("Usuário já existe"));
      });
      it("should respond with the rejected value", () => {
        return expect(signupRes).rejects.toThrowError("Usuário já existe");
      });
    });
    describe("other errors", () => {
      beforeAll(() => {
        signupServiceSpy.mockRejectedValue(
          new Error("Houve um erro ao cadastrar")
        );
      });
      it("should respond with the rejected value", () => {
        return expect(signupRes).rejects.toThrowError(
          "Houve um erro ao cadastrar"
        );
      });
    });
  });
});

describe("Logout action", () => {
  beforeEach(() => {
    logout({ dispatch });
  });

  it("should call 'removeStorageToken'", () => {
    expect(removeStorageTokenSpy).toHaveBeenCalled();
  });
  it("should call dispatch with type 'logout'", () => {
    expect(dispatch).toHaveBeenCalledWith({ type: "logout" });
  });
});
