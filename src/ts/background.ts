const $canvas = document.getElementById('bg') as HTMLCanvasElement;
const $img = document.getElementById('smiley') as HTMLImageElement;
const ctx = $canvas.getContext('2d');
const entities = [];
let canvasWidthFull = 0;
let canvasHeightFull = 0;

const ENTITY_SIZE = window.innerWidth >= 1024 ? 170 : window.innerWidth >= 768 ? 130 : window.innerWidth >= 425 ? 110 : 90;

interface vec2 {
    x: number;
    y: number;
}

interface Entity {
    pos: vec2;
    rotation: number;
}

const vec2 = (x: number, y: number): vec2 => ({ x, y });
const vec2Subtract = (a: vec2, b: vec2) => vec2(b.x - a.x, b.y - a.y);
const vec2LengthSqrt = (a: vec2) => a.x * a.x + a.y * a.y;

const setCanvasSize = () => {
    const dpr = window.devicePixelRatio || 1;
    $canvas.width = window.innerWidth * dpr;
    $canvas.height = window.innerHeight * dpr;
    $canvas.style.width = window.innerWidth + 'px';
    $canvas.style.height = window.innerHeight + 'px';
    canvasWidthFull = window.innerWidth + ENTITY_SIZE;
    canvasHeightFull = window.innerHeight + ENTITY_SIZE;
    ctx.scale(dpr, dpr);
};

const drawEntity = (obj: Entity) => {
    const { x, y } = obj.pos;
    const translateX = x + ENTITY_SIZE / 2;
    const translateY = y + ENTITY_SIZE / 2;
    ctx.save();

    ctx.translate(translateX, translateY);
    ctx.rotate(obj.rotation * Math.PI / 180);
    ctx.translate(-translateX, -translateY);
    ctx.drawImage($img, obj.pos.x, obj.pos.y, ENTITY_SIZE, ENTITY_SIZE);
    ctx.restore();
};

const getEntity = (): Entity => {
    return {
        pos: vec2(Math.random() * (canvasWidthFull) - ENTITY_SIZE, Math.random() * (canvasHeightFull) - ENTITY_SIZE),
        rotation: Math.random() * 360 - 180
    };
};

const circleHitDetection = (a: Entity, b: Entity): boolean => {
    return vec2LengthSqrt(vec2Subtract(a.pos, b.pos)) <= ENTITY_SIZE * ENTITY_SIZE;
};

const hasEntityCollision = (entity: Entity): boolean => {
    return !!entities.find(target => target !== entity && circleHitDetection(entity, target));
};

const populateEntities = (): void => {
    const maxIdeal = Math.floor((canvasWidthFull) * (canvasHeightFull) / (ENTITY_SIZE * ENTITY_SIZE));
    const tryMax = 100;

    for(let i = 0; i < maxIdeal * tryMax; i++){
        for(let c = 0; c < tryMax; c++){
            const newEntity = getEntity();
            if(!hasEntityCollision(newEntity)){
                entities.push(newEntity);
                break;
            }
        }
    }
};

setCanvasSize();
populateEntities();
entities.map(drawEntity);

window.addEventListener('resize', () => {
    setCanvasSize();
    entities.map(drawEntity);
});
