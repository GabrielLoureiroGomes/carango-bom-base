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
    const errorMessage = await res.text();
    throw new Error(`${res.status}: ${res.statusText}, ${errorMessage}`);
  }

  if (res.status === 204) return true;

  return await res.json();
}

export default apiClient;
