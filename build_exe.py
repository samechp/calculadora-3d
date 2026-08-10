import os
import shutil
import subprocess

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

print("Moviendo exe a raiz...")
if os.path.exists("dist/Calculadora3D.exe"):
    if os.path.exists("Calculadora3D.exe"):
        os.remove("Calculadora3D.exe")
    shutil.move("dist/Calculadora3D.exe", "Calculadora3D.exe")

print("Listo!")
