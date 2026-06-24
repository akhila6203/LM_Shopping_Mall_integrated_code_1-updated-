import axiosClient from "@/api/axiosClient";
export const getBanners = async () => {
  const res = await axiosClient.get("/banners");
  return res.data.data || [];
};
