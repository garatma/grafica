// Tipo de material para la bandera  ----> satinado
var material_banderas = {
	ka: [0.17 ,0.01 ,0.01],
	kd: [0.61 ,0.04 ,0.04],
	ks: [0.73 ,0.63 ,0.63],
	alfa: 1,
	f0: 1
};

// Tipo de material para el castillo ----> rugoso (piedra)
var material_castillo = {
	ka: [0.13,0.13,0.13],
	kd: [0.8, 0.8, 0.8],
	ks: [0.01, 0.01, 0.01],
	n: 20
};

// Tipo de material para el piso del castillo ----> rugoso
var material_piso = {
	ka: [0.02,0.02,0.02],
	kd: [0.01, 0.01, 0.01],
	ks: [0.5, 0.5, 0.5],
	n: 9.85
};


// Tipo de material para el piso del castillo ----> rugoso (arena)
var material_sand = {
	ka: [0.25,0.22,0.11],
	kd: [0.8, 0.8, 0.8],
	ks: [0.01, 0.01, 0.01],
	n: 9.85
};


// Tipo de material para la puerta  ----> satinado
var material_puerta = {
	ka: [0.11,0.06,0.11],
	kd: [0.43, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	n: 9.85
};

// Tipo de material para el cañon  ----> metalica (cromo)
var material_barrels = {
	ka: [0.23,0.23,0.23],
	kd: [0.28, 0.28, 0.28],
	ks: [0.77, 0.77, 0.77],
	alfa: 2,
	f0: 0.3
};

// Tipo de material para la bala  ----> metalica  (estaño)
var material_balas ={
	ka: [0.01,0.01,0.01],
	kd: [0.28, 0.28, 0.28],
	ks: [0.77, 0.77, 0.77],
	alfa: 2,
	f0: 1
};

// Tipo de material para las ruedas  ----> rugoso
var material_ruedas = {
	ka: [0.11,0.06,0.11],
	kd: [0.43, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	n: 9.85
};

// Tipo de material para el soporte  ----> rugoso
var material_soporte = {
	ka: [0.22,0.09,0.09],
	kd: [0.4, 0.4, 0.4],
	ks: [0.01, 0.01, 0.01],
	n: 0.77
};

// Tipo de material para el bote ----> rugoso
var material_bote = {
	ka: [0.4,0.17,0.06],
	kd: [0.47, 0.47, 0.47],
	ks: [0.01, 0.01, 0.01],
	n: 9
};

// Tipo de material para las bisagras ----> metalico (estaño)
var material_hinges = {
	ka: [0.1,0.06,0.11],
	kd: [0.42, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	alfa: 2,
	f0: 1
};

// Tipo de material para los remos ----> rugoso
var material_remos = {
	ka: [0.11,0.06,0.11],
	kd: [0.43, 0.47, 0.54],
	ks: [0.33, 0.33, 0.52],
	n: 9.85
};

// Tipo de material para el agua  ----> satinado
var material_agua = {
	ka: [0.07,0.07,0.3],
	kd: [0.07,0.07,0.3],
	ks: [1,1,1],
	n: 30
};
