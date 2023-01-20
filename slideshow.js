const REFRESH_INTERVAL = 60_000;
const SECONDS_TO_CYCLE = 5_000;
let lastRefresh = 0;

const imgElem = document.createElement('img');
let images = [];
let imgIndex = 0;

async function nextImage() {
    if (Date.now() - lastRefresh > REFRESH_INTERVAL) {
        images =
            (await (await fetch('images/imagelist.txt')).text())
                .replaceAll('\r', '')
                .split('\n')
                .filter(group => group.trim().length > 0)
                .map(src => src.startsWith('EXT:') ? src.substring(4) : `images/${src}`);
        lastRefresh = Date.now();
    }

    imgIndex = (imgIndex + 1) % images.length;

    imgElem.src = images[imgIndex];
    setTimeout(nextImage, SECONDS_TO_CYCLE);
}

nextImage().then(() => {
    document.querySelector('#loading').remove();
    document.body.append(imgElem);
    imgElem.addEventListener('click', () => imgElem.requestFullscreen());
});
