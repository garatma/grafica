var gl, canvas;

// Variables Auxiliares para los shaders
var shader_phong, shader_luz, shader_phong_procedural, normalmap;

var camara;
var textura_luna, textura_suelo;
// Tecturas para las esferas
var textura_metal, textura_height;
var textura_metalica, textura_oxido, textura_normales;
var textura_luna, textura_oxido;
var texturas_seleccionadas = [1.0,1.0,1.0,1.0];

//Aux variables
var coordenadas = new Array(16);
var len = coordenadas.length;
var camara;
var suelo;

// Esferas multitexturada , textura normal y procedural
var esfera_luna, esfera_metal;

//Esfera Mármol
var esfera_marmol;
var lacunaridad = 2.5;
var ganancia = 0.4;
var octavas = 10;

// Variables Auxiliares para los objetos de luz
var luz_spot, luz_puntual, luz_direccional, luz_ambiente;
var luz_seleccionada = 0;
var esfera_puntual;
var cono_spot;
var flecha_direccional;

var material_spot = {
	ka: [0,0,0],
	kd: [1,1,1],
	ks: [1,1,1],
	n: 10
};

var material_puntual = {
	ka: [0,0,0],
	kd: [1,1,1],
	ks: [1,1,1],
	n: 10
};

var material_direccional = {
	ka: [0,0,0],
	kd: [1,1,1],
	ks: [1,1,1],
	n: 10
};

function onLoad() {

	// Obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');
	
	// Shaders utilizados
	shader_phong = new Phong3(gl);
	shader_luz = new Shader_luz(gl);
	normalmap = new normalmap3(gl);
	shader_phong_procedural = new Phong3_Procedurales(gl);

	//Cargo los models para los distintos tipo de luces
	cono_spot = new Model(spot_obj,material_spot,shader_luz.loc_posicion,shader_luz.loc_normal,null);
	esfera_puntual = new Model(puntual_obj,material_puntual, shader_luz.loc_posicion,shader_luz.loc_normal,null);
	flecha_direccional = new Model(direccional_obj,material_direccional,shader_luz.loc_posicion,shader_luz.loc_normal,null);

	// Cargo los models de cada tipo de esfera 
	esfera_metal_normal = new Model(esfera_metalica_obj,10,normalmap.loc_posicion,normalmap.loc_normal,normalmap.loc_textura);
	esfera_luna = new Model(luna_obj,100,shader_phong.loc_posicion,shader_phong.loc_normal,shader_phong.loc_textura);
	esfera_marmol = new Model(luna_obj,10,shader_phong_procedural.loc_posicion,shader_phong_procedural.loc_normal, shader_phong_procedural.loc_textura);

	// Cargo el suelo
	suelo = new Model(suelotex_obj,10, shader_phong.loc_posicion, shader_phong.loc_normal,shader_phong.loc_textura);

	//...Escalado de las esferas.............................
	// Esfera con textura comun
	let matriz = esfera_luna.matriz;
	mat4.scale(matriz,matriz,[2.5,2.5,2.5]);

	// Esfera procedural
	matriz = esfera_marmol.matriz;
	mat4.scale(matriz,matriz,[2.5,2.5,2.5]);

	// Esfera con normalmapping
	matriz = esfera_metal_normal.matriz;
	mat4.scale(matriz,matriz,[4.3,4.3,4.3]);

	//......................................................

	camara = new Camara(canvas);
	reset_camara();

	inicializar_luces();

	// textura luna para la esfera 
	textura_luna = inicializar_textura("../Modelos/textura_luna.png",0);

	// texturas para la esfera con multitex y normalmapping
	textura_metal = inicializar_textura("../Modelos/A/texturas/basecolor.jpg",0);
	textura_normales = inicializar_textura("../Modelos/A/texturas/normal.jpg",1);
	textura_metalica = inicializar_textura("../Modelos/A/texturas/metallic.jpg",2);
	textura_oxido = inicializar_textura("../Modelos/A/texturas/oxido.jpg",3);
	textura_suelo = inicializar_textura("../Modelos/A/texturas/suelo.jpg",0);

	gl.clearColor(0.04,0.04,0.04,1);

	gl.enable(gl.DEPTH_TEST);

	gl.bindVertexArray(null);


	//Posicion de esferas en la escena situadas en circulo
	for ( let i = 0; i < 8; i++ ) {
		coordenadas[i] = [0,0];
		coordenadas[i][0] = Math.sin(i*45*Math.PI/180);
		coordenadas[i][2] = Math.cos(i*45*Math.PI/180);

		coordenadas[i+8] = [0,0];
		coordenadas[i+8][0] = Math.sin((45*i+22.5)*Math.PI/180);
		coordenadas[i+8][2] = Math.cos((45*i+22.5)*Math.PI/180);
	}

	// se empieza a dibujar por cuadro
	requestAnimationFrame(onRender)
}

