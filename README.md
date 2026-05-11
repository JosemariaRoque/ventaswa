# VentasWA — Servidor WhatsApp

Servidor Node.js que conecta tu gestor de ventas con WhatsApp Business API.

---

## Cómo activarlo en 5 pasos

### Paso 1 — Instala Node.js
Descarga desde https://nodejs.org (versión LTS)

### Paso 2 — Descarga este servidor
Descomprime la carpeta y abre una terminal dentro de ella.

```bash
npm install
```

### Paso 3 — Crea tu archivo .env
Renombra `.env.example` a `.env` y llena tus credenciales:

```
WA_TOKEN=tu_token_de_meta
PHONE_ID=tu_phone_number_id
DEST_NUMBER=51987654321
```

**¿Cómo conseguir el token y el Phone ID?**
1. Ve a https://developers.facebook.com
2. Crea una app → tipo "Business"
3. Agrega el producto "WhatsApp"
4. En "API Setup" encontrarás el Access Token y el Phone Number ID

### Paso 4 — Inicia el servidor
```bash
npm start
```
Verás: `✅ Servidor VentasWA corriendo en http://localhost:3000`

### Paso 5 — Prueba que funciona
Abre tu navegador o usa curl:
```bash
curl -X POST http://localhost:3000/notificar \
  -H "Content-Type: application/json" \
  -d '{"mensaje": "Hola, esto es una prueba de VentasWA 🎉"}'
```
El mensaje llegará a tu WhatsApp en segundos.

---

## Rutas disponibles

| Ruta | Método | Descripción |
|---|---|---|
| `/health` | GET | Verifica que el servidor esté activo |
| `/notificar` | POST | Envía cualquier mensaje al dueño |
| `/venta-nueva` | POST | Notificación automática de venta |
| `/recordatorio` | POST | Recordatorio de pago al cliente |
| `/resumen-diario` | POST | Resumen del día al dueño |

---

## Publicar en internet (para acceder desde cualquier lugar)

Opciones gratuitas recomendadas:

- **Railway** → https://railway.app (el más fácil, sube el código y listo)
- **Render** → https://render.com (gratis, tarda ~30s en despertar)

En ambos casos solo subes esta carpeta y configuras las variables de entorno en el panel web — no necesitas hacer nada más.

---

## Conectar con el gestor de ventas

En el gestor (panel "Configurar API"), en el campo de Access Token pon la URL de tu servidor:
```
http://localhost:3000   ← mientras pruebas en tu PC
https://tu-app.railway.app  ← cuando lo publiques
```
