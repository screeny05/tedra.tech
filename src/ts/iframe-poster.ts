const onPosterClick = (e: MouseEvent) => {
  const $el = <HTMLElement>e.currentTarget;
  const { embedUrl } = $el.dataset;

  if (!embedUrl) {
    return;
  }

  e.preventDefault();
  $el.outerHTML = `
        <iframe
            src="${embedUrl}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            allowtransparency="true"
            lazy
        ></iframe>
    `;
};

document.addEventListener("DOMContentLoaded", () => {
  Array.from(document.querySelectorAll(".js-iframe-poster")).forEach((el) => {
    if (!(el instanceof HTMLElement)) {
      return;
    }
    el.addEventListener("click", onPosterClick);
  });
});