function onRender() {

	// limpiar canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//...................LUCES....................................................
	// 0 = spot, 1 = puntual, 2 = direccional
	gl.useProgram(shader_luz.shader_program);
	dibujar_luz(luz_spot,0,cono_spot);
	dibujar_luz(luz_puntual,1, esfera_puntual);
	dibujar_luz(luz_direccional,2,flecha_direccional);
	gl.useProgram(null);
//..................................................................................	


	gl.useProgram(shader_phong.shader_program);

	//.....................TEXTURA COMUN............................................
	//dibujar suelo
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textura_suelo);//difuso base
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_suelo(shader_phong);

	// Dibujar esferas
	gl.bindTexture(gl.TEXTURE_2D, textura_luna);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_esferas(esfera_luna, shader_phong, 3, 0);	
	gl.useProgram(null);
	//.........................................................................

	//........................NORMAL MAPPING....................................
	gl.useProgram(normalmap.shader_program);
	gl.uniform4f(normalmap.u_texturas_seleccionadas,texturas_seleccionadas[0],texturas_seleccionadas[1],texturas_seleccionadas[2],texturas_seleccionadas[3]);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textura_metal);//difuso base
	gl.uniform1i(normalmap.u_colorbase, 0);
	

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D,textura_normales);//normalmap
	gl.uniform1i(normalmap.u_normalsmap, 1);
	

	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D,textura_metalica);//especular
	gl.uniform1i(normalmap.u_metallic, 2);

	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, textura_oxido);//difuso oxido
	gl.uniform1i(normalmap.u_oxido, 3);
	

	dibujar_esferas(esfera_metal_normal,normalmap, 3.2, 0);

	gl.useProgram(null);
	//.................................................................	

	gl.useProgram(shader_phong_procedural.shader_program);

	//.....................PROCEDURAL..........................................
	
	gl.uniform1f(shader_phong_procedural.u_lacunaridad,lacunaridad);
	gl.uniform1f(shader_phong_procedural.u_ganancia,ganancia);
	gl.uniform1f(shader_phong_procedural.u_octavas,octavas);

	dibujar_esferas(esfera_marmol,shader_phong_procedural, 5.5, 8);
	
	gl.useProgram(null);
	//...........................................................................

	requestAnimationFrame(onRender);
}

function dibujar_luz(luz, que_dibujar, objeto) {
	// si la luz es spot o puntual, tengo que mover el objeto según su posición
	let matriz = mat4.create();
	shader_luz.set_luz(luz_ambiente, luz_spot, luz_puntual, luz_direccional);
	if ( que_dibujar == 0 || que_dibujar == 1 ) {
		mat4.translate(matriz,matriz,luz.posicion);

		// escalar según el ángulo y rotar según la dirección
		if ( que_dibujar == 0 ) {
			rotar(luz_spot.direccion, matriz);
			mat4.rotateX(matriz,matriz,3.14);
			mat4.translate(matriz,matriz,[0,10,0]);
			mat4.scale(matriz, matriz, [10,10,10]);
		}
	}
	else if ( que_dibujar == 2 ) rotar(luz_direccional.direccion, matriz);
	objeto.material.ka = luz.intensidad;
	objeto.matriz = matriz;
	dibujar(shader_luz,objeto);
}

function rotar(direccion, matriz) {
	let matriz_rotation = mat4.create();
	let matriz_rotationy = mat4.create();

	let esferico = Utils.cartesianas_a_esfericas(direccion);
//	// crea un cuaternión con las rotaciones de f y t de esferico
	let cuaternion_rotacion = quat.create();
	quat.rotateY(cuaternion_rotacion, cuaternion_rotacion, esferico[1]);
	quat.rotateX(cuaternion_rotacion, cuaternion_rotacion, esferico[2]);
	let rotacion = mat4.create();
	mat4.fromQuat(rotacion, cuaternion_rotacion);
	mat4.multiply(matriz, matriz, rotacion);
}

function dibujar_esferas(objeto, shader, radio, offset) {
	let x, z;
	let matriz = objeto.matriz;
	for (let i=0;i<8;i++){
		x = coordenadas[i+offset][0]*radio*2;
		z = coordenadas[i+offset][2]*radio*2;
		mat4.translate(matriz,matriz,[x,0,z]);
		dibujar(shader, objeto);
		mat4.translate(matriz,matriz,[-x,0,-z]);
	}
}

function dibujar(shader, objeto) {
	shader.set_luz(luz_ambiente,luz_spot,luz_puntual,luz_direccional);
	shader.set_material(objeto.material); 

	// setea uniforms de matrices de modelo y normales
	let matriz_normal = mat4.create()
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camara.proyeccion());
	mat4.multiply(matriz_normal,camara.vista(),objeto.matriz);
	mat4.invert(matriz_normal,matriz_normal);
	mat4.transpose(matriz_normal,matriz_normal);
	gl.uniformMatrix4fv(shader.u_matriz_normal, false, matriz_normal);
	gl.uniformMatrix4fv(shader.u_matriz_modelo, false, objeto.matriz);
	
	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
}

function dibujar_suelo(shader) {
	let matriz;
	for ( let i = -10; i <= 10; i++ )
		for ( let j = -10; j <= 10; j++ ) {
			matriz = mat4.create();
			mat4.translate(matriz,matriz,[i*10,-4.37,j*10]);
			mat4.scale(matriz,matriz,[5,1,5]);
			suelo.matriz = matriz;
			dibujar(shader, suelo);
		}
}

function inicializar_textura(imagen,i) {
	let textura = gl.createTexture();
	textura.image = new Image();
	textura.image.onload = function() { handleLoadedTexture(textura,i); }
	textura.image.src = imagen;
	return textura;
}

function handleLoadedTexture(textura,i) {
	gl.activeTexture(gl.TEXTURE0+i);
	gl.bindTexture(gl.TEXTURE_2D, textura);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textura.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
}