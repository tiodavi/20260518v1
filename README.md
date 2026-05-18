# Project Specification: Bicycle Rental System (Vercel + Neon)

## 1. 核心開發指令 (Base Template)
- **參考模板**: 請完全參考並依據此專案的技術架構與程式碼風格進行開發：
- **首要任務**: 請先分析該模板專案的目錄結構、環境變數配置、資料庫 ORM 設定（Drizzle）、驗證機制（Auth）以及 UI 元件庫配置。
- **開發目標**: 在該模板的基礎與規範下，延伸建立一個包含「使用者前台」與「管理者後台」的「腳踏車租借系統」。
- **部署目標**: Vercel (前端與 API) + Neon (Serverless PostgreSQL)。

---

## 2. 角色與權限規範
必須延續模板中的認證/路由保護機制（若模板未提供，請自動生成符合業界規範的實作），區分以下權限：
- **訪客 (Visitor)**: 僅能瀏覽首頁、車款列表與詳細頁。
- **註冊會員 (User)**: 可預約腳踏車、查看個人租借紀錄、進行還車/續租模擬。
- **系統管理員 (Admin)**: 可進入獨立的後台管理系統（路由需嚴格保護，如 `/admin/*`）。

---

## 3. 功能需求範疇

### A. 使用者前台 (User Frontend)
1. **首頁 (Home)**: 具備吸引力的 Hero Section、熱門車款推薦、動態租借流程簡介。
2. **車款探索與篩選 (Catalog)**: 支援依車款類型（公路車、登山車、電輔車）、租金範圍、目前是否可租借進行篩選與搜尋。
3. **詳細資訊與預約 (Detail & Booking)**:
   - 顯示車輛狀態（可租借、已出租、維修中）。
   - 內建日期與時間選擇器，自動計算預估租金總額（單價 * 時數/天數）。
   - 送出預約訂單。
4. **個人會員中心 (User Dashboard)**:
   - 顯示當前租借中的車輛、剩餘時間或已計費時間。
   - 歷史訂單紀錄（明細、狀態：已完成、租借中、已取消）。

### B. 管理者後台 (Admin Backend)
1. **營運儀表板 (Dashboard)**: 視覺化圖表或卡片，顯示今日營運額、目前出租車輛數、車輛妥善率、即時借還動態。
2. **腳踏車資產管理 (Bike CRUD)**: 完整的新增、讀取、更新、刪除車輛功能（欄位：名稱、類型、圖片 URL、每小時/每日租金、目前狀態描述）。
3. **租借訂單調度 (Order Management)**: 檢視全系統訂單，管理者可手動變更狀態（例如：確認歸還、標記異常、取消訂單）。
4. **用戶管理 (User Management)**: 檢視註冊用戶名單。

---

## 4. 資料庫結構要求 (Database Schema)
請配合 Neon Postgres 並沿用模板的 ORM 工具建立或擴充以下 Table 關聯：

- **User (用戶)**: 需包含 `id`, `name`, `email`, `role` (USER/ADMIN)。
- **Bike (腳踏車)**: 需包含 `id`, `name`, `type`, `imageUrl`, `price`, `status` (AVAILABLE, RENTED, MAINTENANCE), `description`。
- **Rental (租借紀錄)**: 需包含 `id`, `userId` (FK), `bikeId` (FK), `startTime`, `endTime`, `totalPrice`, `status` (PENDING, ACTIVE, RETURNED, OVERDUE)。

---

## 5. UI/UX 視覺與元件規範
- **風格**: 沿用模板的 UI 語彙（如 Tailwind 主色調、Shadcn 主題變數）。若模板為全黑白或未定風格，請使用活力運動風（如 `#22c55e` 綠色或 `#3b82f6` 藍色為主色）。
- **佈局**: 前台重視行動端體驗（方便手機網頁操作）；後台重視桌機端資訊密度與 Scannability（易讀性）。

---

## 6. 開發實作步驟 (Implementation Steps)
1. **Step 1**: 解析並初始化 `20260518v1` 模板環境，確保現有程式碼能正常運作。
2. **Step 2**: 根據上述 Schema，編寫資料庫 Migration 並同步至 Neon 測試庫。
3. **Step 3**: 實作使用者前台的車款瀏覽與預約邏輯（含時間與金額計算）。
4. **Step 4**: 實作管理者後台的 CRUD 與營運數據統計。
5. **Step 5**: 優化全站的 Edge Cases（如：重覆預約同一輛車的阻擋機制、未登入攔截等）。