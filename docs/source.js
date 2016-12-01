var container
var camera, scene, renderer
var uniforms
var startTime

init()
animate()
fadeIn()

function init() {
  container = document.getElementById('container')
  startTime = Date.now()

  camera = new THREE.Camera()
  camera.position.z = 1

  scene = new THREE.Scene()

  var geometry = new THREE.PlaneBufferGeometry(2, 2)
  uniforms = {
    iGlobalTime: { type: "f", value: 1.0 },
    iResolution: { type: "v1", value: new THREE.Vector2(), }
  }


  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent
  })

  var mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  renderer = new THREE.WebGLRenderer()
  container.appendChild(renderer.domElement)
  window.addEventListener('resize', onWindowResize, false)
  onWindowResize()
}

function onWindowResize(_event) {
  wrWidth = window.innerWidth
  wrHeight = window.innerHeight
  uniforms.iResolution.value.x = window.innerWidth
  uniforms.iResolution.value.y = window.innerHeight
  renderer.setSize(wrWidth, wrHeight)
}

var diffTime;
var cycle_at = 120;
// Calculate this since multiplication is much faster than multiplication 
var cycle_at_r = 1 / cycle_at;
var cyclei = 0;
var min_fps = 16;
var min_mspf = 1000 / min_fps;
var is_adjusted = false;
// Watching performance and adjusting DPR in response.
function time(timeNow, lastTime) {
  if (is_adjusted) return
  diffTime += timeNow - lastTime
  if (cyclei++ > cycle_at) {
    var avgTime = diffTime * cycle_at_r
    diffTime = cyclei = 0
    if (avgTime && avgTime > min_mspf) {
      renderer.setPixelRatio(1)
      is_adjusted = true
      console.warn("Reducing resolution of Three for your device.")
    }
  }
}

var currentTime;
var nextTime;
function animate() {
  requestAnimationFrame(animate)
  nextTime = Date.now()
  // record for metrics
  time(nextTime, currentTime)
  currentTime = nextTime
  render(currentTime - startTime)
}

function render(t) {
  uniforms.iGlobalTime.value = t * 0.0001
  renderer.render(scene, camera)
}

function fadeIn() {
  setTimeout(function () {
    var overlay1 = document.getElementById('overlay-1')
    var overlay2 = document.getElementById('overlay-2')
    overlay1.style.opacity = 0;
    overlay2.style.opacity = 0;
    onWindowResize()
    setTimeout(function () {
      renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
    }, 2500)
  }, 100)
}
