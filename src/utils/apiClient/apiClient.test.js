import * as AuthUtils from "../auth";

import { getHeaders, handleResponseError } from "./apiClient";

const spyLogout = jest.spyOn(AuthUtils, "logout");

const defaultHeaders = {
  "Content-Type": "application/json",
};

describe("The getHeaders function", () => {
  describe("When it doesn't receive custom headers, and the localStorage is empty", () => {
    it("Should return only the default headers", () => {
      expect(getHeaders()).toEqual(defaultHeaders);
    });
  });

  describe("When it receive custom headers, and the local storage is empty", () => {
    it("Should return the default headers with the custom headers", () => {
      const customHeaders = { "Content-Type": "*" };
      expect(getHeaders(customHeaders)).toEqual({
        ...defaultHeaders,
        ...customHeaders,
      });
    });
  });

  describe("When there's a token in the local storage", () => {
    it("Should return the default headers and the Authorization with the token", () => {
      const testToken = "jsonwebtoken";
      AuthUtils.setStorageToken(testToken);

      expect(getHeaders()).toEqual({
        ...defaultHeaders,
        Authorization: `Bearer ${testToken}`,
      });
    });
  });
});

describe("The handleResponseError function", () => {
  it("Should return the first error message from response", async () => {
    const firstErrorMessage = "testErrorMessage";
    const secondErrorMessage = "testErrorMessage2";
    expect(
      await handleResponseError({
        status: 400,
        text: () =>
          Promise.resolve([
            { error: { message: firstErrorMessage } },
            { error: { message: secondErrorMessage } },
          ]),
      })
    ).toEqual(firstErrorMessage);
  });

  describe("When the error status is 403(forbidden)", () => {
    it("Should logout the user", async () => {
      await handleResponseError({
        status: 403,
        text: () =>
          Promise.resolve(
            JSON.stringify({
              errors: [{ message: "" }],
            })
          ),
      });

      expect(spyLogout).toHaveBeenCalledTimes(1);
    });
  });
});
