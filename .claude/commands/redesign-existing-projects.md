# Skill: Redesign Existing Projects

## Role & Objective

Bạn là một Senior UI/UX Engineer chuyên nâng cấp giao diện lên chất lượng premium.

Khi được gọi, hãy áp dụng quy trình **Scan → Diagnose → Fix** cho target mà user chỉ định trong `$ARGUMENTS`.

---

## Ràng buộc dự án (BẮT BUỘC)

- **Bảng màu hệ thống:** nền `#F9F6F5`, accent `#004BE3→#819BFF`, chữ chính `#2F2F2E`, chữ phụ `#5C5B5B` — không tự ý thêm màu ngoài hệ thống.
- **Stack:** React 19 + Tailwind CSS 4 + Framer Motion — không migrate framework hay thư viện.
- **Tailwind v4:** không dùng `theme.extend` kiểu v3; kiểm tra syntax trước khi sửa config.
- **Không phá chức năng:** mọi thay đổi phải giữ nguyên logic, state, API calls hiện có.

---

## Bước 1 — Scan

Đọc codebase của target được chỉ định:
- Framework / styling method (Tailwind, CSS module, inline styles...)
- Các component và pattern thiết kế đang dùng
- Font, màu sắc, spacing hiện tại

---

## Bước 2 — Diagnose

Chạy audit theo 8 hạng mục dưới đây. **Liệt kê mọi vấn đề tìm được** trước khi bắt tay fix.

### Typography
- Font mặc định browser hoặc dùng Inter ở mọi nơi → thay bằng font có cá tính hơn (Geist, Outfit, Cabinet Grotesk, Satoshi; dự án đã có Fraunces + Nunito + Cormorant Garamond).
- Tiêu đề thiếu sức nặng → tăng size, giảm letter-spacing, giảm line-height.
- Đoạn văn quá rộng → giới hạn ~65 ký tự, tăng line-height.
- Chỉ dùng Regular (400) và Bold (700) → thêm Medium (500) và SemiBold (600).
- Số trong font proportional → dùng `font-variant-numeric: tabular-nums` cho bảng dữ liệu.
- Thiếu điều chỉnh letter-spacing → âm cho heading lớn, dương cho label nhỏ.
- Từ lẻ cuối đoạn → fix bằng `text-wrap: balance` hoặc `text-wrap: pretty`.

### Màu sắc & Surface
- Nền đen tuyệt đối `#000000` → thay bằng off-black hoặc tinted dark.
- Accent quá bão hòa → giữ saturation dưới 80%.
- Dùng nhiều hơn 1 màu accent → chỉ giữ 1.
- Mix warm gray và cool gray → chọn 1 hệ gray duy nhất.
- "AI gradient" tím/xanh generic → thay bằng nền neutral + 1 accent có chủ đích.
- `box-shadow` đen generic → tint shadow theo hue của background.
- Surface phẳng, không texture → thêm noise/grain tinh tế.
- Gradient đều đặn → dùng radial gradient hoặc mesh gradient.
- Section tối đột ngột giữa trang sáng → đồng nhất tone hoặc dùng shade đậm hơn cùng palette.
- Section trống, không có depth → thêm background imagery hoặc ambient gradient.

### Layout
- Mọi thứ đều căn giữa, đối xứng → phá đối xứng bằng offset margin, aspect ratio khác nhau.
- Ba card bằng nhau làm feature row → thay bằng zig-zag 2 cột, asymmetric grid, hoặc horizontal scroll.
- `height: 100vh` → thay bằng `min-height: 100dvh`.
- Flex + percentage math phức tạp → dùng CSS Grid.
- Không có `max-width` container → thêm constraint ~1200–1440px với auto margin.
- Card đồng chiều cao ép bằng flexbox → cho phép height tự nhiên hoặc dùng masonry.
- Border-radius đồng đều mọi nơi → vary: nhỏ cho inner element, lớn cho container.
- Element nằm phẳng bên nhau → dùng negative margin để tạo layering.
- Padding trên dưới bằng nhau → điều chỉnh optically (bottom thường cần lớn hơn chút).
- Thiếu whitespace → double spacing, để design thở.
- Button trong card group không align bottom → pin button xuống đáy card.

### Interactivity & States
- Nút không có hover state → thêm background shift, scale nhẹ, hoặc translate.
- Không có active/pressed feedback → thêm `scale(0.98)` hoặc `translateY(1px)`.
- Transition 0ms → thêm 200–300ms cho mọi interactive element.
- Thiếu focus ring → đảm bảo visible focus indicator (accessibility bắt buộc).
- Spinner tròn generic → thay bằng skeleton loader khớp shape của layout.
- Không có empty state → thiết kế "getting started" view có nghĩa.
- Không có error state → thêm inline error message rõ ràng, không dùng `window.alert()`.
- Link chết trỏ `#` → link tới đích thật hoặc disable có visual.
- Không highlight trang hiện tại trong nav → style active link khác biệt.
- Anchor click nhảy đột ngột → thêm `scroll-behavior: smooth`.
- Animation dùng `top/left/width/height` → chuyển sang `transform` và `opacity`.

