import axiosClient from "@/api/axiosClient";

export const getCollections = async () => {
  const res = await axiosClient.get("/collections", {
    params: {
      status: "active",
      limit: 6,
    },
  });

  return res.data?.data || [];
};

export const getCollectionById = async (id) => {
  const res = await axiosClient.get(`/collections/${id}`);
  return res.data?.data;
};