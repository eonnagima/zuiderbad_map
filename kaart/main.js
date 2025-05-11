import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector('#canvas'); //fetch the canvas element
const filterMenuDesktop = document.querySelector('#filterMenuDesktop'); //fetch the filter menu element

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const height = canvas.clientHeight; //get the height of the canvas
const width = canvas.clientWidth; //get the width of the canvas
const pins = [];
const activeFilters = []; //make cookie in future

const mapGroup = new THREE.Group(); //create a group to hold the map and pins
scene.add(mapGroup); //add the group to the scene

class locationPin{
    constructor(name, category, position, model, active, scale){
        this.name = name;
        this.category = category;
        this.position = position;
        this.model = model;
        this.active = active; 
        this.scale = scale;
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
    }

    fadeInOut(){
        if(this.active){
            this.pinObject.visible = true;
        } else {
            this.pinObject.visible = false;
        }
    }
}

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true }); //create a WebGL renderer in canvas element
renderer.setSize(width, height, false); //set the size of the renderer to the size of the canvas
camera.aspect = width / height; //update the aspect ratio of the camera so it doesnt get distorted
camera.updateProjectionMatrix();

scene.background = new THREE.Color(0xfef8e8); //set the background color of the scene

const loader = new GLTFLoader();

loader.load('./assets/models/MapZuiderbadV2.glb', function (gtlf){
    //scale model down to fit in the scene
    gtlf.scene.scale.set(0.2, 0.2, 0.2); //scale the model down to fit in the scene
    mapGroup.add(gtlf.scene); //add the loaded model to the scene
}, undefined, function (error) {
    console.error(error);
});

//add Pins to map

const firstAidPin = new locationPin("Eerste Hulp", "firstaid", new THREE.Vector3(0, 0.1, 0), "./assets/models/firstAidPin.glb", true, 0.3);
await firstAidPin.initialize(mapGroup, pins);

const zuiderbadPin = new locationPin("Zuiderbad", "food", new THREE.Vector3(0, 0.1, 0.2), "./assets/models/zuiderbadPin.glb", true, 0.3);
await zuiderbadPin.initialize(mapGroup, pins);


const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);  // Subtle intensity
dirLight.position.set(5, 10, 7);  // Angle it so that it doesn't cause harsh shadows
scene.add(dirLight);

scene.add(new THREE.AmbientLight(0xffffff, 2));

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement); //create controls for user to move the camera
controls.enableDamping = true; 

//filter event listener
filterMenuDesktop.addEventListener('click', function(e){
    e.preventDefault();
    if(e.target.classList.contains('filterButton')){
        let clickedFilter = (e.target.dataset.filter).toLowerCase();
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
                }else{
                    pin.active = true;
                }
                pin.fadeInOut();
            }
        })
    }
})

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