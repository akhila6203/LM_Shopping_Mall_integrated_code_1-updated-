import axiosClient from "@/api/axiosClient";

export const getContentPage = async (pageKey) => {
  const res = await axiosClient.get(`/content/${pageKey}`);
  return res.data.data;
};
