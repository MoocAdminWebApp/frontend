import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";
import { ApiResponseResult } from "../../types/types";

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

const instance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL + "/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshTokenPromise: Promise<void> | null = null;

const refreshToken = async () => {
  let refreshTokenValue = localStorage.getItem("refreshToken");
  if (!refreshTokenValue) {
    window.location.href = "/login";
  }
  const response: ApiResponseResult<RefreshTokenResponse> = await instance.post(
    "/auth/RefreshToken",
    { refreshToken: refreshTokenValue }
  );
  if (response.isSuccess) {
    // Update stored tokens
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
  } else {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }
};

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    //Usually, there is no need to handle errors here, unless you want to do some general error handling before sending the request
    //However, please note that errors here are usually caused by configuration issues (such as invalid URLs), rather than network response errors
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.isSuccess) {
      return response.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401 && !originalRequest._retry) {
        if (!isRefreshing) {
          isRefreshing = true;

          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";

          // refreshTokenPromise = refreshToken().finally(() => {
          //   isRefreshing = false;
          // });

          // try {
          //   await refreshTokenPromise;
          //   //Reset the token and retry the request
          //   originalRequest.headers[
          //     "Authorization"
          //   ] = `Bearer ${localStorage.getItem("token")}`;
          //   originalRequest._retry = true;

          //   return instance(originalRequest);
          // } catch (err) {
          //   // Failed to refresh token, user  need to log in again
          //   return Promise.reject(err);
          // }
        } else {
          // If the token is already being refreshed,
          // wait for the refresh to complete and retry the request
          return refreshTokenPromise!.then(() => {
            originalRequest.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
            originalRequest._retry = true;

            return instance(originalRequest);
          });
        }
      } else if (status === 403) {
        toast.error("Forbidden: You do not have permission to access this resource.");
      } else {
        let repData = data as ApiResponseResult;
        // let message: string | null = null;
        // if (repData) {
        //   message = repData.message;
        // }
        // if (status === 400) {
        //   toast.error(`Bad Request: ${message || "Invalid request"}`);
        // } else if (status === 400) {
        //   toast.error("Server Error: Please try again later.");
        // } else {
        //   toast.error(`Error: ${message || "An error occurred"}`);
        // }
        if (repData) {
          return repData;
        } else {
          repData = {
            isSuccess: false,
            status: 500,
            message: "An error occurred",
            time: new Date(),
            data: null,
          };
          return repData;
        }
      }
    } else if (error.request) {
      //The request has been sent, but no response has been received
      toast.error("Network Error: Please check your internet connection.");
    } else {
      //Other errors
      toast.error("Error: An unexpected error occurred.");
    }
    let repData = {
      isSuccess: false,
      status: 500,
      message: "An error occurred",
      time: new Date(),
      data: null,
    };
    //return Promise.reject(repData);
    return Promise.resolve(repData);
  }
);

export default instance;

/**
 *  Get Request
 * @param url Request Address
 * @param params  Query parameters
 * @param config  Other Axios configurations
 * @returns
 */
export const get = <T>(
  url: string,
  params?: Record<string, any>, //Query parameters
  config?: AxiosRequestConfig //Other Axios configurations
): Promise<ApiResponseResult<T>> => {
  return instance.get(url, { ...config, params });
};

/**
 * Post  Request
 * @param url  Request Address
 * @param data Post Data
 * @param config Other Axios configurations
 * @returns
 */
export const post = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponseResult<T>> => {
  return instance.post(url, data, config);
};

/**
 *
 * @param url Request Address
 * @param data put Data
 * @param config Other Axios configurations
 * @returns
 */
export const put = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponseResult<T>> => {
  return instance.put(url, data, config);
};

/**
 * DELETE Request
 * @param url  Request Address
 * @param data
 * @param config Other Axios configurations
 * @returns
 */
export const del = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponseResult<T>> => {
  return instance.delete(url, { ...config, data });
};
