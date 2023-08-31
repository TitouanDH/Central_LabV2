import axios from "axios";

const Axios = axios.create({
  // .. where we make our configurations
  baseURL: "http://10.255.120.133/api/",
});

Axios.defaults.headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

export default Axios