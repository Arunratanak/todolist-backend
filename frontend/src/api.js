export async function api(path, options = {}) {
  const { body, headers, ...rest } = options;

  const res = await fetch(path, {
    ...rest,
    credentials: "include", // sends and accepts the login cookie
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  // DELETE or empty responses have no JSON body, so this falls back to null
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Your backend sometimes uses "error" and sometimes "message"; handle both
    const err = new Error(data?.error || data?.message || `Request failed with status ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}