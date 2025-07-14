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
  assceToken: string;
  refreshToken: string;
}

const instance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL + "/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshTokenPromise: Promise<void> | null = null;

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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

        } else {
          // If the token is already being refreshed,
          // wait for the refresh to complete and retry the request
          return refreshTokenPromise!.then(() => {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${localStorage.getItem("token")}`;
            originalRequest._retry = true;

            return instance(originalRequest);
          });
        }
      } else if (status === 403) {
        toast.error(
          "Forbidden: You do not have permission to access this resource."
        );
      } else {
        let repData = data as ApiResponseResult;
  
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
