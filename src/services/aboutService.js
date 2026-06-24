import axiosClient from "@/api/axiosClient";

export const getAboutUs = async () => {
  const res = await axiosClient.get("/content/about");
  return res.data.data;
};