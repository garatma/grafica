var luz_seleccionada = 0;

function reset_camara() {
	camara.r = 60;
	camara.t = 120*Math.PI/180;
	camara.f = 5*Math.PI/180;
}

function actualizar_interfaz_bote() {
	document.getElementById("ganancia").value = material_bote.ganancia;
	document.getElementById("lacunaridad").value = material_bote.lacunaridad;
	document.getElementById("octavas").value = material_bote.octavas;
	document.getElementById("resolucion0").value = material_bote.resolucion[0];
	document.getElementById("resolucion1").value = material_bote.resolucion[1];
	// inicializo los valores del slider de lacunaridad , ganancia y octavas de la esfera de mármol
	UpdateTextInput(10,material_bote.ganancia);
	UpdateTextInput(11,material_bote.lacunaridad);
	UpdateTextInput(12,material_bote.octavas);
	UpdateTextInput(13,material_bote.resolucion[0]);
	UpdateTextInput(14,material_bote.resolucion[1]);
}
// se actualizan los sliders según la luz seleccionada
function actualizar_interfaz() {
	let posicion, atenuacion, intensidad; 
	if ( luz_seleccionada == 0 ) {
		posicion = Utils.cartesianas_a_esfericas(luz_puntual.posicion);
		atenuacion = luz_puntual.atenuacion;
		intensidad = luz_puntual.intensidad;

		//Luz puntual posición
		document.getElementById("rpos").value = parseFloat(posicion[0]).toFixed(0);
		document.getElementById("tpos").value = parseFloat(posicion[1]).toFixed(1);
		document.getElementById("fpos").value = parseFloat(posicion[2]).toFixed(1);
		UpdateTextInput(1,parseFloat(posicion[0]).toFixed(0));
		UpdateTextInput(2,parseFloat(posicion[1]).toFixed(1));
		UpdateTextInput(3,parseFloat(posicion[2]).toFixed(1));

		//Luz puntual atenuación
		document.getElementById("aatt").value = atenuacion[0];
		document.getElementById("batt").value = atenuacion[1];
		document.getElementById("catt").value = atenuacion[2];
		UpdateTextInput(4,atenuacion[0]);
		UpdateTextInput(5,atenuacion[1]);
		UpdateTextInput(6,atenuacion[2]);

		//Luz puntual intensidad
		document.getElementById("rint").value = parseFloat(intensidad[0]*255).toFixed(0);
		document.getElementById("gint").value = parseFloat(intensidad[1]*255).toFixed(0);
		document.getElementById("bint").value = parseFloat(intensidad[2]*255).toFixed(0);
		UpdateTextInput(7,parseFloat(intensidad[0]*255).toFixed(0));
		UpdateTextInput(8,parseFloat(intensidad[1]*255).toFixed(0));
		UpdateTextInput(9,parseFloat(intensidad[2]*255).toFixed(0));
	}
	else {

		// Luz ambiente intensidad
		intensidad = luz_ambiente.intensidad;
		document.getElementById("rint").value = parseFloat(intensidad[0]*255).toFixed(0);
		document.getElementById("gint").value = parseFloat(intensidad[1]*255).toFixed(0);
		document.getElementById("bint").value = parseFloat(intensidad[2]*255).toFixed(0);
		UpdateTextInput(7,parseFloat(intensidad[0]*255).toFixed(0));
		UpdateTextInput(8,parseFloat(intensidad[1]*255).toFixed(0));
		UpdateTextInput(9,parseFloat(intensidad[2]*255).toFixed(0));
	}
}

function iniciar_luces() {
	luz_puntual = new Light([-50,50,-50],null,[0.7,0.7,0.7],null,[0,0,0]);
	let posicion = Utils.cartesianas_a_esfericas(luz_puntual.posicion);
	luz_ambiente = new Light(null,null,[0,0,0],null,null);

	actualizar_interfaz();
}

