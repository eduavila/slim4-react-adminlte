import get from "lodash/get";
import axios from "axios";

export const fakeApp = axios.create({
  baseURL: "https://localhost:5000/"
});

fakeApp.interceptors.response.use(
  response => response,
  error => {
    const err = get(error, ["response", "data", "err"]);

    return err ? Promise.reject(err) : Promise.reject(error.message);
  }
);

export default fakeApp;
