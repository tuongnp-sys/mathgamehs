import { createPlatform } from '../platform/index.js';
import { initAudio, unlockAudio, pauseAudio, resumeAudio, playBellSound, playBgm, stopBgm, resetBgmUserPreference, setBgmUserEnabled, isBgmUserEnabled } from './audio.js';
import { loadBank, buildExam } from './app/exam-engine.js';
import { scoreExam } from './app/scoring.js';
import {
  addMistakesFromSession,
  loadMistakeNotebook,
  loadStats,
  saveStats,
  recordQuestCompletion,
} from './app/mistake-notebook.js';
import { t, getLocale } from './app/i18n.js';
import { getContentLang } from './app/content-lang.js';
import { toggleUnifiedLang, syncUnifiedLang } from './app/unified-lang.js';
import { tx } from './app/content-text.js';
import { isQuestionAnswered } from './app/quest-answer.js';
import {
  createQuestId,
  loadQuestSession,
  saveQuestSession,
  clearQuestSession,
  questSessionNeedsResume,
} from './app/quest-session.js';
import { generateExamManifest } from './app/exam-manifest.js';
import { computeTreasureReward } from './app/treasure-rewards.js';
import {
  renderMenu,
  renderExam,
  renderResult,
  renderNotebook,
  renderLoading,
  clearScreen,
  resetExamIndex,
  setExamIndex,
  getExamIndex,
} from './ui/screens.js';
import { renderQuestBriefing } from './ui/quest-briefing.js';
import { renderQuestTreasure } from './ui/quest-treasure.js';
import { renderRegionCutscene } from './ui/region-cutscene.js';
import 'katex/dist/katex.min.css';
import '../public/css/mathgamehs.css';
import '../public/css/quest-map.css';

/** @typedef {'menu'|'briefing'|'exam'|'cutscene'|'result'|'treasure'|'notebook'|'loading'} Screen */

const platform = createPlatform();
const isPortalBuild = typeof __PORTAL_MODE__ !== 'undefined' && __PORTAL_MODE__ === true;
const GAME_TITLE = typeof __GAME_TITLE__ !== 'undefined' ? __GAME_TITLE__ : 'MathGameHS';

let screen = /** @type {Screen} */ ('loading');
let bank = null;
let currentExam = null;
let answers = {};
let flags = {};
let timerId = null;
let secondsLeft = 0;
let examMode = 'full';
let questMode = false;
let questId = null;
let questStartedAt = null;
let lastSessionComplete = false;
let lastRunEndState = null;
let lastResult = null;
let lastReward = null;
let lastNewBest = false;
let contentLang = getContentLang();
let sessionGold = 0;
/** @type {Set<string>} */
let regionsCelebrated = new Set();
let showSolutions = false;
let menuReady = false;
let portalPaused = false;

const root = document.getElementById('screen-root');
const header = document.getElementById('app-header');
const footer = document.getElementById('app-footer');
const btnLocale = document.getElementById('btn-locale');
const brandTitle = document.getElementById('brand-title');

function applyPortalChrome() {
  const portal = platform.isPortalHost || isPortalBuild;
  document.body.classList.toggle('portal-mode', portal);
  header.classList.toggle('hidden', portal);
  footer.classList.toggle('hidden', portal);
  btnLocale.classList.toggle('hidden', portal);
  if (brandTitle) brandTitle.textContent = GAME_TITLE;
}

function shouldRunCommercialBreak() {
  return (
    (platform.isPortalHost || isPortalBuild) &&
    lastSessionComplete &&
    lastRunEndState === 'complete'
  );
}

async function runCommercialBreak() {
  pauseAudio();
  platform.gameplayStop?.();
  await platform.commercialBreak?.();
  if (!portalPaused) resumeAudio();
}

function isTimedMode(mode) {
  return mode === 'full' || mode.startsWith('official-');
}

function updateLocaleButton() {
  if (btnLocale) btnLocale.textContent = getLocale() === 'vi' ? 'EN' : 'VI';
}

function handleToggleLang() {
  contentLang = toggleUnifiedLang();
  updateLocaleButton();
  refreshCurrentScreen();
}

