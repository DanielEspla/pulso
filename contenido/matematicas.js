window.MISSIO_CONTENIDO=window.MISSIO_CONTENIDO||{};
window.MISSIO_CONTENIDO.matematicas={
  "id": "matematicas",
  "nombre": "Matemáticas",
  "icono": "🔢",
  "descripcion": "Divisibilidad y números enteros. Contenido de 2.º ESO según el currículo; pendiente de ordenar según el libro del alumno.",
  "idioma": "es",
  "temas": {
    "mat_divisibilidad": {
      "id": "mat_divisibilidad",
      "titulo": "Divisibilidad",
      "microlecciones": [
        {
          "id": "mat_div_multiplos",
          "asignatura": "Matemáticas",
          "unidad": "Divisibilidad",
          "titulo": "Múltiplos y divisores",
          "objetivo": "¿Cuál de estos números es divisor de 36?",
          "explicacion": "Un número es múltiplo de otro si se obtiene multiplicándolo por un número natural. Un número es divisor de otro si la división entre ellos es exacta, con resto 0. Son dos caras de la misma relación.",
          "ejemplo": "24 = 6 · 4. Por eso 24 es múltiplo de 6, y 6 es divisor de 24.",
          "preguntas": [
            {
              "id": "mat_div_multiplos_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál de estos números es divisor de 36?",
              "opciones": [
                {
                  "id": "mat_div_multiplos_p1_c",
                  "texto": "72"
                },
                {
                  "id": "mat_div_multiplos_p1_a",
                  "texto": "9"
                },
                {
                  "id": "mat_div_multiplos_p1_b",
                  "texto": "8"
                }
              ],
              "correcta": "mat_div_multiplos_p1_a",
              "pista": "Divide 36 entre cada número y mira cuál da exacto, sin decimales.",
              "explicacion": "36 : 9 = 4, exacto: 9 es divisor de 36. 36 : 8 = 4,5 no es exacto. Y 72 es múltiplo de 36, no divisor: es más grande."
            },
            {
              "id": "mat_div_multiplos_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál de estos números es múltiplo de 7?",
              "opciones": [
                {
                  "id": "mat_div_multiplos_p2_a",
                  "texto": "63"
                },
                {
                  "id": "mat_div_multiplos_p2_c",
                  "texto": "17"
                },
                {
                  "id": "mat_div_multiplos_p2_b",
                  "texto": "47"
                }
              ],
              "correcta": "mat_div_multiplos_p2_a",
              "pista": "Repasa la tabla del 7.",
              "explicacion": "63 = 7 · 9, así que es múltiplo de 7. 47 y 17 no aparecen en la tabla del 7, aunque 17 contenga un 7."
            }
          ],
          "presentacion": {
            "fase": "Comprende",
            "emoji": "24 = 6 · 4"
          }
        },
        {
          "id": "mat_div_criterios",
          "asignatura": "Matemáticas",
          "unidad": "Divisibilidad",
          "titulo": "Criterios de divisibilidad",
          "objetivo": "¿Cuál de estos números es divisible por 3?",
          "explicacion": "Un número es divisible por 2 si acaba en cifra par; por 3, si la suma de sus cifras es múltiplo de 3; por 5, si acaba en 0 o en 5; y por 10, si acaba en 0.",
          "ejemplo": "471: 4 + 7 + 1 = 12, y 12 es múltiplo de 3. Por tanto, 471 es divisible por 3.",
          "preguntas": [
            {
              "id": "mat_div_criterios_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál de estos números es divisible por 3?",
              "opciones": [
                {
                  "id": "mat_div_criterios_p1_a",
                  "texto": "522"
                },
                {
                  "id": "mat_div_criterios_p1_b",
                  "texto": "413"
                },
                {
                  "id": "mat_div_criterios_p1_c",
                  "texto": "352"
                }
              ],
              "correcta": "mat_div_criterios_p1_a",
              "pista": "No mires la última cifra: suma todas las cifras.",
              "explicacion": "5 + 2 + 2 = 9, múltiplo de 3, así que 522 es divisible por 3. En 413 la suma es 8, aunque acabe en 3. En 352 la suma es 10."
            },
            {
              "id": "mat_div_criterios_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál de estos números es divisible por 2 y por 5 a la vez?",
              "opciones": [
                {
                  "id": "mat_div_criterios_p2_a",
                  "texto": "730"
                },
                {
                  "id": "mat_div_criterios_p2_b",
                  "texto": "735"
                },
                {
                  "id": "mat_div_criterios_p2_c",
                  "texto": "572"
                }
              ],
              "correcta": "mat_div_criterios_p2_a",
              "pista": "Tiene que ser par y acabar en 0 o 5 al mismo tiempo.",
              "explicacion": "730 acaba en 0: es par y divisible por 5. 735 es divisible por 5 pero es impar. 572 es par pero no acaba en 0 ni en 5."
            }
          ],
          "presentacion": {
            "fase": "Aplica",
            "emoji": "2 · 3 · 5 · 10"
          }
        },
        {
          "id": "mat_div_primos",
          "asignatura": "Matemáticas",
          "unidad": "Divisibilidad",
          "titulo": "Números primos y compuestos",
          "objetivo": "¿Cuál de estos números es primo?",
          "explicacion": "Un número primo tiene exactamente dos divisores: el 1 y él mismo. Un número compuesto tiene más de dos divisores. El 1 no es primo ni compuesto, porque solo tiene un divisor.",
          "ejemplo": "13 es primo: solo se divide entre 1 y 13. 15 es compuesto: 15 = 3 · 5.",
          "preguntas": [
            {
              "id": "mat_div_primos_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál de estos números es primo?",
              "opciones": [
                {
                  "id": "mat_div_primos_p1_c",
                  "texto": "1"
                },
                {
                  "id": "mat_div_primos_p1_b",
                  "texto": "27"
                },
                {
                  "id": "mat_div_primos_p1_a",
                  "texto": "29"
                }
              ],
              "correcta": "mat_div_primos_p1_a",
              "pista": "Prueba a dividir entre 2, 3 y 5. Y recuerda qué pasa con el 1.",
              "explicacion": "29 solo es divisible entre 1 y 29: es primo. 27 = 3 · 9 es compuesto. El 1 no es primo porque solo tiene un divisor."
            },
            {
              "id": "mat_div_primos_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Por qué 51 no es un número primo?",
              "opciones": [
                {
                  "id": "mat_div_primos_p2_b",
                  "texto": "Porque es impar"
                },
                {
                  "id": "mat_div_primos_p2_c",
                  "texto": "Porque acaba en 1"
                },
                {
                  "id": "mat_div_primos_p2_a",
                  "texto": "Porque 51 = 3 · 17"
                }
              ],
              "correcta": "mat_div_primos_p2_a",
              "pista": "Suma sus cifras y aplica el criterio del 3.",
              "explicacion": "5 + 1 = 6, así que 51 es divisible por 3: 51 = 3 · 17. Ser impar o acabar en 1 no dice nada: 7, 11 y 31 son impares y primos."
            }
          ],
          "presentacion": {
            "fase": "Distingue",
            "emoji": "2 · 3 · 5 · 7"
          }
        },
        {
          "id": "mat_div_factorizar",
          "asignatura": "Matemáticas",
          "unidad": "Divisibilidad",
          "titulo": "Descomposición en factores primos",
          "objetivo": "¿Cuál es la descomposición en factores primos de 72?",
          "explicacion": "Descomponer un número es escribirlo como producto de números primos. Se divide entre el primo más pequeño posible y se repite con el cociente hasta llegar a 1. Los factores repetidos se escriben como potencia.",
          "ejemplo": "60 : 2 = 30; 30 : 2 = 15; 15 : 3 = 5; 5 : 5 = 1. Resultado: 60 = 2² · 3 · 5.",
          "preguntas": [
            {
              "id": "mat_div_factorizar_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál es la descomposición en factores primos de 72?",
              "opciones": [
                {
                  "id": "mat_div_factorizar_p1_b",
                  "texto": "2² · 3³"
                },
                {
                  "id": "mat_div_factorizar_p1_a",
                  "texto": "2³ · 3²"
                },
                {
                  "id": "mat_div_factorizar_p1_c",
                  "texto": "8 · 9"
                }
              ],
              "correcta": "mat_div_factorizar_p1_a",
              "pista": "Divide 72 entre 2 todas las veces que puedas y luego entre 3.",
              "explicacion": "72 : 2 = 36; : 2 = 18; : 2 = 9; : 3 = 3; : 3 = 1. Son tres doses y dos treses: 2³ · 3². 8 · 9 da 72, pero 8 y 9 no son primos. 2² · 3³ da 108."
            },
            {
              "id": "mat_div_factorizar_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Qué número es 2² · 3 · 5?",
              "opciones": [
                {
                  "id": "mat_div_factorizar_p2_c",
                  "texto": "120"
                },
                {
                  "id": "mat_div_factorizar_p2_a",
                  "texto": "60"
                },
                {
                  "id": "mat_div_factorizar_p2_b",
                  "texto": "30"
                }
              ],
              "correcta": "mat_div_factorizar_p2_a",
              "pista": "Calcula primero la potencia: 2² = 4.",
              "explicacion": "2² · 3 · 5 = 4 · 3 · 5 = 60. Si te sale 30, has usado 2 en lugar de 2²."
            }
          ],
          "presentacion": {
            "fase": "Practica",
            "emoji": "60 = 2² · 3 · 5"
          }
        },
        {
          "id": "mat_div_mcd",
          "asignatura": "Matemáticas",
          "unidad": "Divisibilidad",
          "titulo": "Máximo común divisor",
          "objetivo": "¿Cuál es el m.c.d. de 24 y 36?",
          "explicacion": "El m.c.d. de varios números es el mayor número que los divide a todos. Se calcula descomponiendo y multiplicando solo los factores comunes, cada uno con el menor exponente. Sirve para repartir en partes iguales lo más grandes posible.",
          "ejemplo": "12 = 2² · 3 y 18 = 2 · 3². Comunes con menor exponente: 2 · 3 = 6. m.c.d.(12, 18) = 6.",
          "preguntas": [
            {
              "id": "mat_div_mcd_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál es el m.c.d. de 24 y 36?",
              "opciones": [
                {
                  "id": "mat_div_mcd_p1_c",
                  "texto": "72"
                },
                {
                  "id": "mat_div_mcd_p1_b",
                  "texto": "6"
                },
                {
                  "id": "mat_div_mcd_p1_a",
                  "texto": "12"
                }
              ],
              "correcta": "mat_div_mcd_p1_a",
              "pista": "24 = 2³ · 3 y 36 = 2² · 3². Coge los comunes con el exponente más pequeño.",
              "explicacion": "Comunes: 2 y 3. Menor exponente: 2² y 3. m.c.d. = 4 · 3 = 12. El 6 también divide a los dos, pero no es el mayor. 72 es el m.c.m."
            },
            {
              "id": "mat_div_mcd_p2",
              "tipo": "opcion_multiple",
              "enunciado": "Tienes 20 caramelos de fresa y 30 de limón. Quieres hacer bolsas iguales, sin mezclar sabores y lo más grandes posible. ¿Cuántos caramelos irán en cada bolsa?",
              "opciones": [
                {
                  "id": "mat_div_mcd_p2_a",
                  "texto": "10"
                },
                {
                  "id": "mat_div_mcd_p2_b",
                  "texto": "5"
                },
                {
                  "id": "mat_div_mcd_p2_c",
                  "texto": "60"
                }
              ],
              "correcta": "mat_div_mcd_p2_a",
              "pista": "Repartir en partes iguales lo más grandes posible es un problema de m.c.d.",
              "explicacion": "m.c.d.(20, 30) = 10: dos bolsas de fresa y tres de limón. Con 5 también se puede repartir, pero las bolsas no serían las más grandes. 60 es el m.c.m."
            }
          ],
          "presentacion": {
            "fase": "Resuelve",
            "emoji": "m.c.d."
          }
        },
        {
          "id": "mat_div_mcm",
          "asignatura": "Matemáticas",
          "unidad": "Divisibilidad",
          "titulo": "Mínimo común múltiplo",
          "objetivo": "¿Cuál es el m.c.m. de 4 y 6?",
          "explicacion": "El m.c.m. de varios números es el menor múltiplo común a todos, sin contar el 0. Se calcula multiplicando los factores comunes y no comunes, cada uno con el mayor exponente. Sirve para saber cuándo vuelven a coincidir dos cosas que se repiten.",
          "ejemplo": "12 = 2² · 3 y 18 = 2 · 3². Todos con mayor exponente: 2² · 3² = 36. m.c.m.(12, 18) = 36.",
          "preguntas": [
            {
              "id": "mat_div_mcm_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál es el m.c.m. de 4 y 6?",
              "opciones": [
                {
                  "id": "mat_div_mcm_p1_b",
                  "texto": "24"
                },
                {
                  "id": "mat_div_mcm_p1_a",
                  "texto": "12"
                },
                {
                  "id": "mat_div_mcm_p1_c",
                  "texto": "2"
                }
              ],
              "correcta": "mat_div_mcm_p1_a",
              "pista": "Escribe los múltiplos de 6 y busca el primero que también sea múltiplo de 4.",
              "explicacion": "Múltiplos de 6: 6, 12... y 12 ya es múltiplo de 4. 24 es común, pero no el menor. 2 es el m.c.d."
            },
            {
              "id": "mat_div_mcm_p2",
              "tipo": "opcion_multiple",
              "enunciado": "Un autobús sale cada 10 minutos y otro cada 15. Si salen juntos a las 8:00, ¿a qué hora vuelven a coincidir?",
              "opciones": [
                {
                  "id": "mat_div_mcm_p2_c",
                  "texto": "A las 10:30"
                },
                {
                  "id": "mat_div_mcm_p2_a",
                  "texto": "A las 8:30"
                },
                {
                  "id": "mat_div_mcm_p2_b",
                  "texto": "A las 8:25"
                }
              ],
              "correcta": "mat_div_mcm_p2_a",
              "pista": "¿Cuándo se repiten a la vez? Busca el m.c.m. de 10 y 15.",
              "explicacion": "m.c.m.(10, 15) = 30 minutos, así que coinciden a las 8:30. Sumar 10 + 15 no sirve. Multiplicar 10 · 15 = 150 minutos da una coincidencia, pero no la primera."
            }
          ],
          "presentacion": {
            "fase": "Resuelve",
            "emoji": "m.c.m."
          }
        }
      ]
    },
    "mat_enteros": {
      "id": "mat_enteros",
      "titulo": "Números enteros",
      "microlecciones": [
        {
          "id": "mat_ent_concepto",
          "asignatura": "Matemáticas",
          "unidad": "Números enteros",
          "titulo": "Qué son los números enteros",
          "objetivo": "Un buceador está a 15 metros por debajo del nivel del mar. ¿Qué número lo representa?",
          "explicacion": "Los números enteros son los positivos, los negativos y el cero. Los negativos sirven para expresar cantidades por debajo de una referencia: temperaturas bajo cero, plantas de sótano, profundidad bajo el mar o deudas.",
          "ejemplo": "3 grados bajo cero se escribe −3. La segunda planta del sótano es −2.",
          "preguntas": [
            {
              "id": "mat_ent_concepto_p1",
              "tipo": "opcion_multiple",
              "enunciado": "Un buceador está a 15 metros por debajo del nivel del mar. ¿Qué número lo representa?",
              "opciones": [
                {
                  "id": "mat_ent_concepto_p1_c",
                  "texto": "0"
                },
                {
                  "id": "mat_ent_concepto_p1_b",
                  "texto": "+15"
                },
                {
                  "id": "mat_ent_concepto_p1_a",
                  "texto": "−15"
                }
              ],
              "correcta": "mat_ent_concepto_p1_a",
              "pista": "El nivel del mar es el 0. Por debajo, números negativos.",
              "explicacion": "Por debajo del nivel del mar se usan negativos: −15. +15 sería 15 metros por encima, por ejemplo en lo alto de un acantilado."
            },
            {
              "id": "mat_ent_concepto_p2",
              "tipo": "opcion_multiple",
              "enunciado": "A las 7:00 había −4 °C y hasta las 13:00 la temperatura subió 9 grados. ¿Qué temperatura había a las 13:00?",
              "opciones": [
                {
                  "id": "mat_ent_concepto_p2_c",
                  "texto": "13 °C"
                },
                {
                  "id": "mat_ent_concepto_p2_b",
                  "texto": "−13 °C"
                },
                {
                  "id": "mat_ent_concepto_p2_a",
                  "texto": "5 °C"
                }
              ],
              "correcta": "mat_ent_concepto_p2_a",
              "pista": "Sitúate en −4 en la recta y avanza 9 pasos hacia la derecha.",
              "explicacion": "−4 + 9 = 5. Subiendo 4 grados llegas a 0 y te quedan 5 más. −13 sería bajar 9 grados, y 13 sale de ignorar el signo menos."
            }
          ],
          "presentacion": {
            "fase": "Comprende",
            "emoji": "🌡️ −3 · 0 · +5"
          }
        },
        {
          "id": "mat_ent_orden",
          "asignatura": "Matemáticas",
          "unidad": "Números enteros",
          "titulo": "Ordenar números enteros",
          "objetivo": "¿Cuál es el mayor de estos números?",
          "explicacion": "En la recta numérica, un número es mayor cuanto más a la derecha está. Cualquier positivo es mayor que cualquier negativo. Entre dos negativos, es mayor el que está más cerca del cero.",
          "ejemplo": "−2 > −7, porque −2 está más a la derecha. Hace menos frío a −2 °C que a −7 °C.",
          "preguntas": [
            {
              "id": "mat_ent_orden_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál es el mayor de estos números?",
              "opciones": [
                {
                  "id": "mat_ent_orden_p1_b",
                  "texto": "−8"
                },
                {
                  "id": "mat_ent_orden_p1_c",
                  "texto": "−10"
                },
                {
                  "id": "mat_ent_orden_p1_a",
                  "texto": "−3"
                }
              ],
              "correcta": "mat_ent_orden_p1_a",
              "pista": "Piensa en temperaturas: ¿con cuál hace menos frío?",
              "explicacion": "−3 es el más cercano a cero, así que es el mayor. Con negativos, el que tiene la cifra más grande es el más pequeño: −10 es el menor."
            },
            {
              "id": "mat_ent_orden_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál de estas ordenaciones, de menor a mayor, es correcta?",
              "opciones": [
                {
                  "id": "mat_ent_orden_p2_a",
                  "texto": "−6 < −1 < 0 < 4"
                },
                {
                  "id": "mat_ent_orden_p2_b",
                  "texto": "−1 < −6 < 0 < 4"
                },
                {
                  "id": "mat_ent_orden_p2_c",
                  "texto": "0 < −1 < 4 < −6"
                }
              ],
              "correcta": "mat_ent_orden_p2_a",
              "pista": "Empieza por el negativo más alejado del cero.",
              "explicacion": "El menor es −6, el más a la izquierda. Le siguen −1, 0 y 4. Poner −1 antes que −6 es tratar los negativos como si fueran positivos."
            }
          ],
          "presentacion": {
            "fase": "Ordena",
            "emoji": "−7 < −2 < 0 < 3"
          }
        },
        {
          "id": "mat_ent_absoluto",
          "asignatura": "Matemáticas",
          "unidad": "Números enteros",
          "titulo": "Valor absoluto y opuesto",
          "objetivo": "¿Cuánto vale |−12|?",
          "explicacion": "El valor absoluto de un número es su distancia al cero, y siempre es positivo o cero. Se escribe entre barras. El opuesto de un número es el que está a la misma distancia del cero, pero al otro lado.",
          "ejemplo": "|−5| = 5 y |5| = 5. El opuesto de 5 es −5, y el opuesto de −5 es 5.",
          "preguntas": [
            {
              "id": "mat_ent_absoluto_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto vale |−12|?",
              "opciones": [
                {
                  "id": "mat_ent_absoluto_p1_a",
                  "texto": "12"
                },
                {
                  "id": "mat_ent_absoluto_p1_b",
                  "texto": "−12"
                },
                {
                  "id": "mat_ent_absoluto_p1_c",
                  "texto": "0"
                }
              ],
              "correcta": "mat_ent_absoluto_p1_a",
              "pista": "¿A cuántos pasos del cero está el −12?",
              "explicacion": "El valor absoluto es una distancia, y una distancia nunca es negativa: |−12| = 12."
            },
            {
              "id": "mat_ent_absoluto_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuál es el opuesto de −9?",
              "opciones": [
                {
                  "id": "mat_ent_absoluto_p2_a",
                  "texto": "9"
                },
                {
                  "id": "mat_ent_absoluto_p2_b",
                  "texto": "−9"
                },
                {
                  "id": "mat_ent_absoluto_p2_c",
                  "texto": "−1/9"
                }
              ],
              "correcta": "mat_ent_absoluto_p2_a",
              "pista": "El opuesto está al otro lado del cero, a la misma distancia.",
              "explicacion": "El opuesto de −9 es 9: solo cambia el signo. −1/9 es el inverso, que es otra cosa."
            }
          ],
          "presentacion": {
            "fase": "Distingue",
            "emoji": "|−5| = 5"
          }
        },
        {
          "id": "mat_ent_suma",
          "asignatura": "Matemáticas",
          "unidad": "Números enteros",
          "titulo": "Sumar números enteros",
          "objetivo": "¿Cuánto es −8 + 5?",
          "explicacion": "Si los dos números tienen el mismo signo, se suman sus valores absolutos y se deja ese signo. Si tienen distinto signo, se resta el pequeño del grande, en valor absoluto, y se pone el signo del que tiene mayor valor absoluto.",
          "ejemplo": "−7 + (−3) = −10, mismo signo. −7 + 3 = −4: 7 − 3 = 4, y gana el signo del 7.",
          "preguntas": [
            {
              "id": "mat_ent_suma_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es −8 + 5?",
              "opciones": [
                {
                  "id": "mat_ent_suma_p1_b",
                  "texto": "3"
                },
                {
                  "id": "mat_ent_suma_p1_c",
                  "texto": "−13"
                },
                {
                  "id": "mat_ent_suma_p1_a",
                  "texto": "−3"
                }
              ],
              "correcta": "mat_ent_suma_p1_a",
              "pista": "Distinto signo: resta 8 − 5 y piensa quién gana.",
              "explicacion": "8 − 5 = 3 y gana el signo del 8, que es negativo: −3. Si debes 8 € y pagas 5, aún debes 3."
            },
            {
              "id": "mat_ent_suma_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es −6 + (−4)?",
              "opciones": [
                {
                  "id": "mat_ent_suma_p2_c",
                  "texto": "10"
                },
                {
                  "id": "mat_ent_suma_p2_b",
                  "texto": "−2"
                },
                {
                  "id": "mat_ent_suma_p2_a",
                  "texto": "−10"
                }
              ],
              "correcta": "mat_ent_suma_p2_a",
              "pista": "Mismo signo: se suman y se queda el signo.",
              "explicacion": "Los dos son negativos: 6 + 4 = 10 y se mantiene el menos: −10. Si debes 6 € y pides 4 más, debes 10."
            }
          ],
          "presentacion": {
            "fase": "Practica",
            "emoji": "−7 + 3 = −4"
          }
        },
        {
          "id": "mat_ent_resta",
          "asignatura": "Matemáticas",
          "unidad": "Números enteros",
          "titulo": "Restar números enteros",
          "objetivo": "¿Cuánto es 4 − (−6)?",
          "explicacion": "Restar un número es lo mismo que sumar su opuesto. Así toda resta se convierte en una suma y se aplican las reglas de la suma.",
          "ejemplo": "3 − (−5) = 3 + 5 = 8. Y −2 − 4 = −2 + (−4) = −6.",
          "preguntas": [
            {
              "id": "mat_ent_resta_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es 4 − (−6)?",
              "opciones": [
                {
                  "id": "mat_ent_resta_p1_c",
                  "texto": "2"
                },
                {
                  "id": "mat_ent_resta_p1_a",
                  "texto": "10"
                },
                {
                  "id": "mat_ent_resta_p1_b",
                  "texto": "−2"
                }
              ],
              "correcta": "mat_ent_resta_p1_a",
              "pista": "Cambia la resta por la suma del opuesto de −6.",
              "explicacion": "4 − (−6) = 4 + 6 = 10. Quitar una deuda equivale a ganar dinero."
            },
            {
              "id": "mat_ent_resta_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es −3 − 7?",
              "opciones": [
                {
                  "id": "mat_ent_resta_p2_b",
                  "texto": "4"
                },
                {
                  "id": "mat_ent_resta_p2_a",
                  "texto": "−10"
                },
                {
                  "id": "mat_ent_resta_p2_c",
                  "texto": "−4"
                }
              ],
              "correcta": "mat_ent_resta_p2_a",
              "pista": "Convierte: −3 + (−7).",
              "explicacion": "−3 − 7 = −3 + (−7) = −10. Si estás a −3 °C y la temperatura baja 7 grados, llegas a −10 °C."
            }
          ],
          "presentacion": {
            "fase": "Practica",
            "emoji": "3 − (−5) = 3 + 5"
          }
        },
        {
          "id": "mat_ent_multiplicar",
          "asignatura": "Matemáticas",
          "unidad": "Números enteros",
          "titulo": "Multiplicar y dividir enteros",
          "objetivo": "¿Cuánto es (−6) · (−5)?",
          "explicacion": "Se multiplican o dividen los valores absolutos y el signo sigue la regla de los signos: signos iguales dan positivo y signos distintos dan negativo. Vale igual para la división.",
          "ejemplo": "(−4) · (−3) = 12. (−20) : 5 = −4.",
          "preguntas": [
            {
              "id": "mat_ent_multiplicar_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es (−6) · (−5)?",
              "opciones": [
                {
                  "id": "mat_ent_multiplicar_p1_a",
                  "texto": "30"
                },
                {
                  "id": "mat_ent_multiplicar_p1_b",
                  "texto": "−30"
                },
                {
                  "id": "mat_ent_multiplicar_p1_c",
                  "texto": "−11"
                }
              ],
              "correcta": "mat_ent_multiplicar_p1_a",
              "pista": "Menos por menos...",
              "explicacion": "Signos iguales dan positivo: (−6) · (−5) = 30. −11 sale de sumar en lugar de multiplicar."
            },
            {
              "id": "mat_ent_multiplicar_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es (−36) : 4?",
              "opciones": [
                {
                  "id": "mat_ent_multiplicar_p2_b",
                  "texto": "9"
                },
                {
                  "id": "mat_ent_multiplicar_p2_c",
                  "texto": "−32"
                },
                {
                  "id": "mat_ent_multiplicar_p2_a",
                  "texto": "−9"
                }
              ],
              "correcta": "mat_ent_multiplicar_p2_a",
              "pista": "Signos distintos dan negativo.",
              "explicacion": "36 : 4 = 9, y como los signos son distintos, −9. −32 sale de restar en lugar de dividir."
            }
          ],
          "presentacion": {
            "fase": "Recuerda",
            "emoji": "(−) · (−) = (+)"
          }
        },
        {
          "id": "mat_ent_jerarquia",
          "asignatura": "Matemáticas",
          "unidad": "Números enteros",
          "titulo": "Operaciones combinadas",
          "objetivo": "¿Cuánto es 2 − 3 · (−4)?",
          "explicacion": "Orden de las operaciones: primero los paréntesis, después multiplicaciones y divisiones, y por último sumas y restas, de izquierda a derecha. Un signo menos delante de un paréntesis cambia el signo de todo lo de dentro.",
          "ejemplo": "5 − (3 − 8) = 5 − (−5) = 5 + 5 = 10.",
          "preguntas": [
            {
              "id": "mat_ent_jerarquia_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es 2 − 3 · (−4)?",
              "opciones": [
                {
                  "id": "mat_ent_jerarquia_p1_c",
                  "texto": "−10"
                },
                {
                  "id": "mat_ent_jerarquia_p1_a",
                  "texto": "14"
                },
                {
                  "id": "mat_ent_jerarquia_p1_b",
                  "texto": "4"
                }
              ],
              "correcta": "mat_ent_jerarquia_p1_a",
              "pista": "La multiplicación va antes que la resta.",
              "explicacion": "Primero 3 · (−4) = −12. Después 2 − (−12) = 2 + 12 = 14. Si restas primero 2 − 3, te sale 4, que es el error típico."
            },
            {
              "id": "mat_ent_jerarquia_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es −(4 − 9)?",
              "opciones": [
                {
                  "id": "mat_ent_jerarquia_p2_c",
                  "texto": "−13"
                },
                {
                  "id": "mat_ent_jerarquia_p2_b",
                  "texto": "−5"
                },
                {
                  "id": "mat_ent_jerarquia_p2_a",
                  "texto": "5"
                }
              ],
              "correcta": "mat_ent_jerarquia_p2_a",
              "pista": "Resuelve el paréntesis y luego aplica el signo de fuera.",
              "explicacion": "4 − 9 = −5, y el menos de fuera lo cambia: −(−5) = 5."
            }
          ],
          "presentacion": {
            "fase": "Aplica",
            "emoji": "( ) → · : → + −"
          }
        },
        {
          "id": "mat_ent_potencias",
          "asignatura": "Matemáticas",
          "unidad": "Números enteros",
          "titulo": "Potencias de base negativa",
          "objetivo": "¿Cuánto es (−2)³?",
          "explicacion": "Una potencia de base negativa da positivo si el exponente es par y negativo si es impar. Ojo con los paréntesis: en (−3)² se eleva el −3 entero, pero en −3² solo se eleva el 3 y el menos queda fuera.",
          "ejemplo": "(−2)³ = (−2) · (−2) · (−2) = −8. (−3)² = 9, pero −3² = −9.",
          "preguntas": [
            {
              "id": "mat_ent_potencias_p1",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es (−2)³?",
              "opciones": [
                {
                  "id": "mat_ent_potencias_p1_c",
                  "texto": "−6"
                },
                {
                  "id": "mat_ent_potencias_p1_a",
                  "texto": "−8"
                },
                {
                  "id": "mat_ent_potencias_p1_b",
                  "texto": "8"
                }
              ],
              "correcta": "mat_ent_potencias_p1_a",
              "pista": "El exponente es impar.",
              "explicacion": "(−2) · (−2) = 4 y 4 · (−2) = −8. Exponente impar, resultado negativo. −6 sale de multiplicar la base por el exponente."
            },
            {
              "id": "mat_ent_potencias_p2",
              "tipo": "opcion_multiple",
              "enunciado": "¿Cuánto es (−5)²?",
              "opciones": [
                {
                  "id": "mat_ent_potencias_p2_a",
                  "texto": "25"
                },
                {
                  "id": "mat_ent_potencias_p2_b",
                  "texto": "−25"
                },
                {
                  "id": "mat_ent_potencias_p2_c",
                  "texto": "−10"
                }
              ],
              "correcta": "mat_ent_potencias_p2_a",
              "pista": "Exponente par, y el paréntesis incluye el signo.",
              "explicacion": "(−5) · (−5) = 25: menos por menos da más. −25 sería el resultado de −5², sin paréntesis."
            }
          ],
          "presentacion": {
            "fase": "Atención",
            "emoji": "(−3)² ≠ −3²"
          }
        }
      ]
    }
  }
};

