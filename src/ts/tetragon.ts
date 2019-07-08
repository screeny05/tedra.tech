import { throttle } from 'throttle-debounce';

const $tetragon = document.querySelector('.tetragon') as HTMLDivElement;

const clamp = (val: number, min: number, max: number) => Math.max(Math.min(val, max), min);

window.addEventListener('mousemove', throttle(100, e => {
    const xFac = e.clientX / window.innerWidth * 2 - 1;
    const yFac = e.clientY / window.innerHeight * 2 - 1;
    $tetragon.style.transform = `rotateY(${xFac * 15}deg) rotateX(${yFac * -15}deg)`;
}));

window.addEventListener('deviceorientation', throttle(100, e => {
    const xFac = clamp(e.gamma, -45, 45) / 45;
    const yFac = clamp(e.beta, -45, 45) / 45;
    console.log(xFac, yFac)
    $tetragon.style.transform = `rotateY(${xFac * 15}deg) rotateX(${yFac * -15}deg)`;
}));

window.addEventListener('load', () => {
    setTimeout(() => {
        document.documentElement.classList.remove('is--tetragon-locked');
    }, 3000);
});

$tetragon.addEventListener('mousedown', e => {
    if(e.which === 1){
        $tetragon.classList.add('tetragon--down');
    }
});

$tetragon.addEventListener('touchstart', () => {
    $tetragon.classList.add('tetragon--down');
}, { passive: true });

window.addEventListener('mouseup', () => {
    $tetragon.classList.remove('tetragon--down');
});

window.addEventListener('touchend', () => {
    $tetragon.classList.remove('tetragon--down');
}, { passive: true });