// función oyente del combo box. cambia la interfaz según la luz elegida (opcion)
function cambiar_luz(opcion) {
	luz_seleccionada = opcion;

	document.getElementById("epos").hidden = luz_seleccionada == 1;
	document.getElementById("eatt").hidden = luz_seleccionada == 1;

	// se actualizan los sliders
	actualizar_interfaz();
}

function posicion_teclado(valor, coordenada) {
	let slider, actualizar, nuevo_valor;

	if ( coordenada == 1 ) {
		slider = document.getElementById("tpos");
		nuevo_valor = parseFloat(slider.value) + parseFloat(valor);
		actualizar = 0 < nuevo_valor && nuevo_valor <= 6.28;
	}
	else if ( coordenada == 2 ) {
		slider = document.getElementById("fpos");
		nuevo_valor = parseFloat(slider.value) + parseFloat(valor);
		actualizar = 0 < nuevo_valor && nuevo_valor <= 3.14;
	}
	else {
		slider = document.getElementById("rpos");
		nuevo_valor = parseFloat(slider.value) + parseFloat(valor);
		actualizar = 0 < nuevo_valor && nuevo_valor <= 100;
	}

	if ( actualizar ) {
		let pos = Utils.cartesianas_a_esfericas(luz_puntual.posicion), actualizar;
		pos[coordenada] += parseFloat(valor);
		luz_puntual.posicion = Utils.esfericas_a_cartesianas(pos);
		// se actualiza la interfaz
		slider.value = nuevo_valor;
		if (coordenada==0) UpdateTextInput(1,parseFloat(nuevo_valor).toFixed(0));
		else UpdateTextInput(coordenada+1,parseFloat(nuevo_valor).toFixed(1));
	}
}

function toggle() {
	let luz, offset = luz_seleccionada*3;
	if ( luz_seleccionada == 0 ) luz = luz_puntual;
	else luz = luz_ambiente;

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

//......................PARÁMETROS LUZ..................................

/*Funcion para actualizar el valor en el text del slider*/
function UpdateTextInput(num,val) {
	document.getElementById("textInput"+num).innerText=val;
}

function cambiar_bandera(valor) { 
	textura_bandera_seleccionada = valor; 
}

function posicion(valor, coordenada) {
	let pos = Utils.cartesianas_a_esfericas(luz_puntual.posicion);
	pos[coordenada] = parseFloat(valor); 
	luz_puntual.posicion = Utils.esfericas_a_cartesianas(pos);
	if (coordenada==0) UpdateTextInput(1,parseFloat(valor).toFixed(0));
	else UpdateTextInput(coordenada+1,parseFloat(valor).toFixed(1));
}

function atenuacion(valor, coordenada) { 
	luz_puntual.atenuacion[coordenada] = valor;
	UpdateTextInput(coordenada+4,luz_puntual.atenuacion[coordenada]);
}

function intensidad(valor, coordenada) {
	if ( luz_seleccionada == 0 ) luz_puntual.intensidad[coordenada] = valor/255;
	else luz_ambiente.intensidad[coordenada] = valor/255;
	UpdateTextInput(coordenada+7,parseFloat(valor).toFixed(0));
}

//.....................................................................

//.................PARÁMETROS BOTE............................

function ganancia(valor) {
	 material_bote.ganancia = valor; 
	 UpdateTextInput(10,material_bote.ganancia);
}

function lacunaridad(valor) { 
	material_bote.lacunaridad = valor; 
	UpdateTextInput(11,material_bote.lacunaridad);
}

function octavas(valor) {
	 material_bote.octavas = valor; 
	 UpdateTextInput(12,material_bote.octavas);
	}

function resolucion(valor, coordenada) {
	 material_bote.resolucion[coordenada] = valor;
	 if (coordenada==0)
		 UpdateTextInput(13,material_bote.resolucion[coordenada]);
	 else
		 UpdateTextInput(14,material_bote.resolucion[coordenada]);
	}

//...................................................................
