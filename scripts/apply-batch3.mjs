#!/usr/bin/env node
/**
 * Apply batch 3: insert bank-*-b06, bank-*-b07 into questions.json and update slot metadata.
 * Usage: node scripts/apply-batch3.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const matrix = JSON.parse(readFileSync(join(root, 'content/bank/matrix-764.json'), 'utf8'));
const slotMeta = Object.fromEntries(matrix.slots.map((s) => [s.slotCode, s]));

const ANCHOR = {
  P1_01: 'bank-p1-01-b04',
};

function qid(slot, n) {
  return `bank-${slot.toLowerCase().replace(/_/g, '-')}-b${String(n).padStart(2, '0')}`;
}

function partOf(slot) {
  return slotMeta[slot].part;
}

function base(slot, n) {
  const m = slotMeta[slot];
  return {
    id: qid(slot, n),
    part: m.part,
    grade: m.grade,
    topicCode: m.topicCode,
    difficulty: m.difficulty,
    matrixSlot: slot,
    status: 'approved',
    source: 'matrix-bank-v3-variant',
  };
}

function mcq(slot, n, stem, options, correct, explanation, explanationLong, mistakeFeedback) {
  const labels = ['A', 'B', 'C', 'D'];
  return {
    ...base(slot, n),
    stem: { vi: stem.vi, en: stem.en },
    options: options.map((text, i) => ({
      label: labels[i],
      text: { vi: text, en: text },
      correct: labels[i] === correct,
    })),
    explanation: { vi: explanation.vi, en: explanation.en },
    explanationLong: { vi: explanationLong.vi, en: explanationLong.en },
    mistakeFeedback: { vi: mistakeFeedback.vi, en: mistakeFeedback.en },
  };
}

function tf(slot, n, stem, subItems, explanation, explanationLong, mistakeFeedback) {
  return {
    ...base(slot, n),
    stem: { vi: stem.vi, en: stem.en },
    subItems,
    explanation: { vi: explanation.vi, en: explanation.en },
    explanationLong: { vi: explanationLong.vi, en: explanationLong.en },
    mistakeFeedback: { vi: mistakeFeedback.vi, en: mistakeFeedback.en },
  };
}

function short(slot, n, stem, acceptedAnswers, tolerance, explanation, explanationLong, mistakeFeedback) {
  return {
    ...base(slot, n),
    stem: { vi: stem.vi, en: stem.en },
    acceptedAnswers,
    tolerance,
    explanation: { vi: explanation.vi, en: explanation.en },
    explanationLong: { vi: explanationLong.vi, en: explanationLong.en },
    mistakeFeedback: { vi: mistakeFeedback.vi, en: mistakeFeedback.en },
  };
}

function si(label, vi, en, isTrue, explVi, explEn) {
  return {
    label,
    statement: { vi, en },
    isTrue,
    explanation: { vi: explVi, en: explEn },
  };
}

const BATCH3 = [
  // P1_01
  mcq('P1_01', 6,
    { vi: 'Giá trị của $\\sin 45^\\circ$ là', en: 'The value of $\\sin 45^\\circ$ is' },
    ['$\\dfrac{\\sqrt{2}}{2}$', '$\\dfrac{1}{2}$', '$\\dfrac{\\sqrt{3}}{2}$', '$1$'], 'A',
    { vi: '$\\sin 45^\\circ = \\dfrac{\\sqrt{2}}{2}$.', en: '$\\sin 45^\\circ = \\dfrac{\\sqrt{2}}{2}$.' },
    { vi: '**Góc đặc biệt:** $\\sin 45^\\circ = \\dfrac{\\sqrt{2}}{2}$. **Kết luận.** Chọn **A**.', en: '**Special angle.** Choose **A**.' },
    { vi: 'Hay nhầm với $\\sin 30^\\circ$ hoặc $\\sin 60^\\circ$.', en: 'Do not confuse with $\\sin 30^\\circ$ or $\\sin 60^\\circ$.' }),
  mcq('P1_01', 7,
    { vi: 'Giá trị của $\\tan 45^\\circ$ là', en: 'The value of $\\tan 45^\\circ$ is' },
    ['$1$', '$0$', '$\\dfrac{\\sqrt{3}}{3}$', '$\\dfrac{1}{2}$'], 'A',
    { vi: '$\\tan 45^\\circ = 1$.', en: '$\\tan 45^\\circ = 1$.' },
    { vi: '**Góc đặc biệt:** tam giác vuông cân nên $\\tan 45^\\circ = 1$. **Kết luận.** Chọn **A**.', en: '**Special angle.** $\\tan 45^\\circ = 1$. Choose **A**.' },
    { vi: 'Hay nhầm với $\\tan 0^\\circ = 0$ hoặc $\\tan 30^\\circ$.', en: 'Do not confuse with $\\tan 0^\\circ$ or $\\tan 30^\\circ$.' }),

  // P1_02
  mcq('P1_02', 6,
    { vi: 'Cho cấp số cộng $(u_n)$ có $u_1 = 5$, $d = -2$. Giá trị $u_3$ bằng', en: 'An AP has $u_1 = 5$, $d = -2$. Find $u_3$.' },
    ['$1$', '$9$', '$-1$', '$3$'], 'A',
    { vi: '$u_3 = 5 + 2(-2) = 1$.', en: '$u_3 = 5 + 2(-2) = 1$.' },
    { vi: '**Công thức:** $u_3 = u_1 + 2d = 5 - 4 = 1$. **Kết luận.** Chọn **A**.', en: '**Formula:** $u_3 = u_1 + 2d = 1$.' },
    { vi: 'Công sai âm: $u_3 = u_1 + 2d$, không phải $u_1 - 2d$ nếu đã thay $d=-2$.', en: 'Use $u_3 = u_1 + 2d$ with $d = -2$.' }),
  mcq('P1_02', 7,
    { vi: 'Cho cấp số nhân $(u_n)$ có $u_1 = 5$, $q = \\dfrac{1}{2}$. Giá trị $u_3$ bằng', en: 'A GP has $u_1 = 5$, $q = \\dfrac{1}{2}$. Find $u_3$.' },
    ['$\\dfrac{5}{4}$', '$\\dfrac{5}{2}$', '$10$', '$\\dfrac{5}{8}$'], 'A',
    { vi: '$u_3 = 5 \\cdot \\left(\\dfrac{1}{2}\\right)^2 = \\dfrac{5}{4}$.', en: '$u_3 = 5 \\cdot (1/2)^2 = 5/4$.' },
    { vi: '**Công thức:** $u_3 = u_1 q^2 = 5 \\cdot \\dfrac{1}{4} = \\dfrac{5}{4}$. **Kết luận.** Chọn **A**.', en: '**Formula:** $u_3 = u_1 q^2 = 5/4$.' },
    { vi: 'Số mũ là $n-1=2$, không phải $3$.', en: 'Exponent is $n-1=2$, not $3$.' }),

  // P1_03 — prism without new figure assets
  mcq('P1_03', 6,
    { vi: 'Lăng trụ đứng có đáy vuông cạnh $5$, chiều cao $3$. Thể tích bằng', en: 'A right prism has square base side $5$ and height $3$. Its volume is' },
    ['$75$', '$15$', '$125$', '$30$'], 'A',
    { vi: '$V = 5^2 \\cdot 3 = 75$.', en: '$V = 25 \\cdot 3 = 75$.' },
    { vi: '**Công thức:** $V = S_{\\text{đáy}} \\cdot h = 25 \\cdot 3 = 75$. **Kết luận.** Chọn **A**.', en: '**Formula:** $V = 25 \\cdot 3 = 75$.' },
    { vi: 'Đáy vuông cạnh $5$ → diện tích $25$, không phải $5$.', en: 'Square side $5$ gives base area $25$.' }),
  mcq('P1_03', 7,
    { vi: 'Chóp $S.ABC$ có đáy tam giác vuông tại $A$, $AB=3$, $AC=4$, $SA=6$ vuông góc mặt phẳng đáy. Thể tích bằng', en: 'Pyramid $S.ABC$ has right triangle base $AB=3$, $AC=4$, and $SA=6$ perpendicular to the base. Volume is' },
    ['$12$', '$36$', '$72$', '$24$'], 'A',
    { vi: '$V = \\dfrac{1}{3} \\cdot \\dfrac{1}{2} \\cdot 3 \\cdot 4 \\cdot 6 = 12$.', en: '$V = \\dfrac{1}{3} \\cdot 6 \\cdot 6 = 12$.' },
    { vi: '**Bước 1.** $S_{\\text{đáy}} = \\dfrac{1}{2} \\cdot 3 \\cdot 4 = 6$. **Bước 2.** $V = \\dfrac{1}{3} \\cdot 6 \\cdot 6 = 12$. **Kết luận.** Chọn **A**.', en: '**Steps.** Base area $6$, $V = 12$.' },
    { vi: 'Thể tích chóp có hệ số $\\dfrac{1}{3}$; chiều cao là $SA=6$.', en: 'Cone/pyramid factor $\\dfrac{1}{3}$; height is $SA$.' }),

  // P1_04
  mcq('P1_04', 6,
    { vi: 'Một hình cầu có bán kính $R = 3$. Thể tích bằng', en: 'A sphere has radius $R = 3$. Its volume is' },
    ['$36\\pi$', '$27\\pi$', '$12\\pi$', '$9\\pi$'], 'A',
    { vi: '$V = \\dfrac{4}{3}\\pi R^3 = 36\\pi$.', en: '$V = \\dfrac{4}{3}\\pi \\cdot 27 = 36\\pi$.' },
    { vi: '**Công thức:** $V = \\dfrac{4}{3}\\pi R^3 = \\dfrac{4}{3}\\pi \\cdot 27 = 36\\pi$. **Kết luận.** Chọn **A**.', en: '**Formula:** $V = 36\\pi$.' },
    { vi: 'Nhầm với $V=\\dfrac{4}{3}\\pi R^2$ hoặc quên lũy thừa $R^3$.', en: 'Use $R^3$, not $R^2$.' }),
  mcq('P1_04', 7,
    { vi: 'Một hình cầu có bán kính $R = 2$. Diện tích mặt cầu bằng', en: 'A sphere has radius $R = 2$. Its surface area is' },
    ['$16\\pi$', '$8\\pi$', '$4\\pi$', '$32\\pi$'], 'A',
    { vi: '$S = 4\\pi R^2 = 16\\pi$.', en: '$S = 4\\pi \\cdot 4 = 16\\pi$.' },
    { vi: '**Công thức:** $S = 4\\pi R^2 = 16\\pi$. **Kết luận.** Chọn **A**.', en: '**Formula:** $S = 16\\pi$.' },
    { vi: 'Diện tích mặt cầu dùng $4\\pi R^2$, không phải thể tích.', en: 'Surface area uses $4\\pi R^2$, not volume formula.' }),

  // P1_05
  mcq('P1_05', 6,
    { vi: 'Nghiệm của phương trình $3^x = 27$ là', en: 'The solution of $3^x = 27$ is' },
    ['$3$', '$9$', '$2$', '$\\dfrac{1}{3}$'], 'A',
    { vi: '$3^x = 3^3 \\Leftrightarrow x = 3$.', en: '$3^x = 3^3 \\Leftrightarrow x = 3$.' },
    { vi: '**Bước 1.** $27 = 3^3$. **Bước 2.** $x = 3$. **Kết luận.** Chọn **A**.', en: '**Step 1.** $27 = 3^3$. **Answer:** $x = 3$.' },
    { vi: 'Đồng cơ số: $3^x = 3^3 \\Rightarrow x = 3$.', en: 'Same base: $x = 3$.' }),
  mcq('P1_05', 7,
    { vi: 'Nghiệm của phương trình $\\log_3 x = 2$ là', en: 'The solution of $\\log_3 x = 2$ is' },
    ['$9$', '$6$', '$3$', '$2$'], 'A',
    { vi: '$x = 3^2 = 9$.', en: '$x = 3^2 = 9$.' },
    { vi: '**Định nghĩa:** $\\log_3 x = 2 \\Leftrightarrow x = 3^2 = 9$. **Kết luận.** Chọn **A**.', en: '**Definition:** $x = 9$.' },
    { vi: 'Đừng nhầm $x = 2$ hoặc $x = 3$.', en: 'Do not answer $x = 2$ or $x = 3$.' }),

  // P1_06
  mcq('P1_06', 6,
    { vi: 'Trung bình cộng của $3$, $7$, $10$ bằng', en: 'The mean of $3$, $7$, $10$ is' },
    ['$\\dfrac{20}{3}$', '$6$', '$7$', '$10$'], 'A',
    { vi: '$\\dfrac{3+7+10}{3} = \\dfrac{20}{3}$.', en: '$(3+7+10)/3 = 20/3$.' },
    { vi: '**Công thức:** $\\bar{x} = \\dfrac{3+7+10}{3} = \\dfrac{20}{3}$. **Kết luận.** Chọn **A**.', en: '**Mean:** $20/3$.' },
    { vi: 'Chia cho số lượng $3$, không phải $2$.', en: 'Divide by count $3$.' }),
  mcq('P1_06', 7,
    { vi: 'Dãy số liệu ghép nhóm: $[0;5)$ có $4$ phần tử, $[5;10)$ có $6$ phần tử. Trung vị thuộc khoảng', en: 'Grouped data: $[0,5)$ has $4$ items, $[5,10)$ has $6$. The median lies in' },
    ['$[5;10)$', '$[0;5)$', '$[10;15)$', 'Không xác định'], 'A',
    { vi: '$n=10$, vị trí trung vị $5$–$6$ nằm trong nhóm $[5;10)$.', en: 'Median positions $5$–$6$ fall in $[5,10)$.' },
    { vi: '**Bước 1.** $n=10$, trung vị ở vị trí $5$ và $6$. **Bước 2.** Nhóm tích lũy: $4$ rồi $10$ → thuộc $[5;10)$. **Kết luận.** Chọn **A**.', en: '**Step 1.** $n=10$. **Step 2.** Median in second group.' },
    { vi: 'Tính tích lũy tần số trước khi xác định nhóm chứa trung vị.', en: 'Use cumulative frequency first.' }),

  // P1_07
  mcq('P1_07', 6,
    { vi: 'Đạo hàm của $f(x) = x^3 + 2x$ là', en: 'The derivative of $f(x) = x^3 + 2x$ is' },
    ['$3x^2 + 2$', '$3x^2$', '$x^3 + 2$', '$3x + 2$'], 'A',
    { vi: "$f'(x) = 3x^2 + 2$.", en: "$f'(x) = 3x^2 + 2$." },
    { vi: "**Bước 1.** $(x^3)' = 3x^2$, $(2x)' = 2$. **Kết luận.** Chọn **A**.", en: "**Derivative:** $3x^2 + 2$." },
    { vi: 'Đạo hàm hằng số $2$ là $0$ nhưng $(2x)$ có đạo hàm $2$.', en: "Derivative of $2x$ is $2$, not $0$." }),
  mcq('P1_07', 7,
    { vi: 'Đạo hàm của $f(x) = 5x^2 - x$ tại $x = 1$ bằng', en: "The derivative of $f(x) = 5x^2 - x$ at $x = 1$ is" },
    ['$9$', '$10$', '$4$', '$5$'], 'A',
    { vi: "$f'(x) = 10x - 1$, $f'(1) = 9$.", en: "$f'(1) = 9$." },
    { vi: "**Bước 1.** $f'(x) = 10x - 1$. **Bước 2.** $f'(1) = 9$. **Kết luận.** Chọn **A**.", en: "**Step 2.** $f'(1) = 9$." },
    { vi: 'Sau khi tìm $f\'(x)$, thế $x=1$.', en: 'Substitute $x=1$ into $f\'(x)$.' }),

  // P1_08
  mcq('P1_08', 6,
    { vi: 'Nguyên hàm của $f(x) = 4x$ là', en: 'An antiderivative of $f(x) = 4x$ is' },
    ['$2x^2 + C$', '$4x^2 + C$', '$2x + C$', '$x^2 + C$'], 'A',
    { vi: '$\\int 4x\\,dx = 2x^2 + C$.', en: '$\\int 4x\\,dx = 2x^2 + C$.' },
    { vi: '**Bước 1.** $\\int 4x\\,dx = 4 \\cdot \\dfrac{x^2}{2} + C = 2x^2 + C$. **Kết luận.** Chọn **A**.', en: '**Antiderivative:** $2x^2 + C$.' },
    { vi: 'Nhớ chia hệ số cho $(n+1)$ khi lũy thừa.', en: 'Divide coefficient by $(n+1)$ for powers.' }),
  mcq('P1_08', 7,
    { vi: '$\\displaystyle \\int_0^2 (x+1)\\,dx$ bằng', en: '$\\displaystyle \\int_0^2 (x+1)\\,dx$ equals' },
    ['$4$', '$3$', '$2$', '$5$'], 'A',
    { vi: '$\\left[\\dfrac{x^2}{2}+x\\right]_0^2 = 2+2 = 4$.', en: '$[x^2/2+x]_0^2 = 4$.' },
    { vi: '**Bước 1.** Nguyên hàm $\\dfrac{x^2}{2}+x$. **Bước 2.** $F(2)-F(0)=4$. **Kết luận.** Chọn **A**.', en: '**Answer:** $4$.' },
    { vi: 'Thế cả cận dưới $0$.', en: 'Evaluate both bounds.' }),

  // P1_09
  mcq('P1_09', 6,
    { vi: 'Nguyên hàm của $f(x) = \\sin x$ là', en: 'An antiderivative of $f(x) = \\sin x$ is' },
    ['$-\\cos x + C$', '$\\cos x + C$', '$\\sin x + C$', '$-\\sin x + C$'], 'A',
    { vi: '$\\int \\sin x\\,dx = -\\cos x + C$.', en: '$\\int \\sin x\\,dx = -\\cos x + C$.' },
    { vi: '**Công thức:** $\\int \\sin x\\,dx = -\\cos x + C$. **Kết luận.** Chọn **A**.', en: '**Formula:** $-\\cos x + C$.' },
    { vi: 'Hay nhầm dấu: nguyên hàm của $\\sin x$ là $-\\cos x$.', en: 'Sign: antiderivative of $\\sin x$ is $-\\cos x$.' }),
  mcq('P1_09', 7,
    { vi: '$\\displaystyle \\int_0^{\\pi} \\cos x\\,dx$ bằng', en: '$\\displaystyle \\int_0^{\\pi} \\cos x\\,dx$ equals' },
    ['$0$', '$2$', '$1$', '$-2$'], 'A',
    { vi: '$[\\sin x]_0^{\\pi} = 0 - 0 = 0$.', en: '$[\\sin x]_0^{\\pi} = 0$.' },
    { vi: '**Bước 1.** $[\\sin x]_0^{\\pi} = \\sin\\pi - \\sin 0 = 0$. **Kết luận.** Chọn **A**.', en: '**Answer:** $0$.' },
    { vi: '$\\sin\\pi = 0$, không phải $1$.', en: '$\\sin\\pi = 0$.' }),

  // P1_10
  mcq('P1_10', 6,
    { vi: 'Khoảng cách từ $M(0;3;4)$ đến gốc $O$ bằng', en: 'The distance from $M(0,3,4)$ to the origin is' },
    ['$5$', '$7$', '$12$', '$25$'], 'A',
    { vi: '$OM = \\sqrt{0+9+16} = 5$.', en: '$OM = 5$.' },
    { vi: '**Công thức:** $OM = \\sqrt{3^2+4^2} = 5$. **Kết luận.** Chọn **A**.', en: '**Distance:** $5$.' },
    { vi: 'Cộng tọa độ $3+4=7$ là sai; phải bình phương rồi căn.', en: 'Square coordinates before the square root.' }),
  mcq('P1_10', 7,
    { vi: 'Khoảng cách từ $N(2;6;3)$ đến gốc $O$ bằng', en: 'The distance from $N(2,6,3)$ to the origin is' },
    ['$7$', '$11$', '$\\sqrt{13}$', '$49$'], 'A',
    { vi: '$ON = \\sqrt{4+36+9} = 7$.', en: '$ON = 7$.' },
    { vi: '**Bước 1.** $ON = \\sqrt{2^2+6^2+3^2} = \\sqrt{49} = 7$. **Kết luận.** Chọn **A**.', en: '**Answer:** $7$.' },
    { vi: 'Nhớ bình phương từng tọa độ trước khi cộng.', en: 'Square each coordinate first.' }),

  // P1_11
  mcq('P1_11', 6,
    { vi: 'Đường thẳng $d: \\dfrac{x-1}{2} = \\dfrac{y+1}{-1} = \\dfrac{z}{3}$ có vectơ chỉ phương', en: 'Line $d: \\dfrac{x-1}{2} = \\dfrac{y+1}{-1} = \\dfrac{z}{3}$ has direction vector' },
    ['$(2;-1;3)$', '$(1;-1;0)$', '$(-2;1;-3)$', '$(2;1;3)$'], 'A',
    { vi: 'Hệ số mẫu: $(2;-1;3)$.', en: 'Denominators: $(2,-1,3)$.' },
    { vi: '**Dạng chính tắc:** vectơ chỉ phương lấy từ mẫu $(2;-1;3)$. **Kết luận.** Chọn **A**.', en: '**Direction from denominators.** Choose **A**.' },
    { vi: 'Lấy hệ số mẫu, không lấy tử hoặc đổi dấu tùy tiện.', en: 'Use denominators, not numerators.' }),
  mcq('P1_11', 7,
    { vi: 'Đường thẳng $\\dfrac{x}{1} = \\dfrac{y-2}{3} = z+1$ có một vectơ chỉ phương là', en: 'Line $\\dfrac{x}{1} = \\dfrac{y-2}{3} = z+1$ has direction vector' },
    ['$(1;3;1)$', '$(0;2;-1)$', '$(1;3;-1)$', '$(3;1;1)$'], 'A',
    { vi: 'Viết $z+1 = \\dfrac{z+1}{1}$ nên mẫu $(1;3;1)$.', en: 'Write $z+1$ as $(z+1)/1$; direction $(1,3,1)$.' },
    { vi: '**Bước 1.** $z+1 = \\dfrac{z+1}{1}$. **Bước 2.** Vectơ chỉ phương $(1;3;1)$. **Kết luận.** Chọn **A**.', en: '**Direction:** $(1,3,1)$.' },
    { vi: 'Ẩn mẫu $1$ của $z$ vẫn là $1$, không phải $0$.', en: 'Missing denominator on $z$ means $1$.' }),

  // P1_12
  mcq('P1_12', 6,
    { vi: 'Mặt phẳng $(P): 2x + y - z - 4 = 0$ có vectơ pháp tuyến', en: 'Plane $(P): 2x + y - z - 4 = 0$ has normal vector' },
    ['$(2;1;-1)$', '$(2;1;1)$', '$(1;2;-1)$', '$(4;1;-1)$'], 'A',
    { vi: '$\\vec{n} = (2;1;-1)$.', en: '$\\vec{n} = (2,1,-1)$.' },
    { vi: '**Dạng $ax+by+cz+d=0$:** $\\vec{n}=(a;b;c)=(2;1;-1)$. **Kết luận.** Chọn **A**.', en: '**Coefficients:** $(2,1,-1)$.' },
    { vi: 'Hệ số $z$ là $-1$, không phải $1$.', en: '$z$-coefficient is $-1$.' }),
  mcq('P1_12', 7,
    { vi: 'Mặt phẳng $(Q): -2x + 5y + z - 10 = 0$ có một vectơ pháp tuyến là', en: 'Plane $(Q): -2x + 5y + z - 10 = 0$ has normal vector' },
    ['$(-2;5;1)$', '$(2;5;1)$', '$(-2;5;-1)$', '$(10;5;1)$'], 'A',
    { vi: '$\\vec{n} = (-2;5;1)$.', en: '$\\vec{n} = (-2,5,1)$.' },
    { vi: '**Đọc hệ số:** $a=-2$, $b=5$, $c=1$. **Kết luận.** Chọn **A**.', en: '**Read coefficients.** Choose **A**.' },
    { vi: 'Giữ dấu âm của $-2x$; $+z$ nghĩa là hệ số $1$.', en: 'Keep the minus on $-2x$; $+z$ means coefficient $1$.' }),

  // P2_01
  tf('P2_01', 6,
    { vi: 'Cho hàm số $f(x) = x^3 - 3x^2 + 2$.', en: 'Given $f(x) = x^3 - 3x^2 + 2$.' },
    [
      si('a', "$f'(x) = 3x^2 - 6x$.", "$f'(x) = 3x^2 - 6x$.", true, 'Đạo hàm từng hạng.', 'Term-by-term.'),
      si('b', "$f'(x)=0$ có tập nghiệm $S=\\{0;2\\}$.", "$f'(x)=0$ has solutions $\\{0,2\\}$.", true, '$3x(x-2)=0$.', '$3x(x-2)=0$.'),
      si('c', 'Hàm số đồng biến trên $(0;2)$.', 'The function is increasing on $(0,2)$.', false, 'Giữa $0$ và $2$, $f\'<0$.', '$f\'<0$ between roots.'),
      si('d', 'Giá trị cực tiểu của hàm số bằng $-2$.', 'The local minimum value equals $-2$.', true, '$f(2)=8-12+2=-2$.', '$f(2)=-2$ at $x=2$.'),
    ],
    { vi: 'Đáp án: aĐ, bĐ, cS, dĐ.', en: 'Answers: aT, bT, cF, dT.' },
    { vi: '**Ý a–b.** $f\'=3x^2-6x$, nghiệm $0,2$. **Ý c.** Nghịch biến trên $(0;2)$. **Ý d.** $f(2)=-2$.', en: '**a–b.** Derivative and roots. **c.** Decreasing on $(0,2)$. **d.** $f(2)=-2$.' },
    { vi: 'Xét dấu $f\'$ giữa hai nghiệm.', en: 'Sign-test $f\'$ between roots.' }),
  tf('P2_01', 7,
    { vi: 'Cho hàm số $f(x) = -x^2 + 4x - 1$.', en: 'Given $f(x) = -x^2 + 4x - 1$.' },
    [
      si('a', "$f'(x) = -2x + 4$.", "$f'(x) = -2x + 4$.", true, 'Đạo hàm đúng.', 'Correct derivative.'),
      si('b', 'Hàm số có một điểm cực trị.', 'The function has one critical point.', true, "$f'(x)=0 \\Leftrightarrow x=2$.", 'One critical point at $x=2$.'),
      si('c', 'Hàm số đạt giá trị lớn nhất tại $x=2$.', 'The function attains its maximum at $x=2$.', true, '$a=-1<0$ nên cực đại tại $x=2$.', 'Parabola opens downward.'),
      si('d', 'Giá trị lớn nhất của hàm số bằng $5$.', 'The maximum value equals $5$.', false, '$f(2)=-4+8-1=3$, không phải $5$.', '$f(2)=3$, not $5$.'),
    ],
    { vi: 'Đáp án: aĐ, bĐ, cĐ, dS.', en: 'Answers: aT, bT, cT, dF.' },
    { vi: '**Ý d.** $f(2)=3$ — bẫy tính toán.', en: '**d.** $f(2)=3$.' },
    { vi: 'Thế $x=2$ vào $f(x)$ sau khi tìm cực trị.', en: 'Substitute into $f(x)$ after finding the critical point.' }),

  tf('P2_02', 6,
    { vi: 'Cho $M = \\displaystyle \\int_0^1 (3x+1)\\,dx$.', en: 'Let $M = \\displaystyle \\int_0^1 (3x+1)\\,dx$.' },
    [
      si('a', '$\\dfrac{3x^2}{2}+x$ là một nguyên hàm của $3x+1$.', '$\\dfrac{3x^2}{2}+x$ is an antiderivative of $3x+1$.', true, 'Đạo hàm ngược kiểm tra.', 'Derivative checks out.'),
      si('b', '$M = 2{,}5$.', '$M = 2.5$.', true, '$\\left[\\dfrac{3x^2}{2}+x\\right]_0^1 = 2{,}5$.', '$3/2+1=2.5$.'),
      si('c', '$M = 1{,}5$.', '$M = 1.5$.', false, 'Quên hạng $\\dfrac{3x^2}{2}$ tại $x=1$.', 'Forgot the quadratic term.'),
      si('d', 'Hàm số dưới dấu tích phân dương trên $[0;1]$.', 'The integrand is positive on $[0,1]$.', true, '$3x+1 \\ge 1>0$.', '$3x+1>0$ on $[0,1]$.'),
    ],
    { vi: 'Đáp án: aĐ, bĐ, cS, dĐ.', en: 'Answers: aT, bT, cF, dT.' },
    { vi: '**Ý b.** $M=2{,}5$. **Ý c.** Bẫy chỉ lấy $1$.', en: '**b.** $M=2.5$.' },
    { vi: 'Cộng đủ hạng khi thế cận.', en: 'Include every term when evaluating bounds.' }),
  tf('P2_02', 7,
    { vi: 'Cho $N = \\displaystyle \\int_2^5 x\\,dx$.', en: 'Let $N = \\displaystyle \\int_2^5 x\\,dx$.' },
    [
      si('a', '$\\dfrac{x^2}{2}$ là một nguyên hàm của $x$.', '$\\dfrac{x^2}{2}$ is an antiderivative of $x$.', true, 'Đạo hàm đúng.', 'Correct.'),
      si('b', '$N = \\dfrac{21}{2}$.', '$N = \\dfrac{21}{2}$.', true, '$\\dfrac{25}{2}-\\dfrac{4}{2}=\\dfrac{21}{2}$.', '$25/2-2=21/2$.'),
      si('c', '$N = \\dfrac{25}{2}$.', '$N = \\dfrac{25}{2}$.', false, 'Quên trừ cận dưới.', 'Forgot lower bound.'),
      si('d', 'Giá trị trung bình của $x$ trên $[2;5]$ bằng $\\dfrac{7}{2}$.', 'The average value of $x$ on $[2,5]$ equals $\\dfrac{7}{2}$.', true, '$N/3 = (21/2)/3 = 7/2$.', 'Average $= N/3 = 7/2$.'),
    ],
    { vi: 'Đáp án: aĐ, bĐ, cS, dĐ.', en: 'Answers: aT, bT, cF, dT.' },
    { vi: '**Ý d.** Giá trị trung bình $= N/(5-2)$.', en: '**d.** Average $= N/3$.' },
    { vi: 'Tích phân xác định: $F(b)-F(a)$.', en: 'Definite integral: $F(b)-F(a)$.' }),

  tf('P2_03', 6,
    { vi: 'Trong $Oxyz$, mặt phẳng $(\\gamma): x + y - z - 3 = 0$.', en: 'In $Oxyz$, plane $(\\gamma): x + y - z - 3 = 0$.' },
    [
      si('a', 'Một vectơ pháp tuyến của $(\\gamma)$ là $(1;1;-1)$.', 'A normal vector is $(1,1,-1)$.', true, 'Hệ số $1,1,-1$.', 'Coefficients $1,1,-1$.'),
      si('b', 'Điểm $P(1;1;1)$ thuộc $(\\gamma)$.', 'Point $P(1,1,1)$ lies on $(\\gamma)$.', false, '$1+1-1-3=-2\\neq0$.', '$-2\\neq0$.'),
      si('c', 'Vectơ $(1;-1;0)$ song song với $(\\gamma)$.', 'Vector $(1,-1,0)$ is parallel to $(\\gamma)$.', true, '$(1;-1;0)\\cdot(1;1;-1)=0$.', 'Dot product is $0$.'),
      si('d', 'Khoảng cách từ $O$ đến $(\\gamma)$ bằng $\\sqrt{3}$.', 'Distance from $O$ to $(\\gamma)$ equals $\\sqrt{3}$.', true, '$d=\\dfrac{3}{\\sqrt{3}}=\\sqrt{3}$.', '$d=3/\\sqrt{3}=\\sqrt{3}$.'),
    ],
    { vi: 'Đáp án: aĐ, bS, cĐ, dĐ.', en: 'Answers: aT, bF, cT, dT.' },
    { vi: '**Ý b.** Thế $P$ vào phương trình. **Ý d.** $|\\vec{n}|=\\sqrt{3}$.', en: '**b.** Substitute $P$. **d.** $d=\\sqrt{3}$.' },
    { vi: 'Kiểm tra điểm thuộc mặt phẳng bằng cách thế tọa độ.', en: 'Substitute coordinates to test a point on the plane.' }),
  tf('P2_03', 7,
    { vi: 'Trong $Oxyz$, mặt phẳng $(\\delta): 5x - 2z + 10 = 0$.', en: 'In $Oxyz$, plane $(\\delta): 5x - 2z + 10 = 0$.' },
    [
      si('a', 'Vectơ $(5;0;-2)$ là một vectơ pháp tuyến của $(\\delta)$.', 'Vector $(5,0,-2)$ is a normal vector.', true, 'Hệ số $5,0,-2$.', 'Coefficients $5,0,-2$.'),
      si('b', 'Gốc tọa độ $O$ thuộc $(\\delta)$.', 'The origin lies on $(\\delta)$.', false, '$10\\neq0$.', '$10\\neq0$.'),
      si('c', 'Điểm $A(-2;0;0)$ thuộc $(\\delta)$.', 'Point $A(-2,0,0)$ lies on $(\\delta)$.', true, '$5(-2)+10=0$.', '$-10+10=0$.'),
      si('d', 'Khoảng cách từ $O$ đến $(\\delta)$ bằng $10$.', 'Distance from $O$ to $(\\delta)$ equals $10$.', false, '$d=\\dfrac{10}{\\sqrt{29}}\\neq10$.', 'Divide by $|\\vec{n}|$.'),
    ],
    { vi: 'Đáp án: aĐ, bS, cĐ, dS.', en: 'Answers: aT, bF, cT, dF.' },
    { vi: '**Ý d.** Bẫy quên chia $\\sqrt{29}$.', en: '**d.** Trap: forgot $|\\vec{n}|$.' },
    { vi: 'Ẩn $y$ nghĩa là hệ số $0$.', en: 'Missing $y$ means coefficient $0$.' }),

  tf('P2_04', 6,
    { vi: 'Túi có $4$ bi đỏ và $1$ bi xanh. Rút hai bi không hoàn lại.', en: 'A bag has $4$ red and $1$ blue ball. Two draws without replacement.' },
    [
      si('a', '$P(\\text{bi đỏ đầu}) = \\dfrac{4}{5}$.', '$P(\\text{first red}) = \\dfrac{4}{5}$.', true, '$4$ đỏ trong $5$ bi.', '$4$ red out of $5$.'),
      si('b', '$P(\\text{cả hai đỏ}) = \\dfrac{3}{5}$.', '$P(\\text{both red}) = \\dfrac{3}{5}$.', true, '$\\dfrac{4}{5}\\cdot\\dfrac{3}{4}=\\dfrac{3}{5}$.', '$4/5\\cdot3/4=3/5$.'),
      si('c', 'Hai lần rút độc lập.', 'The two draws are independent.', false, 'Không hoàn lại.', 'Without replacement.'),
      si('d', '$P(\\text{bi xanh thứ hai} \\mid \\text{đầu đỏ}) = 0$.', '$P(\\text{second blue} \\mid \\text{first red}) = 0$.', false, 'Còn $1$ xanh trong $4$ bi: $P=\\dfrac{1}{4}$.', 'One blue remains: $1/4$.'),
    ],
    { vi: 'Đáp án: aĐ, bĐ, cS, dS.', en: 'Answers: aT, bT, cF, dF.' },
    { vi: '**Ý d.** Sau một đỏ vẫn còn $1$ xanh.', en: '**d.** One blue remains.' },
    { vi: 'Rút không hoàn lại: cập nhật số bi sau lần đầu.', en: 'Update counts after the first draw.' }),
  tf('P2_04', 7,
    { vi: 'Xét nghiệm: $5\\%$ dân số mắc bệnh; dương tính đúng $90\\%$ khi có bệnh; âm tính đúng $95\\%$ khi không bệnh.', en: 'Test: $5\\%$ disease rate; $90\\%$ true positive; $95\\%$ true negative.' },
    [
      si('a', 'Xác suất không mắc bệnh bằng $0{,}95$.', 'Probability of no disease is $0.95$.', true, '$1-0{,}05=0{,}95$.', '$1-0.05=0.95$.'),
      si('b', 'Xác suất dương tính, biết có bệnh, bằng $0{,}9$.', 'Given disease, $P(\\text{positive})=0.9$.', true, 'Theo dữ kiện.', 'Given in stem.'),
      si('c', 'Xác suất dương tính bằng $0{,}9$.', 'Probability of positive test is $0.9$.', false, '$P(+)=0{,}05\\cdot0{,}9+0{,}95\\cdot0{,}05=0{,}0925$.', 'Total probability.'),
      si('d', 'Xác suất không bệnh, biết âm tính, lớn hơn $0{,}99$.', 'Given negative, $P(\\text{healthy})>0.99$.', true, '$\\approx0{,}994$.', '$\\approx0.994>0.99$.'),
    ],
    { vi: 'Đáp án: aĐ, bĐ, cS, dĐ.', en: 'Answers: aT, bT, cF, dT.' },
    { vi: '**Ý c.** $P(+)$ cần công thức xác suất toàn phần.', en: '**c.** Total probability for $P(+)$.' },
    { vi: 'Phân biệt $P(+)$ và $P(+\\mid\\text{bệnh})$.', en: 'Distinguish $P(+)$ and $P(+\\mid\\text{disease})$.' }),

  short('P3_01', 6,
    { vi: 'Giá trị lớn nhất của $T = 4x + y$ với $x \\ge 0$, $y \\ge 0$, $x + y \\le 8$ bằng', en: 'Max of $T = 4x + y$ with $x \\ge 0$, $y \\ge 0$, $x + y \\le 8$ is' },
    ['32'], 0,
    { vi: 'GTLN tại $(8;0)$: $T=32$.', en: 'Max at $(8,0)$: $T=32$.' },
    { vi: '**Đỉnh:** $(0,0)$, $(8,0)$, $(0,8)$. **$T(8,0)=32$** lớn nhất.', en: '**Vertices.** Max **32** at $(8,0)$.' },
    { vi: 'Hệ số $4$ của $x$ lớn — kiểm tra $(8;0)$.', en: 'Larger $x$ coefficient — check $(8,0)$.' }),
  short('P3_01', 7,
    { vi: 'Giá trị lớn nhất của $T = 2x + 5y$ với $x \\ge 0$, $y \\ge 0$, $x + 3y \\le 15$ bằng', en: 'Max of $T = 2x + 5y$ with $x \\ge 0$, $y \\ge 0$, $x + 3y \\le 15$ is' },
    ['25'], 0,
    { vi: 'GTLN tại $(0;5)$: $T=25$.', en: 'Max at $(0,5)$: $T=25$.' },
    { vi: '**Giao $Oy$:** $(0;5)$. **$T(0,5)=25$.**', en: '**$y$-intercept $(0,5)$.** Max **25**.' },
    { vi: '$x+3y\\le15$ cắt $Oy$ tại $(0;5)$, không phải $(0;15)$.', en: '$y$-intercept is $(0,5)$, not $(0,15)$.' }),

  short('P3_02', 6,
    { vi: 'Số cách chọn 2 quyển sách từ 9 quyển khác nhau bằng', en: 'Ways to choose 2 books from 9 distinct books' },
    ['36'], 0,
    { vi: '$C_9^2 = 36$.', en: '$C_9^2 = 36$.' },
    { vi: '**$C_9^2 = \\dfrac{9\\cdot8}{2} = 36$.**', en: '**$C_9^2 = 36$.**' },
    { vi: 'Chia $2!$ vì không xét thứ tự.', en: 'Divide by $2!$.' }),
  short('P3_02', 7,
    { vi: 'Số cách chọn 4 thành viên từ 8 thành viên bằng', en: 'Ways to choose 4 members from 8' },
    ['70'], 0,
    { vi: '$C_8^4 = 70$.', en: '$C_8^4 = 70$.' },
    { vi: '**$C_8^4 = \\dfrac{8\\cdot7\\cdot6\\cdot5}{4!} = 70$.**', en: '**$C_8^4 = 70$.**' },
    { vi: 'Nhớ chia $4!=24$.', en: 'Divide by $4!=24$.' }),

  short('P3_03', 6,
    { vi: 'Gieo một xúc xắc. $P(\\text{mặt } \\le 2)$ bằng (phân số tối giản)', en: 'One die. $P(\\text{face } \\le 2)$ (simplest fraction)' },
    ['1/3', '2/6'], 0,
    { vi: 'Hai mặt $\\{1,2\\}$: $P=\\dfrac{2}{6}=\\dfrac{1}{3}$.', en: '$P=2/6=1/3$.' },
    { vi: '**$A=\\{1,2\\}$, $P=\\dfrac{1}{3}$.**', en: '**$P=1/3$.**' },
    { vi: '$\\le 2$ gồm $1$ và $2$, không phải $\\dfrac{2}{6}$ chưa rút gọn nếu đề yêu cầu tối giản.', en: 'Two outcomes: $1$ and $2$.' }),
  short('P3_03', 7,
    { vi: 'Gieo hai xúc xắc. $P(\\text{tổng bằng } 9)$ bằng (phân số tối giản)', en: 'Two dice. $P(\\text{sum } 9)$ (simplest fraction)' },
    ['1/9', '4/36'], 0,
    { vi: 'Bốn cặp trong $36$ kết quả: $P=\\dfrac{4}{36}=\\dfrac{1}{9}$.', en: 'Four pairs: $P=4/36=1/9$.' },
    { vi: '**Tổng $9$:** $(3,6),(4,5),(5,4),(6,3)$ — $4$ cặp.', en: '**Four ordered pairs.**' },
    { vi: 'Đếm cặp có thứ tự, $n(\\Omega)=36$.', en: 'Ordered pairs, $36$ outcomes.' }),

  short('P3_04', 6,
    { vi: 'Nón có $r=3$, $h=8$. Thể tích ($\\pi\\approx3{,}14$, làm tròn số nguyên)', en: 'Cone $r=3$, $h=8$. Volume ($\\pi\\approx3.14$, round to integer)' },
    ['75'], 1,
    { vi: '$V=\\dfrac{1}{3}\\cdot3{,}14\\cdot9\\cdot8\\approx75{,}36\\rightarrow75$.', en: '$V\\approx75$.' },
    { vi: '**$V=\\dfrac{1}{3}\\pi r^2 h\\approx75$.**', en: '**$V\\approx75$.**' },
    { vi: 'Hệ số $\\dfrac{1}{3}$ cho nón.', en: 'Factor $\\dfrac{1}{3}$ for cone.' }),
  short('P3_04', 7,
    { vi: 'Nón có $r=4$, $h=3$. Thể tích ($\\pi\\approx3{,}14$, làm tròn số nguyên)', en: 'Cone $r=4$, $h=3$. Volume ($\\pi\\approx3.14$, round)' },
    ['50'], 1,
    { vi: '$V=\\dfrac{1}{3}\\cdot3{,}14\\cdot16\\cdot3\\approx50{,}24\\rightarrow50$.', en: '$V\\approx50$.' },
    { vi: '**$r^2=16$, $V\\approx50$.**', en: '**$V\\approx50$.**' },
    { vi: '$r^2=16$, không phải $8$.', en: '$r^2=16$.' }),

  short('P3_05', 6,
    { vi: 'GTNN của $f(x)=x^2-2x+3$ trên $\\mathbb{R}$ bằng', en: 'Minimum of $f(x)=x^2-2x+3$ on $\\mathbb{R}$' },
    ['2'], 0,
    { vi: '$x=1$, $f(1)=2$.', en: '$f(1)=2$.' },
    { vi: '**$f\'(x)=2x-2=0 \\Rightarrow x=1$, $f(1)=2$.**', en: '**$f(1)=2$.**' },
    { vi: 'Thế $x=1$ vào $f(x)$.', en: 'Evaluate $f(1)$.' }),
  short('P3_05', 7,
    { vi: 'GTNN của $f(x)=3x^2-12x+7$ trên $\\mathbb{R}$ bằng', en: 'Minimum of $f(x)=3x^2-12x+7$ on $\\mathbb{R}$' },
    ['-5'], 0,
    { vi: '$x=2$, $f(2)=-5$.', en: '$f(2)=-5$.' },
    { vi: '**$x=2$, $f(2)=12-24+7=-5$.**', en: '**$f(2)=-5$.**' },
    { vi: 'GTNN có thể âm.', en: 'Minimum can be negative.' }),

  short('P3_06', 6,
    { vi: '$\\displaystyle \\int_0^3 2x\\,dx$ bằng', en: '$\\displaystyle \\int_0^3 2x\\,dx$ equals' },
    ['9'], 0,
    { vi: '$[x^2]_0^3=9$.', en: '$[x^2]_0^3=9$.' },
    { vi: '**Nguyên hàm $x^2$, $F(3)-F(0)=9$.**', en: '**Answer 9.**' },
    { vi: 'Thế cả cận dưới.', en: 'Evaluate both bounds.' }),
  short('P3_06', 7,
    { vi: '$\\displaystyle \\int_0^2 (x+2)\\,dx$ bằng', en: '$\\displaystyle \\int_0^2 (x+2)\\,dx$ equals' },
    ['6'], 0,
    { vi: '$\\left[\\dfrac{x^2}{2}+2x\\right]_0^2=2+4=6$.', en: '$[x^2/2+2x]_0^2=6$.' },
    { vi: '**$F(2)=2+4=6$.**', en: '**Answer 6.**' },
    { vi: 'Cộng đủ hạng $2x$ khi thế $x=2$.', en: 'Include the $2x$ term.' }),
];

function anchorFor(slot) {
  return ANCHOR[slot] ?? qid(slot, 5);
}

function insertAfter(questions, afterId, newQs) {
  const idx = questions.findIndex((q) => q.id === afterId);
  if (idx === -1) throw new Error(`Anchor not found: ${afterId}`);
  questions.splice(idx + 1, 0, ...newQs);
}

function updateSlots() {
  const slotsDir = join(root, 'content/bank/slots');
  const bySlot = {};
  for (const q of BATCH3) {
    if (!bySlot[q.matrixSlot]) bySlot[q.matrixSlot] = [];
    bySlot[q.matrixSlot].push(q.id);
  }
  for (const file of readdirSync(slotsDir).filter((f) => f.endsWith('.json'))) {
    const path = join(slotsDir, file);
    const slot = JSON.parse(readFileSync(path, 'utf8'));
    const added = bySlot[slot.slotCode];
    if (!added) continue;
    slot.bankQuestionIds = [...slot.bankQuestionIds, ...added];
    slot.batch3 = {
      added,
      notes: Object.fromEntries(added.map((id) => [id, `batch3 variant`])),
    };
    slot.status = 'enriched';
    writeFileSync(path, `${JSON.stringify(slot, null, 2)}\n`, 'utf8');
    console.log(`[slot] ${slot.slotCode}: +${added.length}`);
  }
}

const bankPath = join(root, 'content/bank/questions.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));

const bySlotInsert = {};
for (const q of BATCH3) {
  const slot = q.matrixSlot;
  if (!bySlotInsert[slot]) bySlotInsert[slot] = [];
  bySlotInsert[slot].push(q);
}

for (const slot of Object.keys(bySlotInsert)) {
  const anchor = anchorFor(slot);
  const existing = bank.questions.some((q) => bySlotInsert[slot].some((n) => n.id === q.id));
  if (existing) {
    console.log(`[skip] ${slot}: batch3 already present`);
    continue;
  }
  insertAfter(bank.questions, anchor, bySlotInsert[slot]);
  console.log(`[insert] ${slot}: ${bySlotInsert[slot].map((q) => q.id).join(', ')} after ${anchor}`);
}

writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
updateSlots();
console.log(`\nDone — ${BATCH3.length} questions in batch 3.`);