### Content
- Tên placeholder "John Doe" → dùng tên đa dạng, có thật.
- Số tròn giả `99.99%` → dùng số tự nhiên `47.2%`.
- Tên công ty generic "Acme Corp" → invent brand name có ngữ cảnh.
- Cliché AI copywriting ("Elevate", "Seamless", "Unleash", "Next-Gen") → viết ngôn ngữ đơn giản, cụ thể.
- Dấu chấm than trong success message → bỏ đi, tự tin không ồn ào.
- "Oops!" trong error → thay bằng thông báo trực tiếp: "Kết nối thất bại. Thử lại."
- Passive voice → active voice.
- Lorem Ipsum → viết copy thật.
- Title Case Ở Mọi Header → dùng Sentence case thay thế.

### Component Patterns
- Card generic (border + shadow + nền trắng) → bỏ border hoặc chỉ dùng background color.
- Luôn 1 filled button + 1 ghost button → thêm text link hoặc tertiary style.
- Badge hình pill "New/Beta" → thử square badge hoặc plain text label.
- Accordion FAQ → thay bằng side-by-side list hoặc inline progressive disclosure.
- Carousel testimonial 3 card + dots → thay bằng masonry wall hoặc single rotating quote.
- Pricing table 3 cột bằng nhau → highlight tier recommended bằng màu + emphasis.
- Modal cho mọi action nhỏ → dùng inline editing hoặc slide-over panel.
- Avatar tròn duy nhất → thử squircle hoặc rounded square.

### Iconography
- Lucide/Feather icons duy nhất → thêm Phosphor hoặc Heroicons để khác biệt (nếu cần, kiểm tra package.json trước).
- Icon rocketship cho "Launch", shield cho "Security" → chọn icon ít cliché hơn.
- Stroke width icon không nhất quán → audit và đồng bộ 1 stroke weight.
- Thiếu favicon → thêm favicon có brand.

### Code Quality
- Div soup → dùng semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`.
- Inline style trộn với class → chuyển tất cả vào styling system.
- Hardcoded pixel width → dùng relative units (`%`, `rem`, `em`, `max-width`).
- Thiếu `alt` text trên ảnh → mô tả nội dung ảnh cho screen reader.
- z-index tùy tiện `9999` → thiết lập z-index scale rõ ràng.
- Code comment-out còn sót → xóa hết debug artifact.
- Thiếu meta tags → thêm `<title>`, `description`, `og:image`.

### Strategic Omissions
- Không có legal links → thêm privacy policy và ToS ở footer.
- Không có "back" navigation → mọi page cần đường về.
- Không có custom 404 page → thiết kế "page not found" có brand.
- Không có form validation → thêm client-side validate (đã có Zod + RHF trong project).
- Không có "skip to content" link → thêm hidden skip-link cho keyboard users.

---

## Bước 3 — Fix

Áp dụng nâng cấp **theo thứ tự ưu tiên** (impact cao → thấp):

1. **Font swap** — cải thiện tức thì, rủi ro thấp nhất
2. **Color palette cleanup** — loại bỏ màu clash hoặc over-saturated
3. **Hover và active states** — làm interface sống động
4. **Layout và spacing** — grid chuẩn, max-width, padding nhất quán
5. **Thay component generic** — swap pattern cliché bằng alternative hiện đại
6. **Thêm loading, empty, error states** — làm có vẻ hoàn chỉnh
7. **Polish typography scale** — chạm cuối premium

### Kỹ thuật nâng cấp nâng cao (dùng khi phù hợp)

**Typography:**
- Variable font animation — interpolate weight/width khi scroll hoặc hover.
- Text mask reveal — typography lớn làm cửa sổ cho video/animation phía sau.

**Layout:**
- Broken grid / asymmetry — element chủ đích phá column structure.
- Parallax card stacks — section stack lên nhau khi scroll.
- Split-screen scroll — 2 nửa màn hình trượt ngược chiều.

**Motion:**
- Staggered entry — element cascade vào với delay nhỏ dần, kết hợp Y-translate + opacity.
- Spring physics — thay linear easing bằng spring-based motion.
- Scroll-driven reveals — content vào qua expanding mask hoặc wipe.

**Surface:**
- True glassmorphism — `backdrop-filter: blur` + 1px inner border + inner shadow mô phỏng edge refraction.
- Grain/noise overlay — fixed overlay pointer-events-none để phá flat digital.
- Colored tinted shadows — shadow mang hue của background, không dùng đen generic.

---

## Rules

- Làm việc với tech stack hiện có. Không migrate framework hay styling library.
- Không phá chức năng hiện có. Test sau mỗi thay đổi.
- Trước khi import thư viện mới → kiểm tra `package.json` trước.
- Tailwind v4: kiểm tra syntax trước khi sửa config.
- Thay đổi nhỏ, có mục tiêu — cải tiến từng bước, không rewrite lớn.
