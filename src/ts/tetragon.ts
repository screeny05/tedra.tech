import { throttle } from "throttle-debounce";

window.addEventListener("load", () => {
  let isTouchStarted = false;
  let lastTouch = 0;
  let isEasterEggRunning = false;
  const $tetragon = document.querySelector(".tetragon") as HTMLDivElement;

  const clamp = (val: number, min: number, max: number) =>
    Math.max(Math.min(val, max), min);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const toggleTetraDown = (addClass = true) => {
    if (!isEasterEggRunning) {
      $tetragon.classList[addClass ? "add" : "remove"]("tetragon--down");
    }
  };

  const runEasterEgg = async () => {
    isEasterEggRunning = true;
    const axis = Math.random() > 0.5 ? "X" : "Y";

    $tetragon.style.transform = "";
    await sleep(150);

    $tetragon.style.transition = "transform 1s ease";
    $tetragon.style.transformOrigin = "50% 50% -17vmin";
    $tetragon.style.transform = `rotate${axis}(-360deg)`;
    await sleep(1000);

    $tetragon.style.transition = "none";
    await sleep(100);

    $tetragon.style.transformOrigin = "";
    $tetragon.style.transform = "";
    await sleep(100);

    $tetragon.style.transition = "";
    isEasterEggRunning = false;
  };

  window.addEventListener("touchstart", () => (isTouchStarted = true));

  window.addEventListener(
    "mousemove",
    throttle(100, (e: MouseEvent) => {
      if (isTouchStarted) {
        isTouchStarted = false;
        return;
      }
      if (isEasterEggRunning) {
        return;
      }

      const xFac = (e.clientX / window.innerWidth) * 2 - 1;
      const yFac = (e.clientY / window.innerHeight) * 2 - 1;
      $tetragon.style.transform = `rotateY(${xFac * 15}deg) rotateX(${
        yFac * -15
      }deg)`;
    })
  );

  window.addEventListener(
    "deviceorientation",
    throttle(100, (e: DeviceOrientationEvent) => {
      if (!e.gamma || !e.beta || isEasterEggRunning) {
        return;
      }

      const xFac = clamp(e.gamma, -45, 45) / 45;
      const yFac = clamp(e.beta, -45, 45) / 45;
      $tetragon.style.transform = `rotateY(${xFac * 15}deg) rotateX(${
        yFac * -15
      }deg)`;
    })
  );

  $tetragon.addEventListener("mousedown", (e) => {
    if (e.button !== 0) {
      return;
    }

    const currentTouch = Date.now();

    if (currentTouch - lastTouch < 1000 && !isEasterEggRunning) {
      runEasterEgg();
    } else {
      toggleTetraDown();
    }

    lastTouch = currentTouch;
  });
  $tetragon.addEventListener("touchstart", () => toggleTetraDown(), {
    passive: true,
  });

  window.addEventListener("mouseup", () => toggleTetraDown(false));
  window.addEventListener("touchend", () => toggleTetraDown(false), {
    passive: true,
  });
});
