import { throttle } from 'throttle-debounce';

window.addEventListener('load', () => {
    let isPlaying = false;
    let hasPlayedOnce = false;
    let isTouchStarted = false;
    const $tetragon = document.querySelector('.tetragon') as HTMLDivElement;

    const clamp = (val: number, min: number, max: number) => Math.max(Math.min(val, max), min);

    const toggleTetraDown = (addClass = true) => $tetragon.classList[addClass ? 'add' : 'remove']('tetragon--down');

    window.addEventListener('touchstart', () => isTouchStarted = true);

    window.addEventListener('mousemove', throttle(100, (e: MouseEvent) => {
        if(isTouchStarted){
            isTouchStarted = false;
            return;
        }

        const xFac = e.clientX / window.innerWidth * 2 - 1;
        const yFac = e.clientY / window.innerHeight * 2 - 1;
        $tetragon.style.transform = `rotateY(${xFac * 15}deg) rotateX(${yFac * -15}deg)`;
    }));

    window.addEventListener('deviceorientation', throttle(100, (e: DeviceOrientationEvent) => {
        const xFac = clamp(e.gamma, -45, 45) / 45;
        const yFac = clamp(e.beta, -45, 45) / 45;
        $tetragon.style.transform = `rotateY(${xFac * 15}deg) rotateX(${yFac * -15}deg)`;
    }));

    $tetragon.addEventListener('mousedown', e => {
        if(e.which === 1){
            toggleTetraDown();
        }
    });
    $tetragon.addEventListener('touchstart', () => toggleTetraDown(), { passive: true });

    window.addEventListener('mouseup', () => toggleTetraDown(false));
    window.addEventListener('touchend', () => toggleTetraDown(false), { passive: true });
});
