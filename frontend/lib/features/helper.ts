export const baseURL = "https://example.com"

export const _fetch = async ({ method, body, url }: { method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", body: string, url: string }) => {
  if (method === "GET" || method === "DELETE") {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        method
      }
    })
    const data = await res.json()
    return data
  } else {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        method
      }, body: JSON.stringify(body)
    })
    const data = await res.json()
    return data
  }
}