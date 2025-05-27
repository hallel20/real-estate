import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/authStore"; // For accessing setState directly or specific actions
import Cookies from 'js-cookie'; // Import js-cookie
import { apiUrl } from "../constants";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Ensures cookies are sent with every request
});

axiosInstance.interceptors.request.use(
  (config) => {
    const methodsRequiringCsrf = ["post", "put", "delete", "patch"];
    if (
      config.method &&
      methodsRequiringCsrf.includes(config.method.toLowerCase())
    ) {
      // console.log("Raw document.cookie in request interceptor:", document.cookie); // Log the raw cookie string
      const csrfToken = Cookies.get("csrf_access_token"); // Use Cookies.get()
      // console.log("CSRF Token from Cookies.get:", csrfToken); // Log what Cookies.get() found
      if (csrfToken) {
        config.headers["X-CSRF-TOKEN"] = csrfToken;
      }
      // config.headers["X-CSRF-TOKEN"] = "db7cb20d-1097-4bf3-b101-6cad9a9c0acb"; // Temporarily remove for testing dynamic retrieval
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, // Directly return successful responses
  (error: AxiosError) => {
    if (error.response) {
      const { status, config } = error.response;
      const requestUrl = config.url;

      // Check if it's a 401 error (Unauthorized)
      // And ensure it's not an error from an initial login attempt
      if (status === 401 && requestUrl && !requestUrl.endsWith("/auth/login")) {
        // Token is likely expired or invalid for a protected route.

        // 1. Clear client-side authentication state.
        // We get direct access to setState to avoid circular dependencies
        // if authStore itself uses this axiosInstance for its actions.
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Session expired. Please login again.", // Optional error message
        });

        // 2. Redirect to login page, unless already there.
        // if (window.location.pathname !== "/login") {
        //   window.location.href = "/login";
        // }
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance as api };
