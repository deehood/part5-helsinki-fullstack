import axios from "axios";
import login from "./login";

const baseUrl = "/api/blogs";

const getAll = async () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

export default { getAll };
