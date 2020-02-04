import { throttle } from 'throttle-debounce';

window.addEventListener('load', () => {
    let isPlaying = false;
    let hasPlayedOnce = false;
    const $tetragon = document.querySelector('.tetragon') as HTMLDivElement;
    const $soundcloudIframe = document.querySelector('.js-soundcloud-iframe') as HTMLIFrameElement|null;

    const clamp = (val: number, min: number, max: number) => Math.max(Math.min(val, max), min);

    const toggleTetraDown = (addClass = true) => $tetragon.classList[addClass ? 'add' : 'remove']('tetragon--down');

    const toggleSoundcloudPlayback = (): void => {
        if(!$soundcloudIframe){
            return;
        }

        const targetOrigin = new URL($soundcloudIframe.src).origin;

        $soundcloudIframe.contentWindow.postMessage(JSON.stringify({
            method: isPlaying ? 'pause' : 'play'
        }), targetOrigin);

        if(!hasPlayedOnce){
            document.getElementById('soundcloud').scrollIntoView({ behavior: 'smooth' });
        }

        isPlaying = !isPlaying;
        hasPlayedOnce = true;
    };

    window.addEventListener('mousemove', throttle(100, (e: MouseEvent) => {
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

    $tetragon.addEventListener('mouseup', () => toggleSoundcloudPlayback());
    $tetragon.addEventListener('touchend', () => toggleSoundcloudPlayback(), { passive: true });

    window.addEventListener('mouseup', () => toggleTetraDown(false));
    window.addEventListener('touchend', () => toggleTetraDown(false), { passive: true });
});
