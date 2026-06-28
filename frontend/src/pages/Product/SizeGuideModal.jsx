import { AnimatePresence, motion } from "framer-motion";
import { Ruler, X } from "lucide-react";
import { useState } from "react";

const CLOTHING_GUIDE = [
  { size: "S",   minH: 155, maxH: 165, minW: 45, maxW: 57 },
  { size: "M",   minH: 160, maxH: 170, minW: 55, maxW: 65 },
  { size: "L",   minH: 165, maxH: 175, minW: 62, maxW: 72 },
  { size: "XL",  minH: 170, maxH: 180, minW: 68, maxW: 80 },
  { size: "XXL", minH: 175, maxH: 190, minW: 76, maxW: 95 },
];

const DEFAULT_CLOTHING_CHART = {
  headers: ["", "S", "M", "L", "XL", "XXL"],
  rows: [
    ["Chiều cao (cm)", "155-165", "160-170", "165-175", "170-180", "175-190"],
    ["Cân nặng (kg)",  "45-57",  "55-65",  "62-72",  "68-80",  "76-95"],
    ["Dài thân trước", "65",     "67",     "69",     "71",     "73"],
    ["1/2 ngang ngực", "47",     "49",     "51",     "53",     "55"],
    ["1/2 ngang gấu",  "45",     "47",     "49",     "51",     "53"],
  ],
};

const DEFAULT_SHOE_CHART = {
  headers: ["EU", "38", "39", "40", "41", "42", "43", "44"],
  rows: [
    ["Bàn chân (cm)", "24", "24.5", "25", "25.5", "26.5", "27", "27.5"],
  ],
};

function calculateClothingSize(height, weight) {
  const h = Number(height);
  const w = Number(weight);
  if (!h || !w || h < 100 || w < 20) return null;

  const perfect = CLOTHING_GUIDE.find(
    (g) => h >= g.minH && h <= g.maxH && w >= g.minW && w <= g.maxW,
  );
  if (perfect) return perfect.size;

  // Ưu tiên theo cân nặng cho quần áo nam
  const byWeight = CLOTHING_GUIDE.find((g) => w >= g.minW && w <= g.maxW);
  if (byWeight) return byWeight.size;

  const byHeight = CLOTHING_GUIDE.find((g) => h >= g.minH && h <= g.maxH);
  if (byHeight) return byHeight.size;

  if (w < CLOTHING_GUIDE[0].minW) return CLOTHING_GUIDE[0].size;
  if (w > CLOTHING_GUIDE[CLOTHING_GUIDE.length - 1].maxW)
    return CLOTHING_GUIDE[CLOTHING_GUIDE.length - 1].size;

  return null;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  categorySlug,
  sizes = [],
  sizeChart,
}) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [recommended, setRecommended] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const isShoe = categorySlug === "giay";

  const chart =
    sizeChart?.headers?.length > 0
      ? sizeChart
      : isShoe
        ? DEFAULT_SHOE_CHART
        : DEFAULT_CLOTHING_CHART;

  const handleCalculate = () => {
    const result = calculateClothingSize(height, weight);
    setRecommended(result);
    setHasCalculated(true);
  };

  const handleClose = () => {
    setHeight("");
    setWeight("");
    setRecommended(null);
    setHasCalculated(false);
    onClose();
  };

  // Tìm index cột được gợi ý trong header để highlight
  const recommendedColIndex =
    recommended
      ? chart.headers.findIndex(
          (h) => h.toUpperCase() === recommended.toUpperCase(),
        )
      : -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={handleClose}
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <Ruler className="h-5 w-5 text-[#004be3]" />
                <h2 className="text-lg font-bold text-[#2f2f2e]">
                  Hướng dẫn chọn size
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f0ef] text-[#5c5b5b] transition hover:bg-[#e4e2e1] hover:text-[#2f2f2e]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Section 1 — Calculator (chỉ hiện cho quần áo) */}
              {!isShoe && (
                <div className="mb-8 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[#5c5b5b]">
                        Chiều cao
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="168"
                          min={140}
                          max={210}
                          className="w-full rounded-xl border-2 border-black/10 bg-[#f9f6f5] px-4 py-3 pr-10 text-sm font-semibold text-[#2f2f2e] outline-none transition focus:border-[#004be3]"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94a3b8]">
                          cm
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[#5c5b5b]">
                        Cân nặng
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="65"
                          min={30}
                          max={150}
                          className="w-full rounded-xl border-2 border-black/10 bg-[#f9f6f5] px-4 py-3 pr-10 text-sm font-semibold text-[#2f2f2e] outline-none transition focus:border-[#004be3]"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94a3b8]">
                          kg
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCalculate}
                    disabled={!height || !weight}
                    className="w-full rounded-xl bg-[#0f172a] py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Tính toán
                  </button>

                  {hasCalculated && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl p-4 ${
                        recommended
                          ? "border border-[#004be3]/20 bg-[#004be3]/5"
                          : "border border-orange-200 bg-orange-50"
                      }`}
                    >
                      {recommended ? (
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#004be3] font-heading text-xl font-extrabold text-white">
                            {recommended}
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#004be3]">
                              Gợi ý size phù hợp
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[#5c5b5b]">
                              {!sizes.includes(recommended)
                                ? "Sản phẩm này không có size này — hãy tham khảo bảng đo bên dưới."
                                : "Xem bảng đo bên dưới để chắc chắn hơn."}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-orange-700">
                          Không tìm được size phù hợp. Vui lòng tham khảo bảng
                          đo bên dưới.
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Section 2 — Bảng thông số */}
              <div>
                <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-[#5c5b5b]">
                  {isShoe ? "Bảng size giày" : "Thông số sản phẩm"}
                </h3>
                <p className="mb-4 text-[11px] leading-relaxed text-[#94a3b8]">
                  {isShoe
                    ? "* Đo từ gót đến đầu ngón chân dài nhất khi đứng thẳng"
                    : "* Thông số sản phẩm khi trải phẳng, có thể chênh lệch so với số đo cơ thể do độ co giãn vải."}
                </p>

                <div className="overflow-x-auto rounded-xl border border-black/10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-black/10 bg-[#f9f6f5]">
                        {chart.headers.map((h, i) => (
                          <th
                            key={i}
                            className={`whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${
                              i === 0
                                ? "text-[#5c5b5b]"
                                : i === recommendedColIndex
                                  ? "bg-[#004be3]/10 text-[#004be3]"
                                  : "text-[#2f2f2e]"
                            }`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {chart.rows.map((row, ri) => (
                        <tr
                          key={ri}
                          className={ri % 2 === 0 ? "bg-white" : "bg-[#f9f6f5]/50"}
                        >
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className={`whitespace-nowrap px-4 py-3 text-sm ${
                                ci === 0
                                  ? "font-semibold text-[#2f2f2e]"
                                  : ci === recommendedColIndex
                                    ? "bg-[#004be3]/10 font-bold text-[#004be3]"
                                    : "text-[#5c5b5b]"
                              }`}
                            >
                              {cell || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {isShoe && (
                  <div className="mt-5 rounded-xl border border-black/10 bg-[#f9f6f5] p-4">
                    <p className="text-xs leading-relaxed text-[#5c5b5b]">
                      <span className="font-bold text-[#2f2f2e]">
                        Mẹo chọn size:
                      </span>{" "}
                      Nếu size bàn chân nằm giữa 2 size, hãy chọn size lớn hơn
                      để đảm bảo sự thoải mái.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
