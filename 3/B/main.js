
var gl;

var shader_no_texturas, shader_phong, shader_phong2, shader_procedural;

var camara;

var luz_puntual, luz_ambiente;

// objetos
var exterior_castillo, interior_castillo, puertas_torres, bandera;
var bote, barriles, base, ruedas, bala;
var agua;
var arena, troncos, hojas;
var luna;

// texturas
var textura_exterior, textura_interior, textura_puertas_torres, textura_bandera = new Array(4);
var textura_bote, textura_barriles, textura_base, textura_ruedas;
var textura_palmeras_tronco, textura_palmeras_hojas, textura_palmeras_hojas_spec, textura_arena;
var textura_luna;
var textura_bandera_seleccionada = 0;

// random para las balas
let xrnd = new Array(12);
let yrnd = new Array(12);
let zrnd = new Array(12);

var material_agua = {
	ka: [0.07,0.07,0.3],
	kd: [0.07,0.07,0.3],
	ks: [1,1,1],
	n: 30
};

var material_arena = {
	ka: [0.25,0.22,0.11],
	kd: [0.8, 0.8, 0.8],
	ks: [0.01, 0.01, 0.01],
	n: 9.85
};

var material_bala = {
	ka: [0.07,0.07,0.07],
	kd: [0.07,0.07,0.07],
	ks: [1,1,1],
	n: 30
};

var material_bote = {
	ka: [0.3,0.15,0.06],
	kd: [0.3,0.2,0.01],
	ks: [0.2,0.1,0.01],
	n: 10,
	resolucion: [0,1],
	octavas: 0,
	lacunaridad: 1,
	ganancia: 0
};

