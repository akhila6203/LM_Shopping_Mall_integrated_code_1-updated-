import axiosClient from "@/api/axiosClient";

export const getStoreInformation = async () => {
  const res = await axiosClient.get("/settings/store-information");
  return res.data?.data || res.data;
};

// export const getContactPage = async () => {
//   const res = await axiosClient.get("/settings/contact-page");
//   return res.data?.data || res.data;
// };
export const getContactPage = async () => {
  const res = await axiosClient.get("/content/contact");
  return res.data?.data || res.data;
};

const HOUR_KEYS = [
  "working_hours",
  "store_hours",
  "business_hours",
  "opening_hours",
  "hours",
  "supportHours",
  "support_hours",
];

const parseHoursValue = (value) => {
  if (!value) return [];

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((row) => {
        const colonIndex = row.indexOf(":");
        if (colonIndex === -1) {
          return { day: row.trim(), hours: "" };
        }
        return {
          day: row.slice(0, colonIndex).trim(),
          hours: row.slice(colonIndex + 1).trim(),
        };
      })
      .filter((row) => row.day);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          const colonIndex = item.indexOf(":");
          if (colonIndex === -1) return { day: item.trim(), hours: "" };
          return {
            day: item.slice(0, colonIndex).trim(),
            hours: item.slice(colonIndex + 1).trim(),
          };
        }
        if (item && typeof item === "object") {
          return {
            day: item.day || item.label || item.title || "",
            hours: item.hours || item.time || item.value || "",
          };
        }
        return null;
      })
      .filter((row) => row?.day);
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([day, hours]) => ({
        day: String(day).trim(),
        hours: String(hours ?? "").trim(),
      }))
      .filter((row) => row.day);
  }

  return [];
};


export const extractWorkingHours = (storeData = {}, contactData = {}) => {
  const contactContent =
    typeof contactData?.content === "string"
      ? (() => {
          try {
            return JSON.parse(contactData.content);
          } catch {
            return {};
          }
        })()
      : contactData?.content || {};

  const storeContent =
    typeof storeData?.content === "string"
      ? (() => {
          try {
            return JSON.parse(storeData.content);
          } catch {
            return {};
          }
        })()
      : storeData?.content || {};

  const sources = [
    contactContent,
    contactData,
    storeData,
    contactData?.contact?.content,
    storeData?.contact?.content,
    storeContent,
  ];

  for (const source of sources) {
    if (!source || typeof source !== "object") continue;

    for (const key of HOUR_KEYS) {
      const parsed = parseHoursValue(source[key]);
      if (parsed.length > 0) return parsed;
    }
  }

  return [];
};
// export const extractWorkingHours = (storeData = {}, contactData = {}) => {
//   const sources = [
//     contactData,
//     storeData,
//     contactData?.contact?.content,
//     contactData?.content,
//     storeData?.contact?.content,
//     storeData?.content,
//   ];

//   for (const source of sources) {
//     if (!source || typeof source !== "object") continue;

//     for (const key of HOUR_KEYS) {
//       const parsed = parseHoursValue(source[key]);
//       if (parsed.length > 0) return parsed;
//     }
//   }

//   return [];
// };