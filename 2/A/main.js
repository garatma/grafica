
/*\
	TODO:
		- if ( !isNaN(pz) ) posicion_puntual_vieja[2]; es decir, validar la entrada de cada textfield.
		- cambiar función de atenuación por algo distinto a 1.
		- poner las luces y las esferas con un mismo new Model.
		- distintas esferas con distinto shader pero con un único loc_posicion/normal de _m?? al crear la esfera
		- rotar vectores de luces
\*/

var velocidad_rotacion = 45;			// 45º por segundo en la cámara automática
var last_draw_time = 0;					// cuándo se dibujó el último cuadro
var gl;
var shader_m;
var shader_s;
var shader_r;
var shader_luz;
var camara;

// direccional: [0.79, 0.89, 1], cielo cubierto
// spot: [1.0.96,0.89], luz fluorescente
// puntual: [1,0.58,0.16],luz de vela

var luz_spot, luz_puntual, luz_direccional, luz_ambiente;
var ispot, ipuntual, idireccional;

// variables de matrices
var matriz_modelo_esfera = mat4.create();
var matriz_modelo_spot = mat4.create();

//Aux variables,
var filas = 6;
var columnas = 4;
var esfera;
var suelo;
var esfera_puntual;
var cono_spot;
var flecha_direccional;

// constante para objetos métalicos (Polished Silver)
var material_m = {
	ka: [0.23,0.23,0.23],
	kd: [0.28, 0.28, 0.28],
	ks: [0.77, 0.77, 0.77],
	alfa: 1.97,
	f0: 1
};

// constantes para objetos satinado (Turquoise)
var material_s = {
	ka: [0.10,0.19,0.17],
	kd: [0.40,0.74,0.70],
	ks: [0.30,0.31,0.31],
	alfa: -0.37,
	f0: 1
};

// constantes para objetos rugoso(Pewter)
var material_r = {
	ka: [0.11,0.06,0.11],
	kd: [0.43,0.47,0.54],
	ks: [0.33,0.33,0.52],
	n: 9.85
};

var material_suelo = {
	ka: [0,0,0],
	kd: [0.01,0.01,0.01],
	ks: [0.5,0.5,0.5],
	n: 32
};

let a = 0, f = 0;

function onLoad() {

	// obtener el canvas
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	shader_m = new Cook3(gl);
	shader_s = new Cook3(gl);
	shader_r = new Ward3(gl);
	shader_suelo = new Phong3(gl);
	shader_luz = new Shader_luz(gl);

	// objetos para las luces
	esfera_puntual = new Model(esfera_obj,null,shader_luz.loc_posicion,null);
	cono_spot = new Model(spot_obj,null,shader_luz.loc_posicion,null);
	flecha_direccional = new Model(direccional_obj,null,shader_luz.loc_posicion,null);


	// Cargo los objetos
	esfera = new Model(esfera_obj,null,shader_m.loc_posicion,shader_m.loc_normal);
	mat4.scale(matriz_modelo_esfera,matriz_modelo_esfera,[3,3,3]);

	// cargo el suelo
	suelo = new Model(suelo_obj, material_suelo, shader_suelo.loc_posicion, shader_suelo.loc_normal);

	camara = new Camara(canvas);
	reset_camara();

	iniciar_luces();

	gl.clearColor(0.04,0.04,0.04,1);;

	gl.enable(gl.DEPTH_TEST);

	gl.bindVertexArray(null);

	gl.useProgram(shader_luz.shader_program);

	// se empieza a dibujar por cuadro
	requestAnimationFrame(onRender)
}

function onRender(now) {
	// se controla en cada cuadro si la cámara es automática
	control_automatica(now);

	// limpiar canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// 0 = spot, 1 = puntual, 2 = direccional

	if ( luz_spot.dibujar ) dibujar_luz(luz_spot,0,cono_spot);
	if ( luz_puntual.dibujar ) dibujar_luz(luz_puntual,1, esfera_puntual);
	if ( luz_direccional.dibujar ) dibujar_luz(luz_direccional,2,flecha_direccional);

	dibujar_suelo(shader_suelo);

	// Dibujar esferas
	dibujar_esfera(shader_m, material_m, 0);
	dibujar_esfera(shader_s, material_s, 2);
	dibujar_esfera(shader_r, material_r, 4);

	requestAnimationFrame(onRender);
}

