'use client'

import { useRef } from 'react'
import { Printer } from 'lucide-react'

interface ReceiptItem {
  name: string
  quantity: number
  price: number
}

interface PrintableReceiptProps {
  orderNumber: string
  trackingNumber: string
  paymentReference: string
  orderDate: string
  customerEmail: string
  customerName?: string
  customerPhone?: string
  totalAmount: string
  subtotal?: number
  shippingCost?: number
  tax?: number
  items?: ReceiptItem[]
  shippingAddress?: {
    street: string
    city: string
    state: string
    postalCode?: string
    country: string
  }
}

export default function PrintableReceipt(props: PrintableReceiptProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handlePrint = () => {
    const {
      orderNumber, trackingNumber, paymentReference, orderDate,
      customerEmail, customerName, customerPhone, totalAmount,
      subtotal, shippingCost, tax, items, shippingAddress
    } = props

    const itemRows = items && items.length > 0
      ? items.map(item => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e8e3dc;font-size:13px;color:#3a3530;">${item.name} <span style="color:#9a8a72;">×${item.quantity}</span></td>
          <td style="padding:10px 0;border-bottom:1px solid #e8e3dc;font-size:13px;color:#3a3530;text-align:right;">₦${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`).join('')
      : ''

    const sub = subtotal ?? 0
    const ship = shippingCost ?? 0
    const t = tax ?? 0

    const receiptHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  @page { margin: 0; }
  body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background: #faf8f5; color: #1a1714; }
  .receipt { max-width: 600px; margin: 0 auto; padding: 48px 40px; background: #fff; }
  .header { text-align: center; border-bottom: 1px solid #d4c5a0; padding-bottom: 32px; margin-bottom: 32px; }
  .header h1 { margin: 0; font-size: 22px; letter-spacing: 6px; color: #1a1714; font-weight: 400; }
  .header p { margin: 8px 0 0; font-size: 10px; letter-spacing: 3px; color: #9a8a72; text-transform: uppercase; }
  .badge { display: inline-block; background: #1a1714; color: #fff; padding: 6px 16px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
  .section-title { font-size: 10px; letter-spacing: 2px; color: #9a8a72; text-transform: uppercase; margin-bottom: 12px; }
  .detail-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .detail-row .label { color: #6a6560; }
  .detail-row .value { color: #1a1714; font-weight: 500; }
  table { width: 100%; border-collapse: collapse; margin: 24px 0; }
  th { text-align: left; padding: 8px 0; font-size: 10px; letter-spacing: 2px; color: #9a8a72; text-transform: uppercase; border-bottom: 1px solid #1a1714; }
  th:last-child { text-align: right; }
  .totals { margin-top: 16px; border-top: 1px solid #e8e3dc; padding-top: 16px; }
  .totals .row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 13px; color: #6a6560; }
  .totals .grand-total { display: flex; justify-content: space-between; padding: 12px 0 0; margin-top: 12px; border-top: 2px solid #1a1714; font-size: 16px; color: #1a1714; font-weight: 700; }
  .address { background: #faf8f5; padding: 16px; margin: 16px 0; font-size: 13px; line-height: 1.6; color: #3a3530; }
  .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8e3dc; font-size: 11px; color: #9a8a72; letter-spacing: 1px; }
  .footer strong { color: #1a1714; }
</style>
</head>
<body>
<div class="receipt">
  <div class="header">
    <h1>AMAPELS</h1>
    <p>Nigerian Artistry, Global Elegance</p>
  </div>

  <div style="text-align:center;"><span class="badge">Payment Receipt</span></div>

  <div style="margin-bottom:24px;">
    <div class="detail-row"><span class="label">Order Number</span><span class="value" style="font-family:monospace;">${orderNumber}</span></div>
    <div class="detail-row"><span class="label">Tracking Number</span><span class="value" style="font-family:monospace;">${trackingNumber}</span></div>
    <div class="detail-row"><span class="label">Payment Reference</span><span class="value" style="font-family:monospace;">${paymentReference}</span></div>
    <div class="detail-row"><span class="label">Order Date</span><span class="value">${orderDate}</span></div>
  </div>

  ${customerName ? `
  <div class="section-title">Customer</div>
  <div style="margin-bottom:24px;">
    <div class="detail-row"><span class="label">Name</span><span class="value">${customerName}</span></div>
    <div class="detail-row"><span class="label">Email</span><span class="value">${customerEmail}</span></div>
    ${customerPhone ? `<div class="detail-row"><span class="label">Phone</span><span class="value">${customerPhone}</span></div>` : ''}
  </div>` : `
  <div style="margin-bottom:16px;font-size:13px;color:#3a3530;">${customerEmail}</div>`}

  ${items && items.length > 0 ? `
  <div class="section-title">Order Items</div>
  <table>
    <thead><tr><th>Item</th><th>Amount</th></tr></thead>
    <tbody>${itemRows}</tbody>
  </table>
  <div class="totals">
    ${subtotal ? `<div class="row"><span>Subtotal</span><span>₦${sub.toLocaleString()}</span></div>` : ''}
    ${shippingCost ? `<div class="row"><span>Shipping</span><span>₦${ship.toLocaleString()}</span></div>` : ''}
    ${tax ? `<div class="row"><span>Tax (VAT 7.5%)</span><span>₦${t.toLocaleString()}</span></div>` : ''}
    <div class="grand-total"><span>Total Paid</span><span>${totalAmount}</span></div>
  </div>` : `
  <div class="totals">
    <div class="grand-total"><span>Total Paid</span><span>${totalAmount}</span></div>
  </div>`}

  ${shippingAddress ? `
  <div class="section-title" style="margin-top:24px;">Shipping Address</div>
  <div class="address">
    ${shippingAddress.street}<br>
    ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode || ''}<br>
    ${shippingAddress.country}
  </div>` : ''}

  <div style="margin-top:24px;padding:16px;background:#faf8f5;border-left:3px solid #d4c5a0;font-size:12px;color:#6a6560;font-style:italic;">
    "Every piece of jewellery tells a story — ours begins with you."
  </div>

  <div class="footer">
    <strong>AMAPELS</strong> — Lagos, Nigeria<br>
    Handcrafted with passion. Worn with purpose.<br>
    <span style="font-size:10px;">For inquiries: orders@amapels.com</span>
  </div>
</div>
</body>
</html>`

    const iframe = iframeRef.current
    if (!iframe) return

    const doc = iframe.contentWindow?.document
    if (!doc) return

    doc.open()
    doc.write(receiptHtml)
    doc.close()

    setTimeout(() => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }, 250)
  }

  return (
    <>
      <iframe ref={iframeRef} style={{ position: 'absolute', width: 0, height: 0, border: 0, visibility: 'hidden' }} title="print-frame" />
      <button
        onClick={handlePrint}
        className="w-full bg-black text-white py-3.5 px-6 text-[10px] font-medium uppercase tracking-[0.22em] hover:bg-gold hover:text-black-dark transition-all flex items-center justify-center gap-2.5 sm:text-[11px]"
      >
        <Printer size={14} />
        Print Receipt
      </button>
    </>
  )
}