function refreshCurrentScreen() {
  if (!menuReady) return;
  switch (screen) {
    case 'menu':
      showMenu();
      break;
    case 'briefing':
      showQuestBriefing();
      break;
    case 'exam':
      renderExamScreen();
      break;
    case 'treasure':
      if (lastResult && lastReward) showQuestTreasureScreen();
      break;
    case 'result':
      if (lastResult) {
        renderResult(root, {
          result: lastResult,
          exam: currentExam,
          contentLang,
          showSolutions,
          musicEnabled: isBgmUserEnabled(),
          onToggleMusic: handleToggleMusic,
          onReview: showSolutions ? null : () => showResultReview(lastResult),
          onNotebook: () => showNotebook(),
          onNewExam: () => beginNewExam(),
          onMenu: () => showMenu(),
          t,
        });
      }
      break;
    case 'notebook':
      showNotebook();
      break;
    default:
      break;
  }
}

function persistQuestDraft() {
  if (!questMode || !currentExam || (screen !== 'exam' && screen !== 'cutscene')) return;
  const prev = loadQuestSession();
  saveQuestSession({
    questId: questId || createQuestId(),
    examMode: 'full',
    questionIds: currentExam.questions.map((q) => q.id),
    answers,
    flags,
    currentIndex: getExamIndex(),
    secondsLeft,
    startedAt: questStartedAt || Date.now(),
    status: 'in_progress',
    sessionGold,
    regionsCelebrated: [...regionsCelebrated],
    envelopeOpened: true,
    examManifestCode: prev?.examManifestCode,
    treasureValueUsd: prev?.treasureValueUsd,
    playStarted: true,
  });
}

function rebuildExamFromSession(session) {
  const questions = session.questionIds
    .map((id) => bank?.questions.find((q) => q.id === id))
    .filter(Boolean);
  if (questions.length !== session.questionIds.length) {
    clearQuestSession();
    return null;
  }
  return {
    mode: 'full',
    label: { vi: 'Hành trình kho báu', en: 'Treasure Quest' },
    questions,
    isQuest: true,
  };
}

async function boot() {
  applyPortalChrome();
  renderLoading(root, t('loading'));
  await platform.init();
  platform.reportLoading?.(0);
  initAudio();
  bank = await loadBank();
  platform.reportLoading?.(60);
  if (isPortalBuild) {
    syncUnifiedLang();
    contentLang = 'en';
  } else {
    syncUnifiedLang();
    contentLang = getContentLang();
  }
  updateLocaleButton();
  platform.reportLoading?.(100);
  await platform.loadingFinished?.();
  menuReady = true;
  showMenu();
}

function handleToggleMusic() {
  setBgmUserEnabled(!isBgmUserEnabled());
  refreshCurrentScreen();
}

function syncHubBgm() {
  const session = loadQuestSession();
  if (session?.envelopeOpened && !session?.playStarted) {
    unlockAudio();
    playBgm('hub');
  }
}

function cancelTreasureQuest() {
  if (!confirm(t('questCancelConfirm'))) return;
  stopTimer();
  questMode = false;
  questId = null;
  answers = {};
  flags = {};
  clearQuestSession();
  showMenu();
}

function showMenu() {
  screen = 'menu';
  lastSessionComplete = false;
  lastRunEndState = null;
  platform.gameplayStop?.();
  stopBgm();
  const stats = loadStats(platform);
  const session = loadQuestSession();
  renderMenu(root, {
    stats,
    contentLang,
    questEnvelope: session?.envelopeOpened
      ? {
          opened: true,
          examManifestCode: session.examManifestCode,
          treasureValueUsd: session.treasureValueUsd,
          canResume: questSessionNeedsResume(session),
          playStarted: !!session.playStarted,
        }
      : { opened: false },
    musicEnabled: isBgmUserEnabled(),
    onToggleMusic: handleToggleMusic,
    onOpenEnvelope: () => openQuestEnvelope(),
    onFullExam: () => departToBriefing(),
    onResumeQuest: () => resumeQuest(),
    onCancelTreasure: () => cancelTreasureQuest(),
    onNotebook: () => showNotebook(),
    onToggleLang: handleToggleLang,
    t,
    tx,
  });
  syncHubBgm();
}

