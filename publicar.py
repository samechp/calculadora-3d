# -*- coding: utf-8 -*-
"""Publica una versión nueva en GitHub.

Uso típico:
    python publicar.py --web  -m "arreglado el buscador de piezas"
    python publicar.py --app  -m "la ventana ahora recuerda su tamaño"
    python publicar.py --todo -m "cambios grandes"

    --web   cambiaste html/css/js  -> a la gente le llega solo, al reiniciar la app
    --app   cambiaste Python       -> a la gente le sale el aviso con el botón
    --todo  cambiaste las dos cosas

Otras opciones:
    --version-app 2.0.0   pone una versión exacta en vez de subir el último número
    --version-web 2.0.0
    --sin-build           no vuelve a compilar el .exe (solo publica archivos)
"""
import argparse
import json
import mimetypes
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request

RAIZ = os.path.dirname(os.path.abspath(__file__))
REPO = 'samechp/calculadora-3d'
CLON = os.path.join(RAIZ, '.publish')
DESKTOP_PY = os.path.join(RAIZ, 'scripts', 'calculadora_desktop.py')

# Archivos de interfaz que la app se descarga sola. Si algún día agregas otro
# .js o .css, añádelo aquí o los usuarios no lo recibirán.
ARCHIVOS_WEB = [
    'index.html',
    'style.css',
    'bootstrap-icons.css',
    'bootstrap-icons.woff2',
    'app.js',
    'ayuda.js',
    'actualizacion.js',
    'exports.js',
    'filamentos_logic.js',
]

# Lo que se sube al repo además de la interfaz (el código fuente)
ARCHIVOS_FUENTE = [
    ('scripts/calculadora_desktop.py', 'scripts/calculadora_desktop.py'),
    ('scripts/icono.ico', 'scripts/icono.ico'),
    ('build_exe.py', 'build_exe.py'),
    ('Calculadora3D.spec', 'Calculadora3D.spec'),
    ('publicar.py', 'publicar.py'),
]


def paso(texto):
    print('\n=== {} ==='.format(texto))


def correr(cmd, cwd=None, silencioso=False):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    if r.returncode != 0 and not silencioso:
        print(r.stdout)
        print(r.stderr)
        raise SystemExit('Falló: {}'.format(' '.join(cmd)))
    return r


def token_github():
    """Reusa el token que git ya tiene guardado en Windows. No se escribe en
    ningún archivo: solo vive mientras corre este script."""
    r = subprocess.run(['git', 'credential', 'fill'],
                       input='protocol=https\nhost=github.com\n\n',
                       capture_output=True, text=True)
    for linea in r.stdout.splitlines():
        if linea.startswith('password='):
            return linea.split('=', 1)[1].strip()
    raise SystemExit('No se encontró el token de GitHub. Abre GitHub Desktop o haz un git push '
                     'manual una vez para que Windows guarde las credenciales.')


def leer_versiones():
    txt = open(DESKTOP_PY, encoding='utf-8').read()
    app = re.search(r"^APP_VERSION\s*=\s*'([^']+)'", txt, re.M).group(1)
    web = re.search(r"^WEB_VERSION\s*=\s*'([^']+)'", txt, re.M).group(1)
    return app, web


def subir_ultimo_numero(v):
    partes = [int(p) for p in v.split('.')]
    partes[-1] += 1
    return '.'.join(str(p) for p in partes)


def escribir_versiones(app, web):
    txt = open(DESKTOP_PY, encoding='utf-8').read()
    txt = re.sub(r"^APP_VERSION\s*=\s*'[^']+'", "APP_VERSION = '{}'".format(app), txt, count=1, flags=re.M)
    txt = re.sub(r"^WEB_VERSION\s*=\s*'[^']+'", "WEB_VERSION = '{}'".format(web), txt, count=1, flags=re.M)
    open(DESKTOP_PY, 'w', encoding='utf-8').write(txt)


def preparar_clon():
    if not os.path.isdir(os.path.join(CLON, '.git')):
        paso('Clonando el repo de publicación')
        shutil.rmtree(CLON, ignore_errors=True)
        correr(['git', 'clone', 'https://github.com/{}.git'.format(REPO), CLON], silencioso=True)
        if not os.path.isdir(os.path.join(CLON, '.git')):
            os.makedirs(CLON, exist_ok=True)
            correr(['git', 'init'], cwd=CLON)
            correr(['git', 'remote', 'add', 'origin', 'https://github.com/{}.git'.format(REPO)], cwd=CLON)
        correr(['git', 'config', 'user.name', 'Calculadora3D'], cwd=CLON)
        correr(['git', 'config', 'user.email', 'samechp@users.noreply.github.com'], cwd=CLON)
    else:
        correr(['git', 'fetch', 'origin'], cwd=CLON, silencioso=True)
        correr(['git', 'reset', '--hard', 'origin/main'], cwd=CLON, silencioso=True)


def copiar(origen_rel, destino_rel):
    origen = os.path.join(RAIZ, origen_rel)
    destino = os.path.join(CLON, destino_rel)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    shutil.copy2(origen, destino)


def sincronizar_archivos(app, web, notas):
    paso('Copiando archivos al repo')
    for nombre in ARCHIVOS_WEB:
        copiar(os.path.join('web_app', nombre), os.path.join('web_app', nombre))
    for origen, destino in ARCHIVOS_FUENTE:
        copiar(origen, destino)

    version = {
        'app_version': app,
        'web_version': web,
        'web_files': ARCHIVOS_WEB,
        'notas': notas,
    }
    with open(os.path.join(CLON, 'version.json'), 'w', encoding='utf-8') as f:
        json.dump(version, f, ensure_ascii=False, indent=2)

    for nombre in ('README.md', '.gitignore', '.gitattributes'):
        origen = os.path.join(RAIZ, 'plantillas_repo', nombre)
        if os.path.exists(origen):
            shutil.copy2(origen, os.path.join(CLON, nombre))


