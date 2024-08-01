import axios from "axios";

export const api = axios.create({
  baseURL: "https://snake-back-1tq6.onrender.com/api/",
  //   baseURL: "http://localhost:5000/api/",
});
