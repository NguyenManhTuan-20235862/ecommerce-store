import { useState } from "react";
import { ChevronDown } from "lucide-react";

function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-heading text-sm font-extrabold uppercase tracking-widest text-[#0f172a]">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#5c5b5b] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-6">{children}</div>}
    </div>
  );
}

export default function ProductInfo({ material, careInstructions, sizeChart }) {
  const hasDetail = Boolean(material || careInstructions);
  const hasSizeChart =
    sizeChart?.headers?.length > 0 && sizeChart?.rows?.length > 0;

  if (!hasDetail && !hasSizeChart) return null;

  return (
    <div className="border-t border-black/10">
      {hasDetail && (
        <AccordionItem title="Chi tiết sản phẩm" defaultOpen>
          <div className="space-y-5 text-sm text-[#5c5b5b]">
            {material && (
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-[#2f2f2e]">
                  Chất liệu
                </p>
                <p className="leading-relaxed">{material}</p>
              </div>
            )}
            {careInstructions && (
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-[#2f2f2e]">
                  Hướng dẫn bảo quản
                </p>
                <p className="leading-relaxed">{careInstructions}</p>
              </div>
            )}
          </div>
        </AccordionItem>
      )}

      {hasSizeChart && (
        <AccordionItem title="Bảng size">
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10">
                    {sizeChart.headers.map((h, i) => (
                      <th
                        key={i}
                        className="pb-3 pr-8 text-left text-xs font-bold uppercase tracking-wider text-[#2f2f2e] last:pr-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {sizeChart.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`py-3 pr-8 last:pr-0 ${ci === 0 ? "font-bold text-[#0f172a]" : "text-[#5c5b5b]"}`}
                        >
                          {cell || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[#94a3b8]">
              * Số đo trên là số đo cơ thể. Nếu số đo nằm giữa 2 size, hãy chọn size lớn hơn.
            </p>
          </div>
        </AccordionItem>
      )}
    </div>
  );
}
