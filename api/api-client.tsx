import Axios, { InternalAxiosRequestConfig } from "axios";
import { Redirect } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = "application/json";
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: process.env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    Toast.show({
      type: "error",
      text1: "Error",
      text2: message,
    });

    if (error.response?.status === 401) {
      return <Redirect href="/guest" />;
    }

    return Promise.reject(error);
  }
);