def publicar_git(app, web, notas):
    paso('Subiendo a GitHub')
    correr(['git', 'add', '-A'], cwd=CLON)
    estado = correr(['git', 'status', '--porcelain'], cwd=CLON)
    if not estado.stdout.strip():
        print('No hay cambios que subir.')
        return False
    mensaje = 'v{} (interfaz {}) - {}'.format(app, web, notas) if notas else 'v{} (interfaz {})'.format(app, web)
    correr(['git', 'commit', '-m', mensaje], cwd=CLON)
    correr(['git', 'branch', '-M', 'main'], cwd=CLON, silencioso=True)
    correr(['git', 'push', '-u', 'origin', 'main'], cwd=CLON)
    print('Subido.')
    return True


def api_github(url, token, datos=None, metodo=None):
    cuerpo = json.dumps(datos).encode('utf-8') if datos is not None else None
    req = urllib.request.Request(url, data=cuerpo, method=metodo)
    req.add_header('Authorization', 'Bearer ' + token)
    req.add_header('Accept', 'application/vnd.github+json')
    req.add_header('User-Agent', 'publicar-calculadora3d')
    if cuerpo:
        req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req, timeout=60) as r:
        cuerpo_resp = r.read()
    # Borrar un asset responde 204 sin contenido
    return json.loads(cuerpo_resp.decode('utf-8')) if cuerpo_resp else {}


def crear_release(app, notas, token):
    paso('Creando la descarga (Release v{})'.format(app))
    exe = os.path.join(RAIZ, 'Calculadora3D.exe')
    if not os.path.exists(exe):
        raise SystemExit('No existe Calculadora3D.exe. Corre sin --sin-build.')

    tag = 'v' + app
    try:
        existente = api_github('https://api.github.com/repos/{}/releases/tags/{}'.format(REPO, tag), token)
        print('Ya existía el release {}, se reemplaza el archivo.'.format(tag))
        rel = existente
        for asset in rel.get('assets', []):
            api_github('https://api.github.com/repos/{}/releases/assets/{}'.format(REPO, asset['id']),
                       token, metodo='DELETE')
    except urllib.error.HTTPError as e:
        if e.code != 404:
            raise
        rel = api_github('https://api.github.com/repos/{}/releases'.format(REPO), token, {
            'tag_name': tag,
            'target_commitish': 'main',
            'name': 'Calculadora 3D ' + tag,
            'body': (notas or 'Nueva versión.') + '\n\nDescarga `Calculadora3D.exe` y ábrelo. '
                    'Las próximas actualizaciones te llegarán solas.',
            'draft': False,
            'prerelease': False,
        })

    print('Subiendo el ejecutable ({:.1f} MB)...'.format(os.path.getsize(exe) / 1048576))
    with open(exe, 'rb') as f:
        datos = f.read()
    url = rel['upload_url'].split('{')[0] + '?name=Calculadora3D.exe'
    req = urllib.request.Request(url, data=datos, method='POST')
    req.add_header('Authorization', 'Bearer ' + token)
    req.add_header('Content-Type', 'application/octet-stream')
    req.add_header('User-Agent', 'publicar-calculadora3d')
    with urllib.request.urlopen(req, timeout=600) as r:
        json.loads(r.read().decode('utf-8'))
    print('Descarga publicada: https://github.com/{}/releases/latest'.format(REPO))


def main():
    p = argparse.ArgumentParser(description='Publica una versión nueva en GitHub')
    p.add_argument('--web', action='store_true', help='cambió la interfaz (html/css/js)')
    p.add_argument('--app', action='store_true', help='cambió la parte en Python')
    p.add_argument('--todo', action='store_true', help='cambiaron las dos')
    p.add_argument('--version-app', default=None)
    p.add_argument('--version-web', default=None)
    p.add_argument('-m', '--notas', default='', help='qué cambió, en una frase')
    p.add_argument('--sin-build', action='store_true', help='no recompilar el .exe')
    args = p.parse_args()

    sube_web = args.web or args.todo or bool(args.version_web)
    sube_app = args.app or args.todo or bool(args.version_app)
    if not sube_web and not sube_app:
        p.error('Dime qué cambió: --web, --app o --todo')

    app_actual, web_actual = leer_versiones()
    app_nueva = args.version_app or (subir_ultimo_numero(app_actual) if sube_app else app_actual)
    web_nueva = args.version_web or (subir_ultimo_numero(web_actual) if sube_web else web_actual)

    print('Ejecutable: {} -> {}'.format(app_actual, app_nueva))
    print('Interfaz:   {} -> {}'.format(web_actual, web_nueva))

    escribir_versiones(app_nueva, web_nueva)

    if not args.sin_build:
        paso('Compilando el ejecutable')
        r = subprocess.run([sys.executable, 'build_exe.py'], cwd=RAIZ)
        if r.returncode != 0:
            raise SystemExit('Falló la compilación.')

    preparar_clon()
    sincronizar_archivos(app_nueva, web_nueva, args.notas)
    publicar_git(app_nueva, web_nueva, args.notas)

    if sube_app:
        crear_release(app_nueva, args.notas, token_github())
    else:
        print('\nSolo cambió la interfaz: no hace falta un .exe nuevo. '
              'A quien ya la tenga le llegará sola al reiniciar la app.')

    print('\nListo. https://github.com/{}'.format(REPO))


if __name__ == '__main__':
    main()
