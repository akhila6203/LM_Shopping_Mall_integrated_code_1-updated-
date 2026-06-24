import axiosClient from "@/api/axiosClient";

export const getCategories = async (params = {}) => {
  const res = await axiosClient.get("/categories", { params });
  return res.data.data || [];
};

export const getAllCategories = async () => {
  const res = await axiosClient.get("/categories/all");
  return res.data.data || [];
};

export const getCategoryHierarchy = async () => {
  const res = await axiosClient.get("/categories/hierarchy");
  return res.data.data || [];
};

export const getSubCategories = async (mainId = "all", params = {}) => {
  const res = await axiosClient.get(`/categories/${mainId}/sub`, { params });
  return res.data.data || [];
};

export const getChildCategories = async (subId = "all", params = {}) => {
  const res = await axiosClient.get(`/categories/sub/${subId}/child`, { params });
  return res.data.data || [];
};

// import axiosClient from "@/api/axiosClient";

// export const getCategories = async () => {
//   const res = await axiosClient.get("/categories");
//   return res.data.data || [];
// };

// export const getAllCategories = async () => {
//   const res = await axiosClient.get("/categories/all");
//   return res.data.data || [];
// };

// export const getCategoryHierarchy = async () => {
//   const res = await axiosClient.get("/categories/hierarchy");
//   return res.data.data || [];
// };

// export const getSubCategories = async (mainId = "all") => {
//   const res = await axiosClient.get(`/categories/${mainId}/sub`);
//   return res.data.data || [];
// };

// export const getChildCategories = async (subId = "all") => {
//   const res = await axiosClient.get(`/categories/sub/${subId}/child`);
//   return res.data.data || [];
// };
