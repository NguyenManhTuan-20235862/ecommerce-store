import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

dotenv.config();

// ── Ngân hàng bình luận theo rating ───────────────────────────────────────────

const COMMENTS = {
  5: [
    "Sản phẩm y hệt ảnh, chất liệu rất tốt, mặc vào cực kỳ thoải mái. Shop giao hàng nhanh, đóng gói cẩn thận. Chắc chắn sẽ quay lại mua tiếp!",
    "Mình đã mua nhiều lần ở đây và lần nào cũng hài lòng. Chất vải dày dặn, form đẹp chuẩn, màu sắc đúng như mô tả.",
    "Vibe Urban không bao giờ làm mình thất vọng. Sản phẩm lần này tiếp tục chất lượng cao, đóng gói gọn gàng, giao đúng hẹn.",
    "Chất lượng vượt mong đợi ở tầm giá này. May đẹp, đường chỉ thẳng, không có lỗi. Mặc thử ngay và thấy ưng liền.",
    "Hàng xịn, đúng size, form dáng tôn dáng. Đã order thêm 2 màu nữa. Cảm ơn shop!",
    "Mình mua tặng bạn trai và bạn ấy rất thích. Chất liệu mềm mại, không bị xù sau khi giặt. Sẽ ủng hộ shop lâu dài.",
    "Quá xuất sắc! Đây là lần thứ 3 mình mua ở shop và vẫn giữ nguyên chất lượng. Form áo rất trendy, đúng phong cách đường phố.",
    "Nhận hàng rất nhanh, hộp đựng đẹp như quà tặng. Sản phẩm chất lượng đỉnh, mặc ra phố ai cũng hỏi mua ở đâu.",
    "Vải xịn, không bai giãn sau 5 lần giặt. Form chuẩn, không cần chỉnh. Dây kéo trơn, túi to. Hoàn toàn xứng đáng 5 sao.",
    "Mình là fan lâu năm của Vibe Urban. Sản phẩm lần này lại làm hài lòng một lần nữa. Thiết kế clean, mặc được nhiều dịp.",
  ],
  4: [
    "Sản phẩm khá tốt, chất liệu ổn, form vừa vặn. Giao hàng đúng hạn. Trừ 1 sao vì màu hơi khác ảnh một chút nhưng vẫn đẹp.",
    "Nhìn chung hài lòng, chất lượng tương xứng giá tiền. Size chuẩn bảng size, mặc thoải mái. Sẽ mua thêm nếu có mẫu mới.",
    "Hàng đẹp, đóng gói ổn. Chỉ hơi tiếc là thời gian giao hàng lâu hơn dự kiến 1 ngày nhưng chất lượng bù lại được.",
    "Chất vải dày, không bị mỏng như một số nơi khác. Form áo đẹp. Màu sắc đúng mô tả. Tổng thể rất ổn, đáng tiền.",
    "Mình order size L, mặc vừa khít. Form đẹp, không bị rộng hay chật. Chất liệu ổn, thoáng mát. Recommend cho mọi người.",
    "Sản phẩm tốt hơn mình nghĩ ban đầu. Chất vải mịn, mặc không bị ngứa. Đường may chắc chắn. Sẽ quay lại mua thêm.",
    "Nhận hàng đúng như mô tả, size chuẩn. Chỉ mong shop có thêm nhiều màu hơn. Ngoài ra rất hài lòng với sản phẩm.",
    "Chất lượng ổn, giá hợp lý. Mặc vài lần rồi vẫn như mới. Có thể cải thiện thêm phần túi cho rộng hơn một chút.",
    "Áo đẹp, mặc cũng ổn. Logo thêu sắc nét, vải không bị xù. Mình đã order thêm 1 cái nữa làm quà.",
  ],
  3: [
    "Sản phẩm ổn ở tầm trung. Chất vải không dày như mình kỳ vọng nhưng mặc vẫn được. Giao hàng hơi chậm.",
    "Nhìn chung tạm ổn. Size hơi to hơn bảng size một chút, mình phải xuống 1 size. Chất lượng ở mức chấp nhận được.",
    "Được cái form đẹp nhưng chất vải hơi mỏng. Phù hợp mặc mùa hè nhưng lạnh một chút là cần thêm áo ngoài.",
    "Hàng về đúng mô tả nhưng chất lượng không đặc sắc lắm. Giá có thể cân nhắc thêm. Nhìn chung vẫn dùng được.",
    "Mình kỳ vọng cao hơn một chút. Sản phẩm ổn nhưng đường may ở vài chỗ chưa hoàn hảo. Sẽ cân nhắc khi mua lần sau.",
    "Bình thường, không có gì nổi bật. Chất liệu trung bình, form áo ổn. Xứng đáng 3 sao ở tầm giá này.",
  ],
  2: [
    "Hơi thất vọng. Màu thực tế khác ảnh khá nhiều, chất vải mỏng hơn dự kiến. Nhưng form áo vẫn đẹp nên vẫn mặc được.",
    "Chất lượng không tương xứng với giá. Sau 2 lần giặt màu đã bắt đầu phai. Mong shop cải thiện thêm.",
  ],
};