function dibujar_luz(luz, que_dibujar, objeto) {
	gl.useProgram(shader_luz.shader_program);
	gl.uniformMatrix4fv(shader_luz.u_matriz_proyeccion, false, camara.proyeccion());
	let vector = [0,0,0];
	if ( que_dibujar == 0 || que_dibujar == 1 ) vector = luz.posicion;
	let matriz_modelo_luz = mat4.create();
	mat4.translate(matriz_modelo_luz,matriz_modelo_luz,vector);
	shader_luz.set_luz(luz.intensidad);
	if ( que_dibujar == 0 ) {
		// rotar cono de spot
		let escala = 0;
		if ( luz.angulo > 0 ) escala = luz.angulo > 180 ? 10 : 10*luz.angulo/180;
		else luz.angulo = 0;
		mat4.scale(matriz_modelo_luz, matriz_modelo_luz, [escala,2,escala]);
	}
	else if ( que_dibujar == 2 ) {
		let direccion = vec3.normalize(luz.direccion, luz.direccion);
		mat4.targetTo(matriz_modelo_luz, [0,0,0], [0,1,0], direccion);
	}
	gl.uniformMatrix4fv(shader_luz.u_matriz_modelo, false,matriz_modelo_luz);
	gl.uniformMatrix4fv(shader_luz.u_matriz_vista, false, camara.vista());

	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
	gl.useProgram(null);
}

function dibujar_suelo(shader) {
	gl.useProgram(shader.shader_program);
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camara.proyeccion());
	var matriz_modelo_suelo;
	for ( let i = -5; i <= 5; i++ )
		for ( let j = -5; j <= 5; j++ ) {
			matriz_modelo_suelo = mat4.create();
			mat4.scale(matriz_modelo_suelo,matriz_modelo_suelo,[10,15,10]);
			mat4.translate(matriz_modelo_suelo,matriz_modelo_suelo,[i*2,-0.33,j*2]);
			dibujar(shader, suelo, matriz_modelo_suelo);
		}

	gl.useProgram(null);
}

function dibujar_esfera(shader, material, i) {
	let j;
	gl.useProgram(shader.shader_program);
	gl.uniformMatrix4fv(shader.u_matriz_vista, false, camara.vista());
	gl.uniformMatrix4fv(shader.u_matriz_proyeccion, false, camara.proyeccion());
	esfera.material = material;

	for (j=0;j<columnas;j++){
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(i-2.5)*4]);
		dibujar(shader, esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(i-2.5)*4]);

		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[(j-1.5)*4,0,(i+1-2.5)*4]);
		dibujar(shader, esfera, matriz_modelo_esfera);
		mat4.translate(matriz_modelo_esfera,matriz_modelo_esfera,[-(j-1.5)*4,0,-(i+1-2.5)*4]);
	}
	gl.useProgram(null);
}

function dibujar(shader, objeto, matriz_modelo) {
	shader.set_luz(luz_ambiente,luz_spot,luz_puntual,luz_direccional);
	shader.set_material(objeto.material);
	setear_uniforms_objeto(shader, matriz_modelo);
	gl.bindVertexArray(objeto.vao);
	gl.drawElements(gl.TRIANGLES, objeto.cant_indices, gl.UNSIGNED_INT, 0);
	gl.bindVertexArray(null);
}

function setear_uniforms_objeto(shader, matriz_modelo) {
	gl.uniformMatrix4fv(shader.u_matriz_modelo, false,matriz_modelo);
	let matriz_normal = mat4.create()
	mat4.multiply(matriz_normal,camara.vista(),matriz_modelo);
	mat4.invert(matriz_normal,matriz_normal);
	mat4.transpose(matriz_normal,matriz_normal);

	gl.uniformMatrix4fv(shader.u_matriz_normal, false, matriz_normal);
}

function control_automatica(now) {
	if ( document.getElementById("camara_seleccionada").value == 1 ) { // la cámara es automática
		// de milisegundos a segundos
		now *= 0.001;

		// tiempo entre este frame y el anterior
		let delta_tiempo = now - last_draw_time;

		// se establece el diferencial de ángulo a rotar en función del tiempo transcurrido y la velocidad deseada
		let angulo_nuevo_rotacion = delta_tiempo * velocidad_rotacion;

		// para evitar saltos de rotación (sobre todo en la primera iteración)
		if ( angulo_nuevo_rotacion > 1 ) angulo_nuevo_rotacion = 0;

		// se efectúa la rotación y se dibuja
		camara.paneo(angulo_nuevo_rotacion);

		// guardar cuándo se realiza este frame y se vuelve a renderizar
		last_draw_time = now;
	}
}
