import { mathHtml } from './math-render.js';
import { tx, txOptions, txSubItems } from '../app/content-text.js';
import { renderQuestTrailHtml, bindQuestTrail, spawnGoldFloat } from './quest-trail.js';
import { firstIndexInRegion } from '../app/quest-regions.js';
import { unifiedLangButtonHtml } from './lang-button.js';
import { renderWorldHub } from './world-hub.js';
import { getMistakeFeedback } from '../app/mistake-feedback.js';
import { wizardHintHtml } from './wizard-panel.js';

export function clearScreen(root, message) {
  root.innerHTML = `<div class="panel panel-center"><p>${message}</p></div>`;
}

export function renderLoading(root, message) {
  clearScreen(root, message);
}

export function renderMenu(root, opts) {
  renderWorldHub(root, opts);
}

let examIndex = 0;
let autoAdvanceTimer = null;

export function getExamIndex() {
  return examIndex;
}

/** @param {number} index */
export function setExamIndex(index) {
  examIndex = Math.max(0, index);
}

export function clearAutoAdvance() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
}

export function renderExam(root, opts) {
  clearAutoAdvance();
  const {
    exam,
    answers,
    flags,
    examMode,
    contentLang,
    questMode,
    sessionGold,
    onAnswer,
    onFlag,
    onSubmit,
    onQuit,
    onNavigate,
    t,
  } = opts;
  const q = exam.questions[examIndex];
  if (!q) {
    examIndex = 0;
    return;
  }

  const partLabel = q.part === 1 ? t('part1') : q.part === 2 ? t('part2') : t('part3');
  const globalNum = examIndex + 1;
  const total = exam.questions.length;
  const examLabel = typeof exam.label === 'object' ? tx(exam.label, contentLang) : exam.label;

  let body = '';
  if (q.examImage) {
    body += `<div class="exam-paper-img"><img src="${q.examImage}" alt="" loading="lazy" /></div>`;
  }
  if (q.context) {
    body += `<div class="q-context">${mathHtml(tx(q.context, contentLang))}</div>`;
  }
  body += `<div class="q-stem">${mathHtml(tx(q.stem, contentLang))}</div>`;

  if (q.part === 1) {
    const options = txOptions(q.options, contentLang);
    body += '<div class="options">';
    for (const opt of options) {
      const checked = answers[q.id] === opt.label ? 'checked' : '';
      body += `
        <label class="option-row">
          <input type="radio" name="q-${q.id}" value="${opt.label}" ${checked} />
          <span class="opt-label">${opt.label}.</span>
          <span class="opt-text">${mathHtml(opt.text)}</span>
        </label>`;
    }
    body += '</div>';
  } else if (q.part === 2) {
    const sub = answers[q.id] || {};
    const items = txSubItems(q.subItems, contentLang);
    body += '<div class="subitems">';
    for (const item of items) {
      const val = sub[item.label];
      body += `
        <div class="subitem-row">
          <div class="subitem-text"><strong>${item.label})</strong> ${mathHtml(item.statement)}</div>
          <div class="tf-group">
            <button type="button" class="btn btn-sm ${val === true ? 'active' : ''}" data-sub="${item.label}" data-val="true">${t('true')}</button>
            <button type="button" class="btn btn-sm ${val === false ? 'active' : ''}" data-sub="${item.label}" data-val="false">${t('false')}</button>
          </div>
        </div>`;
    }
    body += '</div>';
  } else {
    const val = answers[q.id] ?? '';
    body += `
      <input type="text" class="input-short" id="short-${q.id}" value="${escapeAttr(val)}" placeholder="${t('shortAnswerPlaceholder')}" />`;
  }

  const langBtn = opts.onToggleLang
    ? unifiedLangButtonHtml(contentLang, 'btn-exam-content-lang')
    : '';

  const mapHtml = questMode
    ? renderQuestTrailHtml({
        questions: exam.questions,
        answers,
        flags,
        currentIndex: examIndex,
        sessionGold: sessionGold || 0,
        t,
      })
    : '';

  const timed =
    examMode === 'full' || examMode.startsWith('official-') || questMode;

  root.innerHTML = `
    <div class="panel exam-panel ${questMode ? 'exam-panel-quest' : ''}">
      ${mapHtml}
      <div class="exam-top">
        <span class="exam-meta">${examLabel ? `${examLabel} · ` : ''}${partLabel} — ${t('question')} ${globalNum} ${t('of')} ${total}</span>
        ${timed ? `<span class="exam-timer" id="exam-timer">90:00</span>` : ''}
        ${langBtn}
        <button type="button" class="btn btn-ghost btn-sm flag-btn ${flags[q.id] ? 'flagged' : ''}" data-flag>${t('flag')}</button>
      </div>
      <div class="exam-body" id="exam-body">${body}</div>
      <div class="exam-nav">
        <button type="button" class="btn" data-nav="prev" ${examIndex === 0 ? 'disabled' : ''}>←</button>
        <div class="progress-dots">${questMode ? '' : renderDots(total, examIndex)}</div>
        <button type="button" class="btn" data-nav="next" ${examIndex >= total - 1 ? 'disabled' : ''}>→</button>
      </div>
      <div class="exam-actions">
        <button type="button" class="btn btn-ghost" data-quit>${t('quitExam')}</button>
        <button type="button" class="btn btn-primary" data-submit>${t('submitExam')}</button>
      </div>
    </div>
  `;

  root.querySelectorAll('input[type=radio]').forEach((el) => {
    el.addEventListener('change', () => onAnswer(q.id, el.value));
  });

  root.querySelectorAll('[data-sub]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const label = btn.getAttribute('data-sub');
      const v = btn.getAttribute('data-val') === 'true';
      const prev = { ...(answers[q.id] || {}) };
      prev[label] = v;
      onAnswer(q.id, prev);
    });
  });

  const shortInput = root.querySelector(`#short-${q.id}`);
  if (shortInput) {
    shortInput.addEventListener('input', () => onAnswer(q.id, shortInput.value));
  }

  root.querySelector('[data-flag]')?.addEventListener('click', () => onFlag(q.id));
  root.querySelector('#btn-exam-content-lang')?.addEventListener('click', () => opts.onToggleLang?.());
  root.querySelector('[data-quit]')?.addEventListener('click', onQuit);
  root.querySelector('[data-submit]')?.addEventListener('click', onSubmit);
  root.querySelector('[data-nav="prev"]')?.addEventListener('click', () => {
    if (examIndex > 0 && onNavigate) onNavigate(examIndex - 1);
    else if (examIndex > 0) {
      examIndex -= 1;
      renderExam(root, opts);
    }
  });
  root.querySelector('[data-nav="next"]')?.addEventListener('click', () => {
    if (examIndex < total - 1 && onNavigate) onNavigate(examIndex + 1);
    else if (examIndex < total - 1) {
      examIndex += 1;
      renderExam(root, opts);
    }
  });

  if (questMode && onNavigate) {
    bindQuestTrail(
      root,
      (idx) => onNavigate(idx),
      (regionId) => onNavigate(firstIndexInRegion(/** @type {import('../app/quest-regions.js').RegionId} */ (regionId)))
    );
  }

  if (opts.showGoldFloat && questMode) {
    const panel = root.querySelector('.quest-trail-panel');
    if (panel) spawnGoldFloat(panel, 5);
  }
}

