# 🛠️ Troubleshooting & Setup Guide: OmniBrain + OpenClaw (Termux)

Esta guía documenta los desafíos técnicos encontrados durante la configuración del **OmniBrain-API Proxy** y su integración con el dashboard de **OpenClaw** en dispositivos Android vía Termux.

## 📋 Resumen de Desafíos y Soluciones

| Categoría | Problema | Causa Raíz | Solución Aplicada |
| :--- | :--- | :--- | :--- |
| **Seguridad / API** | Error `401: No autorizado` | Desajuste entre el `.env` (Key nueva) y el cliente (Key antigua/default) | Sincronización de `LOCAL_API_KEY` en ambos extremos y actualización del Tester para auto-inyectar la clave. |
| **Conectividad PC** | `Address already in use` | Procesos SSH huérfanos en la PC local bloqueando el puerto 18789. | Ejecución de `taskkill /F /IM ssh.exe` en local para limpiar túneles previos. |
| **OpenClaw Config** | `Origin not allowed` | Política CORS de OpenClaw restringida a `localhost` por defecto. | Edición de `~/.openclaw/openclaw.json` añadiendo la IP del móvil a `allowedOrigins`. |
| **SSHD / Acceso** | `Connection refused` (Puerto 8022) | El daemon `sshd` fue detenido accidentalmente al intentar limpiar procesos. | Reinicio manual ejecutando `sshd` directamente desde la terminal de Termux. |
| **Estabilidad** | OpenClaw no arranca | Error de sintaxis JSON (una coma extra) introducido durante la edición manual. | Limpieza del archivo JSON y reinicio del proceso en segundo plano con `nohup`. |

---

## 🦾 Soluciones en Detalle

### 1. Sincronización de Claves API (Proxy)

Al cambiar la clave en el archivo `.env` del servidor, el cliente (OpenClaw o el Tester del navegador) queda "huérfano".

* **Solución**: Se modificó `index.ts` para que la **Landing Page** detecte la clave del entorno y la ponga por defecto en el campo de texto. Esto evita errores humanos de "copy-paste".
* **Aprendizaje**: Siempre que se cambie la seguridad del proxy, hay que propagar el cambio al archivo `~/.openclaw/openclaw.json`.

### 2. Gestión de Túneles SSH (PC a Móvil)

El uso de `-L 18789:127.0.0.1:18789` es sensible. Si se interrumpe la conexión pero el proceso `ssh.exe` sigue vivo en Windows, el puerto queda bloqueado.

* **Solución**: Antes de relanzar el túnel, es recomendable limpiar procesos locales con `taskkill /F /IM ssh.exe`.
* **Importante**: El comando del túnel **SOLO debe ejecutarse en la PC**, nunca dentro de Termux para conectar "hacia fuera".

### 3. Configuración de OpenClaw en Android

OpenClaw espera ser ejecutado en PC. En Android:

* **Gateway**: El comando `openclaw gateway start` no está soportado (servicios systemd). Se debe usar `openclaw gateway run` manualmente o con `nohup`.
* **CORS**: Si accedes al Dashboard por IP (`http://192.168.x.x:18789`), debes configurar los orígenes en la sección `gateway.controlUi`:

    ```json
    "allowedOrigins": [
      "http://localhost:18789",
      "http://192.168.0.193:18789"
    ]
    ```

---

## 🚀 Recomendaciones de Setup del Proxy

Para un despliegue exitoso desde cero:

1. **Levantar el Proxy**: Asegurar que `LOCAL_API_KEY` sea sólida y esté en el `.env`.
2. **Verificar el Health Check**: Llamar a `http://localhost:3000/health` antes de configurar clientes.
3. **Onboarding de Clientes**: Usar `openclaw onboard` y elegir el proveedor `Custom`. Poner la URL base con el `/v1` al final: `http://localhost:3000/v1`.
4. **Uso de Modelo `auto`**: OmniBrain está optimizado para recibir `auto` y decidir en milisegundos qué proveedor tiene el menor tiempo de respuesta en ese momento.

---
> [!IMPORTANT]
> **Nota para el futuro**: Si el Dashboard falla al cargar, revisa que no haya errores de sintaxis en `~/.openclaw/openclaw.json` (un simple error de una coma mata el gateway JSON de OpenClaw).
