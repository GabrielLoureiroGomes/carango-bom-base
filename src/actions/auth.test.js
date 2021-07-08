import { auth } from "./auth";
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
  describe("Using auth method", () => {
    describe("with resolved value", () => {
      beforeAll(() => {
        authServiceSpy.mockResolvedValue("ok");
      });
      beforeEach(() => {
        auth({
          dispatch,
          user: userMock,
          method: "auth",
        });
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
  });
  describe("Using signup method", () => {
    describe("with rejected value", () => {
      let authRes;
      beforeAll(() => {
        signupServiceSpy.mockRejectedValue("fail");
      });
      beforeEach(async () => {
        authRes = await auth({
          dispatch,
          user: userMock,
          method: "signup",
        });
      });

      it("should call the 'UserService.auth' with correct user", () => {
        expect(authServiceSpy).toBeCalledWith(userMock);
      });
      it("should call dispatch with type 'logout'", () => {
        expect(dispatch).toBeCalledWith({
          type: "logout",
        });
      });
      it("should call 'removeStorageToken'", () => {
        expect(removeStorageTokenSpy).toHaveBeenCalled();
      });
      it("should respond with the rejected value", () => {
        expect(authRes).toStrictEqual("fail");
      });
    });
  });

  describe("Using unkown method", () => {
    it("should throw an error", async () => {
      expect(
        await auth({
          dispatch,
          user: userMock,
          method: "delete",
        })
      ).toHaveProperty("message", "Unkown UserService method");
    });
  });
});