function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	// declaración y creación de los shaders a utilizar
	shader_no_texturas = new Phong(gl);
	shader_phong = new PhongT(gl);
	shader_phong2 = new Phong2(gl);
	shader_procedural = new PhongProcedural(gl);

	// creación de los modelos
	// castillo
	exterior_castillo = new Model(exterior_obj, 10, shader_phong.loc_posicion, shader_phong.loc_normal, shader_phong.loc_textura);
	interior_castillo = new Model(interior_obj, 10, shader_phong.loc_posicion, shader_phong.loc_normal, shader_phong.loc_textura);
	puertas_torres = new Model(puertas_torres_obj, 10, shader_phong.loc_posicion, shader_phong.loc_normal, shader_phong.loc_textura);
	bandera = new Model(bandera_obj, 10, shader_phong.loc_posicion, shader_phong.loc_normal, shader_phong.loc_textura);

	// land
	arena = new Model(arena_obj,1000, shader_phong.loc_posicion,shader_phong.loc_normal, shader_phong.loc_textura);
	troncos = new Model(troncos_obj, 10, shader_phong.loc_posicion,shader_phong.loc_normal,shader_phong.loc_textura);
	hojas = new Model(hojas_obj, 10, shader_phong2.loc_posicion,shader_phong2.loc_normal,shader_phong2.loc_textura);

	// luna
	luna = new Model(luna_obj, 10, shader_phong.loc_posicion, shader_phong.loc_normal, shader_phong.loc_textura);

	// bote y cañón
	bote = new Model(bote_obj, material_bote, shader_procedural.loc_posicion, shader_procedural.loc_normal,shader_procedural.loc_textura);
	barriles = new Model(barriles_obj, 10, shader_phong.loc_posicion, shader_phong. loc_normal, shader_phong.loc_textura);
	base = new Model(base_obj, 10, shader_phong.loc_posicion, shader_phong. loc_normal, shader_phong.loc_textura);
	ruedas = new Model(ruedas_obj, 10, shader_phong.loc_posicion, shader_phong. loc_normal, shader_phong.loc_textura);
	bala = new Model(low_fi_esfera_obj, material_bala, shader_no_texturas.loc_posicion, shader_no_texturas.loc_normal, null);

	// agua
	agua = new Model(agua_obj, material_agua, shader_no_texturas.loc_posicion, shader_no_texturas.loc_normal, null);
	
	// creación de las texturas a utilizar
	textura_exterior = inicializar_textura("../Modelos/B/castillo/textura_exterior.jpg"); 
	textura_interior = inicializar_textura("../Modelos/B/castillo/textura_interior.jpg");
	textura_puertas_torres = inicializar_textura("../Modelos/B/castillo/textura_puertas_torres.jpg");
	textura_barriles = inicializar_textura("../Modelos/B/cañón/textura_barriles.jpg");
	textura_base = inicializar_textura("../Modelos/B/cañón/textura_base.jpg");
	textura_ruedas = inicializar_textura("../Modelos/B/cañón/textura_ruedas.jpg");
	textura_palmeras_tronco = inicializar_textura("../Modelos/B/palmeras/textura_troncos.png");
	textura_palmeras_hojas = inicializar_textura("../Modelos/B/palmeras/textura_hojas.png");
	textura_palmeras_hojas2 = inicializar_textura("../Modelos/B/palmeras/textura_hojas_spec.png");
	textura_arena = inicializar_textura("../Modelos/B/textura_arena.jpg");
	textura_luna = inicializar_textura("../Modelos/textura_luna.png");
	textura_bandera[0] = inicializar_textura("/Modelos/B/castillo/textura_arg.png");
	textura_bandera[1] = inicializar_textura("/Modelos/B/castillo/textura_dcic.jpg");
	textura_bandera[2] = inicializar_textura("/Modelos/B/castillo/textura_eng.png");
	textura_bandera[3] = inicializar_textura("/Modelos/B/castillo/textura_leones.png");

	// actualizar los sliders de la textura del bote
	actualizar_interfaz_bote();

	// seteo de la cámara
	camara = new Camara(canvas);
	reset_camara();

	// seteo de las luces a utilizar
	iniciar_luces();

	gl.clearColor(0.01,0.01,0.08,1);

	// testeos necesitados
	gl.enable(gl.DEPTH_TEST);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	gl.bindVertexArray(null);

	// desplazamiento inicial de los objetos
	// exterior castillo
	let matriz = mat4.create();
	mat4.scale(matriz, matriz, [0.7,0.7,0.7]);
	mat4.rotateY(matriz, matriz, 235*Math.PI/180);
	mat4.translate(matriz, matriz, [0,1,-25]);
	interior_castillo.matriz = matriz;
	exterior_castillo.matriz = matriz;
	puertas_torres.matriz = matriz;
	bandera.matriz = matriz;

	// bote
	matriz = bote.matriz;
	mat4.translate(matriz,matriz,[-30,0,-20])
	mat4.rotateY(matriz,matriz,0.99);
	mat4.scale(matriz,matriz,[1.3,1.3,1.3]);

	// cañones
	matriz = mat4.create();
	mat4.scale(matriz,matriz,[0.02,0.02,0.02]);
	mat4.rotateY(matriz,matriz,2.55);
	mat4.translate(matriz,matriz,[1800,0,-5]);
	barriles.matriz = matriz;
	base.matriz = matriz;
	ruedas.matriz = matriz;

	// arena
	matriz = arena.matriz;
	mat4.translate(matriz,matriz,[25,-0.5,20]);
	mat4.scale(matriz,matriz,[5,3,5]);
	
	// troncos y hojas
	matriz = troncos.matriz;
	mat4.scale(matriz,matriz,[3,5,3]);
	mat4.translate(matriz,matriz,[20,0.3,2]);
	matriz = hojas.matriz;
	mat4.scale(matriz,matriz,[3,5,3]);
	mat4.translate(matriz,matriz,[20,0.3,2]);

	for ( let i = 0; i < 12; i++) {
		xrnd[i] = Math.random();
		yrnd[i] = Math.random();
		zrnd[i] = Math.random();
	}

	requestAnimationFrame(onRender)
}

