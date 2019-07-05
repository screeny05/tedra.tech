import { throttle } from 'throttle-debounce';
let isLocked = true;

const $tetragon = document.querySelector('.tetragon') as HTMLDivElement;

const clamp = (val: number, min: number, max: number) => Math.max(Math.min(val, max), min);

window.addEventListener('mousemove', throttle(100, e => {
    if(isLocked){
        return;
    }
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
    setTimeout(() => isLocked = false, 3000);
});

$tetragon.addEventListener('mousedown', () => {
    $tetragon.classList.add('tetragon--down');
});

window.addEventListener('mouseup', () => {
    $tetragon.classList.remove('tetragon--down');
});
