var atributos_spot, atributos_puntual, atributos_direccional, atributos_ambiente;

// 0-2: spot, 3-5: puntual, 6-8: direccional, 9-11: ambiente
var intensidad_aux = new Array(12);

function reset_camara() {
	camara.r = 130;
	camara.t = 50*Math.PI/180;
	camara.f = 40*Math.PI/180;
}


// función oyente del combo box. cambia la interfaz según la luz elegida (opcion)
function cambiar_luz(opcion) {
	luz_seleccionada = opcion;
	let luz;

	if ( luz_seleccionada == 0 ) luz = atributos_spot;
	else if ( luz_seleccionada == 1 ) luz = atributos_puntual;
	else if ( luz_seleccionada == 2 ) luz = atributos_direccional;
	else luz = atributos_ambiente;

	document.getElementById("eangulo").hidden = luz.eangulo;
	document.getElementById("edir").hidden = luz.edir;
	document.getElementById("epos").hidden = luz.epos;
	document.getElementById("eatt").hidden = luz.eatt;

	// se actualizan los sliders
	actualizar_interfaz();
}

function posicion_teclado(valor, coordenada) {
	let slider, valor_nuevo;
	if ( coordenada == 0 ) slider = document.getElementById("xpos");
	else if ( coordenada == 1 ) slider = document.getElementById("ypos");
	else slider = document.getElementById("zpos");
	
	valor_nuevo = valor + parseFloat(slider.value);


	if ( -50 < valor_nuevo && valor_nuevo < 50 ) {
		if ( luz_seleccionada == 0 ) {
			luz_spot.posicion[coordenada] += valor;
		}
		else if ( luz_seleccionada == 1 ) {
			luz_puntual.posicion[coordenada] += valor;
		}

		// se actualiza la interfaz
		slider.value = valor_nuevo;
		UpdateTextInput(coordenada+4,valor_nuevo);
	}
}

function actualizar_texturas(nro,id){
	if(document.getElementById(id).checked) texturas_seleccionadas[nro] = 1.0 ;
	else texturas_seleccionadas[nro] = 0.0;
}

function toggle() {
	let luz, offset = luz_seleccionada*3;
	if ( luz_seleccionada == 0 ) luz = luz_spot;
	else if ( luz_seleccionada == 1) luz = luz_puntual;
	else if ( luz_seleccionada == 2) luz = luz_direccional;
	else if ( luz_seleccionada == 3) luz = luz_ambiente;

	if ( luz.dibujar )
		// me guardo el estado de la luz y seteo su intensidad en cero
		for ( let i = 0; i < 3; i++) {
			intensidad_aux[offset + i] = luz.intensidad[i];
			luz.intensidad[i] = 0;
		}
	else
		// restauro el valor de intensidad de la luz
		for ( let i = 0; i < 3; i++) luz.intensidad[i] = intensidad_aux[offset + i];

	luz.dibujar = !luz.dibujar;
	document.getElementById("dibujar_luz").innerText = luz.dibujar ? "Off" : "On";
}

