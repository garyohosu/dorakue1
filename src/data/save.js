import { createInitialPlayer } from './player.js';

const SAVE_KEY = 'dorakue1.save.v1';

export function loadSavedPlayer() {
  try {
    const rawSave = localStorage.getItem(SAVE_KEY);
    if (!rawSave) return null;

    const parsed = JSON.parse(rawSave);
    if (!parsed || typeof parsed !== 'object' || !parsed.player) return null;

    const initialPlayer = createInitialPlayer();
    const savedPlayer = parsed.player;

    return {
      ...initialPlayer,
      ...savedPlayer,
      flags: {
        ...initialPlayer.flags,
        ...(savedPlayer.flags ?? {})
      }
    };
  } catch (error) {
    console.warn('Save load failed:', error);
    return null;
  }
}

export function savePlayer(player) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: 1,
      savedAt: new Date().toISOString(),
      player
    }));
    return true;
  } catch (error) {
    console.warn('Save write failed:', error);
    return false;
  }
}

export function hasSavedPlayer() {
  return loadSavedPlayer() !== null;
}
