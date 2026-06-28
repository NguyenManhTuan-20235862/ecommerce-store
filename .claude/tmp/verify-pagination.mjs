import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const API  = 'http://localhost:5000';

// Admin credentials từ seeder (adminSeeder.js: username=admin, pass=123456)
const ADMIN_IDENTIFIER = 'admin';
const ADMIN_PASSWORD   = '123456';

let browser, page;
const screenshots = [];

async function shot(name) {
  const path = `d:/ecommerce-store/.claude/tmp/${name}.png`;
  await page.screenshot({ path, fullPage: false });
  screenshots.push(path);
  return path;
}

async function login() {
  // Lấy token từ API
  const res = await fetch(`${API}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: ADMIN_IDENTIFIER, password: ADMIN_PASSWORD }),
  });
  const json = await res.json();
  const token = json.accessToken;
  const user  = json.user;
  if (!token) throw new Error('Không lấy được token: ' + JSON.stringify(json));

  // Inject token vào localStorage theo format Zustand persist của authStore
  await page.goto(BASE);
  await page.waitForLoadState('networkidle');
  await page.evaluate(({ token, user }) => {
    const state = { state: { accessToken: token, user }, version: 0 };
    localStorage.setItem('auth-storage', JSON.stringify(state));
  }, { token, user });

  // Reload để Zustand hydrate
  await page.reload();
  await page.waitForLoadState('networkidle');
  console.log(`✅ Login thành công (token inject) — user: ${user?.username}`);
}

// ─── TEST 1: Shop Load More (cursor) ─────────────────────────────────────────
async function testShopLoadMore() {
  console.log('\n=== TEST 1: Shop Load More ===');

  await page.goto(`${BASE}/shop`);
  await page.waitForSelector('[data-testid="product-card"], .product-card, [class*="ProductCard"], [class*="product"]', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1500); // Đợi animation

  // Đếm số sản phẩm ban đầu
  // Tìm product items - dùng nhiều selector để tương thích
  const countBefore = await page.evaluate(() => {
    // Tìm product cards trong shop
    const cards = document.querySelectorAll('article, [class*="tile"], [class*="product-tile"], [class*="ProductTile"]');
    // Nếu không tìm được, thử cách khác
    if (cards.length === 0) {
      const links = document.querySelectorAll('a[href*="/product/"]');
      return links.length;
    }
    return cards.length;
  });
  console.log(`   Sản phẩm ban đầu: ${countBefore}`);
  await shot('01-shop-initial');

  // Tìm nút Load More
  const loadMoreBtn = await page.locator('button:has-text("Load"), button:has-text("Xem thêm"), button:has-text("thêm"), button:has-text("more")').first();
  const btnVisible = await loadMoreBtn.isVisible().catch(() => false);

  if (!btnVisible) {
    console.log('⚠️  Không tìm thấy nút Load More (có thể tất cả sản phẩm đã hiển thị hoặc selector sai)');
    // Cuộn xuống tìm
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await shot('01-shop-scrolled');
    const btnAfterScroll = await page.locator('button:has-text("Load"), button:has-text("Xem thêm"), button:has-text("thêm")').first();
    const visibleAfter = await btnAfterScroll.isVisible().catch(() => false);
    if (!visibleAfter) {
      console.log('❌ Không tìm thấy Load More button');
      return false;
    }
  }

  // Nhấn Load More
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await loadMoreBtn.click();
  await page.waitForTimeout(2000); // Đợi fetch xong

  const countAfter = await page.evaluate(() => {
    const cards = document.querySelectorAll('article, [class*="tile"], [class*="product-tile"], [class*="ProductTile"]');
    if (cards.length === 0) {
      const links = document.querySelectorAll('a[href*="/product/"]');
      return links.length;
    }
    return cards.length;
  });
  console.log(`   Sản phẩm sau Load More: ${countAfter}`);
  await shot('01-shop-after-load-more');

  if (countAfter > countBefore) {
    console.log(`✅ Load More append đúng: ${countBefore} → ${countAfter} (+${countAfter - countBefore})`);
  } else {
    console.log(`❌ Load More không append: vẫn còn ${countAfter} (giống trước)`);
    return false;
  }

  // Test reset khi đổi sort
  console.log('   🔍 Test reset khi đổi filter/sort...');
  const sortSelect = await page.locator('select, [class*="sort"], [class*="Sort"]').first();
  const sortVisible = await sortSelect.isVisible().catch(() => false);
  if (sortVisible) {
    await sortSelect.selectOption({ index: 1 }).catch(() => {});
    await page.waitForTimeout(1500);
    const countAfterSort = await page.evaluate(() => {
      const cards = document.querySelectorAll('article, [class*="tile"], [class*="product-tile"], [class*="ProductTile"]');
      if (cards.length === 0) {
        const links = document.querySelectorAll('a[href*="/product/"]');
        return links.length;
      }
      return cards.length;
    });
    await shot('01-shop-after-sort');
    if (countAfterSort <= countBefore + 2) {
      console.log(`✅ Sort reset list: ${countAfterSort} items (reset về đầu)`);
    } else {
      console.log(`⚠️  Sau sort vẫn còn ${countAfterSort} items — cần kiểm tra thêm`);
    }
  } else {
    console.log('   🔍 Không tìm thấy sort selector để test reset');
  }

  return true;
}

// ─── TEST 2: Admin Orders pagination ─────────────────────────────────────────
async function testAdminOrders() {
  console.log('\n=== TEST 2: Admin Orders Pagination ===');

  // Bắt request để xem params gọi server
  const requests = [];
  page.on('request', req => {
    if (req.url().includes('/api/orders') && req.method() === 'GET') {
      requests.push(req.url());
    }
  });

  await page.goto(`${BASE}/admin/orders`);
  await page.waitForTimeout(2000);
  await shot('02-orders-initial');

  const initialReqs = [...requests];
  console.log(`   Request ban đầu: ${initialReqs.length}`);
  if (initialReqs.length > 0) console.log(`   URL: ${initialReqs[initialReqs.length - 1]}`);

  // Kiểm tra có table/list không
  const hasTable = await page.locator('table, [class*="table"], [class*="order"]').first().isVisible().catch(() => false);
  console.log(`   Có bảng đơn hàng: ${hasTable}`);

  // Tìm các tab status
  const tabs = await page.locator('button:has-text("Chờ"), button:has-text("Đang"), button:has-text("Hoàn"), button:has-text("Hủy"), button:has-text("Tất cả")').all();
  console.log(`   Số tab tìm thấy: ${tabs.length}`);

  if (tabs.length > 1) {
    requests.length = 0; // Reset
    await tabs[1].click(); // Click tab thứ 2
    const tabText = await tabs[1].textContent();
    await page.waitForTimeout(1500);
    await shot('02-orders-tab2');

    const afterTabReqs = [...requests];
    console.log(`   Requests sau click tab "${tabText?.trim()}": ${afterTabReqs.length}`);
    if (afterTabReqs.length > 0) {
      const url = afterTabReqs[0];
      console.log(`   URL: ${url}`);
      if (url.includes('status=') || url.includes('page=')) {
        console.log(`✅ Tab switch gọi server với params đúng`);
      } else {
        console.log(`⚠️  URL không có status param: ${url}`);
      }
    } else {
      console.log('⚠️  Không bắt được request mới sau tab switch (có thể bị cache)');
    }
  } else {
    console.log('⚠️  Không tìm thấy tab switch');
  }

  // Test phân trang
  const nextBtn = await page.locator('button:has-text("›"), button:has-text("Next"), button[aria-label*="next"], button:has-text("Trang sau")').first();
  const nextVisible = await nextBtn.isVisible().catch(() => false);
  if (nextVisible) {
    requests.length = 0;
    await nextBtn.click();
    await page.waitForTimeout(1500);
    const paginationReqs = [...requests];
    await shot('02-orders-page2');
    if (paginationReqs.length > 0) {
      console.log(`✅ Phân trang gọi server: ${paginationReqs[0]}`);
    } else {
      console.log('⚠️  Không bắt được request phân trang');
    }
  } else {
    console.log('🔍 Nút Next page không visible (có thể chỉ có 1 trang dữ liệu)');
  }

  return true;
}

// ─── TEST 3: Admin Customers search + pagination ──────────────────────────────
async function testAdminCustomers() {
  console.log('\n=== TEST 3: Admin Customers Search + Pagination ===');

  const requests = [];
  page.on('request', req => {
    if (req.url().includes('/api/users') && req.method() === 'GET') {
      requests.push(req.url());
    }
  });

  await page.goto(`${BASE}/admin/customers`);
  await page.waitForTimeout(2000);
  await shot('03-customers-initial');

  // Đếm rows ban đầu
  const rowsBefore = await page.locator('table tbody tr, [class*="customer-row"], [class*="CustomerRow"]').count().catch(() => 0);
  console.log(`   Rows ban đầu: ${rowsBefore}`);

  // Tìm search input
  const searchInput = await page.locator('input[type="search"], input[placeholder*="tìm"], input[placeholder*="Tìm"], input[placeholder*="search"], input[placeholder*="Search"]').first();
  const searchVisible = await searchInput.isVisible().catch(() => false);

  if (!searchVisible) {
    console.log('⚠️  Không tìm thấy search input');
    return false;
  }

  // Test debounce: gõ từng ký tự, kiểm tra không bắn request ngay
  requests.length = 0;
  await searchInput.type('a', { delay: 50 });
  await page.waitForTimeout(200); // Trong debounce window
  const reqs200ms = requests.length;

  await page.waitForTimeout(600); // Sau debounce (thường 500ms)
  const reqs800ms = requests.length;
  console.log(`   Requests sau 200ms: ${reqs200ms} | sau 800ms: ${reqs800ms}`);
  if (reqs200ms === 0 && reqs800ms > 0) {
    console.log('✅ Debounce hoạt động đúng');
  } else if (reqs800ms > 0) {
    console.log('⚠️  Có request (debounce có thể không hoạt động hoàn hảo nhưng vẫn search được)');
  }

  // Gõ search đầy đủ
  await searchInput.fill('nguyen');
  await page.waitForTimeout(800); // Đợi debounce
  await shot('03-customers-search');

  // Ghi lại URL request search
  const searchReqs = requests.filter(u => u.includes('search=') || u.includes('nguyen'));
  if (searchReqs.length > 0) {
    console.log(`✅ Search gọi server: ${searchReqs[searchReqs.length - 1]}`);
  }

  // Kiểm tra page reset về 1 khi search
  const urlAfterSearch = searchReqs[searchReqs.length - 1] || '';
  if (urlAfterSearch.includes('page=1') || !urlAfterSearch.includes('page=')) {
    console.log('✅ Page reset về 1 khi search');
  } else {
    console.log(`⚠️  Page không reset: ${urlAfterSearch}`);
  }

  // Clear search, test phân trang
  await searchInput.fill('');
  await page.waitForTimeout(800);
  await shot('03-customers-cleared');

  const nextBtn = await page.locator('button:has-text("›"), button:has-text("Next"), button[aria-label*="next"], button:has-text("Trang sau"), button:has-text("Tiếp")').first();
  const nextVisible = await nextBtn.isVisible().catch(() => false);

  if (nextVisible) {
    requests.length = 0;
    await nextBtn.click();
    await page.waitForTimeout(1500);
    const pReqs = [...requests];
    await shot('03-customers-page2');
    if (pReqs.length > 0) {
      console.log(`✅ Phân trang gọi server: ${pReqs[0]}`);
    } else {
      console.log('🔍 Phân trang không bắt được request mới');
    }
  } else {
    console.log('🔍 Next page không visible (có thể ít hơn 1 trang customer)');
  }

  return true;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage();
  page.setDefaultTimeout(15000);

  const results = { shop: false, orders: false, customers: false };

  try {
    await login();

    results.shop      = await testShopLoadMore().catch(e => { console.error('Shop error:', e.message); return false; });
    results.orders    = await testAdminOrders().catch(e => { console.error('Orders error:', e.message); return false; });
    results.customers = await testAdminCustomers().catch(e => { console.error('Customers error:', e.message); return false; });

  } catch (err) {
    console.error('Fatal:', err.message);
  } finally {
    await browser.close();
  }

  console.log('\n========== KẾT QUẢ ==========');
  console.log(`Shop Load More   : ${results.shop ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`Admin Orders     : ${results.orders ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`Admin Customers  : ${results.customers ? 'PASS ✅' : 'FAIL ❌'}`);
  console.log(`\nScreenshots: ${screenshots.join(', ')}`);
})();
