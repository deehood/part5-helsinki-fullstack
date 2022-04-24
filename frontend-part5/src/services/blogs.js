import axios from "axios";
import login from "./login";

const baseUrl = "/api/blogs";

const getAll = async (token) => {
  const request = axios.get(baseUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return request.then((response) => response.data);
};

export default { getAll };
