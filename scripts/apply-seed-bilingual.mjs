#!/usr/bin/env node
/**
 * One-shot: add { vi, en } bilingual fields to seed questions.json
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'content/bank/questions.json');
const data = JSON.parse(readFileSync(path, 'utf8'));

/** @param {string} en @param {string} vi */
function bi(en, vi) {
  return { en, vi: vi || en };
}

/** @param {string} s */
function biMath(s) {
  return { en: s, vi: s };
}

const VI = {
  'seed-p1-01': {
    stem: 'Giá trị của $\\sin 30^\\circ$ là',
    explanation: '$\\sin 30^\\circ = \\dfrac{1}{2}$.',
  },
  'seed-p1-02': {
    stem: 'Cấp số cộng có $u_1 = 3$ và công sai $d = 4$. Tìm $u_5$.',
    explanation: '$u_5 = u_1 + 4d = 3 + 16 = 19$.',
  },
  'seed-p1-03': {
    stem: 'Lăng trụ đứng có đáy vuông cạnh $4$ và chiều cao $5$. Thể tích bằng',
    explanation: '$V = 4^2 \\times 5 = 80$.',
  },
  'seed-p1-04': {
    stem: 'Một hình cầu có bán kính $R = 3$. Diện tích mặt cầu bằng',
    explanation: '$S = 4\\pi R^2 = 36\\pi$.',
  },
  'seed-p1-05': {
    stem: 'Nghiệm của phương trình $2^x = 8$ là',
    explanation: '$2^x = 2^3 \\Rightarrow x = 3$.',
  },
  'seed-p1-06': {
    stem: 'Trung bình cộng của dãy số $4, 6, 8, 10$ là',
    explanation: 'Trung bình $= \\dfrac{4+6+8+10}{4} = 7$.',
  },
  'seed-p1-07': {
    stem: 'Đạo hàm của $f(x) = x^3 - 2x$ là',
    explanation: '$f\'(x) = 3x^2 - 2$.',
  },
  'seed-p1-08': {
    stem: '$\\displaystyle \\int_0^1 2x\\,dx$ bằng',
    explanation: '$\\int_0^1 2x\\,dx = [x^2]_0^1 = 1$.',
  },
  'seed-p1-09': {
    stem: 'Một nguyên hàm của $f(x) = \\cos x$ là',
    explanation: '$(\\sin x)\' = \\cos x$.',
  },
  'seed-p1-10': {
    stem: 'Trong $Oxyz$, khoảng cách từ $M(1,2,2)$ đến gốc tọa độ bằng',
    explanation: '$OM = \\sqrt{1+4+4} = 3$.',
  },
  'seed-p1-11': {
    stem: 'Một vectơ chỉ phương của đường thẳng $\\dfrac{x-1}{2} = \\dfrac{y}{-1} = \\dfrac{z+1}{3}$ là',
    explanation: 'Hệ số dưới mẫu cho vectơ chỉ phương $(2,-1,3)$.',
  },
  'seed-p1-12': {
    stem: 'Mặt phẳng $2x - y + 2z - 6 = 0$ có vectơ pháp tuyến',
    explanation: 'Hệ số của $x,y,z$ tạo thành vectơ pháp tuyến.',
  },
  'seed-p2-01': {
    context: 'Cho $f(x) = x^3 - 3x + 1$.',
    stem: 'Xét các mệnh đề sau:',
    sub: {
      a: 'Mệnh đề $f\'(x) = 3x^2 - 3$.',
      b: 'Hàm số $f$ có hai điểm cực trị.',
      c: 'Hàm số $f$ đồng biến trên $(1,+\\infty)$.',
      d: 'Giá trị lớn nhất của $f$ trên $\\mathbb{R}$ bằng $3$.',
    },
    subExpl: {
      a: 'Đạo hàm trực tiếp.',
      b: '$f\'(x)=0 \\Leftrightarrow x = \\pm 1$.',
      c: '$f\'(x) > 0$ khi $x > 1$.',
      d: '$f$ không có giá trị lớn nhất trên $\\mathbb{R}$.',
    },
  },
  'seed-p2-02': {
    stem: 'Với $I = \\displaystyle \\int_0^2 (x+1)\\,dx$, chọn Đúng hoặc Sai:',
    sub: {
      a: 'Một nguyên hàm của $x+1$ là $\\dfrac{x^2}{2} + x$.',
      b: '$I = 4$.',
      c: '$I < 3$.',
      d: 'Hàm số dưới dấu tích phân dương trên $[0,2]$.',
    },
  },
  'seed-p2-03': {
    stem: 'Trong $Oxyz$, mặt phẳng $(P): x + y + z - 6 = 0$.',
    sub: {
      a: 'Vectơ pháp tuyến của $(P)$ là $(1,1,1)$.',
      b: 'Điểm $A(2,2,2)$ thuộc $(P)$.',
      c: 'Vectơ $(1,-1,0)$ song song với $(P)$.',
      d: 'Khoảng cách từ $O$ đến $(P)$ bằng $2\\sqrt{3}$.',
    },
  },
  'seed-p2-04': {
    context: 'Hộp có 3 bi đỏ và 2 bi xanh. Rút một bi, sau đó rút tiếp không hoàn lại.',
    stem: 'Chọn Đúng hoặc Sai:',
    sub: {
      a: '$P(\\text{bi đỏ đầu}) = \\dfrac{3}{5}$.',
      b: '$P(\\text{cả hai đỏ}) = \\dfrac{3}{10}$.',
      c: 'Hai lần rút độc lập.',
      d: '$P(\\text{bi đỏ thứ hai} \\mid \\text{đầu đỏ}) = \\dfrac{1}{2}$.',
    },
  },
  'seed-p3-01': {
    stem: 'Giá trị lớn nhất của $T = 2x + 3y$ với $x \\ge 0, y \\ge 0, x + y \\le 4$ tại đỉnh $(0,4)$ bằng',
    explanation: '$T(0,4) = 12$.',
  },
  'seed-p3-02': {
    stem: 'Số cách chọn 2 học sinh từ 5 học sinh bằng',
    explanation: '$C_5^2 = 10$.',
  },
  'seed-p3-03': {
    stem: 'Gieo một con xúc xắc cân đối một lần. $P(\\text{chẵn})$ bằng (viết số thập phân)',
    explanation: 'Ba mặt chẵn trong sáu: $P = \\dfrac{1}{2}$.',
  },
  'seed-p3-04': {
    stem: 'Hình nón có bán kính đáy $3$ và chiều cao $4$. Thể tích bằng (lấy $\\pi \\approx 3{,}14$, làm tròn số nguyên)',
    explanation: '$V = \\dfrac{1}{3}\\pi r^2 h \\approx 37{,}68 \\rightarrow 38$.',
  },
  'seed-p3-05': {
    stem: 'Giá trị nhỏ nhất của $f(x) = x^2 - 4x + 7$ trên $\\mathbb{R}$ bằng',
    explanation: 'Đỉnh tại $x=2$, $f(2)=3$.',
  },
  'seed-p3-06': {
    stem: '$\\displaystyle \\int_1^2 \\dfrac{1}{x}\\,dx$ bằng (làm tròn 2 chữ số thập phân)',
    explanation: '$\\ln 2 \\approx 0{,}69$.',
  },
};

for (const q of data.questions) {
  const v = VI[q.id];
  if (!v) continue;

  if (typeof q.stem === 'string') q.stem = bi(q.stem, v.stem);
  if (q.explanation && typeof q.explanation === 'string') {
    q.explanation = bi(q.explanation, v.explanation);
  }
  if (q.context && typeof q.context === 'string') {
    q.context = bi(q.context, v.context);
  }
  if (q.options) {
    for (const o of q.options) {
      if (typeof o.text === 'string') o.text = biMath(o.text);
    }
  }
  if (q.subItems && v.sub) {
    for (const s of q.subItems) {
      if (typeof s.statement === 'string') {
        s.statement = bi(s.statement, v.sub[s.label]);
      }
      if (s.explanation && v.subExpl?.[s.label]) {
        s.explanation = bi(s.explanation, v.subExpl[s.label]);
      }
    }
  }
}

writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Bilingual seed questions written:', path);
