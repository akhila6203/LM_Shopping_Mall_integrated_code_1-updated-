
import axiosClient from "@/api/axiosClient";

export const getStoreInformation = async () => {
  const res = await axiosClient.get("/settings/store-information");
  return res.data?.data || res.data;
};

export const getContactPage = async () => {
  const res = await axiosClient.get("/settings/contact-page");
  return res.data?.data || res.data;
};