function inicializar_luces() {
	luz_spot = new Light([0,30,0],[0,-1,0],[1,0.96,0.89],49,[0,0,0]);
	luz_puntual = new Light([20,20,20],null,[1,0.58,0.16],null,[0,0,0]);
	luz_direccional = new Light(null,[0,0,-1],[0.59,0.59,1],null,null);
	luz_ambiente = new Light(null,null,[0.2,0.2,0.2],null,null);

	atributos_spot = {
		eangulo: false,
		edir: false,
		epos: false,
		eatt: false
	};

	atributos_puntual = {
		eangulo: true,
		edir: true,
		epos: false,
		eatt: false
	};

	atributos_direccional = {
		eangulo: true,
		edir: false,
		epos: true,
		eatt: true
	};

	
	atributos_ambiente = {
		eangulo: true,
		edir: true,
		epos: true,
		eatt: true
	};

	actualizar_interfaz();
}
// se actualizan los sliders según la luz seleccionada
function actualizar_interfaz() {
	let direccion, posicion, atenuacion, intensidad; 
	if ( luz_seleccionada == 0 ) {
		direccion = Utils.cartesianas_a_esfericas(luz_spot.direccion);
		posicion = luz_spot.posicion;
		atenuacion = luz_spot.atenuacion;
		intensidad = luz_spot.intensidad;

		// Ángulo luz Spot
		document.getElementById("angulo").value = luz_spot.angulo;
		UpdateTextInput(1,(luz_spot.angulo));
		//Dirección Luz spot
		document.getElementById("tdir").value = direccion[1];
		document.getElementById("fdir").value = direccion[2];
		UpdateTextInput(2,parseFloat(direccion[1]).toFixed(2));
		UpdateTextInput(3,parseFloat(direccion[2]).toFixed(2));

		//Posición Luz spot
		document.getElementById("xpos").value = posicion[0];
		document.getElementById("ypos").value = posicion[1];
		document.getElementById("zpos").value = posicion[2];
		UpdateTextInput(4,posicion[0]);
		UpdateTextInput(5,posicion[1]);
		UpdateTextInput(6,posicion[2]);

		// Atenuación  Luz spot
		document.getElementById("aatt").value = atenuacion[0];
		document.getElementById("batt").value = atenuacion[1];
		document.getElementById("catt").value = atenuacion[2];
		UpdateTextInput(7,atenuacion[0]);
		UpdateTextInput(8,atenuacion[1]);
		UpdateTextInput(9,atenuacion[2]);

		// Intensidad  Luz spot
		document.getElementById("rint").value = parseFloat(intensidad[0]*255).toFixed(0);
		document.getElementById("gint").value = parseFloat(intensidad[1]*255).toFixed(0);
		document.getElementById("bint").value = parseFloat(intensidad[2]*255).toFixed(0);
		UpdateTextInput(10,parseFloat(intensidad[0]*255).toFixed(0));
		UpdateTextInput(11,parseFloat(intensidad[1]*255).toFixed(0));
		UpdateTextInput(12,parseFloat(intensidad[2]*255).toFixed(0));

	}
	else if ( luz_seleccionada == 1) {
		posicion = luz_puntual.posicion;
		atenuacion = luz_puntual.atenuacion;
		intensidad = luz_puntual.intensidad;

		// Posición  Luz Puntual
		document.getElementById("xpos").value = posicion[0];
		document.getElementById("ypos").value = posicion[1];
		document.getElementById("zpos").value = posicion[2];
		UpdateTextInput(4,posicion[0]);
		UpdateTextInput(5,posicion[1]);
		UpdateTextInput(6,posicion[2]);

		// Atenuación  Luz Puntual
		document.getElementById("aatt").value = atenuacion[0];
		document.getElementById("batt").value = atenuacion[1];
		document.getElementById("catt").value = atenuacion[2];
		UpdateTextInput(7,atenuacion[0]);
		UpdateTextInput(8,atenuacion[1]);
		UpdateTextInput(9,atenuacion[2]);

		// Intensidad  Luz Puntual
		document.getElementById("rint").value = parseFloat(intensidad[0]*255).toFixed(0);
		document.getElementById("gint").value = parseFloat(intensidad[1]*255).toFixed(0);
		document.getElementById("bint").value = parseFloat(intensidad[2]*255).toFixed(0);
		UpdateTextInput(10,parseFloat(intensidad[0]*255).toFixed(0));
		UpdateTextInput(11,parseFloat(intensidad[1]*255).toFixed(0));
		UpdateTextInput(12,parseFloat(intensidad[2]*255).toFixed(0));

	}
	else if ( luz_seleccionada == 2 ) {
		direccion = Utils.cartesianas_a_esfericas(luz_direccional.direccion);
		intensidad = luz_direccional.intensidad;

		//Dirección Luz Direccional
		document.getElementById("tdir").value = direccion[1];
		document.getElementById("fdir").value = direccion[2];
		UpdateTextInput(2,parseFloat(direccion[1]).toFixed(2));
		UpdateTextInput(3,parseFloat(direccion[2]).toFixed(2));
		
		//Intensidad Luz Direccional
		document.getElementById("rint").value = parseFloat(intensidad[0]*255).toFixed(0);
		document.getElementById("gint").value = parseFloat(intensidad[1]*255).toFixed(0);
		document.getElementById("bint").value = parseFloat(intensidad[2]*255).toFixed(0);
		UpdateTextInput(10,parseFloat(intensidad[0]*255).toFixed(0));
		UpdateTextInput(11,parseFloat(intensidad[1]*255).toFixed(0));
		UpdateTextInput(12,parseFloat(intensidad[2]*255).toFixed(0));
	}
	else {
		intensidad = luz_ambiente.intensidad;
		document.getElementById("rint").value = parseFloat(intensidad[0]*255).toFixed(0);
		document.getElementById("gint").value = parseFloat(intensidad[1]*255).toFixed(0);
		document.getElementById("bint").value = parseFloat(intensidad[2]*255).toFixed(0);
		UpdateTextInput(10,parseFloat(intensidad[0]*255).toFixed(0));
		UpdateTextInput(11,parseFloat(intensidad[1]*255).toFixed(0));
		UpdateTextInput(12,parseFloat(intensidad[2]*255).toFixed(0));
	}
	// inicializo los valores del slider de lacunaridad , ganancia y octavas de la esfera de mármol
	UpdateTextInput(13,lacunaridad);
	UpdateTextInput(14,ganancia);
	UpdateTextInput(15,octavas);
}






