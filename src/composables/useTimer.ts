import { ref, computed, onUnmounted } from 'vue';

export function useTimer(initialTime: number) {
  const timeLeft = ref(initialTime);
  const isExpired = computed(() => timeLeft.value <= 0);

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  let intervalId: number | null = null;

  const start = () => {
    intervalId = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stop();
      }
    }, 1000);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onUnmounted(stop);

  return {
    timeLeft,
    isExpired,
    start,
    stop,
    formattedTime,
  };
}
