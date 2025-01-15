import { useIntervalFn, useTimeoutFn } from '@vueuse/core';
import { ref } from 'vue';

export const useVerifycode = () => {
    const isCountingDown = ref(false);
    const countdown = ref(60);

    const { pause: pauseCountdown } = useIntervalFn(
        () => {
            if (countdown.value <= 1) {
                pauseCountdown();
                isCountingDown.value = false;
                countdown.value = 60;
            } else {
                countdown.value--;
            }
        },
        1000,
        { immediate: false }
    );

    const { start: startCountdown } = useTimeoutFn(() => {
        isCountingDown.value = false;
        countdown.value = 60;
    }, 60000);

    return {
        isCountingDown,
        countdown,
        pauseCountdown,
        startCountdown
    };
};
