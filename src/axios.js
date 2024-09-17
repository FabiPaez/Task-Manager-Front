import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000' // URL base de tu API
});

export default instance;