function onRender(now) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//dibujo el agua
	gl.useProgram(shader_no_texturas.shader_program);
	dibujar_agua();
	
	//dibujo las balas
	dibujar_balas();

	gl.useProgram(null);

	//dibujo el bote
	gl.useProgram(shader_procedural.shader_program);
	dibujar_objeto(bote,shader_procedural);

	gl.useProgram(null);

	//dibujo la luna
	gl.useProgram(shader_phong.shader_program);
	gl.activeTexture(gl.TEXTURE0);
	luna.matriz = mat4.create();
	let matriz = luna.matriz;
	let pos = Utils.cartesianas_a_esfericas(luz_puntual.posicion);
	pos[0] += 50;
	pos = Utils.esfericas_a_cartesianas(pos);
	mat4.translate(matriz, matriz, [pos[0],pos[1],pos[2]]);
	mat4.scale(matriz, matriz, [5,5,5]);
	gl.bindTexture(gl.TEXTURE_2D, textura_luna);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(luna,shader_phong);

	//dibujo la arena
	gl.bindTexture(gl.TEXTURE_2D, textura_arena);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(arena, shader_phong);

	//dibujo el castillo exterior 
	gl.bindTexture(gl.TEXTURE_2D, textura_exterior);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(exterior_castillo, shader_phong);
	
	//dibujo el castillo interior
	gl.bindTexture(gl.TEXTURE_2D, textura_interior);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(interior_castillo, shader_phong);
	
	//dibujo las puertas y torres
	gl.bindTexture(gl.TEXTURE_2D, textura_puertas_torres);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(puertas_torres, shader_phong);

	//dibujo la bandera
	gl.bindTexture(gl.TEXTURE_2D, textura_bandera[textura_bandera_seleccionada]);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(bandera, shader_phong);

	//dibujo los barriles
	gl.bindTexture(gl.TEXTURE_2D, textura_barriles);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(barriles,shader_phong);

	//dibujo la base
	gl.bindTexture(gl.TEXTURE_2D, textura_base);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(base,shader_phong);

	//dibujo las ruedas
	gl.bindTexture(gl.TEXTURE_2D, textura_ruedas);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(ruedas,shader_phong);

	//dibujo los troncos de las palmeras
	gl.bindTexture(gl.TEXTURE_2D, textura_palmeras_tronco);
	gl.uniform1i(shader_phong.u_imagen, 0);
	dibujar_objeto(troncos,shader_phong);

	//dibujo las hojas de las palmeras
	gl.useProgram(shader_phong2.shader_program);
	gl.bindTexture(gl.TEXTURE_2D, textura_palmeras_hojas);
	gl.uniform1i(shader_phong2.u_imagen, 0);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, textura_palmeras_hojas_spec);
	gl.uniform1i(shader_phong2.shader_program.imagen2, 1);
	dibujar_objeto(hojas,shader_phong2);

	gl.useProgram(null);
	requestAnimationFrame(onRender);
}

function dibujar_agua() {
	let matriz = agua.matriz;
	for ( let i = -1; i < 2; i++) {
		mat4.translate(matriz, matriz, [0,0,i*50]);
		dibujar_objeto(agua, shader_no_texturas);
		mat4.translate(matriz, matriz, [0,0,-i*50]);
	}
}

function dibujar_balas() {
	let matriz;
	for ( let i = -6; i < 6; i++) {
		bala.matriz = mat4.create();
		matriz = bala.matriz;
		mat4.rotateY(matriz, matriz, -0.6);
		mat4.translate(matriz, matriz, [xrnd[i+6]*2-30,yrnd[i+6]*2+1.5,zrnd[i+6]*5-2]);
		mat4.scale(matriz, matriz, [0.1,0.1,0.1]);
		dibujar_objeto(bala, shader_no_texturas);
	}
}

function dibujar_objeto(objeto, shader) {
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camara.proyeccion());
	gl.uniformMatrix4fv(shader.u_matriz_modelo, false, objeto.matriz);
	shader.set_luz(luz_puntual, luz_ambiente);
	shader.set_material(objeto.material);

	let matriz_normal = mat4.create();
	mat4.multiply(matriz_normal,camara.vista(),objeto.matriz);
	mat4.invert(matriz_normal,matriz_normal);
	mat4.transpose(matriz_normal,matriz_normal);
	gl.uniformMatrix4fv(shader.u_matriz_normal, false, matriz_normal);

	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
}

function inicializar_textura(imagen) {
	let textura = gl.createTexture();
	textura.image = new Image();
	textura.image.onload = function() { handleLoadedTexture(textura); }
	textura.image.src = imagen;
	return textura;
}

function handleLoadedTexture(textura) {
	gl.bindTexture(gl.TEXTURE_2D, textura);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textura.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);
}