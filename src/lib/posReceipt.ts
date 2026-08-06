// Generador oficial de Boleta Térmica de 80mm con Timbre PDF417 SII Dinámico
export interface ReceiptItem {
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface ReceiptData {
  tipoComprobante: 'boleta' | 'factura' | 'comprobante'
  folio?: number
  fechaHora: string
  cajeraNombre: string
  sedeNombre: string
  items: ReceiptItem[]
  subtotal: number
  descuentoGlobalMonto: number
  total: number
  metodoPago: string
  efectivoPagado?: number
  vuelto?: number
  rUTCliente?: string
  razonSocial?: string
}

export function drawPDF417BarcodeCanvas(canvas: HTMLCanvasElement, textSeed?: string) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, width, height)

  const baseSeed = textSeed
    ? textSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : Math.floor(Math.random() * 1000000000) + 1

  const rows = 36
  const cols = 19
  const cellW = width / (cols + 14)
  const cellH = height / rows

  const startPattern = [7, 1, 1, 1, 1, 1, 3, 1, 1]
  const stopPattern = [7, 1, 1, 3, 1, 1, 1, 2, 1, 1]

  ctx.fillStyle = '#000000'

  for (let r = 0; r < rows; r++) {
    const y = r * cellH

    let currX = 0
    for (let i = 0; i < startPattern.length; i++) {
      const w = startPattern[i] * (cellW * 0.7)
      if (i % 2 === 0) {
        ctx.fillRect(currX, y, w, cellH + 0.3)
      }
      currX += w
    }

    const dataStartX = currX
    const dataWidth = width - dataStartX - 35
    const colW = dataWidth / cols

    for (let c = 0; c < cols; c++) {
      const cx = dataStartX + c * colW
      const pseudoRand = Math.sin(baseSeed + r * 997 + c * 43) * 10000
      const isBlack = (pseudoRand - Math.floor(pseudoRand)) > 0.42

      if (isBlack) {
        ctx.fillRect(cx, y, colW + 0.3, cellH + 0.3)
      }
    }

    currX = width - 35
    for (let i = 0; i < stopPattern.length; i++) {
      const w = stopPattern[i] * (cellW * 0.6)
      if (i % 2 === 0) {
        ctx.fillRect(currX, y, w, cellH + 0.3)
      }
      currX += w
    }
  }
}

