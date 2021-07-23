import { logout, getToken } from "./auth";

async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...customConfig,
    method: customConfig.method || "GET",
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(endpoint, config);

  if (!res.ok) {
    if (res.status === 403) logout();

    const errorMessage = await res.text();
    const [
      {
        error: { message },
      },
    ] = errorMessage;

    throw new Error(message);
  }

  if (res.status === 204) return true;

  return res.json();
}

export default apiClient;
