import axiosClient from "@/api/axiosClient";

export const sendOtp = async (data) => {
  const res = await axiosClient.post("/storefront/auth/send-otp", data);
  return res.data;
};

export const verifyOtp = async (data) => {
  const res = await axiosClient.post("/storefront/auth/verify-otp", data);
  return res.data;
};

export const registerCustomer = async (data) => {
  const res = await axiosClient.post("/storefront/auth/register", data);
  return res.data;
};

export const loginCustomer = async (data) => {
  const res = await axiosClient.post("/storefront/auth/login", data);
  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await axiosClient.post("/storefront/auth/forgot-password", data);
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await axiosClient.post("/storefront/auth/reset-password", data);
  return res.data;
};

export const logoutCustomer = async () => {
  const res = await axiosClient.post("/storefront/auth/logout");
  return res.data;
};

export const getCustomerProfile = async () => {
  const res = await axiosClient.get("/storefront/auth/profile");
  return res.data;
};

export const updateCustomerProfile = async (data) => {
  const res = await axiosClient.put("/storefront/auth/profile", data);
  return res.data;
};

export const updateCustomerAvatar = async (file, profileFields = {}) => {
  const formData = new FormData();
  formData.append("avatar", file);
  Object.entries(profileFields).forEach(([key, value]) => {
    if (value != null && value !== "") {
      formData.append(key, value);
    }
  });
  const res = await axiosClient.put("/storefront/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
