export default function TeamSection() {
  const team = [
    { id: 1, name: "Tên thành viên", role: "Head of Make" },
    { id: 2, name: "Tên thành viên", role: "Creative Director" },
    { id: 3, name: "Tên thành viên", role: "Workshop Lead" },
    { id: 4, name: "Tên thành viên", role: "Retail · North" },
  ];

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 border-t border-black/10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12">
        <div>
          <div className="inline-block border border-black/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-6 rounded-full">
            06 - Đội ngũ
          </div>
          <h2 className="font-heading text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1] text-[#0f172a]">
            Mười bốn người làm nên bộ này.
          </h2>
        </div>
        <button className="bg-transparent border border-black/10 text-[#0f172a] px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-white transition self-start sm:self-auto">
          Đang tuyển - 03 vị trí
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <div key={member.id} className="group cursor-pointer">
            <div className="w-full aspect-[3/4] bg-[#e2e8f0] rounded-[2rem] mb-6 relative overflow-hidden">
              {/* Pattern */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                  PORTRAIT {member.id.toString().padStart(2, '0')}
                </p>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition duration-300"></div>
            </div>
            <h3 className="text-xl font-extrabold text-[#0f172a] mb-1">{member.name}</h3>
            <p className="text-xs text-[#5c5b5b] font-medium">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
