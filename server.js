// ============================================================
//  VentasWA — Servidor Node.js
//  Conecta tu gestor de ventas con WhatsApp Cloud API (Meta)
// ============================================================

const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app  = express();
app.use(cors());
app.use(express.json());

// ── Credenciales (pon tus datos en el archivo .env) ──────────
const WA_TOKEN      = process.env.WA_TOKEN;       // Access Token de Meta
const PHONE_ID      = process.env.PHONE_ID;       // Phone Number ID
const DEST_NUMBER   = process.env.DEST_NUMBER;    // Tu número (ej: 51987654321)
const PORT          = process.env.PORT || 3000;

// ── Función central: envía mensaje de texto por WhatsApp ─────
async function enviarMensaje(numero, texto) {
  const url = `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    to: numero,
    type: "text",
    text: { body: texto },
  };

console.log("Enviando a:", numero);
console.log("Cuerpo:", JSON.stringify(body));
  const res = await fetch(url, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${WA_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Error WhatsApp API:", data);
    throw new Error(data.error?.message || "Error al enviar mensaje");
  }

  return data;
}

// ── Rutas ────────────────────────────────────────────────────

// GET /health — verifica que el servidor esté vivo
app.get("/health", (req, res) => {
  res.json({ ok: true, numero_destino: DEST_NUMBER });
});

// POST /notificar — envía notificación genérica al número configurado
//  Body: { mensaje: "texto libre" }
app.post("/notificar", async (req, res) => {
  try {
    const { mensaje } = req.body;
    if (!mensaje) return res.status(400).json({ error: "Falta el campo 'mensaje'" });

    const resultado = await enviarMensaje(DEST_NUMBER, mensaje);
    res.json({ ok: true, whatsapp: resultado });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /venta-nueva — notificación automática al registrar una venta
//  Body: { cliente, producto, monto, estado }
app.post("/venta-nueva", async (req, res) => {
  try {
    const { cliente, producto, monto, estado } = req.body;

    const iconos = {
      Pagado:     "✅",
      Pendiente:  "⏳",
      "En proceso": "🔄",
      Cancelado:  "❌",
    };

    const icono  = iconos[estado] || "🛒";
    const mensaje =
      `${icono} *Nueva venta registrada*\n` +
      `Cliente: ${cliente}\n` +
      `Producto: ${producto}\n` +
      `Monto: S/ ${monto}\n` +
      `Estado: ${estado}`;

    const resultado = await enviarMensaje(DEST_NUMBER, mensaje);
    res.json({ ok: true, whatsapp: resultado });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /recordatorio — envía recordatorio de pago pendiente al cliente
//  Body: { numero_cliente, cliente, monto }
app.post("/recordatorio", async (req, res) => {
  try {
    const { numero_cliente, cliente, monto } = req.body;

    const mensaje =
      `⏳ Hola ${cliente}, te recordamos que tienes un pago pendiente de *S/ ${monto}*.\n` +
      `¿Necesitas ayuda o información adicional? Estamos a tu disposición.`;

    const resultado = await enviarMensaje(numero_cliente, mensaje);
    res.json({ ok: true, whatsapp: resultado });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /resumen-diario — envía resumen del día al dueño
//  Body: { total_ventas, num_pedidos, pendientes }
app.post("/resumen-diario", async (req, res) => {
  try {
    const { total_ventas, num_pedidos, pendientes } = req.body;

    const fecha   = new Date().toLocaleDateString("es-PE", { dateStyle: "long" });
    const mensaje =
      `📊 *Resumen del día — ${fecha}*\n\n` +
      `💰 Total ventas: S/ ${total_ventas}\n` +
      `🛒 Pedidos: ${num_pedidos}\n` +
      `⏳ Pendientes: ${pendientes}\n\n` +
      `_Generado automáticamente por VentasWA_`;

    const resultado = await enviarMensaje(DEST_NUMBER, mensaje);
    res.json({ ok: true, whatsapp: resultado });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Inicio ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Servidor VentasWA corriendo en http://localhost:${PORT}`);
  console.log(`   Número destino: ${DEST_NUMBER}`);
});
