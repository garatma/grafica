class Phong3_Procedurales {

    constructor(gl) {
        this.gl = gl;

        this.shader_program = ShaderProgramHelper.create(this.vertex(), this.fragment());

        this.u_matriz_vista = this.gl.getUniformLocation(this.shader_program, 'viewMatrix');
        this.u_matriz_proyeccion = this.gl.getUniformLocation(this.shader_program, 'projectionMatrix');
        this.u_matriz_normal = this.gl.getUniformLocation(this.shader_program,'normalMatrix');
        this.u_matriz_modelo = this.gl.getUniformLocation(this.shader_program, 'modelMatrix');

        this.loc_normal = this.gl.getAttribLocation(this.shader_program, 'vertexNormal');
        this.loc_posicion = this.gl.getAttribLocation(this.shader_program, 'vertexPosition');
        this.loc_textura = this.gl.getAttribLocation(this.shader_program, 'vertexTextureCoordinates');

        this.u_intensidad_ambiente = this.gl.getUniformLocation(this.shader_program,"ia");

        this.u_brillo = this.gl.getUniformLocation(this.shader_program,"n");

        this.u_pspot = this.gl.getUniformLocation(this.shader_program,'pspot');
        this.u_ispot = this.gl.getUniformLocation(this.shader_program,'ispot');
        this.u_faspot = this.gl.getUniformLocation(this.shader_program,'faspot');
        this.u_dspot = this.gl.getUniformLocation(this.shader_program,'dspot');
        this.u_angulo = this.gl.getUniformLocation(this.shader_program,'angulo');

        this.u_ppuntual = this.gl.getUniformLocation(this.shader_program,'ppuntual');
        this.u_ipuntual = this.gl.getUniformLocation(this.shader_program,'ipuntual');
        this.u_fapuntual = this.gl.getUniformLocation(this.shader_program,"fapuntual");

        this.u_idireccional = this.gl.getUniformLocation(this.shader_program,'idireccional');
        this.u_ddireccional = this.gl.getUniformLocation(this.shader_program,'ddireccional');

        this.u_octavas = this.gl.getUniformLocation(this.shader_program,'octavas');
        this.u_lacunaridad = this.gl.getUniformLocation(this.shader_program,'lacunaridad');
        this.u_ganancia = this.gl.getUniformLocation(this.shader_program,'ganancia');
    }

    set_luz(ambiente, spot, puntual, direccional) {
        this.gl.uniform3f(this.u_intensidad_ambiente , ambiente.intensidad[0], ambiente.intensidad[1], ambiente.intensidad[2]);

        // luz spot
        let posicion = spot.posicion;
        let intensidad = spot.intensidad;
        let atenuacion = spot.atenuacion;
        let direccion = spot.direccion;

        let angulo = spot.angulo;

        if ( angulo < -180 || angulo > 180 ) angulo = 180;
        angulo = Math.cos(Math.PI*angulo/180);

        this.gl.uniform3f(this.u_pspot, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_ispot, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_faspot, atenuacion[0], atenuacion[1], atenuacion[2]);
        this.gl.uniform3f(this.u_dspot, direccion[0], direccion[1], direccion[2]);
        this.gl.uniform1f(this.u_angulo, angulo);

        // luz puntual
        posicion = puntual.posicion;
        intensidad = puntual.intensidad;
        atenuacion = puntual.atenuacion;

        this.gl.uniform3f(this.u_ppuntual, posicion[0], posicion[1], posicion[2]);
        this.gl.uniform3f(this.u_ipuntual, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_fapuntual, atenuacion[0], atenuacion[1], atenuacion[2]);

        // luz direccional
        intensidad = direccional.intensidad;
        direccion = direccional.direccion;

        this.gl.uniform3f(this.u_idireccional, intensidad[0], intensidad[1], intensidad[2]);
        this.gl.uniform3f(this.u_ddireccional, direccion[0], direccion[1], direccion[2]);
    }

    set_material(n) { this.gl.uniform1f(this.u_brillo,n); }

    vertex() {
        return `#version 300 es
        precision mediump float;
        
        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 normalMatrix;
        uniform mat4 modelMatrix;
        
        uniform vec3 ppuntual;
        uniform vec3 pspot;
        uniform vec3 ddireccional;
        
        in vec2 vertexTextureCoordinates;
        in vec3 vertexNormal;
        in vec3 vertexPosition;
        out vec3 normal;
        out vec3 Lpuntual;
        out vec3 ojo;
        out vec3 Lspot;
        out vec3 LEspot;
        out vec3 ddir;
        out vec2 coordenadas_texturas;
        
        void main() {
            vec3 vPE = vec3(viewMatrix * modelMatrix * vec4(vertexPosition, 1));
            vec3 LE = vec3(viewMatrix * vec4(ppuntual,1));
            ddir = normalize( vec3( viewMatrix * vec4(ddireccional,0)   )  );
            Lpuntual = normalize(vec3(LE-vPE));
            normal = normalize(vec3(normalMatrix*vec4(vertexNormal,1)));
            ojo = normalize(-vPE);  // distancia entre la posicion del ojo (0,0,0) y un vertice del objeto
        
            LEspot = vec3(viewMatrix * vec4(pspot,1));
            Lspot = normalize( pspot - vec3(modelMatrix * vec4(vertexPosition, 1)) );
            LEspot = normalize(vec3(LEspot-vPE));
           // coordenada de textura
            coordenadas_texturas = vertexTextureCoordinates;
            
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1);
        }`;
    }

    fragment() {
        return `#version 300 es
        precision mediump float;
        uniform float time;
        //intensidad ambiente
        uniform vec3 ia;
        
        //solo brillo
        uniform float n;
        
        //parametros luz puntual
        uniform vec3 ipuntual;
        uniform vec3 fapuntual;
        
        //parametros luz spot
        uniform vec3 dspot;
        uniform vec3 ispot;
        uniform float angulo;
        uniform vec3 faspot;
        
        //parametros luz direccional
        uniform vec3 idireccional;
        
        //vectores de entrada al fragment shader
        in vec3 Lspot;
        in vec3 LEspot;
        in vec3 normal;
        in vec3 Lpuntual;
        in vec3 ojo;
        in vec3 ddir;
        
        //parametros octava ,lacunaridad(frecuencia) y ganancia(amplitud)
        in vec2 coordenadas_texturas;
        uniform float lacunaridad;
        uniform float ganancia;
        uniform float octavas;
        out vec4 fragmentColor;
         
        vec4 mod289(vec4 x)
        {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
         
        vec4 permute(vec4 x)
        {
            return mod289(((x*34.0)+1.0)*x);
        }
         
        vec4 taylorInvSqrt(vec4 r)
        {
            return 1.79284291400159 - 0.85373472095314 * r;
        }
         
        // interpolación quíntica curva ( f (x) = 6x ^ 5 -15t ^ 4 + 10t ^ 3 ).  
        vec2 fade(vec2 t) {
            return t*t*t*(t*(t*6.0-15.0)+10.0);
        }
         
        // Perlin Noise Clasico
        float cnoise(vec2 P)
        {
            vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
            vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
            Pi = mod289(Pi); // To avoid truncation effects in permutation
            vec4 ix = Pi.xzxz;
            vec4 iy = Pi.yyww;
            vec4 fx = Pf.xzxz;
            vec4 fy = Pf.yyww;
             
            vec4 i = permute(permute(ix) + iy);
             
            vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
            vec4 gy = abs(gx) - 0.5 ;
            vec4 tx = floor(gx + 0.5);
            gx = gx - tx;
             
            vec2 g00 = vec2(gx.x,gy.x);
            vec2 g10 = vec2(gx.y,gy.y);
            vec2 g01 = vec2(gx.z,gy.z);
            vec2 g11 = vec2(gx.w,gy.w);
             
            vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
            g00 *= norm.x;  
            g01 *= norm.y;  
            g10 *= norm.z;  
            g11 *= norm.w;  
             
            float n00 = dot(g00, vec2(fx.x, fy.x));
            float n10 = dot(g10, vec2(fx.y, fy.y));
            float n01 = dot(g01, vec2(fx.z, fy.z));
            float n11 = dot(g11, vec2(fx.w, fy.w));
             
            vec2 fade_xy = fade(Pf.xy);
            vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
            float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
            return 2.3 * n_xy;
        }
         
        // Ruido de Perlin 2D variante periodico
        float pnoise(vec2 P, vec2 rep)
        {
            vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
            vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
            Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
            Pi = mod289(Pi);        // To avoid truncation effects in permutation
            vec4 ix = Pi.xzxz;
            vec4 iy = Pi.yyww;
            vec4 fx = Pf.xzxz;
            vec4 fy = Pf.yyww;
             
            vec4 i = permute(permute(ix) + iy);
             
            vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
            vec4 gy = abs(gx) - 0.5 ;
            vec4 tx = floor(gx + 0.5);
            gx = gx - tx;
             
            vec2 g00 = vec2(gx.x,gy.x);
            vec2 g10 = vec2(gx.y,gy.y);
            vec2 g01 = vec2(gx.z,gy.z);
            vec2 g11 = vec2(gx.w,gy.w);
             
            vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
            g00 *= norm.x;  
            g01 *= norm.y;  
            g10 *= norm.z;  
            g11 *= norm.w;  
             
            float n00 = dot(g00, vec2(fx.x, fy.x));
            float n10 = dot(g10, vec2(fx.y, fy.y));
            float n01 = dot(g01, vec2(fx.z, fy.z));
            float n11 = dot(g11, vec2(fx.w, fy.w));
             
            vec2 fade_xy = fade(Pf.xy);
            vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
            float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
            return 2.3 * n_xy;
        }
         
        float fbm(vec2 P, int octaves, float lacunarity, float gain)
        {
            float sum = 0.0;
            float amp = 1.0;
            vec2 pp = P;
             
            int i;
             
            for(i = 0; i < octaves; i+=1)
            {
                amp *= gain; 
                sum += amp * cnoise(pp);
                pp *= lacunarity;
            }
            return sum;
         
        }
        
        
        //Patron 1
        float pattern(in vec2 coordenadas_texturas) {
            //float lacunaridad = 2.5;
            //float ganancia = 0.4;
            //int octavas = 10
             
            vec2 q = vec2( fbm( coordenadas_texturas + vec2(0.0,0.0),int (octavas),lacunaridad,ganancia),fbm( coordenadas_texturas + vec2(5.2,1.3),int (octavas),lacunaridad,ganancia));
            vec2 r = vec2( fbm( coordenadas_texturas + 4.0*q + vec2(1.7,9.2),int (octavas),lacunaridad,ganancia ), fbm( coordenadas_texturas + 4.0*q + vec2(8.3,2.8) ,int (octavas),lacunaridad,ganancia));
            return fbm( coordenadas_texturas + 4.0*r ,int (octavas),lacunaridad,ganancia);    
        }
        
        // Patron 2 
        float pattern2( in vec2 coordenadas_texturas, out vec2 q, out vec2 r , float time)
        {
            //float l = 2.3;
            //float g = 0.4;
            //int octavas = 10
        
             
            q.x = fbm( coordenadas_texturas + vec2(time,time),int (octavas),lacunaridad,ganancia);
            q.y = fbm( coordenadas_texturas + vec2(5.2*time,1.3*time) ,int (octavas),lacunaridad,ganancia);
             
            r.x = fbm( coordenadas_texturas + 4.0*q + vec2(1.7,9.2),int (octavas),lacunaridad,ganancia );
            r.y = fbm( coordenadas_texturas + 4.0*q + vec2(8.3,2.8) ,int (octavas),lacunaridad,ganancia);
             
            return fbm( coordenadas_texturas + 4.0*r ,int (octavas),lacunaridad,ganancia);
        }
         
        void main() { 


            vec2 st = coordenadas_texturas;
            vec2 p = -1.0 + 2.0 * st;
            vec2 qq;
            vec2 r;
            
            //float color_pattern = pattern2(p,r,qq,time);
            float color_pattern = pattern(p);

            vec3 difuso = vec3(color_pattern,color_pattern,color_pattern)*3.5;
             

              // luz PUNTUAL
            float FP = 1.0/3.0;
            vec3 N = normalize(normal);
            vec3 L = normalize(Lpuntual);
            vec3 V = normalize(ojo);
            vec3 H = normalize(L+V);
            float NL = max(dot(N,L),0.0); // intensidad de luz difusa
            float NHn = pow(max(dot(N,H),0.0),n);// intensidad de luz especular
            float d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
            float fa = 1.0/(1.0+fapuntual.x+fapuntual.y*d+fapuntual.z*d*d);
            vec3 luzpuntual = ia*difuso + fa*ipuntual*(NL*difuso + NHn);
            
            // luz DIRECCIONAL
            vec3 Ldir = normalize(-ddir);
            NL = max(dot(N,Ldir),0.0);
            vec3 luzdireccional = vec3(0,0,0);
            H = normalize(Ldir+V);
            NHn  = pow(max(dot(N,H),0.0),n);
            luzdireccional =  ia*difuso + idireccional*( NL*difuso + NHn  );   
        
            // luz SPOT
            vec3 Dspot = normalize(-dspot);
            vec3 vL = normalize(Lspot);
            L = normalize(LEspot);   
            H = normalize(L+V);
            NL = max(dot(N,L),0.0);
            NHn  = pow(max(dot(N,H),0.0),n);
            vec3 luzspot = ia*difuso;
            if ( angulo == 0.0 || dot(vL,Dspot) > angulo ) {
                d = sqrt(L.x*L.x + L.y*L.y + L.z*L.z  );
                fa = 1.0/(1.0+faspot.x+faspot.y*d+faspot.z*d*d);
                luzspot += fa*ispot*(NL*difuso+NHn);
            }
            
            vec3 color =  FP*(  luzpuntual + luzspot + luzdireccional ) ;
            
            fragmentColor =vec4( color ,1.0);
        }`;
}

}