import os
import shutil
import subprocess
import time

import stat

def remove_readonly(func, path, excinfo):
    os.chmod(path, stat.S_IWRITE)
    func(path)

print("Copiando web_app a .tmp/app_calculadora...")
src = "web_app"
dst = ".tmp/app_calculadora"

if os.path.exists(dst):
    shutil.rmtree(dst, onerror=remove_readonly)
shutil.copytree(src, dst, ignore=shutil.ignore_patterns('.git'))

print("Construyendo ejecutable con PyInstaller...")
# run pyinstaller
subprocess.run(["pyinstaller", "--clean", "Calculadora3D.spec"], check=True)

def borrar_esperando(ruta, intentos=15):
    """Si la app quedo abierta, Windows no deja borrar el .exe. En vez de fallar
    la compilacion entera, se espera un poco a que cierre."""
    for i in range(intentos):
        try:
            os.remove(ruta)
            return True
        except FileNotFoundError:
            return True
        except PermissionError:
            if i == 0:
                print("  El .exe esta en uso (la app abierta?). Esperando a que se libere...")
            time.sleep(1)
    raise SystemExit(
        "No se pudo reemplazar {}: sigue en uso.\n"
        "Cierra la Calculadora 3D (o miralo con: tasklist | findstr Calculadora3D) "
        "y vuelve a intentarlo.".format(ruta))


print("Moviendo exe a raiz...")
if os.path.exists("dist/Calculadora3D.exe"):
    if os.path.exists("Calculadora3D.exe"):
        borrar_esperando("Calculadora3D.exe")
    shutil.move("dist/Calculadora3D.exe", "Calculadora3D.exe")

print("Listo!")
