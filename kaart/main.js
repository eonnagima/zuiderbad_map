import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

const canvas = document.querySelector('#canvas'); //fetch the canvas element
const filterMenuDesktop = document.querySelector('#filterMenuDesktop'); //fetch the filter menu element

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const height = canvas.clientHeight; //get the height of the canvas
const width = canvas.clientWidth; //get the width of the canvas
const raycaster = new THREE.Raycaster(); //create a raycaster to detect mouse events
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true }); //create a WebGL renderer in canvas element
renderer.setSize(width, height, false); //set the size of the renderer to the size of the canvas
camera.aspect = width / height; //update the aspect ratio of the camera so it doesnt get distorted
camera.updateProjectionMatrix();
camera.position.set(0, 0, 10);


const controls = new OrbitControls(camera, renderer.domElement); //create controls for user to move the camera
controls.enableDamping = true; 

const pins = [];
const activeFilters = []; //make cookie in future

const mapGroup = new THREE.Group(); //create a group to hold the map and pins
scene.add(mapGroup); //add the group to the scene

//classes

class locationPin{
    constructor(id, category, position, model, active, scale, info = {}){
        this.id = id;
        this.category = category;
        this.position = position;
        this.model = model;
        this.active = active; 
        this.scale = scale;
        this.info = info; // Initialize info to an empty object
        this.pinObject = null; // Initialize pinObject to null
    }

    async initialize(group, array) {
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
            loader.load(this.model, resolve, undefined, reject);
        })

        this.pinObject = gltf.scene;
        this.pinObject.scale.set(this.scale, this.scale, this.scale);
        this.pinObject.position.set(...this.position); // unpack the position array

        group.add(this.pinObject);
        array.push(this);

        if(this.active){
            this.pinObject.visible = true;
        }else{
            this.pinObject.visible = false;
        }
    }

    fadeInOut(){
        if(this.active){
            this.pinObject.visible = true;
        } else {
            this.pinObject.visible = false;
        }
    }
}

scene.background = new THREE.Color(0xfef8e8); //set the background color of the scene


//map
const loader = new GLTFLoader();
loader.load('./assets/models/MapZuiderbadV3.glb', function (gtlf){
    //scale model down to fit in the scene
    gtlf.scene.scale.set(0.2, 0.2, 0.2); //scale the model down to fit in the scene
    //gtlf.scene.rotation.x = Math.PI / 4;
    mapGroup.add(gtlf.scene); //add the loaded model to the scene
}, undefined, function (error) {
    console.error(error);
});

//userPin

loader.load('./assets/models/userLocation.glb', function(gltf){
    let userPin = gltf.scene;
    userPin.scale.set(0.18, 0.18, 0.18); 
    userPin.position.set(0.08, 0.08, 1);
    scene.add(userPin); 

    focusCameraOnObject(camera, controls, userPin, 2);
}, undefined, function(error){
    console.error(error);
})

//add Pins to map

const firstAidPin = new locationPin(
    0,
    "firstaid",
    new THREE.Vector3(0.4, 0.08, 0.25),
    "./assets/models/firstAidPin.glb",
    false,
    0.3,
    {
        name: "EHBO",
        openingHours: null,
        describtion: "Hier kan je terecht voor eerste hulp bij ongevallen. Bij een ongeval, bel 112.",
        url: null
    }
);
await firstAidPin.initialize(mapGroup, pins);

const zuiderbadPin = new locationPin(
    1, 
    "food", 
    new THREE.Vector3(0.5, 0.08, 0.1),
    "./assets/models/zuiderbadPin.glb", 
    false, 
    0.3,
    {
        name: "Zuiderbad Strandbar",
        openingHours: {'monday': 'Gesloten', 'tuesday': 'Gesloten', 'wednesday': '12:00 – 23:00', 'thursday': '18:00 – 23:00', 'friday': '18:00 – 23:00', 'saturday': '11:00 – 18:30', 'sunday': '11:00 – 18:30'},
        describtion: "Welkom in de strandbar op de meest magische plek op het domein van Sport Vlaanderen Hofstade! Op het menu: frisse dranken, beachfood & holiday vibes. De strandbar beschikt over een ruim terras en serre (bij regenweer). Welkom zonder reserveren.",
        url: null
    }
);
await zuiderbadPin.initialize(mapGroup, pins);


