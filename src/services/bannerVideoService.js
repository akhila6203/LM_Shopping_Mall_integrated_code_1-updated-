import axiosClient from "@/api/axiosClient";

export const getBannerVideos = async () => {
  const res = await axiosClient.get("/banner-videos");
  return res.data?.data || [];
};
