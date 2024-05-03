import axios, { AxiosError, AxiosResponse, AxiosInstance } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_baseURL,
});



axiosInstance.interceptors.request.use((config) => {
  const token2 = localStorage.getItem("adminToken");
  console.log("token", token2);
  //  const token = "19|66uZbbYkNrBUyGgfDaraRkgUHR20nHfLY8SLGiUb";
  if (token2) {
    config.headers.Authorization = `Bearer ${token2}`;
  }
  return config;
});

axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response?.data || null;
  },
  function (error) {
    const { data, status } = error;
    console.log("data Status", data, status)
    switch (status) {
      case 400:
        console.error(data);
        break;

      case 401:
        console.error("unauthorised");
        break;

      case 404:
        console.error("not-found");
        break;

      case 500:
        console.error("server-error");
        break;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
