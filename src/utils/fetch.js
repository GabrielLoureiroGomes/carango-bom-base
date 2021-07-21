async function fetchWrapper(req) {
  const res = await req;
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `${res.status}: ${res.statusText}, ${JSON.stringify(data)}`
    );
  }
  return data;
}

export default fetchWrapper;
