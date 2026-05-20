export default function StoresSection() {
  const stores = [
    {
      id: "01",
      tag: "✦ flagship",
      tagColor: "bg-[#ff6b35] text-white",
      imgColor: "bg-[#ffdcce]",
      name: "solar. Saigon Flagship",
      address: "28 Tôn Đản, Q.04, TP. HCM",
      time: "T2-CN · 09:30 - 22:00",
      phone: "028 73 071 175",
    },
    {
      id: "02",
      tag: "✦ thủ đô",
      tagColor: "bg-[#004be3] text-white",
      imgColor: "bg-[#cce0ff]",
      name: "solar. Hanoi Centre",
      address: "B2-34, Tầng B2, 175 Nguyễn Thái Học, Đống Đa",
      time: "T2-CN · 10:00 - 22:00",
      phone: "024 73 071 175",
    },
    {
      id: "03",
      tag: "✦ biển",
      tagColor: "bg-[#c8e6c9] text-[#0f172a]",
      imgColor: "bg-[#e8f5e9]",
      name: "solar. Da Nang Beach",
      address: "218 Võ Nguyên Giáp, Phước Mỹ, Sơn Trà",
      time: "T2-CN · 09:00 - 22:30",
      phone: "0236 73 071 175",
    },
    {
      id: "04",
      tag: "✦ mới • 11.2026",
      tagColor: "bg-[#ffcdd2] text-[#0f172a]",
      imgColor: "bg-[#ffebee]",
      name: "solar. Hai Phong",
      address: "01 Lạch Tray, Lê Chân, Hải Phòng",
      time: "T2-CN · 09:30 - 22:00",
      phone: "0225 73 071 175",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12">
        <div>
          <div className="inline-block bg-[#004be3] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-6 rounded-full">
            04 - Cửa hàng
          </div>
          <h2 className="font-heading text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1] text-[#0f172a]">
            <span className="text-[#ff6b35] italic font-serif lowercase">Bốn</span> địa chỉ.<br />
            Mời bạn ghé thử.
          </h2>
        </div>
        <button className="bg-[#0f172a] text-white px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black transition self-start sm:self-auto">
          Xem trên bản đồ →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="border border-black/10 rounded-[2rem] p-4 flex flex-col sm:flex-row gap-6 hover:border-black/30 transition">
            {/* Store Image Placeholder */}
            <div className={`w-full sm:w-[200px] h-[200px] rounded-[1.5rem] relative overflow-hidden ${store.imgColor}`}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
              <div className="absolute top-3 left-3">
                <span className={`inline-block px-2 py-1 text-[8px] font-bold uppercase tracking-widest rounded-full ${store.tagColor}`}>
                  {store.tag}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                <p className="text-[8px] font-bold uppercase tracking-widest text-[#0f172a]/40">
                  STORE {store.id} / {store.name.toUpperCase()}
                </p>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="inline-block bg-[#0f172a] text-white px-2 py-0.5 text-[9px] font-bold rounded-full">
                  #{store.id}
                </span>
              </div>
            </div>

            {/* Store Details */}
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <h3 className="text-2xl font-extrabold text-[#0f172a] mb-1">{store.name}</h3>
                <p className="text-sm text-[#5c5b5b] mb-6">{store.address}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="bg-[#f3f0ef] px-3 py-2 rounded-xl flex-1 min-w-[140px]">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mb-0.5">Giờ mở</p>
                    <p className="text-xs font-bold text-[#0f172a]">{store.time}</p>
                  </div>
                  <div className="bg-[#f3f0ef] px-3 py-2 rounded-xl flex-1 min-w-[140px]">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#94a3b8] mb-0.5">Hotline</p>
                    <p className="text-xs font-bold text-[#0f172a]">{store.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <button className="bg-[#0f172a] text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition">
                  Chỉ đường →
                </button>
                <button className="bg-transparent border border-black/10 text-[#0f172a] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition">
                  Gọi điện
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
