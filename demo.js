var scene, camera, renderer, mesh, clock;
var keyboard = {};
var player = {height:1.8, speed: 0.3,turnSpeed: 0.1 ,canShoot: 0, crouch: 0.2};
var meshFloor;

var crate, crateTexture, crateNormalMap, crateBumpMap;
var crate1, crateTexture1, crateNormalMap1, crateBumpMap1;

var LOADING_MANAGER = null;
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1100/720, 0.1, 100),
    box: new THREE.Mesh(
    new THREE.SphereGeometry(0.5,0.5,0.5,),
        new THREE.MeshBasicMaterial({color: 0x4444ff })
    )
}

var RESOURCES_LOADED = false;

var models = {


    gun: {
		obj:"gun.obj",
       
		mesh: null,
		castShadow:false
	}
}

var meshes = {};


var bullets = [];

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, 1100/720, 0.1, 1000);
    clock = new THREE.Clock();

    loadingScreen.box.position.set(0,0,5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
loadingScreen.scene.add(loadingScreen.box);
    
    loadingManager = new THREE.LoadingManager();
    
    loadingManager.onProgress = function(item, loaded, total){
        console.log(item, loaded, total);
    }
    
    loadingManager.onLoad = function(){
        console.log("loaded all resources");
        RESOURCES_LOADED = true;
        onResourcesLoaded();
    }
    
    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(250,250, 10, 10),
        new THREE.MeshPhongMaterial({color: 0x32cd32, wireframe: false})
    );
    meshFloor.rotation.x -= Math.PI / 2;
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    ambientLight = new THREE.HemisphereLight(0xffffff, 0.1);
    scene.add(ambientLight);
    
    light = new THREE.PointLight(0xfffff, 0xffffff , 0.01);
    light.castShadow = true;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 500;
    scene.add(light);

var radius = 200;
var nCollectible = 50;
for (var i =0; i < nCollectible; i++){
crate = new THREE.Mesh(
    new THREE.BoxGeometry(0.25,0.25,0.25),
    new THREE.MeshBasicMaterial({color: 0xA52A2A, wireframe: false})
);
  
crate.receiveShadow = true;
crate.position.x += 1;
crate.position.set(radius/2 - radius * Math.random(),0.5,radius/2 - radius * Math.random())
scene.add(crate);

}
    

    
   	for( var _key in models ){
		(function(key){
			
			var mtlLoader = new THREE.MTLLoader(loadingManager);
			mtlLoader.load(models[key].mtl, function(materials){
				materials.preload();
				
				var objLoader = new THREE.OBJLoader(loadingManager);
				
				objLoader.setMaterials(materials);
				objLoader.load(models[key].obj, function(mesh){
					
					mesh.traverse(function(node){
						if( node instanceof THREE.Mesh ){
							node.castShadow = true;
							node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh;
					
				});
			});
			
		})(_key);
	}
    
    camera.position.set(0,player.height,-5);
    camera.lookAt(new THREE.Vector3(0,player.height,0));
    
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(1270, 725);
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    
    document.body.appendChild(renderer.domElement);
    
    animate();
}

function onResourcesLoaded(){
	
	// Clone models into meshes.


	meshes["gun"] = models.gun.mesh.clone();
	// Reposition individual meshes, then add meshes to scene


    
    meshes["gun"].position.set(0,1,0);
   meshes["gun"].rotation.set(0, Math.PI, 0);
    scene.add(meshes["gun"]);
}

function animate(){

    //crate.rotation.x += 0.01;
	crate.rotation.y += 0.05;
    
    if(RESOURCES_LOADED == false){
        requestAnimationFrame(animate);
        loadingScreen.box.position.x -= 0.05;
        if(loadingScreen.box.position.x < -10){ loadingScreen.box.position.x = 10;}
        loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);
        
        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return;
    }
    
    
    requestAnimationFrame(animate);
    
    var time = Date.now() * 0.0005;
    var delta = clock.getDelta();
    
	for(var index=0; index<bullets.length; index+=1){
		if( bullets[index] === undefined ) continue;
		if( bullets[index].alive == false ){
			bullets.splice(index,1);
			continue;
		}
		
		bullets[index].position.add(bullets[index].velocity);
	}

    if(keyboard[38])// the w key
    {
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed; 
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
     if(keyboard[40])// the s key
     {
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
     if(keyboard[65])// the A key
     {
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
    }
     if(keyboard[68])// the D key
     {
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }
    
    if(keyboard[37]) // the left arrow key
    {
        camera.rotation.y -= Math.PI * player.turnSpeed;
    }
     if(keyboard[39])// the right arrow key
     {
        camera.rotation.y += Math.PI * player.turnSpeed;
    }

    // the shift key for crouching the player
    if(keyboard[16])
    {
       camera.position.y -= Math.PI * player.crouch;

setTimeout(function(){
    camera.position.y += Math.PI * player.crouch;
}, 2000);
if(camera.position.y <= 0){

    camera.position.y += Math.PI * player.height;
}

    }

    

	if(keyboard[32] && player.canShoot <= 0){ // spacebar key
		// creates a bullet as a Mesh object
		var bullet = new THREE.Mesh(
			new THREE.SphereGeometry(0.05,8,8),
			new THREE.MeshBasicMaterial({color: 0x808080})
		);
		// this is silly.
		// var bullet = models.pirateship.mesh.clone();
		
		// position the bullet to come from the player's weapon
		bullet.position.set(
			meshes["gun"].position.x,
			meshes["gun"].position.y + 0.10,
			meshes["gun"].position.z
		);
		
		// set the velocity of the bullet
		bullet.velocity = new THREE.Vector3(
			-Math.sin(camera.rotation.y),
			0,
			Math.cos(camera.rotation.y)
		);
		
		// after 1000ms, set alive to false and remove from scene
		// setting alive to false flags our update code to remove
		// the bullet from the bullets array
		bullet.alive = true;
		setTimeout(function(){
			bullet.alive = false;
			scene.remove(bullet);
		}, 1000);
		
		// add to scene, array, and set the delay to 10 frames
		bullets.push(bullet);
		scene.add(bullet);
		player.canShoot = 3;
	}
	if(player.canShoot > 0) player.canShoot -= 1;
	
	// position the gun in front of the camera
	meshes["gun"].position.set(
		camera.position.x - Math.sin(camera.rotation.y + Math.PI/4) * 0.75,
		camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z)*0.01,
		camera.position.z + Math.cos(camera.rotation.y + Math.PI/4) * 0.75
	);
	meshes["gun"].rotation.set(
		camera.rotation.x,
		camera.rotation.y ,
		camera.rotation.z
	);


    renderer.render(scene, camera);
}

function keyDown(event){
    keyboard[event.keyCode] = true;
}

function keyUp(event){
    keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);


window.onload = init;