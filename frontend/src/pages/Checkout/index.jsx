import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import CheckoutProgress from "./components/CheckoutProgress";
import DeliveryProtocol from "./components/DeliveryProtocol";
import ShippingDeploymentForm from "./components/ShippingDeploymentForm";
import TransactionInterface from "./components/TransactionInterface";
import VelocityManifest from "./components/VelocityManifest";
import {
  cityOptions,
  formatVnd,
  manifestItems,
  paymentMethods,
  shippingMethods,
  subtotal,
  tax,
} from "./constants";

export default function Checkout() {
  const [selectedShipping, setSelectedShipping] = useState("urban-pulse");
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const shippingFee =
    shippingMethods.find((method) => method.value === selectedShipping)?.fee ||
    0;
  const total = subtotal + shippingFee + tax;

  return (
    <section className="bg-[#f9f6f5] px-4 pb-10 pt-6 sm:px-6 lg:px-6 lg:pb-20 lg:pt-10">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <div className="flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#2f2f2e] transition hover:border-[#004be3]/30 hover:text-[#004be3]"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại giỏ hàng
          </Link>
        </div>

        <CheckoutProgress />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-12 lg:col-span-7">
            <ShippingDeploymentForm cityOptions={cityOptions} />

            <DeliveryProtocol
              shippingMethods={shippingMethods}
              selectedShipping={selectedShipping}
              onSelectShipping={setSelectedShipping}
              formatVnd={formatVnd}
            />

            <TransactionInterface
              paymentMethods={paymentMethods}
              selectedPayment={selectedPayment}
              onSelectPayment={setSelectedPayment}
            />
          </div>

          <VelocityManifest
            manifestItems={manifestItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            tax={tax}
            total={total}
            formatVnd={formatVnd}
          />
        </div>
      </div>
    </section>
  );
}
