import { createFactories } from './batch-helpers.mjs';

/** Official exam → matrix slot topical mapping (not by question order on paper). */
export const OFFICIAL_SLOT_REFS = {
  P1_01: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q07', note: 'sin x = 0 — bank-p1-01-b02' },
  ],
  P1_02: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q06', note: 'CSC u_5 — bank-p1-02-b02' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q02', note: 'CSN u_3 — bank-p1-02-b03' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q04', note: 'CSC u_2 — bank-p1-02-b04' },
  ],
  P1_03: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q01', note: 'Lăng trụ vectơ — chủ đề solid' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q02', note: 'Hình hộp song song mặt phẳng' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q12', note: 'Thể tích chóp — bank-p1-03-b03' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q09', note: 'Hình lập phương vectơ — solid' },
  ],
  P1_04: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q09', note: 'Hình lập phương — bank-p1-04-b10' },
  ],
  P1_05: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q05', note: 'log_3(3x)=2 — bank-p1-05-b02' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q10', note: 'log_3(2x-1)=2 — bank-p1-05-b03' },
  ],
  P1_06: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q07', note: 'Trung vị mẫu ghép — bank-p1-06-b02' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q03', note: 'Tứ phân vị Q_3 mẫu ghép' },
  ],
  P1_07: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q10', note: 'Đạo hàm tổng — bank-p1-07-b02' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q11', note: 'Tiệm cận hàm hữu tỉ' },
  ],
  P1_08: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q03', note: 'Nguyên hàm F(x)=5x³ — bank-p1-08-b02' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q05', note: 'Họ nguyên hàm x² — bank-p1-08-b03' },
  ],
  P1_09: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q12', note: 'Tích phân tổng — bank-p1-09-b02' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q08', note: 'Diện tích tích phân |2x-3|' },
  ],
  P1_10: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q01', note: 'Vectơ AB — bank-p1-10-b02' },
  ],
  P1_11: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q04', note: 'Vectơ chỉ phương đường thẳng — bank-p1-11-b02' },
  ],
  P1_12: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q09', note: 'Phương trình mặt phẳng — bank-p1-12-b02' },
  ],
  P2_01: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q13', note: 'f(x)=⅓x³−2x²+3x+8 — bank-p2-01-b02' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q13', note: 'f(x)=x³−12x−8 — bank-p2-01-b03' },
  ],
  P2_02: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q16', note: "Pin mặt trời F'(t) — bank-p2-02-b02" },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q14', note: "Nồng độ thuốc y'=ky" },
  ],
  P2_03: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q09', note: 'Mặt phẳng 3x+2y-z-12=0 — bank-p2-03-b02' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q15', note: 'Mặt phẳng Oxyz — đề 2026' },
  ],
  P2_04: [
    { exam: 'official-2026-0116', questionId: 'off26-0116-q14', note: 'AI sàng lọc bệnh — bank-p2-04-b02' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q16', note: 'Tin nhắn quảng cáo — bank-p2-04-b03' },
    { exam: 'official-2025-0101', questionId: 'off25-0101-q15', note: 'Xác suất có điều kiện — đề 2025' },
  ],
  P3_01: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q19', note: 'QHTT chanh/khoai — bank-p3-01-b10' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q18', note: 'Doanh thu rau củ — đề 2026' },
  ],
  P3_02: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q21', note: 'Xếp sách vào ngăn — bank-p3-02-b10' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q22', note: 'Điền số lưới bậc thang' },
  ],
  P3_03: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q17', note: 'Xác suất giải mật thư — tham chiếu đề gốc' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q19', note: 'Xác suất bóng đèn đa giác' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q11', note: 'P(AB) độc lập — bank-p3-03-b10' },
  ],
  P3_04: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q20', note: 'Khoảng cách AC và SD — bank-p3-04-b10' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q17', note: 'Khoảng cách P đến mặt phẳng' },
  ],
  P3_05: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q18', note: 'Lợi nhuận doanh nghiệp — bank-p3-05-b10' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q20', note: 'Lợi nhuận tối đa C(x), R(x)' },
  ],
  P3_06: [
    { exam: 'official-2025-0101', questionId: 'off25-0101-q22', note: 'Thể tích chân đế (chóp cụt − cầu)' },
    { exam: 'official-2026-0116', questionId: 'off26-0116-q21', note: 'Thể tích tròn xoay — bank-p3-06-b10' },
  ],
};

