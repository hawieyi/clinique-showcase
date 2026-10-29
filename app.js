import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const host=document.querySelector('#viewport');
const loading=document.querySelector('#loading');
try {
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(32,1,.1,100);
camera.position.set(0,2.7,11.3);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;
host.appendChild(renderer.domElement);
const pmrem=new THREE.PMREMGenerator(renderer);
const room=new RoomEnvironment();
const env=pmrem.fromScene(room,.06);
scene.environment=env.texture;
room.dispose();pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xfffdf1,0xa1a58a,2));
const light=new THREE.DirectionalLight(0xfffbeb,4.5);
light.position.set(-3,7,5);light.castShadow=true;light.shadow.mapSize.set(2048,2048);
Object.assign(light.shadow.camera,{left:-5,right:5,top:7,bottom:-5});
light.shadow.normalBias=.025;light.shadow.bias=-.0002;light.shadow.radius=5;scene.add(light);
const rim=new THREE.DirectionalLight(0xffffff,3);rim.position.set(3,4,-2);scene.add(rim);
const product=new THREE.Group();scene.add(product);
function rounded(w,h,d,r,material){
 const x=-w/2,y=-h/2,s=new THREE.Shape();
 s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
 s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
 s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
 s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
 const g=new THREE.ExtrudeGeometry(s,{depth:d-.12,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.06,bevelThickness:.06,curveSegments:20});
 g.translate(0,0,-(d-.12)/2);g.computeVertexNormals();
 const mesh=new THREE.Mesh(g,material);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
}
const yellow=new THREE.MeshPhysicalMaterial({color:0xecc84f,roughness:.27,metalness:0,clearcoat:.65,clearcoatRoughness:.2});
const body=rounded(2.08,3.25,.94,.22,yellow);body.position.y=1.68;product.add(body);
const silver=new THREE.MeshStandardMaterial({color:0xe6e7e3,metalness:1,roughness:.15});
const glass=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:.05,transmission:1,thickness:.07,ior:1.47,transparent:true,opacity:.45,depthWrite:false});
function cylinder(radius,height,y,material,parent=product){const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,96),material);m.position.y=y;m.castShadow=true;parent.add(m);return m;}
cylinder(.6,.86,3.7,silver);
cylinder(.52,.68,4.43,silver);
const pumpTop=cylinder(.52,.035,4.78,silver);
const nozzle=new THREE.Mesh(new THREE.CylinderGeometry(.105,.105,.07,48),silver);nozzle.rotation.x=Math.PI/2;nozzle.position.set(0,4.52,.51);product.add(nozzle);
const hole=new THREE.Mesh(new THREE.CircleGeometry(.055,32),new THREE.MeshBasicMaterial({color:0x202420}));hole.position.set(0,4.52,.551);product.add(hole);
const cap=new THREE.Group();product.add(cap);cap.position.y=4.37;
const shell=new THREE.Mesh(new THREE.CylinderGeometry(.655,.655,.91,96,1,true),glass);cap.add(shell);
const roof=new THREE.Mesh(new THREE.CylinderGeometry(.655,.655,.035,96),glass);roof.position.y=.455;cap.add(roof);
for(const y of [-.45,.45]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.647,.018,8,96),new THREE.MeshPhysicalMaterial({color:0xe9ece6,roughness:.1,metalness:.15,transparent:true,opacity:.6}));ring.rotation.x=Math.PI/2;ring.position.y=y;cap.add(ring);}
// A transparent vector-style label, recreated from the reference typography.
const label=document.createElement('canvas');label.width=1024;label.height=1500;
const ctx=label.getContext('2d');ctx.fillStyle='#11160e';ctx.textAlign='center';
ctx.beginPath();ctx.roundRect(325,70,374,650,128);ctx.fill();
ctx.strokeStyle='#f5df8b';ctx.lineWidth=25;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(510,120);ctx.lineTo(510,665);ctx.moveTo(510,390);ctx.lineTo(696,390);ctx.stroke();
ctx.fillRect(0,762,1024,5);ctx.fillRect(0,995,1024,5);
ctx.font='155px Georgia';ctx.fillText('CLINIQUE',512,940,1020);
ctx.font='68px Arial';ctx.fillText('dramatically different',512,1100,1020);ctx.fillText('moisturizing gel',512,1183,1000);
ctx.font='bold 47px Arial';ctx.fillText('OIL-FREE / NON-GRAS',512,1255,1000);
ctx.font='65px Arial';ctx.fillText('gel hydratant',512,1340);ctx.fillText('tellement différent',512,1420,1020);
const texture=new THREE.CanvasTexture(label);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const sticker=new THREE.Mesh(new THREE.PlaneGeometry(1.48,2.17),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));sticker.position.set(0,1.65,.532);product.add(sticker);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.15}));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;floor.receiveShadow=true;scene.add(floor);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,2.42,0);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=7.6;controls.maxDistance=15;controls.minPolarAngle=.3;controls.maxPolarAngle=Math.PI*.64;controls.autoRotate=!matchMedia('(prefers-reduced-motion: reduce)').matches;controls.autoRotateSpeed=.5;controls.update();
const rotate=document.querySelector('#rotate');function updateRotate(){rotate.setAttribute('aria-pressed',String(controls.autoRotate));rotate.innerHTML=controls.autoRotate?'Ⅱ <span>暂停旋转</span>':'▷ <span>自动旋转</span>';}
updateRotate();rotate.onclick=()=>{controls.autoRotate=!controls.autoRotate;updateRotate();};
let reset=false,capOpen=false;
document.querySelector('#front').onclick=()=>{controls.autoRotate=false;updateRotate();reset=true;};
controls.addEventListener('start',()=>{reset=false;});
document.querySelector('#cap').onclick=()=>{capOpen=!capOpen;const b=document.querySelector('#cap');b.setAttribute('aria-pressed',String(capOpen));b.innerHTML=capOpen?'↧ <span>合上瓶盖</span>':'↥ <span>打开瓶盖</span>';};
const observer=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();});observer.observe(host);
loading.hidden=true;
let last=performance.now();renderer.setAnimationLoop(now=>{const dt=Math.min((now-last)/1000,.05);last=now;cap.position.y=THREE.MathUtils.damp(cap.position.y,capOpen?5.6:4.37,5,dt);if(reset){camera.position.lerp(new THREE.Vector3(0,2.7,11.3),1-Math.exp(-6*dt));controls.target.lerp(new THREE.Vector3(0,2.42,0),1-Math.exp(-6*dt));if(camera.position.distanceTo(new THREE.Vector3(0,2.7,11.3))<.008)reset=false;}controls.update(dt);renderer.render(scene,camera);});
window.addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);observer.disconnect();controls.dispose();env.dispose();texture.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of [].concat(o.material))m.dispose();}});renderer.dispose();},{once:true});
window.__showcaseReady=true;
} catch(e){console.error(e);loading.textContent='3D 暂时无法加载，请点击“原图对照”查看产品。';loading.style.width='80%';}
const photo=document.querySelector('#photo');document.querySelector('#reference').onclick=()=>photo.showModal();document.querySelector('#close').onclick=()=>photo.close();photo.addEventListener('click',e=>{if(e.target===photo)photo.close();});
