async function fetchWrapper(req) {
  const res = await req;
  if (!res.ok) throw new Error(res);
  const data = await res.json();
  return data;
}

export default fetchWrapper;