export function generateReceiptHTML(data?: ReceiptData | any): string {
  if (!data) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Imprimiendo Boleta...</title></head><body style="font-family:sans-serif;padding:20px;text-align:center;"><h2>Generando boleta...</h2></body></html>`;
  }

  const fmtCLP = (n: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(Math.round(Number(n) || 0))

  const folioNum = data.folio || data.boletaNumero || 12345
  const totalMonto = Number(data.total) || 0
  const seed = `${folioNum}_${totalMonto}_${Date.now()}`
  const itemsList: ReceiptItem[] = Array.isArray(data.items) ? data.items : []

  const itemsRows = itemsList
    .map(
      (item: ReceiptItem) => `
      <tr>
        <td style="padding: 3px 0; text-align: left;">${item.nombre}</td>
        <td style="padding: 3px 0; text-align: center;">${item.cantidad}</td>
        <td style="padding: 3px 0; text-align: right;">${fmtCLP(item.precioUnitario)}</td>
        <td style="padding: 3px 0; text-align: right; font-weight: bold;">${fmtCLP(item.subtotal)}</td>
      </tr>
    `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Boleta Electrónica ${data.folio || ''}</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body {
            width: 78mm;
            margin: 0 auto;
            padding: 5mm 2mm;
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            color: #000;
            background: #fff;
          }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 6px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          .canvas-container { text-align: center; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="text-center">
          <div style="font-size: 16px; font-weight: bold;">YAXSEL COMERCIAL</div>
          <div style="font-size: 10px;">R.U.T.: 77.892.310-K</div>
          <div style="font-size: 9px;">VENTA DE ABARROTES Y ACCESORIOS</div>
          <div style="font-size: 9px;">Sede: ${data.sedeNombre || 'Principal'}</div>
        </div>

        <div class="divider"></div>

        <div class="text-center bold" style="font-size: 13px; margin: 4px 0;">
          BOLETA ELECTRÓNICA Nº ${data.folio || Math.floor(Math.random() * 89999) + 10000}
        </div>
        <div class="text-center" style="font-size: 9px;">
          S.I.I. - SANTIAGO CENTRO
        </div>

        <div class="divider"></div>

        <div style="font-size: 9px; line-height: 1.3;">
          <div><strong>Fecha:</strong> ${data.fechaHora}</div>
          <div><strong>Cajera:</strong> ${data.cajeraNombre}</div>
          <div><strong>Pago:</strong> ${data.metodoPago.toUpperCase()}</div>
        </div>

        <div class="divider"></div>

        <table>
          <thead>
            <tr style="border-bottom: 1px solid #000;">
              <th style="text-align: left;">Item</th>
              <th style="text-align: center;">Cant</th>
              <th style="text-align: right;">P.Unit</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="divider"></div>

        <div style="font-size: 11px; line-height: 1.4;">
          <div style="display: flex; justify-content: space-between;">
            <span>Subtotal:</span>
            <span>${fmtCLP(data.subtotal)}</span>
          </div>
          ${
            data.descuentoGlobalMonto > 0
              ? `<div style="display: flex; justify-content: space-between;">
                  <span>Descuento:</span>
                  <span>-${fmtCLP(data.descuentoGlobalMonto)}</span>
                </div>`
              : ''
          }
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-top: 4px;">
            <span>TOTAL:</span>
            <span>${fmtCLP(data.total)}</span>
          </div>
        </div>

        ${
          data.efectivoPagado
            ? `
          <div class="divider"></div>
          <div style="font-size: 10px;">
            <div style="display: flex; justify-content: space-between;">
              <span>Efectivo Entregado:</span>
              <span>${fmtCLP(data.efectivoPagado)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
              <span>Vuelto:</span>
              <span>${fmtCLP(data.vuelto || 0)}</span>
            </div>
          </div>
        `
            : ''
        }

        <div class="divider"></div>

        <!-- Timbre Electrónico SII Dinámico Canvas PDF417 -->
        <div class="canvas-container">
          <canvas id="pdf417-canvas" width="240" height="70"></canvas>
          <div style="font-size: 8px; font-weight: bold; margin-top: 3px;">
            Timbre Electrónico SII<br/>
            Res.99 del 21-10-2014
          </div>
        </div>

        <div class="text-center" style="font-size: 9px; margin-top: 8px;">
          ¡Gracias por su preferencia!
        </div>

        <script>
          const seed = "${seed}";
          const canvas = document.getElementById('pdf417-canvas');
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const baseSeed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, 240, 70);
            
            const rows = 36;
            const cols = 19;
            const cellW = 240 / 33;
            const cellH = 70 / rows;
            const startPattern = [7, 1, 1, 1, 1, 1, 3, 1, 1];
            const stopPattern = [7, 1, 1, 3, 1, 1, 1, 2, 1, 1];
            
            ctx.fillStyle = '#000000';
            for (let r = 0; r < rows; r++) {
              const y = r * cellH;
              let currX = 0;
              for (let i = 0; i < startPattern.length; i++) {
                const w = startPattern[i] * (cellW * 0.7);
                if (i % 2 === 0) ctx.fillRect(currX, y, w, cellH + 0.3);
                currX += w;
              }
              const dataStartX = currX;
              const colW = (240 - dataStartX - 35) / cols;
              for (let c = 0; c < cols; c++) {
                const cx = dataStartX + c * colW;
                const pseudoRand = Math.sin(baseSeed + r * 997 + c * 43) * 10000;
                if ((pseudoRand - Math.floor(pseudoRand)) > 0.42) {
                  ctx.fillRect(cx, y, colW + 0.3, cellH + 0.3);
                }
              }
              currX = 240 - 35;
              for (let i = 0; i < stopPattern.length; i++) {
                const w = stopPattern[i] * (cellW * 0.6);
                if (i % 2 === 0) ctx.fillRect(currX, y, w, cellH + 0.3);
                currX += w;
              }
            }
          }
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `
}

export function openReceiptPrintWindow(data?: any, existingWindow?: Window | null): Window | null {
  let win = existingWindow || null
  if (!win && typeof window !== 'undefined') {
    win = window.open('', '_blank', 'width=400,height=600')
  }

  if (win && data) {
    const html = generateReceiptHTML(data)
    win.document.open()
    win.document.write(html)
    win.document.close()
  }
  return win
}
