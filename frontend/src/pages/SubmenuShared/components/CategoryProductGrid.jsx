import { motion } from "framer-motion";
import { fadeUpItem, staggerContainer } from "../../../animations/variants";
import ProductTile from "../../Shop/components/ProductTile";

// Pattern: [normal][normal] → [wide full row] → [normal][normal] → [normal][normal] → [wide full row] ...
// Mỗi cycle 5 item: index % 5 === 2 là wide
function isWideItem(index) {
  return index % 5 === 2;
}

function EmptyState() {
  return (
    <div className="col-span-2 flex flex-col items-center gap-3 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f0ef] text-2xl">
        —
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
        Không có sản phẩm
      </p>
      <p className="max-w-[200px] text-xs leading-relaxed text-[#5c5b5b]">
        Thử xóa bộ lọc hoặc chọn tag khác
      </p>
    </div>
  );
}

export default function CategoryProductGrid({
  products,
  filterKey,
  total,
  hasMore,
  onLoadMore,
}) {
  const shown = products.length;
  const progress = total > 0 ? Math.min((shown / total) * 100, 100) : 0;

  return (
    <>
      <motion.div
        key={filterKey}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          products.map((product, index) => {
            const wide = isWideItem(index);
            return (
              <motion.div
                key={product.id}
                variants={fadeUpItem}
                className={wide ? "col-span-1 md:col-span-2" : "col-span-1"}
              >
                {/* className="col-span-2" triggers isLarge in ProductTile → aspect-[2/1] */}
                <ProductTile
                  product={product}
                  className={wide ? "col-span-2" : ""}
                />
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Progress + Load More */}
      {products.length > 0 && (
        <div className="mt-12 flex flex-col items-center gap-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#94a3b8]">
            {shown} / {total} SẢN PHẨM
          </p>

          <div className="relative h-px w-full max-w-sm bg-[#eae7e7]">
            <div
              className="absolute left-0 top-0 h-px bg-[#004be3] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            type="button"
            onClick={onLoadMore}
            disabled={!hasMore}
            className="rounded-full border-2 border-[#0f172a] bg-transparent px-10 py-4 font-heading text-sm font-extrabold uppercase tracking-widest text-[#0f172a] transition hover:border-[#004be3] hover:text-[#004be3] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {hasMore ? "LOAD MORE VIBEZ" : "ALL ITEMS LOADED"}
          </button>
        </div>
      )}
    </>
  );
}
