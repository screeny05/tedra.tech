// Background should be revealed at least 1.7s into pageload
const REVEAL_TIMEOUT = 1700;
const startTime = performance.timing ? performance.timing.navigationStart : Date.now();

window.addEventListener('load', () => {
    const $canvas = document.getElementById('bg') as HTMLCanvasElement;
    const $img = document.getElementById('smiley') as HTMLImageElement;
    const ctx = $canvas.getContext('2d');
    const entities: Entity[] = [];

    let canvasWidthFull = 0;
    let canvasHeightFull = 0;
    const entitySize = window.innerWidth >= 1024 ? 170 : window.innerWidth >= 768 ? 130 : window.innerWidth >= 425 ? 110 : 90;
    const canvasHeightAdd = 0;

    interface vec2 {
        x: number;
        y: number;
    }

    interface Entity {
        pos: vec2;
        velocity: vec2;
        rotation: number;
    }

    const vec2 = (x: number, y: number): vec2 => ({ x, y });
    const vec2Subtract = (a: vec2, b: vec2) => vec2(a.x - b.x, a.y - b.y);
    const vec2Add = (a: vec2, b: vec2) => vec2(a.x + b.x, a.y + b.y);
    const vec2LengthSqrt = (a: vec2) => a.x * a.x + a.y * a.y;
    const vec2Length = (a: vec2) => Math.sqrt(vec2LengthSqrt(a));

    const setCanvasSize = () => {
        const dpr = window.devicePixelRatio || 1;
        $canvas.width = window.innerWidth * dpr;
        $canvas.height = (window.innerHeight + canvasHeightAdd) * dpr;
        $canvas.style.width = window.innerWidth + 'px';
        $canvas.style.height = (window.innerHeight + canvasHeightAdd) + 'px';
        canvasWidthFull = window.innerWidth + entitySize;
        canvasHeightFull = (window.innerHeight + canvasHeightAdd) + entitySize;
        ctx.scale(dpr, dpr);
    };

    const drawEntity = (obj: Entity) => {
        const { x, y } = obj.pos;
        const translateX = x + entitySize / 2;
        const translateY = y + entitySize / 2;
        ctx.save();

        ctx.translate(translateX, translateY);
        ctx.rotate(obj.rotation * Math.PI / 180);
        ctx.translate(-translateX, -translateY);
        ctx.drawImage($img, obj.pos.x, obj.pos.y, entitySize, entitySize);
        ctx.restore();
    };

    const getEntity = (x?: number, y?: number): Entity => {
        return {
            pos: vec2(Math.random() * canvasWidthFull - entitySize / 2, Math.random() * canvasHeightFull - entitySize / 2),
            velocity: vec2(0, 0),
            rotation: Math.random() * 360,
        };
    };

    const circleHitDetection = (a: Entity, b: Entity): boolean => {
        return vec2LengthSqrt(vec2Subtract(a.pos, b.pos)) <= entitySize * entitySize;
    };

    const hasEntityCollision = (entity: Entity): boolean => {
        return !!entities.find(target => target !== entity && circleHitDetection(entity, target));
    };

    const populateEntities = (): void => {
        const maxIdeal = Math.floor((canvasWidthFull) * (canvasHeightFull) / (entitySize * entitySize));
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

    const setLoadedClass = (): void => {
        const paintDelta = Date.now() - startTime;
        if(paintDelta > REVEAL_TIMEOUT){
            setTimeout(() => {
                $canvas.classList.add('background--is-painted');
            }, paintDelta)
        } else {
            $canvas.classList.add('background--is-painted');
        }
    };

    window.addEventListener('resize', () => {
        setCanvasSize();
        entities.map(drawEntity);
    });

    setCanvasSize();
    populateEntities();
    entities.map(drawEntity);
    setLoadedClass();
});
