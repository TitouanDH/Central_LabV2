import axios from "axios";

const Axios = axios.create({
  // .. where we make our configurations
  baseURL: "http://127.0.0.1:8000/api/",
});

Axios.defaults.headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

export default Axios