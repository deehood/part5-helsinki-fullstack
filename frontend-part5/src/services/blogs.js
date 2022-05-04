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

  return response.data;
};

const getPosterNameById = async (blogId, token) => {
  const response = await axios.get(`${baseUrl}/${blogId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.user;
};

const updateBlog = async (id, blog, token) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default { getAll, createBlog, getPosterNameById, updateBlog };
