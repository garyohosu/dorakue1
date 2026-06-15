// Web Audio API を用いた8bit風効果音システム

let audioCtx = null;
let sfxVolumeNode = null;

// AudioContextを取得または初期化する
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sfxVolumeNode = audioCtx.createGain();
    sfxVolumeNode.gain.setValueAtTime(0.08, audioCtx.currentTime); // 効果音全体の音量を控えめ(8%)に設定
    sfxVolumeNode.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ユーザーのアクション（キー押下や画面クリック）時に呼び出してオーディオを有効化する
export function initAudio() {
  try {
    getAudioContext();
  } catch (e) {
    console.warn("Failed to initialize AudioContext:", e);
  }
}

// ノイズバッファの生成ヘルパー
function createNoiseBuffer(ctx, duration) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// 1. カーソル移動音
export function playCursor() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square'; // 8bit風矩形波
  osc.frequency.setValueAtTime(600, now);
  
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
  
  osc.connect(gain);
  gain.connect(sfxVolumeNode);
  
  osc.start(now);
  osc.stop(now + 0.05);
}

// 2. 決定音
export function playConfirm() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square';
  // ピピッという2連続の音
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.setValueAtTime(900, now + 0.04);
  
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
  
  osc.connect(gain);
  gain.connect(sfxVolumeNode);
  
  osc.start(now);
  osc.stop(now + 0.12);
}

// 3. キャンセル音
export function playCancel() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square';
  // ポプッという周波数が下がる音
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
  
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
  
  osc.connect(gain);
  gain.connect(sfxVolumeNode);
  
  osc.start(now);
  osc.stop(now + 0.08);
}

// 4. テキスト送り音
export function playText() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square';
  // ピッという極めて短い音
  osc.frequency.setValueAtTime(280, now);
  
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
  
  osc.connect(gain);
  gain.connect(sfxVolumeNode);
  
  osc.start(now);
  osc.stop(now + 0.03);
}

// 5. 攻撃音
export function playAttack() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // バンドパスフィルタを通したホワイトノイズで「ザシュッ」を表現
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.12);
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, now);
  filter.frequency.exponentialRampToValueAtTime(400, now + 0.12);
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(sfxVolumeNode);
  
  noise.start(now);
  noise.stop(now + 0.12);
}

// 6. ダメージ音
export function playDamage() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // バキッというノイズ＋ノコギリ波の組み合わせ
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.2);
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(500, now);
  
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.linearRampToValueAtTime(50, now + 0.2);
  
  const gainNoise = ctx.createGain();
  gainNoise.gain.setValueAtTime(0.3, now);
  gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  
  const gainOsc = ctx.createGain();
  gainOsc.gain.setValueAtTime(0.25, now);
  gainOsc.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  
  noise.connect(filter);
  filter.connect(gainNoise);
  gainNoise.connect(sfxVolumeNode);
  
  osc.connect(gainOsc);
  gainOsc.connect(sfxVolumeNode);
  
  noise.start(now);
  noise.stop(now + 0.2);
  osc.start(now);
  osc.stop(now + 0.2);
}

// 7. 回復術音
export function playHeal() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // アルペジオ（ピロリロリロ〜ン）
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
  const noteDuration = 0.06;
  
  notes.forEach((freq, idx) => {
    const startTime = now + idx * noteDuration;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle'; // 優しい三角波
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);
    
    osc.connect(gain);
    gain.connect(sfxVolumeNode);
    
    osc.start(startTime);
    osc.stop(startTime + 0.12);
  });
}

// 8. 道具使用音
export function playItem() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // シャキーンという金属質なキラキラ音（サイン波＋矩形波の速い上昇）
  const notes = [440, 554, 659, 880, 1109];
  const noteDuration = 0.04;
  
  notes.forEach((freq, idx) => {
    const startTime = now + idx * noteDuration;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = idx % 2 === 0 ? 'sine' : 'square';
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
    
    osc.connect(gain);
    gain.connect(sfxVolumeNode);
    
    osc.start(startTime);
    osc.stop(startTime + 0.08);
  });
}

// 9. レベルアップ音
export function playLevelUp() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // テレレ・テッテ・テ〜！ (C5-D5-E5-G5-E5-C6)
  const melody = [
    { freq: 523.25, start: 0, dur: 0.08 }, // C5
    { freq: 587.33, start: 0.08, dur: 0.08 }, // D5
    { freq: 659.25, start: 0.16, dur: 0.08 }, // E5
    { freq: 783.99, start: 0.24, dur: 0.12 }, // G5
    { freq: 659.25, start: 0.36, dur: 0.12 }, // E5
    { freq: 1046.50, start: 0.48, dur: 0.4 } // C6
  ];
  
  melody.forEach((note) => {
    const startTime = now + note.start;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(note.freq, startTime);
    
    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.dur);
    
    osc.connect(gain);
    gain.connect(sfxVolumeNode);
    
    osc.start(startTime);
    osc.stop(startTime + note.dur);
  });
}

// 10. 勝利ファンファーレ音
export function playVictory() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // トランペット風矩形波メロディ
  const melody = [
    { freq: 523.25, start: 0, dur: 0.09 }, // C5
    { freq: 523.25, start: 0.1, dur: 0.09 }, // C5
    { freq: 523.25, start: 0.2, dur: 0.09 }, // C5
    { freq: 523.25, start: 0.3, dur: 0.25 }, // C5
    { freq: 415.30, start: 0.58, dur: 0.18 }, // Ab4
    { freq: 466.16, start: 0.78, dur: 0.18 }, // Bb4
    { freq: 523.25, start: 0.98, dur: 0.5 }   // C5
  ];
  
  melody.forEach((note) => {
    const startTime = now + note.start;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(note.freq, startTime);
    
    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.dur);
    
    osc.connect(gain);
    gain.connect(sfxVolumeNode);
    
    osc.start(startTime);
    osc.stop(startTime + note.dur);
  });
}

// 11. 扉開閉音
export function playDoor() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // きしみ音（高音三角波）
  const osc = ctx.createOscillator();
  const gainOsc = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(700, now);
  osc.frequency.exponentialRampToValueAtTime(1000, now + 0.12);
  
  gainOsc.gain.setValueAtTime(0.08, now);
  gainOsc.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
  
  osc.connect(gainOsc);
  gainOsc.connect(sfxVolumeNode);
  
  // ガチャリ音（ローパスノイズ）
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.2);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(250, now + 0.08);
  
  const gainNoise = ctx.createGain();
  gainNoise.gain.setValueAtTime(0, now);
  gainNoise.gain.setValueAtTime(0.25, now + 0.08);
  gainNoise.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
  
  noise.connect(filter);
  filter.connect(gainNoise);
  gainNoise.connect(sfxVolumeNode);
  
  osc.start(now);
  osc.stop(now + 0.12);
  noise.start(now + 0.08);
  noise.stop(now + 0.25);
}

// 12. 宝箱開封音
export function playChest() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  
  // パカッ（短い矩形波の上昇）
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(250, now);
  osc.frequency.setValueAtTime(450, now + 0.04);
  
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
  
  osc.connect(gain);
  gain.connect(sfxVolumeNode);
  
  osc.start(now);
  osc.stop(now + 0.12);
}
