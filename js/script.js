const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1.9;

const sceneIncoming = new THREE.Scene();
const sceneOutgoing = new THREE.Scene();
const sceneRing = new THREE.Scene();

const renderIncoming = new THREE.WebGLRenderer({ antialias : true});
const renderOutgoing = new THREE.WebGLRenderer({ antialias: true });
const renderRing = new THREE.WebGLRenderer();

const clock = new THREE.Clock();


function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

const adjustSize = () => {
    renderIncoming.setSize($("#incoming").width(), $("#incoming").height());
    renderOutgoing.setSize($("#outgoing").width(), $("#outgoing").height());
    renderRing.setSize($("#rings").width(), $("#rings").height());
}

const genWave = ({h , w , r , c , x , y , z} , scene) => {
    const geometry = new THREE.PlaneGeometry(h, w, r, c);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const wave = new THREE.Mesh(geometry, material);
    wave.rotation.set(x, y, z)
    scene.add(wave);
    return wave;
}

const genRing = ({scale} , scene) => {
    const geometry = new THREE.RingGeometry(0.5 , 0.55 , 30 , 1 , 0 , Math.PI * 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(geometry, material);
    ring.scale.set(scale, scale, scale);
    ring.rotation.set(random(0, 10) , random(0, 10), 0 );
    scene.add(ring);
    return ring;
}


let waves = [genWave({ h: 2, w: 2, r: 20, c: 20, x: -1.3, y: 0, z: 0.6 }, sceneIncoming), genWave({ h: 2, w: 2, r: 20, c: 20 , x: -1.3, y: 0, z: -0.4 }, sceneOutgoing)];
let rings = [genRing({ scale: 1.5 }, sceneRing), genRing({ scale: 1.3 }, sceneRing), genRing({ scale: 1.1 }, sceneRing), genRing({ scale: 0.9 }, sceneRing)]

function updateWave() {
    const t = clock.getElapsedTime();
    waves.forEach(wave=>{
        wave.geometry.vertices.map(v => {
            v.z = 0.1 * Math.sin(v.y * 4 + t * 4);
        });
        wave.geometry.verticesNeedUpdate = true;
    })
}

function updateRings() {
    rings.forEach(ring=>{
        ring.rotation.x += 0.005 * random(0 , 5);
        ring.rotation.y += 0.005 * random(5 , 10);
        ring.geometry.verticesNeedUpdate = true;
    })
}

let outAnimId;
let inAnimId;


$("#incoming").append(renderIncoming.domElement);
$("#outgoing").append(renderOutgoing.domElement);
$("#rings").append(renderRing.domElement);

$(window).resize(adjustSize);
$(document).ready(()=>{
    adjustSize();
});



const sounds = {
    "b": new Audio("/sounds/B.mp3"),
    "c": new Audio("/sounds/C.mp3"),
    "d": new Audio("/sounds/D.mp3"),
    "e": new Audio("/sounds/E.mp3"),
    "f": new Audio("/sounds/F.mp3"),
}


var playerTimeout;
var playDelay = 1800;

let order = [];

const sendAlienResponse = () => {
    animateOut();
    var delay = 500;
    order.forEach(key => {
        setTimeout(() => { sounds[key].play() }, delay);
        delay += 300;
    });
    setTimeout(() => {
        cancelAnimationFrame(outAnimId);
    }, 1000+(300*order.length));
    order = [];
}


$(document).keyup((e) => {
    if(sounds[e.key.toLowerCase()]){
        clearTimeout(playerTimeout);
        playerTimeout = setTimeout(sendAlienResponse, playDelay);
    }
});


$(document).keypress((e)=>{
    console.log(order);
    let sound = sounds[e.key.toLowerCase()];
    if(sound){
        clearTimeout(playerTimeout);
        order.unshift(e.key);
        sound.play();
        animateIn();
        setTimeout(() => {
            cancelAnimationFrame(inAnimId);
        }, 1000);
    }
});

updateWave();
renderOutgoing.render(sceneOutgoing, camera);
renderIncoming.render(sceneIncoming, camera);


function animate() {
    requestAnimationFrame(animate);
    updateRings();
    renderRing.render(sceneRing , camera);
}


function animateOut(){
    outAnimId = requestAnimationFrame(animateOut);
    updateWave();
    renderOutgoing.render(sceneOutgoing, camera);
}


function animateIn() {
    inAnimId = requestAnimationFrame(animateIn);
    updateWave();
    renderIncoming.render(sceneIncoming, camera);
}

animate();

if (window.matchMedia("(orientation: portrait)").matches) {
    $("#mainScreen").addClass("hidden");
    $("#hiddenBox").removeClass("hidden");
}else{
    $("#mainScreen").removeClass("hidden");
    $("#hiddenBox").addClass("hidden");
}


$("#b").click((e) => {
    document.dispatchEvent(new KeyboardEvent('keypress', { 'key': "b" }));
    setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { 'key': "b" }));
    }, 500);
});

$("#c").click((e) => {
    document.dispatchEvent(new KeyboardEvent('keypress', { 'key': "c" }));
    setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { 'key': "c" }));
    }, 500);
});

$("#d").click((e) => {
    document.dispatchEvent(new KeyboardEvent('keypress', { 'key': "d" }));
    setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { 'key': "d" }));
    }, 500);
});

$("#e").click((e) => {
    document.dispatchEvent(new KeyboardEvent('keypress', { 'key': "e" }));
    setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { 'key': "e" }));
    }, 500);
});

$("#f").click((e) => {
    document.dispatchEvent(new KeyboardEvent('keypress', { 'key': "f" }));
    setTimeout(() => {
        document.dispatchEvent(new KeyboardEvent('keyup', { 'key': "f" }));
    }, 500);
});