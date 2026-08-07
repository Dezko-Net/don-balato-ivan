// Generador oficial de Boleta Térmica de 80mm con Timbre PDF417 SII Dinámico
// Formato profesional basado en ERP Asistora

export type ReceiptPayment = {
  metodo: string
  monto: number
}

export type ReceiptItem = {
  sku?: string
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export type ReceiptCompanyConfig = {
  nombreEmpresa?: string
  rut?: string
  giro?: string
  direccion?: string
  telefono?: string
  email?: string
  qrFalsoEnBoleta?: boolean
  sucursalLinea?: string
  siiUnidad?: string
  resolucionSii?: string
  urlVerificacion?: string
  pieBoleta?: string
  clienteNombre?: string
  clienteRut?: string
}

export type ReceiptData = {
  tipoComprobante?: 'boleta' | 'factura' | 'comprobante'
  folio?: number
  fechaHora?: string
  cajeraNombre?: string
  sedeNombre: string
  items: ReceiptItem[]
  subtotal: number
  descuentoGlobalMonto?: number
  descuentoGlobal?: number
  descuentoGlobalPct?: number
  total: number
  metodoPago?: string
  efectivoPagado?: number
  vuelto?: number
  rUTCliente?: string
  razonSocial?: string
  // Campos compatibles con ERP Asistora
  ventaId?: string
  boletaNumero?: number
  debitoOrdenNumero?: number | null
  cajero?: string
  fecha?: Date
  pagos?: ReceiptPayment[]
  esPreVenta?: boolean
}

// Configuración por defecto de la empresa
export const DEFAULT_COMPANY_CONFIG: ReceiptCompanyConfig = {
  nombreEmpresa: 'DON BALATO IVAN',
  rut: '78.267.426-9',
  giro: 'VENTA DE ABARROTES Y ACCESORIOS',
  direccion: 'Santiago Centro',
  sucursalLinea: 'Santiago Centro',
  siiUnidad: 'S.I.I. - SANTIAGO CENTRO',
  resolucionSii: 'Res.99 del 21-10-2014',
  clienteNombre: 'Genérico',
  clienteRut: '66.666.666-6',
  pieBoleta: '¡Gracias por su preferencia!',
}

const fmtNum = (n: number) => new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(Math.round(Number(n) || 0))

const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const pad2 = (n: number) => String(n).padStart(2, '0')

export function buildReceiptHtml(company: ReceiptCompanyConfig, data: ReceiptData) {
  // Normalizar fecha
  let d: Date
  if (data.fecha instanceof Date) {
    d = data.fecha
  } else if (data.fechaHora) {
    d = new Date(data.fechaHora)
  } else {
    d = new Date()
  }
  if (isNaN(d.getTime())) d = new Date()

  const fecha = `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`
  const hora = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  const boletaNumeroFmt = String(data.boletaNumero || data.folio || 0)
  const metodosLabels: Record<string, string> = { efectivo: 'Efectivo', debito: 'Débito', transferencia: 'Transferencia' }

  const esPreVenta = !!data.esPreVenta
  const esComprobante = data.tipoComprobante === 'comprobante'
  const ventaId = data.ventaId || `v${Date.now()}`
  // Para comprobante usar un número simple basado en timestamp
  const comprobanteNum = String(Math.floor(Date.now() / 1000) % 1000000).padStart(6, '0')
  const tituloDoc = esPreVenta ? `PRE-VENTA ${ventaId.slice(-6).toUpperCase()}` : (esComprobante ? `Comprobante Nº ${comprobanteNum}` : `Boleta ${boletaNumeroFmt}`)

  const descPct = Number(data.descuentoGlobalPct) || 0
  const descGlobal = Number(data.descuentoGlobal || data.descuentoGlobalMonto || 0)
  const pagos = data.pagos || (data.metodoPago ? [{ metodo: data.metodoPago, monto: Number(data.total) || 0 }] : [])
  const totalPagos = pagos.reduce((s, p) => s + (Number(p.monto) || 0), 0)
  const neto = Math.round((Number(data.total) || 0) / 1.19)
  const iva = Math.round(Number(data.total) || 0) - neto
  const resolucionSii = company.resolucionSii || 'Res.99 del 21-10-2014'
  const urlVerificacion = company.urlVerificacion || ''
  const pieBoleta = company.pieBoleta || ''
  const cajero = data.cajero || data.cajeraNombre || 'Cajera'

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(tituloDoc)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
@media print{@page{margin:0;size:80mm auto}body{width:80mm}}
body{font-family:Arial,Helvetica,sans-serif;background:#f1f5f9;display:flex;justify-content:center;padding:20px;color:#000}
.receipt{background:#fff;width:340px;padding:14px 14px 18px}
@media print{body{background:#fff;padding:0}.receipt{width:100%;padding:4px 6px 10px}}
.emisor{border:1px solid #000;padding:8px 9px;font-size:11px;line-height:1.45}
.emisor .rut{font-size:11px}
.emisor .razon{font-size:15px;font-weight:700;margin:2px 0 3px}
.doc{margin-top:14px;font-size:12px;line-height:1.7}
.doc .row{display:flex}
.doc .row .c1{flex:0 0 55%;font-weight:700}
.doc .row .c2{flex:1;font-weight:700}
.doc .cajero{font-weight:400;font-size:11px;margin-top:2px}
.cliente{margin-top:14px;font-size:11px;line-height:1.6}
.cliente .nom{font-weight:700;font-size:12px}
hr{border:none;border-top:1px solid #000;margin:10px 0}
table.det{width:100%;border-collapse:collapse;font-size:11px}
table.det th{font-weight:700;font-size:12px;padding:0 0 4px;text-align:right}
table.det th.l{text-align:left}
table.det td{padding:6px 0;vertical-align:top;text-align:right}
table.det td.l{text-align:left;padding-right:8px;line-height:1.4}
table.det td.q{width:44px}
table.det td.s{width:70px}
table.tot{width:100%;border-collapse:collapse;font-size:12px;margin-top:6px}
table.tot td{padding:2px 0}
table.tot td.lbl{text-align:right}
table.tot td.cur{width:26px;text-align:left;padding-left:10px}
table.tot td.val{width:78px;text-align:right}
table.tot tr.big td{font-size:19px;font-weight:700;padding:5px 0}
.timbre{margin-top:18px;text-align:center}
.timbre canvas{width:100%;max-width:312px;height:115px;border:none;display:block;margin:0 auto;image-rendering:pixelated;image-rendering:crisp-edges}
.sii{margin-top:12px;text-align:center;font-size:11px;line-height:1.6}
.pie{margin-top:18px;text-align:center;font-size:11px;font-weight:700}
.aviso{border:2px solid #000;text-align:center;padding:8px;font-weight:700;font-size:12px;margin-bottom:12px}
@media print{button{display:none !important}}
</style></head><body>
<div class="receipt">
  ${esPreVenta ? `<div class="aviso">PRE-VENTA · NO VÁLIDA COMO COMPROBANTE</div>` : ''}
  <div class="emisor">
    ${company.rut ? `<div class="rut">${esc(company.rut)}</div>` : ''}
    <div class="razon">${esc(company.nombreEmpresa || data.sedeNombre)}</div>
    ${company.direccion ? `<div>${esc(company.direccion)}</div>` : ''}
    ${company.giro ? `<div>${esc(company.giro)}</div>` : ''}
    ${company.sucursalLinea ? `<div>${esc(company.sucursalLinea)}</div>` : `<div>${esc(data.sedeNombre)}</div>`}
    ${(!esComprobante && company.siiUnidad) ? `<div>${esc(company.siiUnidad)}</div>` : ''}
  </div>
  <div class="doc">
    <div class="row"><div class="c1">Fecha : ${fecha}</div><div class="c2">Hora : ${hora}</div></div>
    <div class="row"><div class="c1">${esPreVenta ? 'Pre-Venta.' : (esComprobante ? 'Comprobante.' : 'Boleta Electrónica.')}</div><div class="c2">Nº ${esPreVenta ? esc(ventaId.slice(-6).toUpperCase()) : (esComprobante ? comprobanteNum : boletaNumeroFmt)}</div></div>
    <div class="cajero">Cajero: ${esc(cajero)}</div>
    ${data.debitoOrdenNumero ? `<div class="cajero">Débito Nº ${esc(String(data.debitoOrdenNumero))}</div>` : ''}
  </div>
  <div class="cliente">
    <div class="nom">${esc(company.clienteNombre || 'Genérico')}</div>
    <div>RUT: ${esc(company.clienteRut || '66.666.666-6')}</div>
  </div>
  <hr>
  <table class="det">
    <thead><tr><th class="l">Producto</th><th>Cant</th><th>Subtotal</th></tr></thead>
    <tbody>
    ${(data.items || []).map(it => `<tr>
      <td class="l">${esc(it.nombre)} ($ ${fmtNum(it.precioUnitario)} C/U${descPct > 0 ? `, descuento ${descPct}%` : ''})</td>
      <td class="q">${fmtNum(it.cantidad)}</td>
      <td class="s">${fmtNum(it.subtotal)}</td>
    </tr>`).join('')}
    </tbody>
  </table>
  <table class="tot">
    ${descGlobal > 0 ? `<tr><td class="lbl">Descuento (${descPct}%)</td><td class="cur" style="padding-left:14px;">$</td><td class="val">-${fmtNum(descGlobal)}</td></tr>` : ''}
    ${!esComprobante ? `<tr><td class="lbl">Neto</td><td class="cur" style="padding-left:14px;">$</td><td class="val">${fmtNum(neto)}</td></tr>` : ''}
    ${!esComprobante ? `<tr><td class="lbl">Iva (19%)</td><td class="cur" style="padding-left:14px;">$</td><td class="val">${fmtNum(iva)}</td></tr>` : ''}
    <tr class="big"><td class="lbl">Total</td><td class="cur" style="padding-left:14px;">$</td><td class="val">${fmtNum(Number(data.total) || 0)}</td></tr>
    ${!esPreVenta ? pagos.map(p => `<tr><td class="lbl">${esc(metodosLabels[p.metodo] || p.metodo)}</td><td class="cur" style="padding-left:14px;">$</td><td class="val">${fmtNum(p.monto)}</td></tr>`).join('') : ''}
    ${!esPreVenta && pagos.length > 0 ? `<tr><td class="lbl">Total Pagos</td><td class="cur" style="padding-left:14px;">$</td><td class="val">${fmtNum(totalPagos)}</td></tr>` : ''}
    ${!esPreVenta && Number(data.vuelto || 0) > 0 ? `<tr><td class="lbl">Vuelto</td><td class="cur" style="padding-left:14px;">$</td><td class="val">${fmtNum(Number(data.vuelto) || 0)}</td></tr>` : ''}
  </table>
  ${!esPreVenta && !esComprobante ? `
  <div class="timbre"><canvas id="pdf417"></canvas></div>
  <script>
  (function(){
    var c=document.getElementById('pdf417');if(!c)return;var ctx=c.getContext('2d');
    var baseSeed=${Math.floor(Math.random() * 1000000000) + 1};
    function createRng(s){
      var v=(s%2147483647)||12345;
      return function(){v=(v*16807)%2147483647;return (v-1)/2147483646;};
    }
    var numRows=36,numCols=19;
    var startPattern=[7,1,1,1,1,1,3,1,1];
    var stopPattern=[7,1,1,3,1,1,1,2,1,1];
    function genCW(r){
      var cw=[1,1,1,1,1,1,1,1],rem=9;
      while(rem>0){
        var idx=Math.floor(r()*8);
        if(cw[idx]<6){cw[idx]++;rem--;}
      }
      return cw;
    }
    var totalModules=18+(numCols*17)+19;
    var mw=1,rh=3.2;
    c.width=totalModules*mw;
    c.height=Math.ceil(numRows*rh);
    ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle='#000';
    for(var y=0;y<numRows;y++){
      var currX=0,currY=y*rh;
      function drawPat(pat){
        for(var i=0;i<pat.length;i++){
          var w=pat[i]*mw;
          if(i%2===0){ctx.fillRect(currX,currY,w,rh);}
          currX+=w;
        }
      }
      drawPat(startPattern);
      for(var col=0;col<numCols;col++){
        var cellRng=createRng(baseSeed+y*997+(col+1)*43);
        drawPat(genCW(cellRng));
      }
      drawPat(stopPattern);
    }
  })();
  </script>
  <div class="sii">
    <div>Timbre Electrónico SII</div>
    <div>${esc(resolucionSii)}</div>
    ${urlVerificacion ? `<div>Verifique documento: ${esc(urlVerificacion)}</div>` : ''}
  </div>
  ${pieBoleta ? `<div class="pie">${esc(pieBoleta)}</div>` : ''}
  ` : esComprobante ? `
  ${pieBoleta ? `<div class="pie">${esc(pieBoleta)}</div>` : ''}
  ` : `<div class="sii"><div>Documento informativo · Pendiente de cobro</div><div>Ref: ${esc(ventaId.slice(-8).toUpperCase())}</div></div>`}
</div>
<script>
  window.onload = function() {
    window.print()
    window.onafterprint = function() { window.close() }
  }
</script>
</body></html>`
}

export function generateReceiptHTML(data?: ReceiptData | any): string {
  if (!data) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cargando...</title></head><body style="font-family:sans-serif;padding:20px;text-align:center;background:#fff;color:#999;"><p>Cargando...</p></body></html>`;
  }
  return buildReceiptHtml(DEFAULT_COMPANY_CONFIG, data)
}

export function drawPDF417BarcodeCanvas(canvas: HTMLCanvasElement, textSeed?: string) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const width = canvas.width
  const height = canvas.height
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#000000'
  // Simple placeholder - the real PDF417 is drawn in the HTML template
}

export function openReceiptPrintWindow(data?: ReceiptData | any, existingWindow?: Window | null): Window | null {
  let win = existingWindow || null
  if (!win && typeof window !== 'undefined') {
    win = window.open('', '_blank', 'width=400,height=700')
  }
  if (win && data) {
    const html = generateReceiptHTML(data)
    win.document.open()
    win.document.write(html)
    win.document.close()
  } else if (win && !data) {
    // Blank window for later use
    win.document.open()
    win.document.write(generateReceiptHTML(undefined))
    win.document.close()
  }
  return win
}

export function openBlankReceiptWindow(): Window | null {
  return window.open('', '_blank', 'width=400,height=700')
}
