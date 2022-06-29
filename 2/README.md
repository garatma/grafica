
Proyecto 2: Una Escena más realista. Iluminación. Distintos materiales
En este proyecto deberán generar dos escenas diferentes. Éstas deben estar constituidas por:
- Escena A. Debe organizarse sobre un plano. Sobre este plano deben ubicarse 24 esferas de al menos tres materiales diferentes (en un arreglo de 6x4). Los materiales básicos deben tener una apariencia rugosa opaca (como, por ejemplo, la de cerámica de barro sin recubrimientos), satinada (como se mostró en los adornos de Navidad en clase) y metálica (como, por ejemplo, oro o cobre que se detalla en la figura que se muestra a continuación). En esta escena deben integrarse luces puntuales, direccionales y spots. Debe haber por lo menos una de cada una.
- Escena B. En esta escena se deben integrar, como mínimo, tres objetos con tres apariencias diferentes (dos, al menos, deben ser las desarrolladas para la escena A). La escena debe estar coherentemente integrada. Deben integrar las luces que consideren convenientes.
En lo que respecta a la interacción con la escena deberán permitir que:
- En ambas escenas se deben poder variar los parámetros de las luces que consideren conveniente.
- En la escena B también deben poder variarse los parámetros del material que consideren adecuados.
Son interesantes los modelos desarrollados por Disney. Estos se detallan, por ejemplo, en s2012_pbs_disney_brdf_notes_v3.pdf y s2015_pbs_disney_bsdf_notes.pdf.
1 Objetivo
En este trabajo se familiarizarán con el proceso de renderizado de escenas con métodos de iluminación local. Considerarán distintos modelos de fuentes de luz y distintos materiales. La generación de distintos materiales se basa en la observación de objetos de distintos materiales reales o de imágenes de los mismos, y la reproducción de estos materiales considerando los métodos de reflexión vistos. Este es un paso más hacia la creación de la escena del proyecto integrador.
2 Los Modelos
Pueden usar los modelos de luces vistos en clase y también pueden incorporar modelos que
consideren convenientes (por ejemplo, luces de área). En cuanto al color de la luz, si bien
puede modelarla con un color arbitrario, en la escena A deben considerar luces que se
asemejen a alguna de las detalladas en la tabla que se muestra a continuación:
Grados Kelvin Tipo de Fuente de luz Color
1700-1800K Luz de fósforo
1850-1930K Luz de vela
2000-3000K Sol cuando sale o cuando se pone
2500-2900K Lamparita de tungsteno
3000K Lamparita de tungsteno 500W-1k
3200-3500K Luz de cuarzo
3200-7500K Luz fluorescente
3275K Lámpara de tungsteno 2K
3380K Lámpara de tungsteno 5K, 10K
5000-5400K Sol directo al mediodía
5500-6500K Luz del día (Sol + Cielo)
5500-6500K Sol a través de las nubes/niebla
6000-7500K Cielo cubierto
6500K RGB Monitor (punto blanco)
7000-8000K Zonas de sombra al aire libre
8000-10000K Cielo parcialmente nublado
En lo que respecta a los materiales puede utilizar los desarrollados en clase y diseñar BRDFs
considerando los términos difuso y especular que considere más convenientes en cada
caso. También puede incorporar algún material incorporándolo desde un archivo donde se
almacena una BRDF adquirida.
Es altamente recomendable que el modelo de iluminación sea físicamente plausible.
3 Extras
Se detallan algunas sugerencias para superar lo mínimo necesario para completar este
Proyecto. ¡Sólo intenten hacer esto una vez que hayan cumplido con los requerimientos
mínimos para el proyecto!
3.1 Incorporación de material/es desde un archivo donde se almacena una BRDF adquirida.
3.2 Modelado de materiales con incorporación de scattering a nivel de sub-superficie.
Puede usar como referencia el trabajo Arbitrarily Layered Micro-Facet Surfaces, Andrea
Weidlich y Alexander Wilkie; también puede usar el trabajo
s2015_pbs_disney_bsdf_notes.pdf.
3.3 Modelado de materiales (que exhiban transmisión difusa y/o especular) con BSDF
mediante el modelo de Disney. Éste puede encontrarlo en
s2015_pbs_disney_bsdf_notes.pdf (ver figuras 5 y 6).
3.4 Modelado de materiales perlados (se mostró en clase un adorno de Navidad de este
tipo)
4 Calificación
El Proyecto será calificado de acuerdo a las rúbricas proporcionadas en la subsección 4.2.
Se presentan rúbricas para la evaluación de:
- Aspectos cognitivos
- Presentación
- Exposición oral
Para aprobar el proyecto ninguno de los ítems evaluados debe ser insuficiente. La nota se
integrará considerando todos los requerimientos exigidos.
4.1 Materiales calificados
Los modelos proporcionados o creados por la cátedra para la explicación de los temas no
contarán para este requisito.
En lo que respecta a la escena B, cualquier modelo que se encuentre en la Web o que
ustedes mismos creen o generen debe ser más complejo que una simple primitiva
geométrica (por ejemplo, esfera, cubo, plano, cónica, etc.) o una combinación trivial de
múltiples primitivas geométricas (por ejemplo, dos esferas apiladas una encima de la otra).
Los materiales desarrollados para estos objetos deben ser físicamente plausibles. Si estos
requisitos no están del todo claros, pregunten a los auxiliares de la cátedra para que le
proporcione orientación.
4.2 Rúbricas
A continuación, se detallan las rúbricas de evaluación:
Aspectos
Cognitivos
Sobresaliente (10) Muy Bueno (8 ó 9) Bueno (6 ó 7) Regular (5) Insuficiente(≤4)
Escena A
Tipos de luces
En la escena se
incorporan los 3
tipos de luces
pedidas y se
adiciona un
modelo de luz de
área.
En la escena se
incorporan dos de
los 3 tipos de luces
pedidas y se
adiciona un
modelo de luz de
área.
En la escena se
incorporan los 3
tipos de luces
pedidas.
En la escena se
incorporan 2 de
los 3 tipos de luces
pedidas
En la escena se
incorpora un
solo modelo de
luz.
Modelado de la
luz
Cada luz se modela
adecuadamente
(en cuanto a cada
uno de sus
parámetros). Se
pueden variar los
parámetros de
cada una de las
luces de manera
consistente.
Al menos el spot y
otra de las dos
luces se modelan
adecuadamente
(en cuanto a cada
uno de sus
parámetros) y los
parámetros de
ambas se pueden
variar de manera
consistente.
Al menos dos de
las luces se
modelan
adecuadamente
(en cuanto a cada
uno de sus
parámetros) y sus
parámetros se
pueden variar de
manera
consistente.
Al menos una de
las luces (que no
sea la direccional)
se modela
adecuadamente
(en cuanto a cada
uno de sus
parámetros) y la
mayoría de sus
parámetros se
puede variar de
manera
consistente.
Al menos la luz
direccional se
modela
adecuadamente
(en cuanto a
cada uno de sus
parámetros).
Integración de
las luces
Las luces (4) se
integran
adecuadamente
en cuanto a su
intensidad y su
color en el
contexto de
múltiples luces. Se
consideran al
menos 2 luces de
cada tipo.
Las luces (3) se
integran
adecuadamente
en cuanto a su
intensidad y su
color en el
contexto de
múltiples luces. Se
consideran al
menos 2 luces de
cada tipo.
Las luces (3) se
integran
adecuadamente
en cuanto a su
intensidad en el
contexto de
múltiples luces. Se
consideran al
menos 2 luces de
un tipo.
Las luces (2) se
integran
adecuadamente
en cuanto a su
intensidad en el
contexto de
múltiples luces.
Las luces no se
integran
adecuadamente.
Si se tiene una
sola luz
obviamente no
puede
integrarse en el
contexto de
múltiples luces.
Material
Los objetos se
modelaron con
tres materiales de
apariencia
diferente de
acuerdo a lo
planteado (rugosa
opaca, satinada y
metálica). La
apariencia es
físicamente
plausible.
Adicionalmente, se
diseñó al menos
uno de los
materiales
detallado en los
Extra.
Pueden explicar
muy bien los
modelos
desarrollados para
los materiales.
Los objetos se
modelaron con
tres materiales de
apariencia
diferente de
acuerdo a lo
planteado (rugosa
opaca, satinada y
metálica). La
apariencia es
físicamente
plausible. Pueden
explicar
relativamente bien
los modelos
desarrollados para
los materiales.
Los objetos se
modelaron con
tres materiales de
apariencia
diferente de
acuerdo a lo
planteado (rugosa
opaca, satinada y
metálica). Al
menos la
apariencia de dos
de ellos es
físicamente
plausible. Pueden
explicar los
modelos
desarrollados para
los materiales con
algunas
dificultades.
Los objetos se
modelaron con
tres materiales de
apariencia
diferente de
acuerdo a lo
planteado (rugosa
opaca, satinada y
metálica). Al
menos la
apariencia de uno
de ellos es
físicamente
plausible.
Pueden explicar,
con bastante
dificultad, los
modelos
desarrollados para
los materiales.
Los objetos se
intentaron
modelar con
tres materiales
de apariencia
diferente de
acuerdo a lo
planteado
(rugosa opaca,
satinada y
metálica) pero
ninguno tiene
una apariencia
físicamente
plausible. No
pueden explicar
los modelos
desarrollados
para los
materiales.
Escena B
Constitución y
estética de la
escena
La escena es muy
atractiva
estéticamente y
permite evaluar
los objetivos
planteados en el
proyecto (en
cuanto a modelos
de iluminación).
Los objetos
incorporados se
relacionan de
manera coherente.
Los objetos tienen
materiales
adecuados y, a su
vez, bien
integrados en
relación a la
escena, a los otros
objetos y a las
luces.
La escena es
atractiva
estéticamente y
permite evaluar
los objetivos
planteados en el
proyecto (en
cuanto a modelos
de iluminación).
Los objetos
incorporados se
relacionan de
manera coherente.
Los objetos tienen
materiales
adecuados y, a su
vez, mayormente
bien integrados en
relación a la
escena, a los otros
objetos y a las
luces.
La escena permite
evaluar los
objetivos
planteados en el
proyecto (en
cuanto a modelos
de iluminación).
Los objetos
incorporados se
relacionan de
manera coherente.
Los objetos tienen
materiales
adecuados y, a su
vez, mayormente
bien integrados en
relación a la
escena, a los otros
objetos y a las
luces.
La escena permite
evaluar los
objetivos
planteados en el
proyecto (en
cuanto a modelos
de iluminación).
Todos los objetos
incorporados
pueden no
relacionarse de
manera coherente.
Alguno de los
objetos no tiene el
material adecuado
y, a su vez, no está
bien integrado en
relación a la
escena, a los otros
objetos o a las
luces.
La escena no
permite evaluar
los objetivos
planteados en el
proyecto (en
cuanto a
modelos de
iluminación). Los
objetos
incorporados no
se relacionan de
manera
coherente, no
tienen el
material
adecuado o no
están bien
integrados en
relación a la
escena, a los
otros objetos o
a las luces.
Tipo y ubicación
de las luces
Se posicionaron
estratégicamente
las luces en la
escena. Pueden
justificar
adecuadamente
cómo establecer
su posición,
orientación y tipo.
Se pueden ver sus
posiciones,
orientaciones y
tipos diferentes en
la escena.
Se posicionaron
adecuadamente
las luces en la
escena. Pueden
justificar
adecuadamente
cómo establecer
su posición,
orientación y tipo.
Se pueden ver sus
posiciones,
orientaciones y
tipos diferentes en
la escena.
Se posicionaron las
luces en la escena.
Pueden justificar
cómo establecer
su posición,
orientación y tipo.
Se pueden ver sus
posiciones,
orientaciones y
tipos diferentes en
la escena.
Se posicionaron las
luces en la escena.
Pueden justificar
cómo establecer
su posición,
orientación y tipo.
No se pueden ver
sus posiciones,
orientaciones ni
los tipos diferentes
en la escena.
Se posicionaron
las luces en la
escena. No
pueden justificar
cómo establecer
su posición,
orientación y/o
tipo. No se
pueden ver sus
posiciones,
orientaciones ni
los diferentes
tipos en la
escena.
Movimiento de
las luces y de la
cámara
La cámara puede
moverse de
manera suave
alrededor de la
escena, siguiendo
un recorrido
adecuado. Se
pueden mover una
o varias luces,
eligiéndolas
previamente. Se
puede ubicar
cualquier luz (una
sola a la vez) en el
lugar de la cámara
y moverla junto
con ella.
La cámara puede
moverse de
manera suave
alrededor de la
escena, siguiendo
un recorrido
adecuado. Se
pueden mover una
o varias luces
dando una o más
secuencias
previamente
establecida/s de
las luces. Se puede
ubicar cualquier
luz (una sola a la
vez) en el lugar de
la cámara y
moverla junto con
ella.
La cámara puede
moverse de
manera suave
alrededor de la
escena, siguiendo
un recorrido preestablecido.
Se
pueden mover una
o varias luces
dando una o más
secuencias
previamente
establecida/s de
las luces. Se puede
ubicar cualquier
luz (una sola a la
vez) en el lugar de
la cámara y
moverla junto con
ella.
La cámara puede
moverse de
manera suave
alrededor de la
escena, siguiendo
un recorrido preestablecido.
Se
pueden mover una
o varias luces
dando una
secuencia
previamente
establecida.
La cámara no
puede moverse
alrededor de la
escena ni de
manera suave ni
siguiendo un
recorrido
adecuado. No se
pueden mover
las luces de
ninguna de las
maneras
detalladas en las
columnas
anteriores.
Presentación Sobresaliente (9 ó 10) Muy bueno (7 u 8) Aprobado (5 ó 6) Insuficiente (≤ 4)
Portada y título
La portada y el título
se ajustan muy bien a
los contenidos de la
presentación. El título
es sugerente y muy
creativo
La portada y el título
se ajustan bien a los
contenidos de la
presentación. El título
es atractivo
La portada y el título
se ajustan
suficientemente bien a
los contenidos de la
presentación.
La portada y el título no
se ajustan a los
contenidos de la
presentación.
Índice
En el índice aparecen
muy bien reflejados
todos los aspectos del
tema trabajado
En el índice aparecen
bien reflejados todos
los aspectos del tema
trabajado
En el índice aparecen
los aspectos
principales del tema
trabajado
En el índice no aparecen
los aspectos principales
del tema trabajado
Orden
Respetan muy bien el
índice
Respetan bien el
índice
Respetan el índice lo
suficientemente bien
En su mayoría, no
respetan el índice
Información
Se presenta muy
ordenada, es
coherente. Existe gran
relación entre texto e
imagen
Se presenta ordenada
y, en su mayoría, es
coherente. Casi
siempre existe relación
entre texto e imagen
Es suficientemente
ordenada y coherente.
No siempre existe
relación entre texto e
imagen
En muchos casos es
desordenada e
incoherente y no hay
relación entre texto e
imagen
Nivel lingüístico
Es muy apropiado para
explicar a los
compañeros
La mayoría de las
veces es apropiado
para explicar a los
compañeros
Algunas veces es
apropiado para
explicar a los
compañeros
La mayoría de las veces
es inapropiado para ser
entendido por los
compañeros
Texto
Resume muy
claramente la
información esencial
Resume bien la
información esencial
Resume
suficientemente bien
la información esencial
No resume la información
esencial
Otros recursos
En la presentación
aparecen imágenes,
direcciones de
Internet y multimedios
relacionados con el
tema
En la mayoría de la
presentación aparecen
imágenes, direcciones
de Internet y
multimedios
relacionados con el
tema
En parte de la
presentación aparecen
imágenes, direcciones
de Internet y
multimedios
relacionados con el
tema
Presentación pobre en
imágenes, direcciones de
Internet y multimedios. Si
aparecen no tienen que
ver con el tema o están
muy poco relacionadas
con éste
Ortografía
No hay errores
ortográficos
La ortografía es buena.
Falta algún acento.
La ortografía es
suficiente, pero hay
más de dos faltas de
ortografía
Hay faltas de ortografía
importantes
Exposición oral Excelente (9 ó 10) Bueno (6, 7 u 8) Insuficiente (<6)
Domina el tema que
expone
Expresa con claridad y
fluidez las ideas y
detalles del tema
Ocasionalmente
expresa con claridad
las ideas y detalles del
tema
No muestra claridad y
consistencia en sus
ideas
Contenido
Expone el contenido
concreto, sin salirse del
tema
Expone el contenido
concreto y en
ocasiones se sale del
tema
La exposición carece
de contenido concreto
Material de apoyo
Presenta material de
apoyo extra para
hacerse entender
mejor. Este material es
de buena calidad,
adecuado a su
proyecto y hace uso de
éste
Presenta muy poco
material de apoyo. El
material es de poca
calidad, no demasiado
adecuado a su
proyecto o no lo usa
No presenta material
de apoyo o lo que
presenta es
inadecuado, de mala
calidad o no lo usa
Opinión personal
Da a conocer su
opinión personal con
respecto al tema
Da a conocer su
opinión personal en
forma poco clara
No da a conocer su
opinión personal
Dominio de la exposición
La exposición es
ordenada y el grupo se
coordinó para exponer.
Todo el grupo participó
por igual
El grupo no mostró
mucha coordinación al
exponer. La exposición
del grupo no fue
totalmente balanceada
El grupo no mostró
coordinación al
exponer. La exposición
del grupo no fue
balanceada
Seguridad en la
exposición del trabajo
Actúa con seguridad en
la exposición y
presentación del
trabajo
No siempre actúa con
seguridad en la
exposición del trabajo
Durante la puesta en
común no expone con
seguridad su trabajo
Vocabulario
Es capaz de utilizar un
vocabulario amplio y
preciso
Utiliza un vocabulario
limitado y no
demasiado preciso
Utiliza un vocabulario
limitado, repitiendo
muchas palabras. Éste
no es preciso
Tono de voz
Habla fuerte y claro. Se
le escucha bien
Habla claro pero no
siempre se le escucha
bien
Habla con muy poca
claridad
Postura
Su postura es natural
mirando al curso en
todo momento. No le
da la espalda.
Su postura es natural y
mira al curso, pero
tiende a apoyarse en
algún lugar y a no
moverse naturalmente
En ocasiones da la
espalda al curso.
No se dirige al curso al
exponer, tiende a
apoyarse en algún
lugar, a no moverse
naturalmente y/o da la
espalda al curso.
