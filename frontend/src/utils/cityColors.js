export const CITY_COLORS = {
  SG: {
    tagColor: "bg-[#ff6b35] text-white",
    imgColor: "bg-[#ffdcce]",
    dotColor: "bg-[#ff6b35]",
    dotPatternColor: "#ff6b35",
  },
  HN: {
    tagColor: "bg-[#004be3] text-white",
    imgColor: "bg-[#cce0ff]",
    dotColor: "bg-[#004be3]",
    dotPatternColor: "#004be3",
  },
  ĐN: {
    tagColor: "bg-[#c8e6c9] text-[#0f172a]",
    imgColor: "bg-[#e8f5e9]",
    dotColor: "bg-[#c8e6c9]",
    dotPatternColor: "#4caf50",
  },
  HP: {
    tagColor: "bg-[#ffcdd2] text-[#0f172a]",
    imgColor: "bg-[#ffebee]",
    dotColor: "bg-[#ffcdd2]",
    dotPatternColor: "#e57373",
  },
};

export const getCityColors = (cityKey) =>
  CITY_COLORS[cityKey] ?? CITY_COLORS["SG"];
