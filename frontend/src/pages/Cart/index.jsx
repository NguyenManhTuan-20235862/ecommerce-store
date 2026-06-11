import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { couponService } from "../../services/coupon.service";
import { saleConfigService } from "../../services/saleConfig.service";
import * as cartService from "../../services/cartService";
import { useCartStore } from "../../store/cartStore";
import { computeTierDiscount, getApplicableTier, getNextTier } from "../../utils/tierUtils";
import CartItem from "./CartItem";
import ComboCartGroup from "./ComboCartGroup";
import CartSummary from "./CartSummary";
import VibeLoyaltyCard from "./VibeLoyaltyCard";
import { promoBadge } from "./cartConstants";
import { mapStoreItem } from "./cartUtils";

export default function Cart() {
  const {
    items,
    fetchCart,
    updateItemQuantity,
    removeItem,
    couponCode,
    setCouponCode,
    couponDiscount,
    setCouponDiscount,
  } = useCartStore();

  const hasStoreItems = items.length > 0;
  const [couponLoading, setCouponLoading] = useState(false);
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    fetchCart();
    saleConfigService.getTiers()
      .then((res) => setTiers(res.data.data ?? []))
      .catch(() => {});
  }, []);

  const displayItems = useMemo(
    () => items.map(mapStoreItem),
    [items],
  );

  // Tách items thường và nhóm combo
  const { soloItems, comboGroups } = useMemo(() => {
    const solo = [];
    const groupMap = new Map();
    for (const item of displayItems) {
      if (!item.comboGroupId) {
        solo.push(item);
      } else {
        if (!groupMap.has(item.comboGroupId)) {
          groupMap.set(item.comboGroupId, {
            comboGroupId: item.comboGroupId,
            comboName:    item.comboName ?? "Combo",
            items:        [],
          });
        }
        groupMap.get(item.comboGroupId).items.push(item);
      }
    }
    return { soloItems: solo, comboGroups: [...groupMap.values()] };
  }, [displayItems]);

  // Calculate totals
  const subtotal = useMemo(
    () =>
      displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [displayItems],
  );

  // Phí ship khớp với backend: miễn phí nếu >= 500k, ngược lại 30k
  const shipping = hasStoreItems ? (subtotal >= 500000 ? 0 : 30000) : 0;

  // Tier discount — chỉ tính khi có real items
  const activeTier   = useMemo(() => hasStoreItems ? getApplicableTier(subtotal, tiers) : null, [subtotal, tiers, hasStoreItems]);
  const tierDiscount = useMemo(() => hasStoreItems ? computeTierDiscount(subtotal, tiers) : 0, [subtotal, tiers, hasStoreItems]);
  const nextTier     = useMemo(() => hasStoreItems ? getNextTier(subtotal, tiers) : null, [subtotal, tiers, hasStoreItems]);

  const total = subtotal - couponDiscount - tierDiscount + shipping;

  // Handle quantity change
  const handleQtyChange = (productId, nextQty) => {
    const safeQty = Math.max(1, nextQty);
    updateItemQuantity(productId, safeQty);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode?.trim()) return;
    setCouponLoading(true);
    try {
      const res = await couponService.validate(couponCode.trim(), subtotal);
      setCouponDiscount(res.data.discountAmount);
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (err) {
      setCouponDiscount(0);
      setCouponCode("");
      toast.error(err.response?.data?.message || "Mã không hợp lệ");
    } finally {
      setCouponLoading(false);
    }
  };

  // Handle item removal
  const handleRemove = (productId) => {
    removeItem(productId);
  };

  // Xóa toàn bộ một combo group
  const handleRemoveCombo = async (comboGroupId) => {
    if (!hasStoreItems) return;
    const groupItems = displayItems.filter((i) => i.comboGroupId === comboGroupId);
    for (const item of groupItems) {
      try {
        await cartService.removeItemAPI(item.cartItemId);
      } catch {}
    }
    useCartStore.getState().fetchCart();
  };

  return (
    <section className="bg-[#f9f6f5] px-4 pb-10 pt-8 sm:px-6 lg:px-6 lg:pb-20 lg:pt-24">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Cart Items Section */}
        <div className="lg:col-span-8">
          <div className="space-y-2">
            <h1 className="font-heading text-4xl font-extrabold uppercase tracking-[-0.05em] text-[#2f2f2e] sm:text-5xl">
              MY KINETIC <span className="italic text-[#004be3]">PULSE</span>
            </h1>
            <p className="text-sm uppercase tracking-[0.08em] text-[#5c5b5b] sm:text-base">
              {displayItems.length} STYLES READY FOR DEPLOYMENT
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {/* Combo groups */}
            {comboGroups.map((group) => (
              <ComboCartGroup
                key={group.comboGroupId}
                group={group}
                onQuantityChange={handleQtyChange}
                onRemove={handleRemove}
                onRemoveGroup={handleRemoveCombo}
              />
            ))}

            {/* Items thường */}
            {soloItems.map((item) => (
              <CartItem
                key={item.cartItemId ?? item.productId}
                item={item}
                onQuantityChange={handleQtyChange}
                onRemove={handleRemove}
              />
            ))}

            {displayItems.length === 0 && (
              <div className="rounded-xl border border-dashed border-[#dfdcdc] bg-white p-10 text-center">
                <p className="font-heading text-2xl font-bold uppercase tracking-[-0.03em] text-[#2f2f2e]">
                  Cart Is Empty
                </p>
                <p className="mt-2 text-sm text-[#5c5b5b]">
                  Add some style payloads from Shop to continue checkout.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Summary & Loyalty */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pt-8 lg:pr-2">
          <div className="space-y-8">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              couponCode={couponCode}
              onCouponChange={(val) => {
                setCouponCode(val);
                setCouponDiscount(0);
              }}
              onApplyCoupon={handleApplyCoupon}
              couponDiscount={couponDiscount}
              couponLoading={couponLoading}
              tierDiscount={tierDiscount}
              tierLabel={activeTier?.label ?? ""}
              nextTier={nextTier}
              subtotalForTier={subtotal}
            />

            <VibeLoyaltyCard promoBadge={promoBadge} />
          </div>
        </aside>
      </div>
    </section>
  );
}
