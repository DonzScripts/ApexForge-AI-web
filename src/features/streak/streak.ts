export type StreakState = {
  current: number;
  longest: number;
  lastCheckinISO: string | null;
};

export function computeNextStreak(state: StreakState, nowISO: string): StreakState {
  const now = new Date(nowISO);
  const today = now.toDateString();

  const last = state.lastCheckinISO ? new Date(state.lastCheckinISO).toDateString() : null;
  if (last === today) return state;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const isConsecutive = last === yesterday.toDateString();
  const nextCurrent = isConsecutive ? state.current + 1 : 1;
  const nextLongest = Math.max(state.longest, nextCurrent);

  return {
    current: nextCurrent,
    longest: nextLongest,
    lastCheckinISO: nowISO
  };
}