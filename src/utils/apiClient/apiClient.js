import { logout, getToken } from "../auth";

async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const config = {
    ...customConfig,
    method: customConfig.method || "GET",
    headers: getHeaders(customConfig.headers),
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(endpoint, config);

  if (!res.ok) {
    throw new Error(handleResponseError(res));
  }

  if (res.status === 204) return true;

  return res.json();
}

export function getHeaders(customHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return { ...headers, ...customHeaders };
}

export async function handleResponseError(res) {
  if (res.status === 403) logout();

  const errorMessage = await res.text();
  const errorArr = errorMessage.length > 0 ? errorMessage[0] : [];

  if (errorArr.length < 1) return "Erro inesperado";

  const [
    {
      error: { message },
    },
  ] = errorMessage;

  return message;
}

export default apiClient;
