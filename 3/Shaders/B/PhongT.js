class PhongT {

    constructor(gl) {
        this.gl = gl;
        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.u_posicion = this.gl.getUniformLocation(this.shader_program,'posicion');

        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');
        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_textura = this.gl.getAttribLocation(this.shader_program, 'vertexTextureCoordinates');

        this.u_imagen = this.gl.getUniformLocation(this.shader_program, 'imagen');

        this.u_intensidad_ambiente = this.gl.getUniformLocation(this.shader_program,'intensidad_ambiente');
        this.u_intensidad = this.gl.getUniformLocation(this.shader_program,'intensidad');
        this.u_atenuacion = this.gl.getUniformLocation(this.shader_program,'atenuacion');

        this.u_n = this.gl.getUniformLocation(this.shader_program,'n');
    }

    set_luz(luz, ambiente) {
        let posicion = luz.posicion;
        let atenuacion = luz.atenuacion;
        let intensidad = luz.intensidad;
        this.gl.uniform3f(this.u_intensidad, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_atenuacion, atenuacion[0], atenuacion[1], atenuacion[2]);
        this.gl.uniform3f(this.u_posicion, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_intensidad_ambiente, ambiente.intensidad[0], ambiente.intensidad[1], ambiente.intensidad[2]);
    }

    set_material(n) { this.gl.uniform1f(this.u_n,n); }

    vertex(){

        return `#version 300 es

        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 normalMatrix;
        uniform mat4 modelMatrix;
        
        uniform vec3 posicion;
        
        in vec2 vertexTextureCoordinates;
        in vec3 vertexNormal;
        in vec3 vertexPosition;
        out vec3 normal;
        out vec3 luz;
        out vec3 ojo;
        out vec2 coordenadaTextura;
        
        void main() {
            vec3 p = vec3(viewMatrix * modelMatrix *vec4(vertexPosition, 1));
            luz = vec3(viewMatrix * vec4(posicion,1));
            luz = normalize(luz - p);
            normal = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
            ojo = normalize(-p);
            coordenadaTextura = vertexTextureCoordinates;
        
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        `;
    }

    fragment(){
        return  `#version 300 es
        precision mediump float;
        
        uniform vec3 intensidad_ambiente;

        uniform vec3 intensidad;
        uniform vec3 atenuacion;
        
        uniform sampler2D imagen;
        
        uniform float n;
        
        in vec3 normal;
        in vec3 luz;
        in vec3 ojo;
        in vec2 coordenadaTextura;
        
        out vec4 fragmentColor;
        
        void main() {
            vec3 N = normalize(normal);
            vec3 L = normalize(luz);
            vec3 V = normalize(ojo);
            vec3 H = normalize(L+V);

            vec3 difusa = vec3(texture(imagen, coordenadaTextura));

            float NL = max(dot(N,L),0.0); // intensidad de luz difusa
            float NHn = pow(max(dot(N,H),0.0),n);// intensidad de luz especular
            float d = sqrt( L.x*L.x + L.y*L.y + L.y*L.y );
            float fa = 1.0/(1.0 + atenuacion.x*d + atenuacion.y*d + atenuacion.z*d*d);
            vec3 color = intensidad_ambiente*difusa*0.1+fa*intensidad*(NL*difusa + NHn);
        
            fragmentColor = vec4(color,1);
        }
        
        ` ;
    }
}
