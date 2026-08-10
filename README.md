# Calculadora 3D

Calculadora de costos y precios para impresión 3D. Aplicación de escritorio para Windows.

Saca el precio real de una pieza teniendo en cuenta filamento, luz, desgaste de la
máquina, tu mano de obra, insumos extra y margen de error — y lo escala a pedidos
grandes (cuántas camas, cuántos rollos, cuánto tiempo y cuánto cobrar).

## Descargar

👉 **[Descargar la última versión](https://github.com/samechp/calculadora-3d/releases/latest)**

Baja el archivo `Calculadora3D.exe` y ábrelo. No hay que instalar nada.

> Windows puede mostrar un aviso de "Windows protegió tu PC" porque el programa no
> está firmado digitalmente. Haz clic en **Más información → Ejecutar de todas formas**.

Ponlo en una carpeta propia (por ejemplo `Documentos\Calculadora 3D`), porque al
lado del programa se guardan tus datos:

| Archivo | Qué guarda |
|---|---|
| `perfiles.json` | Tus perfiles, piezas, proyectos y filamentos |
| `ventana.json` | El tamaño y la posición de la ventana |
| `web_update/` | Actualizaciones de la interfaz descargadas |

## Se actualiza sola

No hay que volver a descargar nada cuando hay cambios:

- **Cambios en la interfaz** (pantallas, campos, textos, arreglos visuales): se
  descargan solos en segundo plano al abrir la app y se aplican la próxima vez que
  la abras. Sale un aviso pequeño abajo a la derecha.
- **Cambios internos** (el programa en sí): aparece una barra arriba con el botón
  **Actualizar ahora**. Al pulsarlo se descarga la versión nueva y la app se
  reinicia sola. Tus datos no se tocan.

Si no hay internet, la app funciona igual: solo se salta la revisión.

### Tú mandas sobre las versiones

En la barra de aviso puedes elegir:

- **Actualizar ahora** — descarga y reinicia.
- **Omitir esta versión** — no se vuelve a avisar de esa versión en concreto (sí de las siguientes).
- **✕** — cerrar; vuelve a avisar la próxima vez que abras.

Y si una versión no te convenció, abajo del todo hay un enlace con el número de
versión (ej. `v1.0.2`). Ahí sale la lista de todas las versiones publicadas y
puedes **instalar cualquier anterior**. Al hacerlo la app se queda fija en esa
versión y deja de actualizarse sola, hasta que pulses **Reactivar
actualizaciones** en esa misma ventana.

Las decisiones se guardan en `actualizaciones.json`, al lado del programa.

## Cómo funciona el cálculo

- **Costo de producción** = material + luz + desgaste + margen de error + insumos + mano de obra.
  Es tu piso: por debajo de ese número, pierdes plata.
- **Total a cobrar** = (costo de impresión × tu margen de ganancia) + mano de obra + insumos, redondeado.

Dentro de la app, cada campo tiene un ícono **ⓘ** que explica qué es y de dónde
sacar el dato.

## Compilar desde el código

Necesitas Python 3.12+ con `pywebview`, `fpdf2`, `openpyxl` y `pyinstaller`:

```bash
python build_exe.py
```

El ejecutable queda en la raíz como `Calculadora3D.exe`.

Para publicar una versión nueva (solo el autor):

```bash
python publicar.py --web -m "qué cambió"    # cambió la interfaz
python publicar.py --app -m "qué cambió"    # cambió la parte en Python
python publicar.py --todo -m "qué cambió"   # cambiaron las dos
```

---

by [samderbrow](https://github.com/samechp)
