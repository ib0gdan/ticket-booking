import { ref, computed, onUnmounted, onMounted } from 'vue';

export function useTimer(startDate: Date | string | undefined, expireAfterSeconds: number) {
  const parseStartDate = (date?: Date | string) =>
    typeof date === 'string' ? new Date(date) : date;

  const calculateTimeLeft = () => {
    const start = parseStartDate(startDate) ?? new Date();
    const now = new Date();
    const elapsedMs = now.getTime() - start.getTime();
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const remaining = expireAfterSeconds - elapsedSeconds;
    return remaining > 0 ? remaining : 0;
  };

  const timeLeft = ref(calculateTimeLeft());

  const isExpired = computed(() => timeLeft.value <= 0);

  const formattedTimeLeft = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  let intervalId: number | null = null;

  const tick = () => {
    timeLeft.value = calculateTimeLeft();
    if (timeLeft.value <= 0) {
      stop();
    }
  };

  const start = () => {
    if (intervalId !== null) {
      return;
    }
    tick();
    if (timeLeft.value <= 0) {
      return;
    }
    intervalId = window.setInterval(tick, 1000);
  };

  const stop = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onMounted(start);

  onUnmounted(stop);

  return {
    isExpired,
    formattedTimeLeft,
  };
}
