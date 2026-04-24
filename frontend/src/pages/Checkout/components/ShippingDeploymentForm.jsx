import { ChevronDown } from "lucide-react";
import { useMemo, useRef, useState } from "react";

export default function ShippingDeploymentForm({ cityOptions }) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const cityDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);

  const selectedCityData = useMemo(
    () => cityOptions.find((city) => city.value === selectedCity) || null,
    [cityOptions, selectedCity],
  );

  const districtOptions = selectedCityData?.districts || [];

  const toggleDropdown = (type) => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  const handleChooseCity = (city) => {
    setSelectedCity(city.value);
    setSelectedDistrict("");
    setOpenDropdown(null);
  };

  const handleChooseDistrict = (district) => {
    setSelectedDistrict(district);
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
        Shipping Deployment
      </h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Full Name
          </p>
          <input
            type="text"
            autoComplete="off"
            placeholder="Nguyen Van Velocity"
            className="h-14 w-full rounded-xl bg-[#f3f0ef] px-4 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Phone
          </p>
          <input
            type="tel"
            autoComplete="off"
            placeholder="+84 900 000 000"
            className="h-14 w-full rounded-xl bg-[#f3f0ef] px-4 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Email
          </p>
          <input
            type="email"
            autoComplete="off"
            placeholder="vibe@urban.vn"
            className="h-14 w-full rounded-xl bg-[#f3f0ef] px-4 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Province / City
          </p>
          <div
            ref={cityDropdownRef}
            className="relative"
            onBlur={(event) => handleBlurDropdown(event, cityDropdownRef)}
          >
            <button
              type="button"
              onClick={() => toggleDropdown("city")}
              className="flex h-14 w-full items-center rounded-xl bg-[#f3f0ef] px-4 pr-12 text-left"
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

            {openDropdown === "city" ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
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
            ) : null}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            District
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
              className="flex h-14 w-full items-center rounded-xl bg-[#f3f0ef] px-4 pr-12 text-left disabled:cursor-not-allowed disabled:opacity-70"
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

            {openDropdown === "district" && selectedCityData ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
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
            ) : null}
          </div>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5b5b]">
            Detailed Address
          </p>
          <textarea
            autoComplete="off"
            placeholder="Apartment, suite, unit, building, floor, etc."
            className="h-28 w-full resize-none rounded-xl bg-[#f3f0ef] px-4 py-4 text-base text-[#2f2f2e] outline-none placeholder:text-[#6b7280]/75"
          />
        </div>
      </div>
    </section>
  );
}
