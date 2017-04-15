  
var radius = 100;
var nTrees = 150;
var nflower = 100;
var ngrass = 200;

for(var i = 0; i < nTrees; i++){
    var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load("models/palmtree.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("models/palmtree.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});
		
			scene.add(mesh);
			mesh.position.set(radius/4 - radius * Math.random(), 0.0, radius/4 - radius * Math.random());
           mesh.scale.set(1.5,1.5,1.5);
			
		});
		
	});
}



for(var i = 0; i < nflower; i++){
    var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load("models/flower1.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("models/flower1.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});
		
			scene.add(mesh);
			mesh.position.set(radius/2 - radius * Math.random(), 0.0, radius/2 - radius * Math.random());
           
			
		});
		
	});
}

for(var i = 0; i < ngrass; i++){
    var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load("models/grass.mtl", function(materials){
		
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		
		objLoader.load("models/grass.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});
		
			scene.add(mesh);
			mesh.position.set(radius/2 - radius * Math.random(), 0.0, radius/2 - radius * Math.random());
           
			
		});
		
	});
}

 var mtlLoader1 = new THREE.MTLLoader();
	mtlLoader1.load("models/mountain.mtl", function(materials){
		
		materials.preload();
		var objLoader1 = new THREE.OBJLoader();
		objLoader1.setMaterials(materials);
		
		objLoader1.load("models/mountian.obj", function(mesh){
		
			mesh.traverse(function(node){
				if( node instanceof THREE.Mesh ){
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});
		
			scene.add(mesh);
			mesh.position.set(2,0,2);
			mesh.scale.set(2,2,2);
           
			
		});
		
	});
