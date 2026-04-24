import { Globe, Mail, MessageCircle } from "lucide-react";

export default function LandingFooter({ footerLinks }) {
  return (
    <footer
      id="footer"
      className="rounded-t-4xl bg-[#f4f4f5] px-4 py-11 sm:px-6 sm:py-12 lg:px-10 lg:py-16"
    >
      <div className="mx-auto grid w-full max-w-400 gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <p className="font-heading text-2xl font-extrabold uppercase tracking-[-0.04em] text-[#18181b]">
            Vibe Urban
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#52525b]">
            Thời trang nam theo hướng streetwear hiện đại, tập trung vào cảm
            giác gọn gàng, mạnh mẽ và dễ ứng dụng cho người dùng Việt.
          </p>

          <div className="mt-6 flex items-center gap-4 text-[#52525b]">
            <a
              href="#"
              aria-label="Mail"
              className="transition hover:text-[#004be3]"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Message"
              className="transition hover:text-[#004be3]"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href="#"
              aria-label="Website"
              className="transition hover:text-[#004be3]"
            >
              <Globe className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#18181b]">
            Collections
          </p>
          <div className="mt-5 space-y-3 text-sm text-[#52525b]">
            {footerLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="block transition hover:text-[#004be3]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#18181b]">
            Hỗ trợ
          </p>
          <div className="mt-5 space-y-3 text-sm text-[#52525b]">
            <a href="#" className="block transition hover:text-[#004be3]">
              Câu hỏi thường gặp
            </a>
            <a href="#" className="block transition hover:text-[#004be3]">
              Chính sách đổi trả
            </a>
            <a href="#" className="block transition hover:text-[#004be3]">
              Vận chuyển
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#18181b]">
            Liên hệ
          </p>
          <p className="mt-5 text-sm leading-7 text-[#52525b]">
            support@vibeurban.vn
            <br />
            028 1234 5678
            <br />
            Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