// Trọng số theo rating (5★ nhiều nhất)
const RATING_WEIGHTS = [
  { rating: 5, weight: 45 },
  { rating: 4, weight: 35 },
  { rating: 3, weight: 15 },
  { rating: 2, weight: 5 },
];

function pickRating() {
  const total = RATING_WEIGHTS.reduce((s, r) => s + r.weight, 0);
  let rand = Math.random() * total;
  for (const { rating, weight } of RATING_WEIGHTS) {
    rand -= weight;
    if (rand <= 0) return rating;
  }
  return 5;
}

function pickComment(rating) {
  const pool = COMMENTS[rating];
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Kết nối DB thành công\n");

    // Lấy tất cả đơn hàng đã giao thành công
    const deliveredOrders = await Order.find({ status: "delivered" }).lean();
    console.log(`📦 Tìm thấy ${deliveredOrders.length} đơn đã giao\n`);

    if (deliveredOrders.length === 0) {
      console.error("❌ Chưa có đơn delivered. Chạy orderSeeder trước.");
      process.exit(1);
    }

    // Build map: productId (string) → Set của userId (string)
    const productBuyerMap = new Map();
    for (const order of deliveredOrders) {
      for (const item of order.items) {
        const pid = item.productId.toString();
        if (!productBuyerMap.has(pid)) productBuyerMap.set(pid, new Set());
        productBuyerMap.get(pid).add(order.userId.toString());
      }
    }

    console.log(`🛍  ${productBuyerMap.size} sản phẩm có người mua\n`);

    // Lấy review đã có để tránh duplicate
    const existingReviews = await Review.find({}).lean();
    const reviewed = new Set(
      existingReviews.map((r) => `${r.userId}_${r.productId}`)
    );
    console.log(`📝 Đã có ${existingReviews.length} review từ trước\n`);

    const toInsert = [];
    let skippedProducts = 0;

    for (const [pid, buyerSet] of productBuyerMap.entries()) {
      const buyers = shuffle([...buyerSet]);

      // Lọc bỏ cặp (user, product) đã được review
      const eligibleBuyers = buyers.filter(
        (uid) => !reviewed.has(`${uid}_${pid}`)
      );

      if (eligibleBuyers.length === 0) {
        skippedProducts++;
        continue;
      }

      // Mỗi sản phẩm lấy 2–4 reviewer (tùy số buyer có sẵn)
      const reviewCount = Math.min(
        eligibleBuyers.length,
        2 + Math.floor(Math.random() * 3) // 2, 3 hoặc 4
      );
      const reviewers = eligibleBuyers.slice(0, reviewCount);

      for (const uid of reviewers) {
        const rating = pickRating();
        toInsert.push({
          userId: new mongoose.Types.ObjectId(uid),
          productId: new mongoose.Types.ObjectId(pid),
          rating,
          comment: pickComment(rating),
          // Ngày review = sau ngày giao hàng vài ngày (giả định)
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          ),
        });
        // Đánh dấu đã xử lý để tránh trùng trong batch này
        reviewed.add(`${uid}_${pid}`);
      }
    }

    if (toInsert.length === 0) {
      console.log("⚠️  Không có review mới cần tạo (tất cả đã tồn tại).");
      await mongoose.disconnect();
      process.exit(0);
    }

    await Review.insertMany(toInsert, { ordered: false });

    // ── Báo cáo ───────────────────────────────────────────────────────────────
    const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of toInsert) ratingDist[r.rating]++;

    console.log(`✅ Đã tạo ${toInsert.length} review cho ${productBuyerMap.size - skippedProducts} sản phẩm\n`);
    console.log("📊 Phân bổ rating:");
    for (const star of [5, 4, 3, 2, 1]) {
      if (ratingDist[star] > 0) {
        const bar = "█".repeat(Math.round(ratingDist[star] / toInsert.length * 20));
        console.log(`   ${star}★ ${bar} ${ratingDist[star]} review`);
      }
    }
    if (skippedProducts > 0) {
      console.log(`\n⏭  ${skippedProducts} sản phẩm bỏ qua (đã có đủ review)`);
    }

    console.log("\n🎉 Review seed hoàn tất!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
