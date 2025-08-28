import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000",
  timeout: 60000,
});

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post("/extract-text/", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