function openQuestEnvelope() {
  if (!bank) return;
  const existing = loadQuestSession();
  if (existing?.envelopeOpened) {
    showMenu();
    return;
  }
  unlockAudio();
  const exam = buildExam(bank, 'full');
  if (!exam.questions.length) {
    alert(t('notebookEmpty'));
    return;
  }
  questId = createQuestId();
  questStartedAt = Date.now();
  const questionIds = exam.questions.map((q) => q.id);
  const { examManifestCode, treasureValueUsd } = generateExamManifest(questId, questionIds);
  saveQuestSession({
    questId,
    examMode: 'full',
    questionIds,
    answers: {},
    flags: {},
    currentIndex: 0,
    secondsLeft: 90 * 60,
    startedAt: questStartedAt,
    status: 'in_progress',
    sessionGold: 0,
    regionsCelebrated: [],
    envelopeOpened: true,
    examManifestCode,
    treasureValueUsd,
    playStarted: false,
  });
  showMenu();
  requestAnimationFrame(() => {
    root.querySelector('.quest-envelope')?.classList.add('envelope-just-opened');
  });
}

function departToBriefing() {
  const session = loadQuestSession();
  if (!session?.envelopeOpened || !bank) return;
  const exam = rebuildExamFromSession(session);
  if (!exam) {
    alert(t('questResumeFailed'));
    clearQuestSession();
    showMenu();
    return;
  }
  resetExamIndex();
  questMode = true;
  examMode = 'full';
  questId = session.questId;
  questStartedAt = session.startedAt;
  currentExam = exam;
  currentExam.label = { vi: 'Hành trình kho báu', en: 'Treasure Quest' };
  answers = { ...session.answers };
  flags = { ...session.flags };
  sessionGold = session.sessionGold ?? 0;
  regionsCelebrated = new Set(session.regionsCelebrated || []);
  secondsLeft = session.secondsLeft ?? 90 * 60;
  screen = 'briefing';
  lastSessionComplete = false;
  unlockAudio();
  showQuestBriefing();
}

function showQuestBriefing() {
  syncHubBgm();
  renderQuestBriefing(root, {
    questions: currentExam.questions,
    t,
    contentLang,
    onToggleLang: handleToggleLang,
    onStart: () => beginQuestPlay(),
  });
}

function startNewQuest() {
  clearQuestSession();
  showMenu();
}

function resumeQuest() {
  const session = loadQuestSession();
  if (!session || !bank) {
    showMenu();
    return;
  }
  const exam = rebuildExamFromSession(session);
  if (!exam) {
    alert(t('questResumeFailed'));
    showMenu();
    return;
  }
  questMode = true;
  examMode = 'full';
  questId = session.questId;
  questStartedAt = session.startedAt;
  currentExam = exam;
  answers = { ...session.answers };
  flags = { ...session.flags };
  sessionGold = session.sessionGold ?? 0;
  regionsCelebrated = new Set(session.regionsCelebrated || []);
  secondsLeft = session.secondsLeft ?? 90 * 60;
  setExamIndex(session.currentIndex ?? 0);
  screen = 'exam';
  unlockAudio();
  platform.gameplayStart?.();
  renderExamScreen();
  startTimer();
}

function beginQuestPlay() {
  stopBgm();
  screen = 'exam';
  platform.gameplayStart?.();
  const prev = loadQuestSession();
  if (prev) {
    saveQuestSession({ ...prev, playStarted: true });
  }
  persistQuestDraft();
  renderExamScreen();
  startTimer();
}

function startExam(mode) {
  if (!bank) return;
  stopBgm();
  questMode = false;
  clearQuestSession();
  resetExamIndex();
  examMode = mode;
  answers = {};
  flags = {};
  currentExam = buildExam(bank, mode);
  if (!currentExam.questions.length) {
    alert(t('notebookEmpty'));
    return;
  }
  const timed = isTimedMode(mode);
  secondsLeft = timed ? 90 * 60 : 0;
  screen = 'exam';
  lastSessionComplete = false;
  unlockAudio();
  platform.gameplayStart?.();
  renderExamScreen();
  if (timed) startTimer();
}

