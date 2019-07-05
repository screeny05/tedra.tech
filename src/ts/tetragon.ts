import { throttle } from 'throttle-debounce';
let isLocked = true;

const $tetragon = document.querySelector('.tetragon') as HTMLDivElement;

window.addEventListener('mousemove', throttle(100, e => {
    if(isLocked){
        return;
    }
    const xFac = e.clientX / window.innerWidth * 2 - 1;
    const yFac = e.clientY / window.innerHeight * 2 - 1;
    $tetragon.style.transform = `rotateY(${xFac * 15}deg) rotateX(${yFac * -15}deg)`;
}));

window.addEventListener('load', () => {
    setTimeout(() => isLocked = false, 3000);
});