//-------------------SLIDERS PARA CADA PARAMETRO DEL TIPO DE LUZ-----------------


/*Funcion para actualizar el valor en el text del slider*/
function UpdateTextInput(num,val) {
	if (num==1){
	document.getElementById("textInput"+num).innerText=val+"º";}
	else
	document.getElementById("textInput"+num).innerText=val;
}

function angulo(valor) { 
	luz_spot.angulo =valor;
	UpdateTextInput(1,valor);
}

function direccion(valor, coordenada) {
	let luz;
	if ( luz_seleccionada == 0 ) luz = luz_spot;
	else luz = luz_direccional;

	let direccion = Utils.cartesianas_a_esfericas(luz.direccion);
	direccion[coordenada] = valor;
	luz.direccion = Utils.esfericas_a_cartesianas(direccion);

	UpdateTextInput(coordenada+1,valor); 
}

function posicion(valor, coordenada) {
	if ( luz_seleccionada == 0 ) luz_spot.posicion[coordenada] = valor;
	else luz_puntual.posicion[coordenada] = valor;
	UpdateTextInput(coordenada+4,valor);
}

function atenuacion(valor, coordenada) {
	if ( luz_seleccionada == 0 ) luz_spot.atenuacion[coordenada] = valor;
	else luz_puntual.atenuacion[coordenada] = valor;
	UpdateTextInput(coordenada+7,valor);
}

function intensidad(valor, coordenada) {
	if ( luz_seleccionada == 0 ) luz_spot.intensidad[coordenada] = valor/255;
	else if ( luz_seleccionada == 1) luz_puntual.intensidad[coordenada] = valor/255;
	else if ( luz_seleccionada == 2) luz_direccional.intensidad[coordenada] = valor/255;
	else if ( luz_seleccionada == 3) luz_ambiente.intensidad[coordenada] = valor/255;
	UpdateTextInput(coordenada+10,valor);
}

//---------------------------parámetros procedural-----------------------

function Lacunaridad(valor) { 
	lacunaridad = valor;
	UpdateTextInput(13,lacunaridad); 
}

function Ganancia(valor) { 
	ganancia = valor;
	UpdateTextInput(14,ganancia);
}

function Octavas(valor) { 
	octavas = valor;
	UpdateTextInput(15,octavas);
}