export function resetExamIndex() {
  examIndex = 0;
  clearAutoAdvance();
}

function renderDots(total, active) {
  let html = '';
  for (let i = 0; i < total; i += 1) {
    html += `<span class="dot ${i === active ? 'active' : ''}"></span>`;
  }
  return html;
}

function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;');
}

export function renderResult(root, { result, exam, contentLang, showSolutions, onReview, onNotebook, onNewExam, onMenu, t }) {
  const wrong = result.details.filter((d) => !d.correct);
  let list = '';
  if (showSolutions) {
    for (const d of result.details) {
      const q = exam.questions.find((x) => x.id === d.questionId);
      if (!q) continue;
      list += renderSolutionBlock(q, d, contentLang, t);
    }
  } else if (wrong.length) {
    list = `<p class="muted">${wrong.length} ${t('incorrectCount')}</p>`;
  }

  root.innerHTML = `
    <div class="panel result-panel">
      <h2 class="screen-title">${t('resultTitle')}</h2>
      ${result.timedOut ? `<p class="warn">${t('timedOut')}</p>` : ''}
      <div class="score-grid">
        <div class="score-main">${t('scoreTotal')}: <strong>${result.total}</strong>/10</div>
        <div class="score-parts">
          <span>${t('scorePart1')}: ${result.part1}</span>
          <span>${t('scorePart2')}: ${result.part2}</span>
          <span>${t('scorePart3')}: ${result.part3}</span>
        </div>
      </div>
      <div class="solution-list">${list}</div>
      <div class="btn-stack">
        ${!showSolutions && onReview ? `<button type="button" class="btn" data-review>${t('viewSolutions')}</button>` : ''}
        <button type="button" class="btn btn-primary" data-new>${t('newExam')}</button>
        <button type="button" class="btn" data-notebook>${t('mistakeNotebook')}</button>
        <button type="button" class="btn btn-ghost" data-menu>${t('backMenu')}</button>
      </div>
    </div>
  `;
  root.querySelector('[data-review]')?.addEventListener('click', onReview);
  root.querySelector('[data-new]')?.addEventListener('click', onNewExam);
  root.querySelector('[data-notebook]')?.addEventListener('click', onNotebook);
  root.querySelector('[data-menu]')?.addEventListener('click', onMenu);
}

