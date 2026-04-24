import { useMemo, useState } from "react";
import { useCartStore } from "../../store/cartStore";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import VibeLoyaltyCard from "./VibeLoyaltyCard";
import { figmaItems, promoBadge } from "./cartConstants";
import { mapStoreItem } from "./cartUtils";

export default function Cart() {
  const {
    items,
    updateItemQuantity,
    removeItem,
    couponCode,
    setCouponCode,
    shippingFee,
  } = useCartStore();

  const hasStoreItems = items.length > 0;
  const [demoItems, setDemoItems] = useState(figmaItems);

  // Determine which items to display (store items or demo items)
  const displayItems = useMemo(
    () => (hasStoreItems ? items.map(mapStoreItem) : demoItems),
    [hasStoreItems, items, demoItems],
  );

  // Calculate totals
  const subtotal = useMemo(
    () =>
      displayItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [displayItems],
  );

  const shipping = hasStoreItems ? Number(shippingFee || 0) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Handle quantity change
  const handleQtyChange = (productId, nextQty) => {
    const safeQty = Math.max(1, nextQty);

    if (hasStoreItems) {
      updateItemQuantity(productId, safeQty);
      return;
    }

    setDemoItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: safeQty } : item,
      ),
    );
  };

  // Handle item removal
  const handleRemove = (productId) => {
    if (hasStoreItems) {
      removeItem(productId);
      return;
    }

    setDemoItems((prev) => prev.filter((item) => item.productId !== productId));
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
            {displayItems.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onQuantityChange={handleQtyChange}
                onRemove={handleRemove}
              />
            ))}

            {displayItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#dfdcdc] bg-white p-10 text-center">
                <p className="font-heading text-2xl font-bold uppercase tracking-[-0.03em] text-[#2f2f2e]">
                  Cart Is Empty
                </p>
                <p className="mt-2 text-sm text-[#5c5b5b]">
                  Add some style payloads from Shop to continue checkout.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Sidebar: Summary & Loyalty */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pt-8 lg:pr-2">
          <div className="space-y-8">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              couponCode={couponCode}
              onCouponChange={setCouponCode}
            />

            <VibeLoyaltyCard promoBadge={promoBadge} />
          </div>
        </aside>
      </div>
    </section>
  );
}
