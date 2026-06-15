// Web Audio API を用いた8bit風簡易ループBGMシーケンサー

let audioCtx = null;
let bgmVolumeNode = null;
let currentBgmId = null;
let schedulerTimer = null;
let nextNoteTime = 0.0;
let stepIndex = 0;

// 音量設定 (0.0 から 1.0)
let userVolume = 0.5;

// 音名から周波数への変換マップ
const noteFreqs = {
  // 4オクターブ目
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  // 5オクターブ目
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  // 6オクターブ目
  'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51,
  // 3オクターブ目 (ベース用)
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  // 2オクターブ目 (ベース用)
  'A2': 110.00, 'G2': 98.00, 'F2': 87.31, 'E2': 82.41
};

// 16ステップのBGM楽譜データ (1ステップあたり16分音符)
// Ch1: メロディ, Ch2: ベース
// 0 は休符を表す
const bgmData = {
  // タイトル画面: 爽やかで明るい「旅立ちの予感」
  title: {
    tempo: 120,
    osc1: 'square',
    osc2: 'triangle',
    ch1: [
      'C5', 'E5', 'G5', 'C6', 'B5', 'G5', 'E5', 'D5',
      'C5', 'E5', 'G5', 'C6', 'D6', 'B5', 'C6', 0
    ],
    ch2: [
      'C3', 0, 'E3', 0, 'G3', 0, 'E3', 0,
      'F3', 0, 'G3', 0, 'C3', 0, 'G3', 0
    ]
  },
  // フィールド: 穏やかで、少し哀愁漂うが前向きな「リュミナの小径」
  field: {
    tempo: 110,
    osc1: 'square',
    osc2: 'triangle',
    ch1: [
      'E5', 'G5', 'A5', 'B5', 'A5', 'G5', 'E5', 0,
      'D5', 'F5', 'G5', 'A5', 'G5', 'F5', 'D5', 0
    ],
    ch2: [
      'A3', 0, 'E3', 0, 'A3', 0, 'E3', 0,
      'G3', 0, 'D3', 0, 'G3', 0, 'D3', 0
    ]
  },
  // 町: 心温まる落ち着いた「始まりの灯」
  town: {
    tempo: 100,
    osc1: 'triangle', // 柔らかい三角波
    osc2: 'triangle',
    ch1: [
      'C5', 0, 'E5', 0, 'D5', 0, 'F5', 0,
      'E5', 'G5', 'F5', 'D5', 'C5', 0, 0, 0
    ],
    ch2: [
      'C3', 'E3', 'G3', 'C4', 'G3', 'B3', 'D4', 'G4',
      'C3', 'E3', 'G3', 'B3', 'C3', 0, 0, 0
    ]
  },
  // 城: 格式高く荘厳な「白鐘の王城」
  castle: {
    tempo: 90,
    osc1: 'square',
    osc2: 'sine',
    ch1: [
      'G5', 0, 'C6', 0, 'B5', 0, 'C6', 0,
      'D6', 0, 'G5', 0, 'E6', 0, 'C6', 0
    ],
    ch2: [
      'C3', 0, 'C3', 0, 'G3', 0, 'G3', 0,
      'B3', 0, 'B3', 0, 'C3', 0, 'C3', 0
    ]
  },
  // ダンジョン: 不気味で緊張感のある「月苔の洞」
  dungeon: {
    tempo: 95,
    osc1: 'sawtooth', // エッジの効いたノコギリ波
    osc2: 'sawtooth',
    ch1: [
      'C5', 'Eb5', 'F#5', 'A5', 'C5', 'Eb5', 'F#5', 'A5',
      'G5', 'F#5', 'F5', 'E5', 'Eb5', 'D5', 'C#5', 'C5'
    ],
    ch2: [
      'C3', 0, 'Eb3', 0, 'F#3', 0, 'A3', 0,
      'G3', 0, 'F#3', 0, 'F3', 0, 'E3', 0
    ]
  },
  // 通常戦闘: 緊迫感のある「夜霧の対峙」
  battle: {
    tempo: 135,
    osc1: 'square',
    osc2: 'sawtooth',
    ch1: [
      'A5', 'A5', 'C6', 'A5', 'D6', 'A5', 'E6', 0,
      'D6', 'D6', 'C6', 'A5', 'G5', 'G5', 'A5', 0
    ],
    ch2: [
      'A3', 'A3', 'A3', 'A3', 'G3', 'G3', 'G3', 'G3',
      'F3', 'F3', 'F3', 'F3', 'E3', 'E3', 'E3', 'E3'
    ]
  },
  // ボス戦: 激しく絶望的な「黒門の闘い」
  boss: {
    tempo: 140,
    osc1: 'sawtooth',
    osc2: 'sawtooth',
    ch1: [
      'D5', 'D#5', 'D5', 'C5', 'D5', 'D#5', 'F5', 'D#5',
      'G5', 'G#5', 'G5', 'F5', 'G5', 'G#5', 'A#5', 0
    ],
    ch2: [
      'D3', 'D#3', 'D3', 'C3', 'D3', 'D#3', 'F3', 'D#3',
      'G3', 'G#3', 'G3', 'F3', 'G3', 'G#3', 'A#3', 'C3'
    ]
  },
  // エンディング: 夜明けを迎えた美しき「暁の鐘」
  ending: {
    tempo: 105,
    osc1: 'triangle',
    osc2: 'sine',
    ch1: [
      'C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C6', 0,
      'B5', 'G5', 'E5', 'C5', 'G4', 'E4', 'C4', 0
    ],
    ch2: [
      'C3', 0, 'E3', 0, 'G3', 0, 'C3', 0,
      'G3', 0, 'E3', 0, 'C3', 0, 0, 0
    ]
  }
};