const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);  // Subtle intensity
dirLight.position.set(5, 10, 7);  // Angle it so that it doesn't cause harsh shadows
scene.add(dirLight);

scene.add(new THREE.AmbientLight(0xffffff, 4));
//filter event listener
filterMenuDesktop.addEventListener('click', function(e){
    e.preventDefault();
    let button = e.target.closest('.filterButton');
    //console.log(button);

    if(button && button.classList.contains('filterButton')){
        let clickedFilter = (button.dataset.filter).toLowerCase();
        let filterName = document.querySelector('.filterName');
        //if clickedFilter is not in activeFilters, add it to activeFilters
        if(!activeFilters.includes(clickedFilter)){
            //if clickedFilter is not in activeFilters, add it to activeFilters
            activeFilters.push(clickedFilter);
        } else {
            //if clickedFilter is in activeFilters, remove it from activeFilters
            activeFilters.splice(activeFilters.indexOf(clickedFilter), 1);
        }
        
        pins.forEach((pin) => {
            let pinCategory = pin.category.toLowerCase();
            if(pinCategory === clickedFilter){
                if(pin.active){
                    pin.active = false;
                    filterName.innerHTML = "";
                }else{
                    pin.active = true;
                    filterName.innerHTML = button.dataset.name;

                }
                pin.fadeInOut();
            }
        })
    }
})

canvas.addEventListener('click', function(e){
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    console.log(mouse);

    raycaster.setFromCamera(mouse, camera); //set the raycaster to the mouse position
    const intersects = raycaster.intersectObjects(
        pins.flatMap(pin => {
            const meshes = [];
            pin.pinObject?.traverse((child) => {
                if(child.isMesh){
                    child.userData.pin = pin;
                    meshes.push(child);
                }
            });
            return meshes;
        }),
        true
    );
    
    if(intersects.length > 0){
        let clickedPin = intersects[0].object.userData.pin;
        console.log(clickedPin.info.name);
        displayLocationInfo(clickedPin);
    }

})

function displayLocationInfo(pin){
    let infoContainer = document.querySelector('.infoDesktop');
    infoContainer.classList.remove('hidden');

    document.querySelector('.infoDesktop .locationName').innerHTML = pin.info.name;
    document.querySelector('.infoDesktop .locationDescription').innerHTML = pin.info.describtion;
    document.querySelector('.infoDesktop .shareButton').dataset.locationId = pin.id;

    let moreInfoButton = document.querySelector('.infoDesktop .moreInfoButton');

    if(pin.info.url){
        moreInfoButton.innerHTML = pin.info.url;
        moreInfoButton.classList.remove('hidden');
    }else{
        moreInfoButton.innerHTML = "";
        moreInfoButton.classList.add('hidden');
    }

    let openingHours = document.querySelector('.infoDesktop .openingHours');

    if(pin.info.openingHours){
        openingHours.innerHTML = pin.info.openingHours.wednesday;
        openingHours.classList.remove('hidden');
    }else{
        openingHours.innerHTML = "";
        openingHours.classList.add('hidden');
    }
}

function focusCameraOnObject(camera, controls, object, duration ){
    let offset = new THREE.Vector3(0,0.5, 0.5);
    let newCameraPosition = object.position.clone().add(offset);
    let newTarget = object.position.clone();

    gsap.to(camera.position, {
        x: newCameraPosition.x,
        y: newCameraPosition.y,
        z: newCameraPosition.z,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function(){
            controls.target.copy(object.position);
            controls.update();
        }
    })

    gsap.to(controls.target, {
        x: newTarget.x,
        y: newTarget.y,
        z: newTarget.z,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function () {
            controls.target.copy(object.position);
            controls.update();
        }
    });
}

function animate() {
    controls.update();

    pins.forEach((pin) => {
        if(pin.pinObject){ // check if the pinObject is loaded
            pin.pinObject.lookAt(camera.position); // make the pin look at the camera
        }
    })

    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );