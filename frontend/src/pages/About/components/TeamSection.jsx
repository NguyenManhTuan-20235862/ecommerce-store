import { useEffect, useState } from "react";
import { teamService } from "../../../services/team.service";
import { getImageUrl } from "../../../utils/getImageUrl";

export default function TeamSection() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamService
      .getMembers()
      .then((res) => setMembers(res.data?.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-[3/4] bg-[#e2e8f0] rounded-[2rem] mb-6" />
              <div className="h-5 bg-[#e2e8f0] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#e2e8f0] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="w-full aspect-[3/4] bg-[#e2e8f0] rounded-[2rem] mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                    PORTRAIT {String(i + 1).padStart(2, '0')}
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-[#0f172a] mb-1">—</h3>
              <p className="text-xs text-[#5c5b5b] font-medium">—</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div key={member._id} className="group cursor-pointer">
              <div className="w-full aspect-[3/4] bg-[#e2e8f0] rounded-[2rem] mb-6 relative overflow-hidden">
                {member.photoUrl ? (
                  <img
                    src={getImageUrl(member.photoUrl)}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                        PORTRAIT
                      </p>
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition duration-300"></div>
              </div>
              <h3 className="text-xl font-extrabold text-[#0f172a] mb-1">{member.name}</h3>
              <p className="text-xs text-[#5c5b5b] font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
