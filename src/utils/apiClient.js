import { logout } from "./auth";

async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

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
    if (res.status === 403) return logout();

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
