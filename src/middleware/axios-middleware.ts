import axios from 'axios';

axios.interceptors.request.use(function (config) {
  const header_token = 'Bearer ';
  const token = header_token + localStorage.token;
  if (token) {
    config.headers.Authorization = token;
    config.headers['If-None-Match'] = '';
  }
  return config;
});
