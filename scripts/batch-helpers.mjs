export function qid(slot, n) {
  return `bank-${slot.toLowerCase().replace(/_/g, '-')}-b${String(n).padStart(2, '0')}`;
}

export function createFactories(slotMeta, source) {
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
      source,
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

  return { mcq, tf, short, si };
}