function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    if (portalPaused) return;
    secondsLeft -= 1;
    if (questMode) persistQuestDraft();
    if (secondsLeft <= 0) {
      stopTimer();
      submitExam(true);
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateTimerDisplay() {
  const el = document.getElementById('exam-timer');
  if (!el) return;
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function navigateToQuestion(index) {
  setExamIndex(index);
  persistQuestDraft();
  renderExamScreen();
}

function handleQuestAnswer(qId, value) {
  const idx = getExamIndex();
  const q = currentExam.questions[idx];
  if (!q || q.id !== qId) return;

  const wasAnswered = isQuestionAnswered(q, answers);
  answers[qId] = value;
  const nowAnswered = isQuestionAnswered(q, answers);
  const earnedGold = questMode && !wasAnswered && nowAnswered;
  if (earnedGold) sessionGold += 5;
  persistQuestDraft();

  const milestones = { 11: 'dam_lay', 15: 'rung_nguy' };
  const regionKey = milestones[idx];
  if (questMode && nowAnswered && regionKey && !regionsCelebrated.has(regionKey)) {
    regionsCelebrated.add(regionKey);
    persistQuestDraft();
    showRegionCutscene(regionKey, () => {
      maybeAutoAdvanceAfterAnswer(q, idx, nowAnswered);
      renderExamScreen(earnedGold);
    });
    return;
  }

  maybeAutoAdvanceAfterAnswer(q, idx, nowAnswered);
  renderExamScreen(earnedGold);
}

function maybeAutoAdvanceAfterAnswer(q, idx, nowAnswered) {
  if (!questMode || q.part !== 1 || !nowAnswered) return;
  if (idx >= currentExam.questions.length - 1) return;
  setTimeout(() => {
    if (screen !== 'exam') return;
    setExamIndex(idx + 1);
    persistQuestDraft();
    renderExamScreen(false);
  }, 400);
}

function showRegionCutscene(regionId, onContinue) {
  screen = 'cutscene';
  renderRegionCutscene(root, {
    regionId,
    mode: 'complete',
    t,
    onContinue: () => {
      screen = 'exam';
      platform.gameplayStart?.();
      onContinue();
    },
  });
}

function renderExamScreen(showGoldFloat = false) {
  renderExam(root, {
    exam: currentExam,
    answers,
    flags,
    secondsLeft,
    examMode,
    contentLang,
    questMode,
    sessionGold,
    showGoldFloat,
    onAnswer: (qId, value) => handleQuestAnswer(qId, value),
    onFlag: (qId) => {
      flags[qId] = !flags[qId];
      persistQuestDraft();
      renderExamScreen();
    },
    onSubmit: () => {
      if (questMode && !confirm(t('questSubmitConfirm'))) return;
      if (!questMode && !confirm(t('submitExam') + '?')) return;
      submitExam(false);
    },
    onQuit: () => {
      if (!confirm(t('questQuitConfirm'))) return;
      stopTimer();
      if (questMode) persistQuestDraft();
      else clearQuestSession();
      platform.gameplayStop?.();
      showMenu();
    },
    onNavigate: questMode ? navigateToQuestion : null,
    onToggleLang: handleToggleLang,
    t,
  });
  updateTimerDisplay();
}

function showQuestTreasureScreen() {
  if (!lastResult || !lastReward) return;
  renderQuestTreasure(root, {
    result: lastResult,
    reward: lastReward,
    newBest: lastNewBest,
    t,
    contentLang,
    musicEnabled: isBgmUserEnabled(),
    onToggleLang: handleToggleLang,
    onToggleMusic: handleToggleMusic,
    onReview: () => showResultReview(lastResult),
    onNotebook: () => showNotebook(),
    onNewQuest: () => beginNewQuestAfterAd(),
    onMenu: () => showMenu(),
  });
}

function submitExam(timedOut) {
  stopTimer();
  if (timedOut) playBellSound();
  const result = scoreExam(currentExam, answers);
  result.timedOut = timedOut;
  result.mode = examMode;
  result.finishedAt = Date.now();
  lastResult = result;
  showSolutions = false;
  addMistakesFromSession(platform, result);

  const reward = computeTreasureReward(result.total);
  lastReward = reward;

  let newBest = false;
  if (questMode) {
    clearQuestSession();
    const { stats, newBest: nb } = recordQuestCompletion(loadStats(platform), result, reward);
    newBest = nb;
    lastNewBest = nb;
    saveStats(platform, stats);
  } else {
    const stats = loadStats(platform);
    stats.examsTaken = (stats.examsTaken || 0) + 1;
    if (!stats.bestScore || result.total > stats.bestScore) {
      stats.bestScore = result.total;
      stats.bestScoreAt = result.finishedAt;
      newBest = true;
    }
    saveStats(platform, stats);
  }

  platform.pingGameOver?.();
  if (result.total >= 8) platform.happyTime?.();
  platform.gameplayStop?.();
  lastSessionComplete = true;
  lastRunEndState = 'complete';

  unlockAudio();
  resetBgmUserPreference();
  playBgm('result');

  if (questMode) {
    screen = 'treasure';
    renderQuestTreasure(root, {
      result,
      reward,
      newBest,
      t,
      contentLang,
      musicEnabled: isBgmUserEnabled(),
      onToggleLang: handleToggleLang,
      onToggleMusic: handleToggleMusic,
      onReview: () => showResultReview(result),
      onNotebook: () => showNotebook(),
      onNewQuest: () => beginNewQuestAfterAd(),
      onMenu: () => showMenu(),
    });
    questMode = false;
  } else {
    screen = 'result';
    renderResult(root, {
      result,
      exam: currentExam,
      contentLang,
      musicEnabled: isBgmUserEnabled(),
      onToggleMusic: handleToggleMusic,
      onReview: () => showResultReview(result),
      onNotebook: () => showNotebook(),
      onNewExam: () => beginNewExam(),
      onMenu: () => showMenu(),
      t,
    });
  }
}

function showResultReview(result) {
  showSolutions = true;
  screen = 'result';
  renderResult(root, {
    result,
    exam: currentExam,
    contentLang,
    showSolutions: true,
    musicEnabled: isBgmUserEnabled(),
    onToggleMusic: handleToggleMusic,
    onReview: null,
    onNotebook: () => showNotebook(),
    onNewExam: () => beginNewExam(),
    onMenu: () => showMenu(),
    t,
  });
}

async function beginNewQuestAfterAd() {
  if (shouldRunCommercialBreak()) {
    await runCommercialBreak();
  }
  lastSessionComplete = false;
  lastRunEndState = null;
  startNewQuest();
}

async function beginNewExam() {
  if (shouldRunCommercialBreak()) {
    await runCommercialBreak();
  }
  lastSessionComplete = false;
  lastRunEndState = null;
  if (examMode === 'full') {
    clearQuestSession();
    showMenu();
  } else startExam(examMode === 'notebook' ? 'full' : examMode);
}

function showNotebook() {
  stopBgm();
  screen = 'notebook';
  const ids = loadMistakeNotebook(platform);
  const questions = bank?.questions.filter((q) => ids.includes(q.id)) || [];
  renderNotebook(root, {
    questions,
    contentLang,
    onPractice: () => {
      if (!questions.length) return;
      questMode = false;
      currentExam = {
        questions,
        mode: 'notebook',
        label: t('notebookTitle'),
      };
      examMode = 'notebook';
      answers = {};
      flags = {};
      secondsLeft = 0;
      screen = 'exam';
      unlockAudio();
      platform.gameplayStart?.();
      renderExamScreen();
    },
    onMenu: () => showMenu(),
    t,
  });
}

function onPortalPause() {
  portalPaused = true;
  pauseAudio();
  platform.gameplayStop?.();
}

function onPortalResume() {
  portalPaused = false;
  if (screen === 'exam') {
    platform.gameplayStart?.();
  }
  resumeAudio();
}

if (btnLocale) {
  btnLocale.addEventListener('click', handleToggleLang);
  updateLocaleButton();
}

platform.onPause?.(onPortalPause);
platform.onResume?.(onPortalResume);
platform.onMute?.(() => pauseAudio());
platform.onUnmute?.(() => {
  if (!portalPaused && screen === 'exam') resumeAudio();
});

boot().catch((err) => {
  console.error(err);
  clearScreen(root, t('bootError'));
});