export function buildOfficialAnchors(slotMeta) {
  const { mcq, short } = createFactories(slotMeta, 'adapted-official-anchor');

  const p104 = mcq(
    'P1_04',
    10,
    {
      vi: "Cho hình lập phương $ABCD.A'B'C'D'$. Vectơ nào sau đây bằng vectơ $\\overrightarrow{AD}$?",
      en: "In cube $ABCD.A'B'C'D'$, which vector equals $\\overrightarrow{AD}$?",
    },
    [
      "$\\overrightarrow{B'C'}$",
      '$\\overrightarrow{CD}$',
      '$\\overrightarrow{AB}$',
      "$\\overrightarrow{AA'}$",
    ],
    'A',
    {
      vi: "$\\overrightarrow{AD}$ và $\\overrightarrow{B'C'}$ cùng hướng, cùng độ dài.",
      en: "$\\overrightarrow{AD}$ and $\\overrightarrow{B'C'}$ have the same direction and length.",
    },
    {
      vi: '**Ý tưởng:** Cạnh đối diện của hình lập phương tạo các vectơ bằng nhau. **Bước 1.** $AD \\parallel B\'C\'$. **Bước 2.** $\\overrightarrow{AD} = \\overrightarrow{B\'C\'}$. **Kết luận.** Chọn **A**.',
      en: '**Idea:** Opposite edges of a cube give equal vectors. **Step 1.** $AD \\parallel B\'C\'$. **Conclusion.** Choose **A**.',
    },
    {
      vi: 'Trong hình lập phương, các cạnh song song có vectơ bằng nhau. Đừng nhầm với $\\overrightarrow{CD}$ (ngược hướng).',
      en: 'Parallel edges in a cube have equal vectors. Do not pick $\\overrightarrow{CD}$ (opposite direction).',
    }
  );
  p104.source = 'adapted-off26-0116-q09';

  const p301 = short(
    'P3_01',
    10,
    {
      vi: 'Câu lạc bộ bán combo A $20$ nghìn (1 cốc chanh, 1 túi khoai) và combo B $30$ nghìn (2 cốc chanh, 1 túi khoai). Tối đa $8$ cốc chanh và $5$ túi khoai. Số tiền lớn nhất thu được (nghìn đồng)?',
      en: 'A club sells combo A for $20$k (1 lemonade, 1 fries) and combo B for $30$k (2 lemonade, 1 fries). At most $8$ lemonades and $5$ fries bags. Maximum revenue (thousand VND)?',
    },
    ['130'],
    0,
    {
      vi: 'Gọi $x$ combo A, $y$ combo B. $Z=20x+30y$ đạt cực đại $130$ tại $(2;3)$.',
      en: 'With $x$ combo A and $y$ combo B, $Z=20x+30y$ is maximized at $130$ for $(2,3)$.',
    },
    {
      vi: '**Ràng buộc:** $x+2y\\le8$, $x+y\\le5$, $x,y\\ge0$. **Đỉnh:** $(2,3)$ cho $Z=130$. **Kết luận.** **130**.',
      en: '**Constraints:** $x+2y\\le8$, $x+y\\le5$. **Vertex** $(2,3)$ gives **130**.',
    },
    {
      vi: 'Liệt kê đủ đỉnh của miền nghiệm. Combo B có hệ số lớn hơn nhưng tốn nhiều chanh hơn.',
      en: 'List all feasible vertices. Combo B pays more but uses more lemonade.',
    }
  );
  p301.source = 'adapted-off25-0101-q19';

  const p302 = short(
    'P3_02',
    10,
    {
      vi: 'Số cách chọn và sắp xếp $3$ quyển sách khác nhau từ $5$ quyển trên kệ (thứ tự có ý nghĩa) bằng',
      en: 'The number of ways to choose and arrange $3$ distinct books from $5$ on a shelf (order matters) equals',
    },
    ['60'],
    0,
    {
      vi: '$A_5^3 = 5\\cdot4\\cdot3 = 60$.',
      en: '$P(5,3) = 5\\cdot4\\cdot3 = 60$.',
    },
    {
      vi: '**Bước 1.** Quyển thứ nhất: $5$ cách. **Bước 2.** Thứ hai: $4$. **Bước 3.** Thứ ba: $3$. **Kết luận.** $60$.',
      en: '**Step 1.** $5$ choices, then $4$, then $3$. **Answer:** **60**.',
    },
    {
      vi: 'Thứ tự có ý nghĩa → chỉnh hợp $A_n^k$, không phải $C_5^3=10$.',
      en: 'Order matters → permutation $P(5,3)$, not $C(5,3)=10$.',
    }
  );
  p302.source = 'adapted-off25-0101-q21';

  const p303 = short(
    'P3_03',
    10,
    {
      vi: 'Hai biến cố độc lập $A$, $B$ có $P(A)=0{,}4$ và $P(B)=0{,}5$. Giá trị $P(AB)$ bằng (viết số thập phân)',
      en: 'Independent events $A$, $B$ satisfy $P(A)=0.4$ and $P(B)=0.5$. Find $P(AB)$ (decimal)',
    },
    ['0.2', '0,2'],
    0.01,
    {
      vi: '$P(AB)=P(A)P(B)=0{,}4\\cdot0{,}5=0{,}2$.',
      en: '$P(AB)=P(A)P(B)=0.4\\cdot0.5=0.2$.',
    },
    {
      vi: '**Công thức:** $A$, $B$ độc lập $\\Rightarrow P(AB)=P(A)P(B)=0{,}2$. **Đáp số:** **0,2**.',
      en: '**Rule:** independence gives $P(AB)=0.2$.',
    },
    {
      vi: 'Độc lập nghĩa là nhân hai xác suất, không cộng hay lấy max.',
      en: 'Independence means multiply, not add or take the maximum.',
    }
  );
  p303.source = 'adapted-off26-0116-q11';

  const p304 = short(
    'P3_04',
    10,
    {
      vi: 'Chóp $S.ABCD$ có đáy hình vuông cạnh $2$, $SA\\perp(ABCD)$, $SA=3$. Thể tích khối chóp (làm tròn đến hàng phần mười)?',
      en: 'Pyramid $S.ABCD$ has square base side $2$, $SA\\perp(ABCD)$, $SA=3$. Volume (round to one decimal)?',
    },
    ['4', '4.0', '4,0'],
    0.05,
    {
      vi: '$V=\\dfrac{1}{3}\\cdot SA\\cdot S_{ABCD}=\\dfrac{1}{3}\\cdot3\\cdot4=4$.',
      en: '$V=\\dfrac{1}{3}\\cdot SA\\cdot S_{ABCD}=4$.',
    },
    {
      vi: '**Bước 1.** $S_{ABCD}=4$. **Bước 2.** $V=\\dfrac{1}{3}\\cdot3\\cdot4=4$. **Kết luận.** **4**.',
      en: '**Step 1.** Base area $4$. **Step 2.** $V=4$.',
    },
    {
      vi: 'Thể tích chóp có hệ số $\\dfrac{1}{3}$. Chiều cao là $SA$ khi $SA\\perp$ đáy.',
      en: 'Pyramid volume uses factor $\\dfrac{1}{3}$. Height is $SA$ when perpendicular to the base.',
    }
  );
  p304.source = 'adapted-off25-0101-q20';

  const p305 = short(
    'P3_05',
    10,
    {
      vi: 'Doanh thu $R(x)=100x$ và chi phí $C(x)=x^2+400$ (nghìn đồng, $1\\le x\\le 50$). Lợi nhuận lớn nhất $P(x)=R(x)-C(x)$ bằng bao nhiêu nghìn đồng?',
      en: 'Revenue $R(x)=100x$ and cost $C(x)=x^2+400$ (thousand VND, $1\\le x\\le 50$). Maximum profit $P(x)=R(x)-C(x)$ in thousand VND?',
    },
    ['2100'],
    0,
    {
      vi: '$P(x)=-x^2+100x-400$ đạt cực đại $2100$ tại $x=50$.',
      en: '$P(x)=-x^2+100x-400$ reaches maximum $2100$ at $x=50$.',
    },
    {
      vi: '**Bước 1.** $P\'(x)=-2x+100=0\\Rightarrow x=50$. **Bước 2.** $P(50)=2100$. **Kết luận.** **2100**.',
      en: '**Step 1.** Critical point $x=50$. **Step 2.** $P(50)=2100$.',
    },
    {
      vi: 'Lợi nhuận = doanh thu − chi phí. Kiểm tra đỉnh parabol nằm trong miền $x$ cho phép.',
      en: 'Profit = revenue − cost. Check the parabola vertex lies in the feasible domain.',
    }
  );
  p305.source = 'adapted-off25-0101-q18';

  const p306 = short(
    'P3_06',
    10,
    {
      vi: 'Thể tích khối tròn xoay tạo bởi $y=x^2$, $0\\le x\\le 1$ quanh trục $Ox$ (làm tròn đến hàng phần trăm, đơn vị $\\pi$)?',
      en: 'Volume of the solid of revolution of $y=x^2$, $0\\le x\\le 1$ about the $x$-axis (hundredths, in units of $\\pi$)?',
    },
    ['0.2', '0,2'],
    0.01,
    {
      vi: '$V=\\pi\\int_0^1 x^4\\,dx=\\dfrac{\\pi}{5}$; hệ số trước $\\pi$ là $0{,}2$.',
      en: '$V=\\pi\\int_0^1 x^4\\,dx=\\pi/5$; coefficient of $\\pi$ is $0.2$.',
    },
    {
      vi: '**Bước 1.** $V=\\pi\\int_0^1 x^4\\,dx=\\dfrac{\\pi}{5}$. **Bước 2.** Hệ số $=0{,}2$. **Đáp số:** **0,2**.',
      en: '**Step 1.** $V=\\pi/5$. **Step 2.** Coefficient **0.2**.',
    },
    {
      vi: 'Tròn xoay quanh $Ox$: $V=\\pi\\int y^2\\,dx$. Bình phương $y=x^2$ trước khi tích phân.',
      en: 'Revolution about $Ox$: $V=\\pi\\int y^2\\,dx$. Square $y=x^2$ before integrating.',
    }
  );
  p306.source = 'adapted-off26-0116-q21';

  return [p104, p301, p302, p303, p304, p305, p306];
}
