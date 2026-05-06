import { ChevronDown } from "lucide-react";
import { useMemo, useRef, useState } from "react";

// Danh sách tỉnh/thành phố Việt Nam
const cityOptions = [
  {
    value: "Hà Nội",
    label: "Hà Nội",
    districts: ["Ba Đình", "Hoàn Kiếm", "Đống Đa", "Cầu Giấy", "Hai Bà Trưng", "Hoàng Mai"],
  },
  {
    value: "TP. Hồ Chí Minh",
    label: "TP. Hồ Chí Minh",
    districts: ["Quận 1", "Quận 3", "Quận 5", "Quận Bình Thạnh", "TP. Thủ Đức", "Quận 7"],
  },
  {
    value: "Đà Nẵng",
    label: "Đà Nẵng",
    districts: ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu"],
  },
];

/**
 * Shipping Deployment Form Component
 * Form nhập thông tin giao hàng với validation
 */
export default function ShippingDeploymentForm({ register, errors, setValue, watch }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const cityDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);

  // Watch form values
  const selectedProvince = watch("province");
  const selectedDistrict = watch("district");

  // Tìm city data dựa trên province đã chọn
  const selectedCityData = useMemo(
    () => cityOptions.find((city) => city.value === selectedProvince) || null,
    [selectedProvince]
  );

  const districtOptions = selectedCityData?.districts || [];

  const toggleDropdown = (type) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  const handleChooseCity = (city) => {
    setValue("province", city.value, { shouldValidate: true });
    setValue("district", "", { shouldValidate: false }); // Reset district
    setOpenDropdown(null);
  };

  const handleChooseDistrict = (district) => {
    setValue("district", district, { shouldValidate: true });
    setOpenDropdown(null);
  };

  const handleBlurDropdown = (event, containerRef) => {
    const nextTarget = event.relatedTarget;
    if (containerRef.current?.contains(nextTarget)) {
      return;
    }
    setOpenDropdown(null);
  };

  return (
    <section className="space-y-8">
      <h1 className="font-heading text-[30px] font-extrabold italic uppercase leading-9 tracking-[-0.05em] text-[#2f2f2e]">
        Thông tin giao hàng
      </h1>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Họ và tên <span className="text-red-500">*</span>
          </p>
          <input
            type="text"
            {...register("receiverName")}
            placeholder="Nguyễn Văn A"
            className={`h-14 w-full rounded-xl bg-[#f3f0ef] px-4 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75 ${
              errors.receiverName ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.receiverName && (
            <p className="text-sm text-red-500">{errors.receiverName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Số điện thoại <span className="text-red-500">*</span>
          </p>
          <input
            type="tel"
            {...register("receiverPhone")}
            placeholder="0901234567"
            className={`h-14 w-full rounded-xl bg-[#f3f0ef] px-4 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75 ${
              errors.receiverPhone ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.receiverPhone && (
            <p className="text-sm text-red-500">{errors.receiverPhone.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Email <span className="text-red-500">*</span>
          </p>
          <input
            type="email"
            {...register("receiverEmail")}
            placeholder="email@example.com"
            className={`h-14 w-full rounded-xl bg-[#f3f0ef] px-4 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75 ${
              errors.receiverEmail ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.receiverEmail && (
            <p className="text-sm text-red-500">{errors.receiverEmail.message}</p>
          )}
        </div>

        {/* Province / City */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Tỉnh / Thành phố <span className="text-red-500">*</span>
          </p>
          <div
            ref={cityDropdownRef}
            className="relative"
            onBlur={(event) => handleBlurDropdown(event, cityDropdownRef)}
          >
            <button
              type="button"
              onClick={() => toggleDropdown("city")}
              className={`flex h-14 w-full items-center rounded-xl bg-[#f3f0ef] px-4 pr-12 text-left ${
                errors.province ? "ring-2 ring-red-500" : ""
              }`}
            >
              <span
                className={`text-base ${selectedCityData ? "text-[#2f2f2e]" : "text-[#6b7280]/75"}`}
              >
                {selectedCityData?.label || "Chọn tỉnh / thành phố"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => toggleDropdown("city")}
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6b7280]"
              aria-label="Mở danh sách tỉnh thành"
            >
              <ChevronDown
                className={`h-5 w-5 transition ${openDropdown === "city" ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            {openDropdown === "city" && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-60 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
                {cityOptions.map((city) => (
                  <button
                    key={city.value}
                    type="button"
                    onClick={() => handleChooseCity(city)}
                    className="block w-full px-4 py-3 text-left text-sm text-[#2f2f2e] transition hover:bg-[#f3f0ef]"
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.province && (
            <p className="text-sm text-red-500">{errors.province.message}</p>
          )}
        </div>

        {/* District */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Quận / Huyện <span className="text-red-500">*</span>
          </p>
          <div
            ref={districtDropdownRef}
            className="relative"
            onBlur={(event) => handleBlurDropdown(event, districtDropdownRef)}
          >
            <button
              type="button"
              disabled={!selectedCityData}
              onClick={() => toggleDropdown("district")}
              className={`flex h-14 w-full items-center rounded-xl bg-[#f3f0ef] px-4 pr-12 text-left disabled:cursor-not-allowed disabled:opacity-70 ${
                errors.district ? "ring-2 ring-red-500" : ""
              }`}
            >
              <span
                className={`text-base ${selectedDistrict ? "text-[#2f2f2e]" : "text-[#6b7280]/75"}`}
              >
                {selectedDistrict || "Chọn quận / huyện"}
              </span>
            </button>
            <button
              type="button"
              disabled={!selectedCityData}
              onClick={() => toggleDropdown("district")}
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#6b7280] disabled:cursor-not-allowed"
              aria-label="Mở danh sách quận huyện"
            >
              <ChevronDown
                className={`h-5 w-5 transition ${openDropdown === "district" ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            {openDropdown === "district" && selectedCityData && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-60 overflow-y-auto rounded-xl border border-black/10 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
                {districtOptions.map((district) => (
                  <button
                    key={district}
                    type="button"
                    onClick={() => handleChooseDistrict(district)}
                    className="block w-full px-4 py-3 text-left text-sm text-[#2f2f2e] transition hover:bg-[#f3f0ef]"
                  >
                    {district}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.district && (
            <p className="text-sm text-red-500">{errors.district.message}</p>
          )}
        </div>

        {/* Ward */}
        <div className="space-y-2 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Phường / Xã <span className="text-red-500">*</span>
          </p>
          <input
            type="text"
            {...register("ward")}
            placeholder="Phường 1"
            className={`h-14 w-full rounded-xl bg-[#f3f0ef] px-4 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75 ${
              errors.ward ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.ward && (
            <p className="text-sm text-red-500">{errors.ward.message}</p>
          )}
        </div>

        {/* Detailed Address */}
        <div className="space-y-2 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Địa chỉ chi tiết <span className="text-red-500">*</span>
          </p>
          <textarea
            {...register("detail")}
            placeholder="Số nhà, tên đường, tòa nhà, v.v."
            className={`h-28 w-full resize-none rounded-xl bg-[#f3f0ef] px-4 py-4 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75 ${
              errors.detail ? "ring-2 ring-red-500" : ""
            }`}
          />
          {errors.detail && (
            <p className="text-sm text-red-500">{errors.detail.message}</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-4 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Phương thức thanh toán <span className="text-red-500">*</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {["COD", "VNPAY", "MOMO"].map((method) => (
              <label
                key={method}
                className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#f3f0ef] p-4 transition hover:bg-[#e8e5e4]"
              >
                <input
                  type="radio"
                  {...register("paymentMethod")}
                  value={method}
                  className="h-5 w-5 accent-[#004be3]"
                />
                <span className="text-sm font-semibold uppercase text-[#2f2f2e]">
                  {method}
                </span>
              </label>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