function renderSolutionBlock(q, detail, contentLang, t) {
  let ans = '';
  if (q.part === 1) {
    ans = `${t('correctAnswer')}: ${detail.correctAnswer}`;
  } else if (q.part === 2) {
    ans = `${t('points')}: ${detail.points} (${detail.correctCount}/4)`;
  } else {
    ans = `${t('correctAnswer')}: ${mathHtml(String(detail.correctAnswer || ''))}`;
  }
  const expl = q.explanation ? tx(q.explanation, contentLang) : '';
  const wizard =
    !detail.correct
      ? wizardHintHtml(getMistakeFeedback(q, contentLang), t)
      : '';
  return `
    <article class="solution-card ${detail.correct ? 'ok' : 'bad'}">
      <div class="q-stem">${mathHtml(tx(q.stem, contentLang))}</div>
      <p>${ans}</p>
      ${wizard}
      ${expl ? `<p class="expl">${mathHtml(expl)}</p>` : ''}
    </article>`;
}

export function renderNotebook(root, { questions, contentLang, onPractice, onMenu, t }) {
  if (!questions.length) {
    root.innerHTML = `
      <div class="panel">
        <h2 class="screen-title">${t('notebookTitle')}</h2>
        <p>${t('notebookEmpty')}</p>
        <button type="button" class="btn" data-menu>${t('backMenu')}</button>
      </div>`;
    root.querySelector('[data-menu]')?.addEventListener('click', onMenu);
    return;
  }

  const list = questions
    .map((q) => {
      const hint = getMistakeFeedback(q, contentLang);
      return `
        <li class="notebook-item">
          <p class="notebook-stem">${stripTex(tx(q.stem, contentLang)).slice(0, 100)}…</p>
          ${wizardHintHtml(hint, t)}
        </li>`;
    })
    .join('');

  root.innerHTML = `
    <div class="panel">
      <h2 class="screen-title">${t('notebookTitle')}</h2>
      <p>${questions.length} ${t('notebookCount')}</p>
      <ul class="notebook-list notebook-list-rich">${list}</ul>
      <div class="btn-stack">
        <button type="button" class="btn btn-primary" data-practice>${t('practiceMistakes')}</button>
        <button type="button" class="btn btn-ghost" data-menu>${t('backMenu')}</button>
      </div>
    </div>`;
  root.querySelector('[data-practice]')?.addEventListener('click', onPractice);
  root.querySelector('[data-menu]')?.addEventListener('click', onMenu);
}

function stripTex(s) {
  return String(s).replace(/\$[^$]+\$/g, '').replace(/\s+/g, ' ').trim();
}
