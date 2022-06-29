class PhongProcedural {

    constructor(gl) {
        this.gl = gl;

        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.u_posicion = this.gl.getUniformLocation(this.shader_program,'ppuntual');

        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');
        this.loc_textura = this.gl.getAttribLocation(this.shader_program, 'vertexTextureCoordinates');

        this.u_intensidad_ambiente = this.gl.getUniformLocation(this.shader_program,'ia');
        this.u_intensidad = this.gl.getUniformLocation(this.shader_program,'ipuntual');
        this.u_atenuacion = this.gl.getUniformLocation(this.shader_program,'fapuntual');

        this.u_ka = this.gl.getUniformLocation(this.shader_program,"ka");
        this.u_kd = this.gl.getUniformLocation(this.shader_program,"kd");
        this.u_ks = this.gl.getUniformLocation(this.shader_program,"ks");
        this.u_n = this.gl.getUniformLocation(this.shader_program,"n");

        this.u_ganancia = this.gl.getUniformLocation(this.shader_program,"gain");
        this.u_lacunaridad = this.gl.getUniformLocation(this.shader_program,"lacunarity");
        this.u_octavas = this.gl.getUniformLocation(this.shader_program,"octavas");
        this.u_resolution = this.gl.getUniformLocation(this.shader_program,"u_resolution");

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

    set_material(material) {
        this.gl.uniform3f(this.u_ka, material.ka[0], material.ka[1], material.ka[2]);
        this.gl.uniform3f(this.u_kd, material.kd[0], material.kd[1], material.kd[2]);
        this.gl.uniform3f(this.u_ks, material.ks[0], material.ks[1], material.ks[2]);
        this.gl.uniform1f(this.u_n, material.n);
        this.gl.uniform2f(this.u_resolution, material.resolucion[0], material.resolucion[1]);
        this.gl.uniform1f(this.u_octavas,material.octavas);
        this.gl.uniform1f(this.u_lacunaridad,material.lacunaridad);
        this.gl.uniform1f(this.u_ganancia,material.ganancia);
    }

    vertex() {
        return `#version 300 es
        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 normalMatrix;
        uniform mat4 modelMatrix;
        
        uniform vec3 ppuntual;
        
        in vec2 vertexTextureCoordinates;
        in vec3 vertexNormal;
        in vec3 vertexPosition;
        out vec3 normal;
        out vec3 Lpuntual;
        out vec3 ojo;
        out vec2 coordtext;
        
        
        void main() {
            vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
            vec3 LE = vec3(viewMatrix * vec4(ppuntual,1));
            Lpuntual = normalize(vec3(LE-vPE));
            normal = normalize(vec3(normalMatrix*vec4(vertexNormal,0)));
            ojo = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto
        
            coordtext = vertexTextureCoordinates;
            
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }
        `;
    }

    fragment() {
        return `#version 300 es
        precision mediump float;
        
        uniform vec3 ia;
        uniform float n;
        uniform vec3 ipuntual;
        uniform vec3 fapuntual;
        uniform vec3 ka;
        uniform vec3 kd;
        uniform vec3 ks;
        uniform float gain;
        uniform float lacunarity;
        uniform float octavas;
        uniform vec2 u_resolution;
        
        in vec3 normal;
        in vec3 Lpuntual;
        in vec3 ojo;
        in vec2 coordtext;
        
        out vec4 FragColor;
        
        float random (in vec2 coordtext) {
            return fract(sin(dot(coordtext.xy,vec2(12.9898,78.233)))* 43758.5453123);
        }
        
        float noise (in vec2 coordtext) {
            vec2 i = floor(coordtext);
            vec2 f = fract(coordtext);
        
            // Four corners in 2D of a tile
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
        
            vec2 u = f * f * (3.0 - 2.0 * f);
        
            return mix(a, b, u.x) +
                    (c - a)* u.y * (1.0 - u.x) +
                    (d - b) * u.x * u.y;
        }
        
        float fbm (vec2 coordtext, float gain, float lacunarity, int octaves) {
            // Initial values
            float value = 0.0;
            float amplitud = .5;
            float frequency = 0.;
            
            // Loop of octaves
            for (int i = 0; i < octaves; i++) {
                value += amplitud * noise(coordtext);
                coordtext *= lacunarity;
                amplitud *= gain;
            }
            return value;
        }
        
        void main() {
            vec2 st = coordtext;   //gl_FragCoord.xy / u_resolution.xy;
            st.x *= u_resolution.x / u_resolution.y;
            float v = fbm(coordtext.xx * vec2(100.0, 12.0), gain, lacunarity, int(octavas)) ;
            float v0 = smoothstep(-1.0, 1.0, sin(st.x * 14.0 + v * 8.0));
            float v1 = random(coordtext);
            float v2 = noise(coordtext * vec2(200.0, 14.0)) - noise(coordtext * vec2(1000.0, 64.0));
        
            vec3 col = vec3(0.860,0.806,0.574);
            col = mix(col, vec3(0.390,0.265,0.192), v0);
            col = mix(col, vec3(0.930,0.493,0.502), v1 * 0.5);
            col -= v2 * 0.2;
            
            float FP = 1.0/3.0;
            vec3 N = normalize(normal);
            vec3 L = normalize(Lpuntual);
            vec3 V = normalize(ojo);
            vec3 H = normalize(L+V);
            float NL = max(dot(N,L),0.0); // intensidad de luz difusa
            float NHn = pow(max(dot(N,H),0.0),n);// intensidad de luz especular
            float d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
            float fa = 1.0/(1.0+fapuntual.x+fapuntual.y*d+fapuntual.z*d*d);
            vec3 luzpuntual = ia*ka*col + fa*ipuntual*(kd*NL*col + ks*NHn);
            
            FragColor = vec4(luzpuntual,1);
        }
        
        `;
    }

}
