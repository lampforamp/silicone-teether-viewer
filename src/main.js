// Import Libraries
import './main.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'

// Setting a canvas
const canvas = document.querySelector('canvas.webgl')

// Creating a scene
const scene = new THREE.Scene()

// Loading Textures
const textureLoader = new THREE.TextureLoader()

const siliconeColorTexture = textureLoader.load('./textures/siliconeAlbedoTexture.jpg')
const siliconeColorTexture_2 = textureLoader.load('./textures/siliconeAlbedoTexture2.jpg')
const siliconeColorTexture_3 = textureLoader.load('./textures/siliconeAlbedoTexture3.jpg')
const woodColorTexture = textureLoader.load('./textures/woodAlbedoTexture.jpg')
const woodRoughnessTexture = textureLoader.load('./textures/woodRoughnessTexture.jpg')
const groundShadowTexture = textureLoader.load('./textures/groundShadow.png')

siliconeColorTexture.colorSpace = THREE.SRGBColorSpace
siliconeColorTexture_2.colorSpace = THREE.SRGBColorSpace
siliconeColorTexture_3.colorSpace = THREE.SRGBColorSpace
siliconeColorTexture.flipY = false
siliconeColorTexture_2.flipY = false
siliconeColorTexture_3.flipY = false
woodColorTexture.colorSpace = THREE.SRGBColorSpace
woodColorTexture.flipY = false
woodRoughnessTexture.flipY = false

// Materials

// Wood Material
const woodMaterial = new THREE.MeshStandardMaterial()
woodMaterial.map = woodColorTexture
woodMaterial.roughnessMap = woodRoughnessTexture
woodMaterial.envMapIntensity = 0.7

// Silicone Material_1
const siliconeMaterial = new THREE.MeshPhysicalMaterial()
siliconeMaterial.roughness = 0.8
siliconeMaterial.map = siliconeColorTexture
siliconeMaterial.sheen = 0.5
siliconeMaterial.sheenRoughness = 1
siliconeMaterial.sheenColor.set(1,1,1)
siliconeMaterial.envMapIntensity = 0.7

// Silicone Material_2
const siliconeMaterial_2 = new THREE.MeshPhysicalMaterial()
siliconeMaterial_2.roughness = 0.8
siliconeMaterial_2.map = siliconeColorTexture_2
siliconeMaterial_2.sheen = 0.5
siliconeMaterial_2.sheenRoughness = 1
siliconeMaterial_2.sheenColor.set(1,1,1)
siliconeMaterial_2.envMapIntensity = 0.7

// Silicone Material_3
const siliconeMaterial_3 = new THREE.MeshPhysicalMaterial()
siliconeMaterial_3.roughness = 0.8
siliconeMaterial_3.map = siliconeColorTexture_3
siliconeMaterial_3.sheen = 0.5
siliconeMaterial_3.sheenRoughness = 1
siliconeMaterial_3.sheenColor.set(1,1,1)
siliconeMaterial_3.envMapIntensity = 0.7

// Ground Material
const groundMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
groundMaterial.transparent = true
groundMaterial.alphaMap = groundShadowTexture

let wood
let silicone
let ground

// Import Models
const gltfLoader = new GLTFLoader()

gltfLoader.load(
    '/models/woodTeether.glb',
    (gltf) =>
    {   
        // Define Children
         wood = gltf.scene.getObjectByName('Wood');
         silicone = gltf.scene.getObjectByName('Silicone');
         ground = gltf.scene.getObjectByName('Ground')
        scene.add(gltf.scene)
        
        // Assign Materials
        wood.material = woodMaterial
        silicone.material = siliconeMaterial
        ground.material = groundMaterial
    }
)



//
// Toggle UI
//
const toggleUiButton = document.querySelector('#toggleUI')
const panel = document.querySelector('.panel')
toggleUiButton.addEventListener('click', (e) => {
    console.log(toggleUiButton)
    panel.classList.toggle('show')
})



//
// Panel
//
const changeMaterialButtons = document.querySelectorAll('.panel button')
const body = document.querySelector('body')
console.log(changeMaterialButtons)
changeMaterialButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        console.log([e.target.dataset.material])
        const material = e.target.dataset.material
        if(material == 'siliconeMaterial') {
            silicone.material = siliconeMaterial
            body.style.backgroundColor = 'rgb(166, 225, 207)'
        }
        if(material == 'siliconeMaterial_2') {
            silicone.material = siliconeMaterial_3
            body.style.backgroundColor = 'rgb(166, 243, 127)'
        }
        if(material == 'siliconeMaterial_3') {
            silicone.material = siliconeMaterial_2
            body.style.backgroundColor = 'rgb(132, 201, 176)'
        }
        
    })
}) 

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2.5)
scene.add(ambientLight)

const directionalLightBack = new THREE.DirectionalLight( 0xffffff, 4 );
directionalLightBack.position.set(-5,5,-5)
scene.add( directionalLightBack )

const directionalLightFront = new THREE.DirectionalLight( 0xffffff, 2 );
directionalLightFront.position.set(5,3,5)
scene.add( directionalLightFront )

// // Environment map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./hdri/hdri_1.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    // scene.background = environmentMap
    scene.environment = environmentMap
})


// Viewport settings
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Viewport resizing
window.addEventListener('resize', () => 
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height)
camera.position.set(1.5, 2 ,5 )

scene.add(camera)

// Camera Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI/2.2
controls.minDistance = 3
controls.maxDistance = 10
controls.enablePan = false

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animation
const tick = () =>
{   
    // Update controls
    controls.update()

    // Update Camera Target
    camera.lookAt(new THREE.Vector3(0,1,0))

    // Renderer
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()