// AudioContextを取得または初期化する
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    bgmVolumeNode = audioCtx.createGain();
    // BGMのデフォルト音量を設定 (userVolumeに応じる)
    setBgmVolume(userVolume);
    bgmVolumeNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// BGMの音量を調整する (value: 0.0 - 1.0)
export function setBgmVolume(value) {
  userVolume = Math.max(0.0, Math.min(1.0, value));
  if (bgmVolumeNode) {
    const ctx = getAudioContext();
    // BGMは小さめに鳴らすため、最大音量をマスター制限 (0.04) とする
    const actualVolume = userVolume * 0.04;
    bgmVolumeNode.gain.setValueAtTime(actualVolume, ctx.currentTime);
  }
}

// 音符を生成・再生する
function playTone(freq, startTime, duration, type, volume) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gain.gain.setValueAtTime(volume, startTime);
  // 少し音切れを作ることで8bitのスタッカート感を演出
  gain.gain.exponentialRampToValueAtTime(0.005, startTime + duration - 0.01);
  
  osc.connect(gain);
  gain.connect(bgmVolumeNode);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// シーケンサースケジューラー
function scheduler() {
  const ctx = getAudioContext();
  const bgm = bgmData[currentBgmId];
  if (!bgm) return;

  const secondsPerBeat = 60.0 / bgm.tempo;
  const sixteenthNoteDuration = secondsPerBeat / 4; // 16分音符の長さ

  // 未来の 0.1秒先までスケジュール
  while (nextNoteTime < ctx.currentTime + 0.1) {
    const note1 = bgm.ch1[stepIndex];
    const note2 = bgm.ch2[stepIndex];

    // チャンネル1 (メロディ) の再生
    if (note1 !== 0 && noteFreqs[note1]) {
      playTone(noteFreqs[note1], nextNoteTime, sixteenthNoteDuration, bgm.osc1, 0.25);
    }

    // チャンネル2 (ベース) の再生
    if (note2 !== 0 && noteFreqs[note2]) {
      // ベースは少し音量を下げて再生
      playTone(noteFreqs[note2], nextNoteTime, sixteenthNoteDuration, bgm.osc2, 0.18);
    }

    // 次のステップへ
    nextNoteTime += sixteenthNoteDuration;
    stepIndex = (stepIndex + 1) % 16; // 16ステップのループ
  }
}

// BGMの再生を開始する
export function playBgm(id) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (currentBgmId === id) return; // 既に再生中なら何もしない
  
  stopBgm(); // 現在のBGMを停止

  if (!bgmData[id]) {
    console.warn(`BGM ID "${id}" is not defined.`);
    return;
  }

  currentBgmId = id;
  stepIndex = 0;
  nextNoteTime = ctx.currentTime + 0.05;

  // 25ms周期でスケジューラーを呼び出し
  schedulerTimer = setInterval(scheduler, 25);
}

// BGMを停止する
export function stopBgm() {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
  currentBgmId = null;
}
