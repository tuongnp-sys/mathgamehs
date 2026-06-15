import { tx } from './content-text.js';

/** @type {Record<string, { vi: string, en: string }>} */
const TOPIC_HINTS = {
  L11_TRIG: {
    vi: 'Ôn lại bảng giá trị lượng giác ở các góc đặc biệt (30°, 45°, 60°) và quan hệ sin/cos.',
    en: 'Review trig values at special angles (30°, 45°, 60°) and sin/cos relationships.',
  },
  L11_SEQ: {
    vi: 'Xác định loại cấp số (cộng/nhân), công thức tổng quát và cách tính hạng thứ n.',
    en: 'Identify arithmetic vs geometric sequences, general formulas, and the n-th term.',
  },
  L11_SOLID: {
    vi: 'Vẽ hình, ghi rõ cạnh–đáy–chiều cao; kiểm tra công thức thể tích/khoảng cách.',
    en: 'Sketch the solid, label edges–bases–heights; verify volume/distance formulas.',
  },
  L11_EXPLOG: {
    vi: 'Chú ý miền xác định, tính chất log và luật mũ; thử thay số kiểm tra nhanh.',
    en: 'Watch the domain, log laws, and exponent rules; plug in numbers to sanity-check.',
  },
  L11_STATS: {
    vi: 'Đọc kỹ bảng số liệu; xác định trung bình, phương sai hoặc xác suất được hỏi.',
    en: 'Read the data table carefully; identify mean, variance, or the probability asked.',
  },
  L12_CALC: {
    vi: 'Tính đạo hàm từng bước; chú ý quy tắc chuỗi và điểm không khả vi.',
    en: 'Differentiate step by step; watch the chain rule and non-differentiable points.',
  },
  L12_INTEGRAL: {
    vi: 'Chọn phương pháp tích phân (đổi biến, từng phần); kiểm tra cận và đơn vị.',
    en: 'Pick substitution or parts; verify bounds and units.',
  },
  L12_OXYZ: {
    vi: 'Viết tọa độ rõ ràng; dùng tích vô hướng cho góc và phương trình mặt phẳng/đường thẳng.',
    en: 'Write coordinates clearly; use dot product for angles and plane/line equations.',
  },
  L12_PROB_COND: {
    vi: 'Vẽ sơ đồ xác suất; tách P(A∩B) = P(A)·P(B|A) và kiểm tra điều kiện độc lập.',
    en: 'Draw a probability tree; use P(A∩B) = P(A)·P(B|A) and check independence.',
  },
  L10_LINEAR_PROG: {
    vi: 'Vẽ miền nghiệm, xác định đỉnh khả thi rồi thế vào hàm mục tiêu.',
    en: 'Plot the feasible region, list corner points, then evaluate the objective.',
  },
  L10_COMBINATORICS: {
    vi: 'Phân biệt chỉnh hợp, tổ hợp và hoán vị; đếm từng bước thay vì đoán.',
    en: 'Tell permutations, combinations, and arrangements apart; count step by step.',
  },
  L11_PROB: {
    vi: 'Liệt kê không gian mẫu đầy đủ; đếm kết quả thuận lợi trước khi rút gọn.',
    en: 'List the full sample space; count favorable outcomes before simplifying.',
  },
};

const GENERIC = {
  vi: 'Đọc lại đề, gạch dưới dữ kiện quan trọng và thử một ví dụ số nhỏ để kiểm tra hướng suy luận.',
  en: 'Re-read the stem, underline key data, and test a small numeric example to verify your approach.',
};

/**
 * @param {import('./scoring.js').Question} q
 * @param {'vi' | 'en'} lang
 */
export function getMistakeFeedback(q, lang) {
  if (q.mistakeFeedback) return tx(q.mistakeFeedback, lang);
  const topic = TOPIC_HINTS[q.topicCode];
  if (topic) return tx(topic, lang);
  return tx(GENERIC, lang);
}
