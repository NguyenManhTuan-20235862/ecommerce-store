# Câu Hỏi Phỏng Vấn Intern — Node.js / Express / MongoDB / React

> Dành cho: Sinh viên năm 3–4, vị trí Intern Fullstack / Backend / Frontend
> Ví dụ thực tế lấy từ dự án **Vibe Urban E-commerce**

---

## MỤC LỤC

1. [JavaScript Cốt Lõi](#1-javascript-cốt-lõi) — Q1–Q5
2. [Node.js](#2-nodejs) — Q6–Q7
3. [Express.js](#3-expressjs) — Q8–Q11
4. [MongoDB & Mongoose](#4-mongodb--mongoose) — Q12–Q15
5. [React](#5-react) — Q16–Q20
6. [Authentication & Bảo Mật](#6-authentication--bảo-mật) — Q21–Q23
7. [State Management](#7-state-management) — Q24–Q25
8. [Câu Hỏi Tổng Hợp](#8-câu-hỏi-tổng-hợp) — Q26–Q28
9. [Bảng Thuật Ngữ IT](#9-bảng-thuật-ngữ-it) — Tra cứu nhanh

---

## 9. Bảng Thuật Ngữ IT

> Tra cứu nhanh các từ tiếng Anh chuyên ngành xuất hiện trong tài liệu này.
> Sắp xếp theo nhóm chủ đề, không phải alphabet — để học theo mạch.

---

### NHÓM 1 — Nền Tảng Lập Trình

---

#### `Runtime` / `Runtime Environment`
> **Dịch:** Môi trường chạy

Phần mềm cung cấp mọi thứ cần thiết để một chương trình thực thi: bộ nhớ, I/O, garbage collector, ... Khác với compile-time (lúc biên dịch), runtime là lúc chương trình **đang chạy thật sự**.

```
Node.js = JavaScript Runtime Environment
→ Giúp JavaScript chạy trên máy chủ, không cần trình duyệt
```

---

#### `Engine`
> **Dịch:** Máy thực thi / Bộ xử lý

Chương trình đọc và thực thi code. V8 là JavaScript engine do Google viết, được dùng trong cả Chrome và Node.js.

```
JavaScript code → V8 Engine → Mã máy (machine code) → CPU thực thi
```

---

#### `Compile-time` vs `Runtime`
> **Dịch:** Thời điểm biên dịch vs Thời điểm chạy

- **Compile-time**: Lỗi phát hiện khi biên dịch (ví dụ: TypeScript type error)
- **Runtime**: Lỗi phát hiện khi chương trình đang chạy (ví dụ: `TypeError: cannot read property of null`)

---

#### `Scope`
> **Dịch:** Phạm vi (của biến)

Vùng code mà một biến có thể được truy cập.

| Loại | Tiếng Việt | Ý nghĩa |
|---|---|---|
| `Global scope` | Phạm vi toàn cục | Truy cập từ bất kỳ đâu |
| `Function scope` | Phạm vi hàm | Chỉ trong hàm đó |
| `Block scope` | Phạm vi khối | Chỉ trong cặp `{}` đó |

```js
var x = 1      // global scope — tồn tại khắp nơi
function foo() {
  var y = 2    // function scope — chỉ trong foo()
  if (true) {
    let z = 3  // block scope — chỉ trong if {}
  }
}
```

---

#### `Hoisting`
> **Dịch:** Kéo lên đầu (không có từ tiếng Việt tương đương)

JavaScript tự động "kéo" khai báo biến/hàm lên đầu scope trước khi thực thi. Với `var`: khai báo được hoist với giá trị `undefined`. Với `let`/`const`: được hoist nhưng ở **Temporal Dead Zone (TDZ)** — truy cập trước khai báo sẽ lỗi.

```js
console.log(a) // undefined (không lỗi!) — var bị hoist
var a = 5

console.log(b) // ReferenceError — let ở TDZ
let b = 5
```

---

#### `Temporal Dead Zone (TDZ)`
> **Dịch:** Vùng chết tạm thời

Khoảng thời gian từ đầu block đến dòng khai báo `let`/`const`, trong đó biến tồn tại nhưng chưa thể dùng được.

---

#### `Closure`
> **Dịch:** Bao đóng / Hàm bao (giữ nguyên tiếng Anh thường gặp hơn)

Khả năng của hàm con **nhớ và truy cập** biến của scope cha, kể cả khi hàm cha đã kết thúc thực thi. Closure = hàm + môi trường nơi nó được tạo ra.

---

#### `Higher-Order Function`
> **Dịch:** Hàm bậc cao

Hàm nhận hàm khác làm tham số, hoặc trả về một hàm. Ví dụ: `.map()`, `.filter()`, `.reduce()`.

```js
// .map() là higher-order function — nhận 1 hàm làm tham số
products.map(p => p.name)
```

---

#### `Callback`
> **Dịch:** Hàm gọi lại

Hàm được truyền vào hàm khác như một tham số, để được gọi sau khi một sự kiện xảy ra hoặc một tác vụ hoàn thành.

```js
// "callback hell" — lồng nhiều callback vào nhau, khó đọc
getUser(id, function(user) {
  getOrders(user.id, function(orders) {
    getProducts(orders[0], function(product) {
      // ...
    })
  })
})
// → Lý do async/await ra đời để thay thế
```

---

#### `Promise`
> **Dịch:** Cam kết / Lời hứa (giữ nguyên tiếng Anh)

Object đại diện cho một giá trị **chưa có ngay** — sẽ có trong tương lai hoặc sẽ thất bại. Có 3 trạng thái:
- `pending` — đang chờ
- `fulfilled` — thành công, có giá trị
- `rejected` — thất bại, có lỗi

```js
const promise = new Promise((resolve, reject) => {
  // Thành công → resolve(value)
  // Thất bại  → reject(error)
})
```

---

#### `async / await`
> **Dịch:** Bất đồng bộ / Chờ đợi

Cú pháp giúp viết code bất đồng bộ trông như đồng bộ. `async` đánh dấu hàm luôn trả về Promise. `await` dừng thực thi trong hàm async để chờ Promise resolve.

---

#### `Synchronous` vs `Asynchronous`
> **Dịch:** Đồng bộ vs Bất đồng bộ

| | Synchronous (đồng bộ) | Asynchronous (bất đồng bộ) |
|---|---|---|
| Thực thi | Từng dòng, tuần tự, phải chờ | Gửi lệnh xong làm việc khác, nhận kết quả sau |
| Ví dụ | Tính toán CPU | Đọc file, gọi API, query DB |
| Vấn đề | Block thread nếu có việc chậm | Phức tạp hơn để lập trình |

---

#### `Destructuring`
> **Dịch:** Phân rã / Giải cấu trúc

Cú pháp lấy giá trị từ object hoặc array ra thành biến riêng biệt trong 1 dòng.

---

#### `Spread Operator` (`...`)
> **Dịch:** Toán tử trải rộng

Trải các phần tử của array/object ra. Dùng để copy, merge, truyền arguments.

---

#### `Rest Parameter` (`...args`)
> **Dịch:** Tham số còn lại

Ngược với spread — gom nhiều arguments vào 1 array. Trông giống `...` nhưng dùng ở vị trí khác.

```js
function sum(...numbers) {   // rest — gom vào array
  return numbers.reduce((a, b) => a + b, 0)
}
sum(1, 2, 3, 4)  // numbers = [1, 2, 3, 4]

const arr = [1, 2, 3]
console.log(...arr)  // spread — trải ra: 1 2 3
```

---

#### `Immutability` / `Immutable`
> **Dịch:** Tính bất biến / Không thể thay đổi

Dữ liệu không được sửa trực tiếp — mỗi lần "thay đổi" phải tạo bản sao mới. React yêu cầu state là immutable để phát hiện thay đổi qua reference comparison.

---

#### `Mutation` / `Mutate`
> **Dịch:** Biến đổi / Thay đổi trực tiếp

Sửa đổi dữ liệu gốc thay vì tạo bản sao mới. Trong React, đây là điều cần tránh với state.

---

### NHÓM 2 — Node.js & Backend

---

#### `Event Loop`
> **Dịch:** Vòng lặp sự kiện

Cơ chế cốt lõi của Node.js: 1 vòng lặp liên tục kiểm tra hàng đợi (queue) xem có callback nào cần chạy không. Cho phép Node.js xử lý nhiều request đồng thời dù chỉ có 1 thread.

```
Call Stack (đang chạy)
     ↑
Event Loop kiểm tra
     ↑
Callback Queue (chờ): [DB trả kết quả, file đọc xong, timer hết]
```

---

#### `Non-blocking I/O`
> **Dịch:** Vào/Ra không chặn

Khi thực hiện I/O (đọc file, query DB, gọi API), Node.js **không dừng** thread chính mà đăng ký callback và tiếp tục làm việc khác. Khi I/O xong → callback được đẩy vào Event Loop.

---

#### `Single-threaded`
> **Dịch:** Đơn luồng

Chỉ có 1 luồng thực thi chính (1 lúc chỉ chạy 1 đoạn code). Khác với Java/C# có thể tạo nhiều thread. Node.js bù đắp bằng Event Loop + Non-blocking I/O.

---

#### `npm` (Node Package Manager)
> **Dịch:** Trình quản lý gói của Node

Công cụ tải về và quản lý thư viện (packages) cho dự án Node.js. `npm install` → đọc `package.json` → tải dependencies vào `node_modules/`.

---

#### `Dependencies` vs `devDependencies`
> **Dịch:** Phụ thuộc chạy thật vs Phụ thuộc khi phát triển

- `dependencies`: Thư viện cần thiết khi chạy production (express, mongoose, ...)
- `devDependencies`: Chỉ cần lúc dev, không ship lên production (nodemon, eslint, ...)

---

#### `Middleware`
> **Dịch:** Phần mềm trung gian / Lớp trung gian

Hàm chạy giữa request và response trong Express. Có quyền đọc/sửa `req`, `res`, và quyết định có chuyển tiếp (`next()`) hay không.

---

#### `Router`
> **Dịch:** Bộ định tuyến

Thành phần ánh xạ URL + HTTP method đến hàm xử lý tương ứng (controller). Express Router là một mini-app có thể mount vào app chính.

---

#### `Controller`
> **Dịch:** Bộ điều khiển

Hàm nhận request, điều phối logic, trả response. Trong pattern MVC, controller đứng giữa View và Model. Trong dự án này, controller phải mỏng — chỉ validate input, gọi service, trả response.

---

#### `Service Layer`
> **Dịch:** Lớp dịch vụ / Lớp nghiệp vụ

Lớp chứa **business logic** (logic nghiệp vụ) — những xử lý phức tạp, tính toán, tương tác DB. Tách khỏi controller để dễ test và tái sử dụng.

```
Route → Controller (mỏng) → Service (logic) → Model (DB)
```

---

#### `Business Logic`
> **Dịch:** Logic nghiệp vụ

Các quy tắc và tính toán cốt lõi của ứng dụng: tính giá sau giảm, kiểm tra tồn kho, validate đơn hàng, ... Không phải logic hiển thị UI hay kết nối DB.

---

#### `REST` (Representational State Transfer)
> **Dịch:** Chuyển giao trạng thái đại diện (giữ nguyên REST)

Kiến trúc thiết kế API dùng HTTP. Mỗi URL đại diện cho 1 resource, tương tác qua HTTP methods chuẩn (GET, POST, PUT, DELETE).

---

#### `Endpoint`
> **Dịch:** Điểm cuối / Địa chỉ API

Một URL cụ thể của API mà client có thể gọi đến. Ví dụ: `GET /api/products` là 1 endpoint.

---

#### `Request` / `Response`
> **Dịch:** Yêu cầu / Phản hồi

- **Request**: Thông điệp client gửi lên server (URL, method, headers, body)
- **Response**: Thông điệp server trả về (status code, headers, body)

---

#### `HTTP Headers`
> **Dịch:** Tiêu đề HTTP

Metadata đi kèm request/response. Ví dụ:
- `Authorization: Bearer <token>` — gửi token xác thực
- `Content-Type: application/json` — báo body là JSON
- `Set-Cookie` — server yêu cầu browser lưu cookie

---

#### `HTTP Status Code`
> **Dịch:** Mã trạng thái HTTP

Con số 3 chữ số server trả về để cho biết kết quả xử lý. 2xx = thành công, 4xx = lỗi client, 5xx = lỗi server.

---

#### `Idempotent`
> **Dịch:** Lũy đẳng / Gọi nhiều lần kết quả như nhau

Tính chất: gọi API 1 lần hay 100 lần cũng cho kết quả như nhau. GET, PUT, DELETE là idempotent. POST thường không (tạo mới mỗi lần).

---

#### `CORS` (Cross-Origin Resource Sharing)
> **Dịch:** Chia sẻ tài nguyên khác nguồn gốc

Cơ chế bảo mật của trình duyệt, chặn JavaScript gọi API đến domain/port khác với trang hiện tại. Cần cấu hình ở backend để cho phép frontend domain.

---

#### `Origin`
> **Dịch:** Nguồn gốc

Tổ hợp của `protocol + domain + port`. Hai URL cùng origin khi cả 3 phần đều giống nhau.
```
http://localhost:5173  → origin A
http://localhost:5000  → origin B (khác port → khác origin)
https://example.com   → origin C (khác domain)
```

---

#### `Payload`
> **Dịch:** Dữ liệu tải / Nội dung chính

Phần dữ liệu thực sự quan trọng trong một thông điệp. Trong JWT: phần giữa chứa thông tin user. Trong HTTP request: phần body chứa dữ liệu gửi lên.

---

#### `Boilerplate`
> **Dịch:** Code mẫu lặp đi lặp lại / Code nồi hơi

Code phải viết đi viết lại nhiều lần mà không thể tránh khỏi. Redux nổi tiếng có nhiều boilerplate hơn Zustand.

---

#### `I/O` (Input/Output)
> **Dịch:** Vào/Ra

Mọi thao tác đọc/ghi dữ liệu từ/vào bên ngoài CPU: đọc file, query DB, gọi API, đọc từ network.

---

### NHÓM 3 — MongoDB & Database

---

#### `Document`
> **Dịch:** Tài liệu / Bản ghi (trong ngữ cảnh MongoDB)

Đơn vị lưu trữ cơ bản trong MongoDB, tương tự 1 row trong SQL. Được lưu dưới dạng BSON (Binary JSON).

---

#### `Collection`
> **Dịch:** Bộ sưu tập / Tập hợp

Nhóm các documents liên quan, tương tự table trong SQL. `users`, `products`, `orders` là các collections.

---

#### `Schema`
> **Dịch:** Lược đồ / Cấu trúc dữ liệu

Định nghĩa cấu trúc dữ liệu: các fields, kiểu dữ liệu, validation rules. MongoDB không bắt buộc schema, nhưng Mongoose thêm schema ở application level.

---

#### `Model`
> **Dịch:** Mô hình dữ liệu

Class/object đại diện cho một collection trong MongoDB, cung cấp các method để CRUD. `const User = mongoose.model("User", userSchema)` → `User.find()`, `User.create()`, ...

---

#### `CRUD`
> **Dịch:** Tạo — Đọc — Cập nhật — Xóa

Viết tắt của 4 thao tác cơ bản với dữ liệu:
- **C**reate → `INSERT` / `POST`
- **R**ead → `SELECT` / `GET`
- **U**pdate → `UPDATE` / `PUT/PATCH`
- **D**elete → `DELETE` / `DELETE`

---

#### `ObjectId`
> **Dịch:** ID đối tượng (giữ nguyên ObjectId)

Kiểu dữ liệu ID đặc biệt của MongoDB, dài 24 ký tự hex. Tự động tạo nếu không cung cấp `_id`. Encode thông tin: timestamp + machine + process + counter.

```
64abc123def456789012abcd
└──────┘ └──────┘
timestamp  random
```

---

#### `Index` (Database)
> **Dịch:** Chỉ mục

Cấu trúc dữ liệu phụ (thường là B-Tree) lưu trữ giá trị của 1 field và pointer đến document, giúp query nhanh mà không cần scan toàn bộ collection.

---

#### `Compound Index`
> **Dịch:** Chỉ mục kết hợp

Index trên nhiều fields cùng lúc. Ví dụ: index trên `{price, _id}` giúp sort theo giá kết hợp với `_id` nhanh hơn.

---

#### `Unique Index`
> **Dịch:** Chỉ mục duy nhất

Index đảm bảo không có 2 documents nào có cùng giá trị field đó. `unique: true` trong Mongoose tự tạo unique index.

---

#### `populate()` / `JOIN`
> **Dịch:** Nối bảng / Điền dữ liệu liên quan

`populate()` trong Mongoose thay thế ObjectId reference bằng document thực từ collection khác. Tương tự `JOIN` trong SQL.

---

#### `Reference` vs `Embed`
> **Dịch:** Tham chiếu vs Nhúng

2 chiến lược lưu dữ liệu liên quan trong MongoDB:
- **Reference**: Lưu ObjectId, populate khi cần (như foreign key SQL)
- **Embed**: Lưu trực tiếp document con vào document cha (như addresses[] trong User)

---

#### `Aggregate`
> **Dịch:** Tổng hợp / Gom nhóm

Pipeline xử lý và biến đổi documents qua nhiều bước (filter → group → sort → ...). Dùng cho báo cáo, thống kê như Dashboard.

---

#### `Migration`
> **Dịch:** Di trú dữ liệu / Chuyển đổi dữ liệu

Script chạy một lần để thay đổi cấu trúc hoặc cập nhật dữ liệu trong DB. Ví dụ: `costPriceMigration.js` trong dự án này thêm field `costPrice` cho các sản phẩm cũ.

---

#### `Seeder`
> **Dịch:** Người gieo hạt / Script khởi tạo dữ liệu mẫu

Script tạo dữ liệu giả (fake data) vào DB cho mục đích phát triển và test.

---

### NHÓM 4 — React & Frontend

---

#### `DOM` (Document Object Model)
> **Dịch:** Mô hình đối tượng tài liệu

Cấu trúc cây đại diện cho trang HTML, do trình duyệt tạo ra. JavaScript có thể đọc/sửa DOM để thay đổi nội dung trang.

---

#### `Virtual DOM`
> **Dịch:** DOM ảo

Bản sao nhẹ của DOM thật, lưu trong memory dưới dạng JavaScript object. React dùng để so sánh (diff) trước khi cập nhật DOM thật — tránh thao tác DOM trực tiếp tốn kém.

---

#### `Reconciliation`
> **Dịch:** Đối soát / Đồng bộ hóa

Quá trình React so sánh Virtual DOM mới với cũ (diffing) để tìm ra phần nào thực sự thay đổi, rồi chỉ cập nhật đúng phần đó trong DOM thật.

---

#### `Diffing`
> **Dịch:** So sánh sự khác biệt

Thuật toán so sánh 2 cây Virtual DOM để tìm sự khác nhau tối thiểu. Kết quả được dùng trong Reconciliation.

---

#### `Component`
> **Dịch:** Thành phần / Linh kiện

Khối xây dựng cơ bản của React UI. Là hàm JavaScript nhận props và trả về JSX. Có thể tái sử dụng, kết hợp lồng nhau.

---

#### `JSX` (JavaScript XML)
> **Dịch:** Cú pháp mở rộng JavaScript giống HTML

Cú pháp cho phép viết HTML-like trong JavaScript. Được Babel biên dịch thành `React.createElement()` calls.

---

#### `Props` (Properties)
> **Dịch:** Thuộc tính / Dữ liệu đầu vào của component

Dữ liệu truyền từ component cha xuống con. Read-only trong component con.

---

#### `State`
> **Dịch:** Trạng thái

Dữ liệu nội bộ của component, component tự quản lý. Thay đổi state → React re-render component.

---

#### `Re-render`
> **Dịch:** Render lại

React gọi lại hàm component để tạo Virtual DOM mới khi state hoặc props thay đổi.

---

#### `Hook`
> **Dịch:** Móc / Hàm đặc biệt của React (giữ nguyên Hook)

Hàm đặc biệt của React cho phép dùng state và lifecycle trong function component. Tên bắt đầu bằng `use`. Ví dụ: `useState`, `useEffect`, `useRef`, `useContext`.

---

#### `useState`
> **Dịch:** Hook quản lý trạng thái

Hook khai báo state cục bộ trong component. Trả về cặp `[giá trị, hàm setter]`.

---

#### `useEffect`
> **Dịch:** Hook xử lý tác dụng phụ

Hook chạy code sau khi render — dùng cho side effects: fetch API, subscribe event, timer, thao tác DOM.

---

#### `Side Effect`
> **Dịch:** Tác dụng phụ

Bất kỳ việc gì ảnh hưởng ra ngoài phạm vi hàm hiện tại: gọi API, đọc/ghi localStorage, set timer, subscribe event. Trong React, side effects được đặt trong `useEffect`.

---

#### `Lifecycle` (Component Lifecycle)
> **Dịch:** Vòng đời (của component)

Các giai đoạn một component trải qua: Mount (xuất hiện) → Update (cập nhật) → Unmount (bị xóa).

---

#### `Mount` / `Unmount`
> **Dịch:** Gắn vào / Tháo ra

- **Mount**: Component xuất hiện lần đầu trong DOM
- **Unmount**: Component bị xóa khỏi DOM (navigate sang trang khác, conditional render false, ...)

---

#### `Dependency Array`
> **Dịch:** Mảng phụ thuộc

Tham số thứ 2 của `useEffect`. React so sánh các giá trị trong mảng này sau mỗi render — nếu thay đổi thì chạy lại effect.

---

#### `Prop Drilling`
> **Dịch:** Truyền props qua nhiều tầng

Anti-pattern: phải truyền props qua nhiều component trung gian chỉ để đến component cần dùng. Giải pháp: Context API hoặc State Management (Zustand, Redux).

---

#### `Shallow Comparison`
> **Dịch:** So sánh nông / So sánh tham chiếu

So sánh bằng cách kiểm tra reference (địa chỉ bộ nhớ), không kiểm tra nội dung bên trong. React dùng để phát hiện state/props có thay đổi không.

```js
const a = [1, 2, 3]
const b = a          // cùng reference
a === b              // true  → React nghĩ "không đổi"

const c = [1, 2, 3]  // reference khác dù nội dung giống
a === c              // false → React nghĩ "đã đổi, re-render"
```

---

#### `Conditional Rendering`
> **Dịch:** Render có điều kiện

Hiển thị/ẩn component dựa vào điều kiện.

```jsx
{isAuthenticated && <Dashboard />}
{isLoading ? <Spinner /> : <Content />}
```

---

#### `Route Guard`
> **Dịch:** Bảo vệ đường dẫn / Kiểm soát truy cập trang

Component bao quanh trang, kiểm tra điều kiện (đã đăng nhập? là admin?) trước khi cho render trang bên trong. Nếu không đủ điều kiện → redirect về trang khác.

---

#### `Lazy Loading`
> **Dịch:** Tải lười / Tải khi cần

Kỹ thuật chỉ tải code/data khi thực sự cần — không tải hết tất cả từ đầu. Giảm thời gian load ban đầu.

---

### NHÓM 5 — Authentication & Bảo Mật

---

#### `Authentication` (AuthN)
> **Dịch:** Xác thực

Xác minh **bạn là ai**. Ví dụ: kiểm tra username + password đúng không.

---

#### `Authorization` (AuthZ)
> **Dịch:** Phân quyền / Ủy quyền

Xác định **bạn được làm gì**. Ví dụ: user thường không được xóa sản phẩm, chỉ admin mới được.

> ⚠️ Authentication vs Authorization hay bị nhầm lẫn:
> - Authentication = "Bạn là Tuân" (xác minh danh tính)
> - Authorization = "Tuân được xem trang admin không?" (kiểm tra quyền)

---

#### `JWT` (JSON Web Token)
> **Dịch:** Token JSON (giữ nguyên JWT)

Chuỗi mã hóa dùng để xác thực. Gồm 3 phần: header (thuật toán) + payload (dữ liệu) + signature (chữ ký). Server ký bằng secret key — client không thể giả mạo.

---

#### `Token`
> **Dịch:** Thẻ xác thực / Mã thông báo

Chuỗi ký tự đại diện cho quyền truy cập. Gửi kèm theo request để server biết bạn là ai và có quyền gì.

---

#### `Access Token`
> **Dịch:** Token truy cập

JWT ngắn hạn (30 phút trong dự án này) dùng để xác thực mọi API call.

---

#### `Refresh Token`
> **Dịch:** Token làm mới

Token dài hạn (14 ngày) chỉ dùng để lấy Access Token mới khi hết hạn. Lưu trong HttpOnly Cookie để an toàn hơn.

---

#### `HttpOnly Cookie`
> **Dịch:** Cookie chỉ HTTP

Cookie có flag `HttpOnly` — trình duyệt tự gửi kèm request nhưng JavaScript **không thể đọc** được. Bảo vệ token khỏi XSS attack.

---

#### `Hash` / `Hashing`
> **Dịch:** Băm / Mã hóa một chiều

Biến đổi dữ liệu gốc thành chuỗi cố định. **Không thể đảo ngược** (không giải mã ra được dữ liệu gốc). Dùng để lưu password.

---

#### `Salt`
> **Dịch:** Muối / Chuỗi ngẫu nhiên thêm vào

Chuỗi ngẫu nhiên thêm vào password trước khi hash. Đảm bảo 2 user cùng password vẫn có hash khác nhau.

---

#### `bcrypt`
> **Dịch:** (Tên thư viện, giữ nguyên)

Thuật toán hash password. Đặc điểm: có salt, chậm có chủ đích (khó brute-force), `salt rounds` càng cao càng chậm và an toàn.

---

#### `XSS` (Cross-Site Scripting)
> **Dịch:** Tấn công chèn script qua site

Tấn công bằng cách chèn script độc hại vào trang web. Script chạy trong browser của victim → có thể đọc localStorage, cookie, ăn cắp token. HttpOnly Cookie ngăn chặn XSS đọc refreshToken.

---

#### `SQL Injection` / `NoSQL Injection`
> **Dịch:** Tấn công chèn câu lệnh SQL/NoSQL

Chèn code độc hại vào input để thao túng câu lệnh DB. Phòng ngừa: validate và escape input trước khi đưa vào query.

---

#### `Rainbow Table`
> **Dịch:** Bảng cầu vồng (tên kỹ thuật, giữ nguyên)

Bảng tra cứu ánh xạ hash → password phổ biến. Nếu không có salt, hash MD5 của "123456" luôn giống nhau → tra bảng ra ngay. Salt phá vỡ rainbow table vì mỗi hash là duy nhất.

---

#### `Brute Force`
> **Dịch:** Tấn công vét cạn

Thử tất cả tổ hợp có thể để tìm password/key đúng. bcrypt làm mỗi lần hash mất ~100ms → brute force trở nên cực kỳ chậm.

---

### NHÓM 6 — State Management & Kiến Trúc

---

#### `State Management`
> **Dịch:** Quản lý trạng thái

Hệ thống quản lý dữ liệu dùng chung giữa nhiều component. Giải quyết vấn đề prop drilling và đồng bộ state giữa các component không liên quan trong cây component.

---

#### `Store`
> **Dịch:** Kho dữ liệu

Object trung tâm lưu trữ toàn bộ state của ứng dụng (hoặc một phần). Components subscribe vào store, tự động re-render khi store thay đổi.

---

#### `Subscribe`
> **Dịch:** Đăng ký / Lắng nghe

Đăng ký nhận thông báo khi dữ liệu thay đổi. Component "subscribe" vào store → khi store update → component tự re-render.

---

#### `Persist` / `Persistence`
> **Dịch:** Lưu bền vững

Dữ liệu vẫn tồn tại sau khi reload trang. Zustand persist middleware tự động lưu store vào localStorage và khôi phục khi app khởi động lại.

---

#### `Hydration` / `Hydrate`
> **Dịch:** Bơm dữ liệu / Khôi phục trạng thái

Quá trình khôi phục state từ nơi lưu trữ (localStorage, cookie) vào memory khi app khởi động lại. `hydrateAuth()` trong dự án: đọc token từ localStorage → verify với server → khôi phục session.

---

#### `MVC` (Model — View — Controller)
> **Dịch:** Mô hình — Giao diện — Bộ điều khiển

Pattern kiến trúc phân chia ứng dụng thành 3 lớp:
- **Model**: Dữ liệu và business logic
- **View**: Giao diện người dùng
- **Controller**: Nhận input, điều phối Model và View

---

#### `Pattern`
> **Dịch:** Mẫu thiết kế / Quy ước

Giải pháp đã được kiểm chứng cho vấn đề thường gặp trong lập trình. Ví dụ: Thin Controller Pattern, Service Layer Pattern, ...

---

#### `Anti-pattern`
> **Dịch:** Mẫu thiết kế xấu / Cách làm không nên

Cách tiếp cận trông có vẻ giải quyết được vấn đề nhưng thực ra gây ra vấn đề khác. Ví dụ: Prop Drilling, callback hell.

---

#### `Singleton`
> **Dịch:** Thể hiện duy nhất

Pattern đảm bảo chỉ có 1 instance duy nhất của một class/object trong suốt vòng đời ứng dụng. Zustand store là singleton — tất cả component dùng chung 1 store object.

---

### NHÓM 7 — Build & Development Tools

---

#### `Vite`
> **Dịch:** (Tên công cụ, tiếng Pháp nghĩa là "Nhanh")

Build tool và dev server hiện đại cho frontend. Dùng ES modules gốc của trình duyệt thay vì bundle khi dev → khởi động gần như tức thì.

---

#### `Bundle` / `Bundler`
> **Dịch:** Gói / Công cụ đóng gói

Gộp nhiều file JS/CSS thành ít file hơn để browser tải về. Webpack, Vite, Rollup là các bundler.

---

#### `Hot Module Replacement (HMR)`
> **Dịch:** Thay thế module nóng

Khi sửa code, chỉ phần đó được cập nhật trong trình duyệt **mà không cần reload toàn trang**. Giữ nguyên state hiện tại.

---

#### `Environment Variable`
> **Dịch:** Biến môi trường

Biến được đặt bên ngoài code, thay đổi theo môi trường (development, production). Ví dụ: `process.env.PORT`, `process.env.ACCESS_TOKEN_SECRET`. Lưu trong file `.env`, không commit lên git.

---

#### `ES Module` (ESM) vs `CommonJS` (CJS)
> **Dịch:** Hệ thống module ES vs CommonJS

2 hệ thống module của JavaScript:
- **CommonJS**: `require()` / `module.exports` — Node.js cũ
- **ES Module**: `import` / `export` — chuẩn hiện đại, dự án này dùng

---

#### `Axios`
> **Dịch:** (Tên thư viện, giữ nguyên)

Thư viện HTTP client cho JavaScript. Dễ dùng hơn `fetch` gốc: tự parse JSON, interceptors, timeout, cancel request.

---

#### `Interceptor`
> **Dịch:** Bộ chặn / Lớp xử lý trung gian

Trong Axios: hàm chạy **trước khi gửi** request hoặc **sau khi nhận** response. Dùng để tự động gắn token, xử lý lỗi toàn cục, auto-refresh token.

---

#### `Debounce`
> **Dịch:** Chống dội / Trì hoãn thực thi

Kỹ thuật trì hoãn thực thi hàm đến khi không còn được gọi trong X ms. Dùng cho search input — chỉ gọi API sau khi user dừng gõ 300ms, không gọi mỗi keystroke.

---

#### `Slug`
> **Dịch:** Định danh thân thiện URL

Phiên bản URL-safe của text: chữ thường, không dấu, dùng dấu gạch ngang. Ví dụ: "Áo Polo Trắng" → `ao-polo-trang`.

---

#### `BSON` (Binary JSON)
> **Dịch:** JSON nhị phân

Format lưu trữ MongoDB — giống JSON nhưng dạng binary, hỗ trợ thêm kiểu dữ liệu (Date, ObjectId, Binary).

---

#### `Refactor`
> **Dịch:** Tái cấu trúc code

Cải thiện cấu trúc code mà không thay đổi chức năng bên ngoài. Mục đích: dễ đọc, dễ maintain, ít bug hơn.

---

#### `Deploy`
> **Dịch:** Triển khai

Đưa ứng dụng từ môi trường development lên server thật để người dùng truy cập.

---

#### `Production` vs `Development`
> **Dịch:** Môi trường sản xuất vs Môi trường phát triển

- **Development**: Môi trường local của dev — debug mode, hot reload, error details
- **Production**: Server thật cho user — optimized, minified, no debug info

---

## 1. JavaScript Cốt Lõi

---

### Q1 — Sự khác biệt giữa `var`, `let`, `const` là gì?

**Trả lời:**

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisting | Có (undefined) | Có (TDZ) | Có (TDZ) |
| Khai báo lại | Được | Không | Không |
| Reassign | Được | Được | Không |

- **`var`**: phạm vi function, bị hoisting lên đầu hàm với giá trị `undefined` — dễ gây bug khó tìm.
- **`let`**: phạm vi block `{}`, không thể khai báo lại trong cùng scope.
- **`const`**: phạm vi block, không thể reassign biến — nhưng nếu là object/array thì vẫn mutate được bên trong.

```js
// var — lỗi khó tìm
for (var i = 0; i < 3; i++) {}
console.log(i) // 3 — vẫn tồn tại ra ngoài loop!

// let — đúng hơn
for (let j = 0; j < 3; j++) {}
console.log(j) // ReferenceError — j không tồn tại ngoài block

// const — không reassign được
const user = { name: "Tuân" }
user.name = "An"      // OK — mutate object bên trong
user = { name: "An" } // TypeError — không thể reassign
```

**Ví dụ trong dự án (`productController.js`):**
```js
const limitNum = Math.min(200, Math.max(1, Number(limit))) // không bao giờ đổi → const
let products, total  // cần gán lại sau await → let
```

> **Quy tắc thực tế:** Luôn dùng `const` trước. Chỉ đổi sang `let` khi biết biến sẽ được reassign. Không bao giờ dùng `var` trong code hiện đại.

---

### Q2 — `async/await` là gì? Tại sao dùng thay vì `.then()`?

**Trả lời:**

`async/await` là cú pháp (syntax sugar) xây dựng trên Promise, giúp viết code bất đồng bộ trông như đồng bộ — dễ đọc, dễ debug, dễ xử lý lỗi hơn.

```js
// Cách cũ — Promise chain (callback hell)
getUser(id)
  .then(user => getOrders(user.id))
  .then(orders => getProducts(orders[0].productId))
  .then(product => console.log(product))
  .catch(err => console.error(err))

// Cách mới — async/await
async function loadData(id) {
  try {
    const user = await getUser(id)
    const orders = await getOrders(user.id)
    const product = await getProducts(orders[0].productId)
    console.log(product)
  } catch (err) {
    console.error(err)  // 1 chỗ xử lý lỗi cho tất cả
  }
}
```

- `async` trước function → hàm luôn trả về Promise
- `await` dừng thực thi bên trong hàm async, chờ Promise resolve — **không block** thread chính

**Ví dụ trong dự án (`productController.js`):**
```js
export const getProducts = async (req, res) => {
  try {
    const filter = await buildProductFilter(req.query) // chờ service
    const products = await Product.find(filter)         // chờ MongoDB
    return res.status(200).json({ products })
  } catch (error) {
    return res.status(500).json({ message: "Lỗi hệ thống" })
  }
}
```

---

### Q3 — `Promise.all()` là gì? Khi nào dùng?

**Trả lời:**

`Promise.all(array)` nhận vào mảng Promises, chạy chúng **song song**, và chờ **tất cả** hoàn thành. Nếu 1 cái fail → toàn bộ fail.

```js
// Chạy tuần tự — chậm (tổng = t1 + t2)
const products = await Product.find(filter)   // mất 50ms
const total = await Product.countDocuments()  // mất 30ms
// Tổng: 80ms

// Chạy song song — nhanh hơn (tổng = max(t1, t2))
const [products, total] = await Promise.all([
  Product.find(filter),          // 50ms
  Product.countDocuments(filter) // 30ms  — chạy cùng lúc
])
// Tổng: 50ms
```

Dùng khi: các task **độc lập** với nhau (không cần kết quả của task này để chạy task kia).

**Ví dụ trong dự án (`productController.js` dòng 63-69):**
```js
[products, total] = await Promise.all([
  Product.find(cursorFilter)
    .populate("category", "name slug")
    .sort(sortOption)
    .limit(limitNum),
  Product.countDocuments(filter),
])
// Tìm sản phẩm và đếm tổng chạy song song → response nhanh hơn
```

---

### Q4 — Closure là gì?

**Trả lời:**

Closure là khi một hàm con **nhớ** biến của scope cha, kể cả sau khi hàm cha đã chạy xong.

```js
function makeCounter() {
  let count = 0  // biến của hàm cha

  return function() {
    count++        // hàm con "nhớ" và truy cập được count
    return count
  }
}

const counter = makeCounter() // hàm cha đã chạy xong
counter() // 1
counter() // 2 — count vẫn được nhớ!
```

Closure xuất hiện ở khắp nơi trong React và Zustand mà thường không để ý.

**Ví dụ trong dự án (`authStore.js`):**
```js
export const useAuthStore = create(
  (set, get) => ({           // hàm cha — truyền set, get
    accessToken: null,

    login: async (credentials) => {
      // "login" là closure — nhớ set, get từ hàm cha create()
      // Kể cả sau khi create() chạy xong, login vẫn dùng được set/get
      set({ isLoading: true })
      const currentToken = get().accessToken
    }
  })
)
```

---

### Q5 — Spread operator `...` và Destructuring là gì?

**Trả lời:**

**Destructuring** — Lấy giá trị từ object/array ra biến riêng:
```js
// Object destructuring
const { name, price, category } = product
// Thay vì: product.name, product.price, product.category

// Với giá trị mặc định
const { page = 1, limit = 12, sort = "newest" } = req.query

// Array destructuring
const [first, second] = [10, 20]
const [products, total] = await Promise.all([...])
```

**Spread operator `...`** — "Trải" phần tử ra:
```js
// Copy và merge object
const updated = { ...oldObject, name: "Mới" }
// Giữ lại tất cả field cũ, chỉ override "name"

// Merge arrays
const all = [...arr1, ...arr2]
```

**Ví dụ trong dự án (`authStore.js` dòng 21):**
```js
// Cập nhật profile — giữ nguyên các field cũ, chỉ đổi field mới
setUser: (userData) => set((state) => ({
  user: { ...state.user, ...userData }
  //     └── giữ email, role, ...  └── ghi đè displayName, avatarUrl, ...
}))
```

**Ví dụ trong dự án (`server.js` dòng 39-44):**
```js
const envAllowedOrigins = [
  ...(process.env.CORS_ORIGINS || "").split(","),  // trải array ra
  process.env.FRONTEND_URL || "",
].filter(Boolean)
```

---

## 2. Node.js

---

### Q6 — Node.js là gì? Điểm mạnh so với các backend khác?

**Trả lời:**

Node.js là **runtime environment** (môi trường chạy) JavaScript ở phía server, sử dụng V8 engine của Chrome.

**Đặc điểm nổi bật:**
- **Single-threaded + Event Loop**: 1 thread chính, nhưng I/O bất đồng bộ — không block khi chờ DB, file, network
- **Non-blocking I/O**: Gửi query DB xong → đi xử lý request khác → khi DB trả kết quả mới callback
- **JavaScript everywhere**: Dùng JS ở cả frontend lẫn backend → share code, đội dev linh hoạt hơn
- **npm ecosystem**: Hàng triệu package sẵn có

```
Mô hình xử lý request:

Java/PHP (truyền thống):        Node.js:
Request 1 → Thread 1            Request 1 ┐
Request 2 → Thread 2            Request 2 ├── Event Loop → callback queue
Request 3 → Thread 3            Request 3 ┘
(tạo thread tốn RAM)            (1 thread, I/O bất đồng bộ)
```

**Phù hợp với:** API server, real-time app, microservices, I/O-heavy workloads.
**Không phù hợp:** CPU-intensive tasks (machine learning, video encoding).

**Ví dụ trong dự án:** `backend/server.js` — Express server lắng nghe port 5000, xử lý đồng thời nhiều request từ frontend mà không tạo thread mới cho mỗi request.

---

### Q7 — `package.json` dùng để làm gì? `dependencies` vs `devDependencies` khác gì?

**Trả lời:**

`package.json` là file cấu hình của Node.js project, chứa:
- **metadata**: tên, version, description
- **scripts**: lệnh tắt (`npm run dev`, `npm start`)
- **dependencies**: package cần thiết khi chạy production
- **devDependencies**: package chỉ cần khi development (linting, testing, build tools)

```json
{
  "scripts": {
    "dev": "node server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^5.2.1",     // Cần khi chạy thật
    "mongoose": "^9.6.2",
    "jsonwebtoken": "^9.0.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"      // Chỉ cần khi dev (auto-reload)
  }
}
```

`npm install` → tải cả `dependencies` + `devDependencies`
`npm install --production` → chỉ tải `dependencies` (dùng khi deploy)

---

## 3. Express.js

---

### Q8 — Middleware trong Express là gì? Cho ví dụ.

**Trả lời:**

Middleware là hàm có signature `(req, res, next)` chạy **giữa** lúc nhận request và lúc gửi response. Mỗi middleware có thể:
1. Đọc/sửa `req` hoặc `res`
2. Gọi `next()` để chuyển sang middleware tiếp theo
3. Kết thúc chuỗi bằng cách gửi response (không gọi `next()`)

```
Request → [CORS] → [parseJSON] → [auth check] → [controller] → Response
```

**Ví dụ trong dự án (`authMiddleware.js`):**
```js
export const protectedRoute = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" })
    // Không gọi next() → dừng chuỗi tại đây
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  req.user = await User.findById(decoded.userId) // Gắn thêm vào req
  next() // Cho đi tiếp vào controller
}
```

**Trong `server.js` có 2 loại middleware:**
```js
// Global middleware — áp dụng cho MỌI request
app.use(cors({ ... }))        // kiểm tra CORS
app.use(express.json())       // parse JSON body
app.use(cookieParser())       // parse cookies
app.use(protectedRoute)       // bảo vệ toàn bộ route bên dưới

// Route-level middleware — chỉ áp dụng cho route cụ thể
router.post("/products", adminRoute, createProduct)
//                          ↑ chỉ route này cần admin
```

---

### Q9 — REST API là gì? Phân biệt GET, POST, PUT/PATCH, DELETE.

**Trả lời:**

REST (Representational State Transfer) là kiến trúc thiết kế API dùng HTTP. Mỗi **resource** có URL riêng, tương tác qua HTTP methods:

| Method | Mục đích | Idempotent | Body |
|---|---|---|---|
| `GET` | Đọc dữ liệu | Có | Không |
| `POST` | Tạo mới | Không | Có |
| `PUT` | Cập nhật toàn bộ | Có | Có |
| `PATCH` | Cập nhật một phần | Có | Có |
| `DELETE` | Xóa | Có | Không |

> **Idempotent** = gọi 1 lần hay 100 lần kết quả như nhau

**Ví dụ trong dự án — Product API:**
```
GET    /api/products           → Lấy danh sách sản phẩm
GET    /api/products/:slug     → Lấy 1 sản phẩm theo slug
POST   /api/products           → Tạo sản phẩm mới (admin)
PUT    /api/products/:id       → Cập nhật toàn bộ sản phẩm (admin)
DELETE /api/products/:id       → Xóa sản phẩm (admin)

GET    /api/orders/me          → Đơn hàng của tôi
POST   /api/orders             → Tạo đơn hàng mới
PUT    /api/orders/:id/status  → Cập nhật trạng thái (admin)
PUT    /api/orders/:id/cancel  → Hủy đơn hàng (customer)
```

---

### Q10 — HTTP Status Code quan trọng là gì?

**Trả lời:**

| Code | Ý nghĩa | Khi nào dùng |
|---|---|---|
| `200 OK` | Thành công | GET, PUT thành công |
| `201 Created` | Tạo thành công | POST tạo resource mới |
| `400 Bad Request` | Dữ liệu gửi sai/thiếu | Thiếu field, sai format |
| `401 Unauthorized` | Chưa xác thực | Chưa đăng nhập / token không có |
| `403 Forbidden` | Không có quyền | Đã login nhưng không phải admin |
| `404 Not Found` | Không tìm thấy | Resource không tồn tại |
| `409 Conflict` | Xung đột | Slug/email/username trùng |
| `500 Server Error` | Lỗi server | Bug code, DB down |

**Ví dụ trong dự án (`productController.js`):**
```js
// 400 — thiếu field bắt buộc
if (!name || !name.trim()) {
  return res.status(400).json({ message: "Tên sản phẩm là bắt buộc" })
}

// 404 — không tìm thấy
const product = await Product.findById(id)
if (!product) {
  return res.status(404).json({ message: "Không tìm thấy sản phẩm" })
}

// 201 — tạo thành công
return res.status(201).json({ message: "Tạo sản phẩm thành công", product })

// 409 — trùng slug (unique constraint)
if (error.code === 11000) {
  return res.status(409).json({ message: "Slug sản phẩm đã tồn tại" })
}

// 500 — lỗi không lường trước
return res.status(500).json({ message: "Lỗi hệ thống" })
```

---

### Q11 — Làm thế nào để bảo vệ API chỉ cho admin truy cập?

**Trả lời:**

Dùng 2 middleware xếp chồng:
1. `protectedRoute` — xác minh đã đăng nhập, gắn `req.user`
2. `adminRoute` — kiểm tra `req.user.role === "admin"`

```js
// authMiddleware.js
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next()
  }
  return res.status(403).json({ message: "Chỉ dành cho Admin" })
}
```

**Cách áp dụng trong dự án (`productRoute.js`):**
```js
// Public — ai cũng xem được
router.get("/", getProducts)
router.get("/:slug", getProductBySlug)

// Admin only — phải qua adminRoute trước
router.post("/", adminRoute, createProduct)
router.put("/:id", adminRoute, updateProduct)
router.delete("/:id", adminRoute, deleteProduct)
```

Ngoài ra, `protectedRoute` được apply global ở `server.js` dòng 89 — tất cả route bên dưới đều cần token. `adminRoute` thêm lớp kiểm tra role.

---

## 4. MongoDB & Mongoose

---

### Q12 — SQL và NoSQL khác nhau thế nào? Khi nào chọn MongoDB?

**Trả lời:**

| | SQL (MySQL, PostgreSQL) | NoSQL (MongoDB) |
|---|---|---|
| Cấu trúc | Bảng (table/row/column) | Document (JSON object) |
| Schema | Cứng — phải define trước | Linh hoạt — mỗi document có thể khác |
| Quan hệ | JOIN nhiều bảng | Embed hoặc reference |
| Scale | Vertical (nâng cấp server) | Horizontal (thêm server) |
| ACID | Mạnh | Hạn chế hơn (tùy version) |
| Phù hợp | Dữ liệu có quan hệ rõ ràng, cần consistency | Dữ liệu linh hoạt, cần scale, prototype nhanh |

**Chọn MongoDB khi:**
- Schema thay đổi thường xuyên (giai đoạn startup)
- Dữ liệu dạng document, nested (product với variants, user với addresses)
- Cần scale horizontal

**Ví dụ trong dự án — Tại sao MongoDB phù hợp hơn:**
```js
// Product có variants — số lượng khác nhau mỗi sản phẩm
// SQL: cần bảng riêng "product_variants" + JOIN
// MongoDB: lưu thẳng vào document
{
  name: "Áo polo",
  variants: [
    { size: "S", color: "Trắng", stock: 10 },
    { size: "M", color: "Đen",   stock: 5 },
    { size: "L", color: "Trắng", stock: 0 }
  ]
}
```

---

### Q13 — Mongoose Schema là gì? Tại sao cần khi MongoDB đã "schemaless"?

**Trả lời:**

MongoDB bản thân không enforce schema (bạn có thể lưu bất kỳ gì). Mongoose thêm **validation layer ở application level** để:
- Đảm bảo dữ liệu nhất quán (type, required, unique)
- Tự động transform (lowercase, trim)
- Cung cấp hooks (pre-save, post-save)
- Populate (tương tự JOIN)

```js
// Không có Mongoose — có thể lưu rác vào DB
db.users.insertOne({ username: 123, role: "superuser" }) // OK!

// Với Mongoose Schema — validation trước khi lưu
const userSchema = new mongoose.Schema({
  username: {
    type: String,      // phải là string
    required: true,    // bắt buộc
    unique: true,      // không trùng
    trim: true,        // tự cắt khoảng trắng
    lowercase: true,   // tự chuyển lowercase
  },
  role: {
    type: String,
    enum: ["customer", "admin"], // chỉ 2 giá trị này
    default: "customer",
  }
})
```

**Ví dụ trong dự án (`User.js`):**
```js
// Nested schema — địa chỉ có schema riêng
const addressSchema = new mongoose.Schema({
  province: { type: String, required: true },
  district: { type: String, required: true },
  ward:     { type: String, required: true },
  detail:   { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true })

// Reference sang collection khác — tương tự foreign key
wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]

// timestamps: true — tự thêm createdAt, updatedAt
}, { timestamps: true })
```

---

### Q14 — `populate()` trong Mongoose là gì?

**Trả lời:**

`populate()` thay thế ObjectId (reference) bằng document thực từ collection được tham chiếu — tương tự `JOIN` trong SQL.

```js
// Không populate — chỉ có ID
{
  name: "Áo polo",
  category: "64abc123def456..."  // ObjectId thô
}

// Sau populate("category", "name slug")
{
  name: "Áo polo",
  category: {
    _id: "64abc123def456...",
    name: "Áo",
    slug: "ao"
  }
}
```

**Ví dụ trong dự án (`productController.js`):**
```js
const products = await Product.find(filter)
  .populate("category", "name slug")
  // ↑ field    ↑ chỉ lấy 2 field này từ Category (tiết kiệm bandwidth)

// Tương đương SQL:
// SELECT p.*, c.name, c.slug
// FROM products p
// JOIN categories c ON p.category_id = c._id
```

---

### Q15 — Index trong MongoDB là gì? Tại sao quan trọng?

**Trả lời:**

Index là cấu trúc dữ liệu phụ (B-Tree) giúp MongoDB tìm kiếm nhanh mà không cần scan toàn bộ collection.

```
Không có index:       Có index:
[doc1] scan           [index] → trỏ thẳng đến doc
[doc2] scan           Không cần đọc toàn bộ collection
[doc3] scan ✓
[doc4] scan
...10000 docs...
```

**Ví dụ thực tế:** Collection 10,000 sản phẩm, tìm theo `category`:
- Không index: scan 10,000 documents = chậm
- Có index trên `category`: tìm ngay lập tức

**Trong Mongoose, index tự động tạo khi:**
```js
// unique: true → tạo unique index
username: { type: String, unique: true }
email:    { type: String, unique: true }

// Explicit index
productSchema.index({ category: 1 })  // index ascending
productSchema.index({ price: 1, _id: -1 })  // compound index
productSchema.index({ name: "text" })  // text search index
```

**Index có trade-off:** Tăng tốc đọc nhưng chậm hơn khi ghi (phải update index). Không nên thêm index cho mọi field.

---

## 5. React

---

### Q16 — Virtual DOM là gì? Tại sao React dùng?

**Trả lời:**

**DOM thật** (Real DOM): cây HTML element trong trình duyệt. Thao tác trực tiếp tốn kém vì browser phải recalculate layout, repaint.

**Virtual DOM**: Bản copy nhẹ của DOM thật, lưu trong memory dưới dạng JavaScript object.

**Quy trình React:**
```
State thay đổi
    ↓
1. React tạo Virtual DOM mới
    ↓
2. Diff: So sánh Virtual DOM mới vs cũ (reconciliation)
    ↓
3. Chỉ update phần DOM thật thực sự thay đổi (minimal updates)
```

```js
// Ví dụ: chỉ text "Đăng nhập" → "Tuân" thay đổi
// React chỉ update textNode đó, không re-render cả Header
<nav>
  <span>{user.displayName}</span>  {/* chỉ span này update */}
  <ul>...</ul>                     {/* không đụng đến */}
</nav>
```

**Ví dụ trong dự án:** Khi user click "Load More" ở Shop, React chỉ append thêm ProductCard mới vào danh sách, không re-render toàn bộ trang.

---

### Q17 — State và Props khác nhau thế nào?

**Trả lời:**

| | **State** | **Props** |
|---|---|---|
| Nguồn gốc | Nội bộ component (do component tự quản lý) | Truyền từ component cha xuống |
| Mutate | Được — qua setter | Không — read-only trong component con |
| Trigger re-render | Có (khi set) | Có (khi cha re-render với props mới) |

```jsx
// Component cha — truyền props xuống
function ProductList({ products }) {
  const [sortBy, setSortBy] = useState("newest") // state — nội bộ component này

  return products.map(p => (
    <ProductCard
      key={p._id}
      name={p.name}          // props — ProductCard không được sửa name
      price={p.price}        // props
      onAddToCart={() => {}} // props — callback function
    />
  ))
}

// Component con — nhận props, không tự sửa
function ProductCard({ name, price, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false) // state riêng của nó
  // name, price → read-only, không được làm: name = "khác"
  return <div>{name} - {price}</div>
}
```

---

### Q18 — `useEffect` là gì? Dependency array hoạt động thế nào?

**Trả lời:**

`useEffect` chạy **side effects** sau khi component render — những việc không liên quan đến việc render UI: fetch API, subscribe event, thao tác DOM trực tiếp, set timer.

```js
useEffect(() => {
  // Phần effect chạy
  fetchData()

  return () => {
    // Cleanup — chạy khi component unmount hoặc trước khi effect chạy lại
    subscription.unsubscribe()
  }
}, [dependency1, dependency2]) // Dependency array
```

**Dependency array quyết định khi nào effect chạy lại:**

```js
useEffect(() => { ... }, [])
// [] rỗng → chỉ chạy 1 lần sau lần render đầu tiên (componentDidMount)

useEffect(() => { ... }, [page, filter])
// Chạy lại mỗi khi page HOẶC filter thay đổi

useEffect(() => { ... })
// Không có array → chạy lại sau MỖI lần render (ít dùng)
```

**Ví dụ trong dự án (`App.jsx` dòng 56-58):**
```js
useEffect(() => {
  // Khi app khởi động: kiểm tra token cũ trong localStorage
  // → nếu còn hợp lệ → tự động đăng nhập lại
  useAuthStore.getState().hydrateAuth()
}, []) // [] = chỉ chạy 1 lần khi App mount
```

---

### Q19 — Tại sao không được mutate state trực tiếp trong React?

**Trả lời:**

React dùng **shallow comparison** (so sánh reference) để phát hiện state có thay đổi không. Nếu mutate trực tiếp → reference không đổi → React không biết cần re-render → UI không cập nhật.

```jsx
// SAI ❌ — mutate trực tiếp
const [items, setItems] = useState([])

function addItem(newItem) {
  items.push(newItem)      // reference của items không đổi!
  setItems(items)          // React thấy "à reference vẫn vậy" → không re-render
}

// ĐÚNG ✅ — tạo array mới
function addItem(newItem) {
  setItems([...items, newItem])  // array mới → reference mới → re-render
  // hoặc:
  setItems(prev => [...prev, newItem])  // functional update — an toàn hơn
}
```

**Nguyên tắc Immutability:**
```js
// Object
setUser({ ...user, displayName: "Tân" })  // object mới

// Array — thêm
setItems(prev => [...prev, newItem])

// Array — xóa
setItems(prev => prev.filter(item => item.id !== id))

// Array — sửa
setItems(prev => prev.map(item =>
  item.id === id ? { ...item, quantity: item.quantity + 1 } : item
))
```

---

### Q20 — React Component Lifecycle là gì?

**Trả lời:**

Lifecycle là các giai đoạn một component trải qua:

```
Mount         →     Update          →     Unmount
(xuất hiện)         (state/props đổi)     (bị xóa)
```

**Map với hooks:**
```js
// Mount — chạy 1 lần sau render đầu
useEffect(() => {
  console.log("Component vừa mount")
  fetchInitialData()
}, [])

// Update — chạy khi dependency thay đổi
useEffect(() => {
  console.log("page hoặc filter đổi → fetch lại")
  fetchProducts()
}, [page, filter])

// Unmount — cleanup function
useEffect(() => {
  const timer = setInterval(() => {}, 1000)

  return () => {
    clearInterval(timer) // Dọn dẹp khi component bị xóa
    console.log("Component unmount")
  }
}, [])
```

**Ví dụ trong dự án:**

`App.jsx` — mount: gọi `hydrateAuth()` để phục hồi session

```js
useEffect(() => {
  useAuthStore.getState().hydrateAuth() // Mount: kiểm tra session cũ
}, [])
```

---

## 6. Authentication & Bảo Mật

---

### Q21 — JWT là gì? Hoạt động thế nào?

**Trả lời:**

JWT (JSON Web Token) là chuỗi mã hóa dùng để xác thực, gồm 3 phần ngăn cách bởi dấu `.`:

```
header.payload.signature
eyJhbGci....eyJ1c2VySWQi....xK2mN9...
```

- **Header**: thuật toán ký (HS256)
- **Payload**: dữ liệu (userId, role, expiry) — **không mã hóa**, chỉ base64
- **Signature**: `HMAC_SHA256(header + payload, secret_key)` — đảm bảo không bị giả mạo

**Quy trình:**
```
1. Client gửi username/password
2. Server xác minh → tạo JWT, ký bằng secret key
3. Client nhận JWT, lưu lại
4. Mỗi request sau: gửi JWT trong header
5. Server verify chữ ký → decode payload → biết user là ai
   (Không cần query DB mỗi lần!)
```

**Ví dụ trong dự án (`authMiddleware.js`):**
```js
// Verify JWT — không cần query DB
const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
// decoded = { userId: "64abc...", role: "customer", iat: ..., exp: ... }

// Chỉ query DB để lấy thông tin mới nhất của user
const user = await User.findById(decoded.userId).select("-hashedPassword")
req.user = user
```

**Lưu ý bảo mật:** Payload có thể đọc được nếu biết base64 decode — **không lưu thông tin nhạy cảm** (password, secret) trong payload.

---

### Q22 — Tại sao cần Refresh Token? Access Token và Refresh Token khác gì?

**Trả lời:**

**Vấn đề:** Token càng tồn tại lâu → càng nguy hiểm nếu bị đánh cắp.

**Giải pháp:** Tách thành 2 loại token:

| | Access Token | Refresh Token |
|---|---|---|
| Tuổi thọ | Ngắn (30 phút) | Dài (14 ngày) |
| Lưu ở đâu | Memory / localStorage | HttpOnly Cookie |
| Dùng để | Xác thực mọi API call | Chỉ để lấy Access Token mới |
| JS có đọc được? | Có | Không (HttpOnly) |
| Nếu bị đánh cắp | Thiệt hại tối đa 30 phút | Khó bị đánh cắp hơn |

**HttpOnly Cookie** — trình duyệt tự gửi kèm request, JavaScript không đọc được → an toàn hơn trước **XSS attacks**.

**Flow trong dự án:**
```
Đăng nhập:
  Server → accessToken (30m) trong response body
         → refreshToken (14d) trong HttpOnly Cookie

30 phút sau:
  Request → 403 (token hết hạn)
  api.js interceptor tự gọi POST /auth/refresh
  Server đọc refreshToken từ cookie → cấp accessToken mới
  Retry request gốc với token mới
  User không hề biết gì → trải nghiệm liền mạch
```

---

### Q23 — Bcrypt là gì? Tại sao không lưu password dạng plain text hay MD5?

**Trả lời:**

**Plain text:** Nếu DB bị hack → tất cả password lộ ngay.

**MD5/SHA1:** Hash nhanh nhưng dễ bị **Rainbow Table attack** (bảng tra cứu hash → password).

**Bcrypt:** Hash chậm có chủ đích + **salt** ngẫu nhiên:
- Salt: chuỗi random thêm vào password trước khi hash → 2 user cùng password vẫn có hash khác nhau
- Slow by design: tính 1 hash mất ~100ms → brute force 1 tỷ password mất 3000 năm

```js
// Đăng ký — hash password trước khi lưu vào DB
const hashedPassword = await bcrypt.hash(password, 10)
// 10 = salt rounds → càng cao càng chậm (và an toàn hơn)

await User.create({ username, email, hashedPassword })
// Không bao giờ lưu password thô vào DB

// Đăng nhập — so sánh với hash trong DB
const isMatch = await bcrypt.compare(inputPassword, user.hashedPassword)
// bcrypt tự extract salt từ hash → so sánh
if (!isMatch) throw new Error("Sai mật khẩu")
```

**Ví dụ trong dự án:** `User.js` lưu field `hashedPassword` (không phải `password`). Trong `authService.js`: `bcrypt.hash(password, 10)` khi tạo user, `bcrypt.compare()` khi đăng nhập.

---

## 7. State Management

---

### Q24 — Tại sao cần State Management (Zustand)? `useState` không đủ sao?

**Trả lời:**

`useState` hoạt động tốt cho state cục bộ của 1 component. Vấn đề xảy ra khi nhiều component ở các tầng khác nhau cần **chia sẻ cùng dữ liệu**.

**Vấn đề "Prop Drilling":**
```
App
 └── Header (cần cartItems.length để hiển thị badge)
      └── ...
 └── CartPage (cần cartItems để render list)
      └── CartItem
           └── CartSummary (cần cartItems để tính tổng)
                └── Checkout (cần cartItems để tạo order)

// Phải truyền cartItems qua 4-5 tầng dù các tầng giữa không dùng
```

**Giải pháp — Global Store:**
```
Zustand cartStore
    ↑ subscribe trực tiếp
Header ─────────────┐
CartPage ───────────┤  Không cần prop drilling
CartSummary ────────┤
Checkout ───────────┘
```

**Ví dụ trong dự án:**

4 Stores:
- `authStore` — user info, token, đăng nhập/đăng xuất
- `cartStore` — giỏ hàng, sync với API
- `uiStore` — sidebar, modal states
- `wishlistStore` — danh sách yêu thích

Header dùng `useAuthStore` + `useCartStore` mà không cần App truyền props xuống.

---

### Q25 — Sự khác biệt giữa Zustand và Redux?

**Trả lời:**

| | **Zustand** | **Redux** |
|---|---|---|
| Boilerplate | Rất ít | Nhiều |
| Cấu trúc | State + actions trong 1 chỗ | Actions / Reducers / Selectors tách biệt |
| Setup | `create()` là xong | Store + Provider + Reducer + Action |
| DevTools | Có (plugin) | Rất mạnh (time-travel debugging) |
| Performance | Tốt | Tốt (với selector đúng) |
| Phù hợp | Small-medium apps, prototype nhanh | Large apps, nhiều dev, cần strict patterns |

**Redux pattern (để so sánh):**
```js
// Redux — nhiều file, nhiều boilerplate
// actions/cart.js
const ADD_ITEM = "cart/ADD_ITEM"
const addItem = (item) => ({ type: ADD_ITEM, payload: item })

// reducers/cart.js
function cartReducer(state = [], action) {
  switch (action.type) {
    case ADD_ITEM: return [...state, action.payload]
  }
}

// Trong component
dispatch(addItem(product))
```

**Zustand pattern (dự án đang dùng):**
```js
// authStore.js — mọi thứ trong 1 chỗ
const useAuthStore = create((set, get) => ({
  user: null,
  login: async (credentials) => {
    const data = await api.post("/auth/signin", credentials)
    set({ user: data.user, isAuthenticated: true })
  }
}))

// Trong component — đơn giản hơn nhiều
const login = useAuthStore(state => state.login)
```

---

## 8. Câu Hỏi Tổng Hợp

---

### Q26 — Mô tả luồng đăng nhập từ khi user click "Login" đến khi vào trang chủ.

**Trả lời (từ dự án):**

```
1. [Browser] User điền username + password, click Submit

2. [Form Validation] React Hook Form + Zod validate:
   - username không rỗng
   - password >= 6 ký tự
   → Nếu fail: hiển thị lỗi ngay, KHÔNG gọi API

3. [authStore.login()] Gọi api.post("/auth/signin", { identifier, password })

4. [Axios Interceptor] Gắn Content-Type: application/json

5. [Express] server.js → authRoute → authController.signin()

6. [authController]
   - Tìm user theo username hoặc email
   - bcrypt.compare(password, user.hashedPassword)
   - Tạo accessToken (JWT, 30 phút)
   - Tạo refreshToken, lưu vào MongoDB Session
   - Gửi refreshToken qua Set-Cookie (HttpOnly)
   - Trả response: { accessToken, user }

7. [authStore.login() tiếp theo]
   - Lưu accessToken vào Zustand state
   - Persist ra localStorage (key: "auth-storage")
   - setAccessToken() → axios sẽ tự gắn token vào mọi request sau
   - Gọi cartStore.fetchCart() + wishlistStore.fetchWishlist()

8. [Toast] Sonner hiển thị "Đăng nhập thành công!"

9. [React Router] Navigate về "/home"

10. [Lần tải lại trang sau]
    App.jsx → useEffect → hydrateAuth()
    → Đọc accessToken từ localStorage
    → Gọi GET /users/me để verify còn hợp lệ không
    → Nếu có: tự động đăng nhập lại (không cần nhập lại)
```

---

### Q27 — Dự án của bạn xử lý bảo mật như thế nào?

**Trả lời (từ dự án):**

```
1. Authentication
   - JWT accessToken (30 phút) + refreshToken (14 ngày, HttpOnly Cookie)
   - protectedRoute middleware verify JWT trước mọi private route
   - adminRoute middleware kiểm tra role

2. Password Security
   - bcrypt hash với salt rounds = 10
   - Không bao giờ trả hashedPassword trong response
   - User.findById().select("-hashedPassword")

3. Input Validation
   - Backend: validate tất cả input trước khi query DB
   - Escape regex characters trước khi dùng $regex
   - Mongoose Schema validation (type, enum, required)

4. CORS
   - Whitelist chỉ cho phép frontend domain

5. File Upload
   - Giới hạn 5MB, chỉ chấp nhận JPEG/PNG/WebP/GIF
   - Chỉ admin được upload

6. Không leak thông tin nhạy cảm
   - Không trả error.stack trong response
   - Chỉ log ra console server
```

---

### Q28 — CORS là gì? Tại sao phải cấu hình?

**Trả lời:**

**CORS** (Cross-Origin Resource Sharing) là cơ chế bảo mật của trình duyệt: chặn request JavaScript đến domain/port **khác** với trang hiện tại.

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
→ Khác port = khác "origin" → trình duyệt chặn!
```

**Tại sao tồn tại?** Bảo vệ user: nếu không có CORS, website độc hại có thể gọi API ngân hàng của bạn bằng cookie đã lưu.

**Giải pháp:** Backend thêm header cho phép origin cụ thể:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

**Ví dụ trong dự án (`server.js` dòng 33-67):**
```js
const allowedOrigins = new Set([
  "http://localhost:5173",   // Vite dev server
  "http://localhost:5174",
  "http://localhost:5175",
  // + từ env variables khi deploy
])

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true)  // Cho phép
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`))
    }
  },
  credentials: true,  // Cần thiết để cookie (refreshToken) hoạt động
}))
```

**Lưu ý:** CORS chỉ ảnh hưởng browser. Tool như Postman, curl không bị chặn CORS.

---

## BẢNG TỔNG KẾT MỨC ĐỘ ƯU TIÊN

| Mức độ | Câu hỏi | Lý do |
|---|---|---|
| **Chắc chắn hỏi** | Q1, Q2, Q8, Q9, Q10, Q16, Q17, Q18, Q21, Q26 | Kiến thức nền tảng |
| **Hay hỏi** | Q3, Q4, Q5, Q12, Q13, Q14, Q19, Q24, Q28 | Hiểu sâu hơn một bậc |
| **Câu phân loại** | Q6, Q11, Q15, Q22, Q23, Q25, Q27 | Phân biệt intern tốt / trung bình |

---

## MẸO KHI TRẢ LỜI PHỎNG VẤN

1. **Trả lời theo cấu trúc:** Định nghĩa → Tại sao dùng → Ví dụ thực tế từ dự án
2. **Luôn có ví dụ cụ thể:** "Trong dự án của tôi, tôi dùng X để giải quyết Y..."
3. **Thừa nhận không biết đúng cách:** "Tôi chưa dùng nhiều nhưng tôi hiểu nó dùng để..."
4. **Đừng đọc thuộc lòng:** Giải thích bằng lời của bạn, không thuộc định nghĩa
5. **Liên kết kiến thức:** Khi trả lời JWT → tự nhiên nhắc đến bcrypt, refresh token → thể hiện hiểu tổng thể
