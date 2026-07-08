import axiosClient from "@/api/axiosClient";


export const getPublicSettings = async () => {
  const res = await axiosClient.get("/settings/public");
  return res.data.data || {};
};

export const getCurrentStore = async () => {
  const res = await axiosClient.get("/stores/current");
  return res.data.data;
};

export const getStoreInformation = async () => {
  const res = await axiosClient.get("/settings/store-information");
  return res.data.data || {};
};

export const getStoreSettings = async () => {
  const res = await axiosClient.get("/settings/public");
  return res.data.data;
};



