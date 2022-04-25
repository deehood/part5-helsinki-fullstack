import axios from "axios";

const baseUrl = "/api/blogs";

const getAll = async (token) => {
  const response = await axios.get(baseUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

const createBlog = async (blog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(baseUrl, blog, config);

  console.log(response.status);

  return response.data;
};

export default { getAll, createBlog };
