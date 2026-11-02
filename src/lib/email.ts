import { Resend } from 'resend'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://amapelsng.com').replace(/\/$/, '')

// The sender MUST be on a domain verified in Resend. A gmail.com address can
// never be used as `from` — Resend rejects it.
const FROM_EMAIL = process.env.EMAIL_FROM?.trim() || 'AMAPELS <orders@amapelsng.com>'
const REPLY_TO = process.env.EMAIL_REPLY_TO?.trim() || 'amapelsng@gmail.com'

export interface OrderEmailItem {
  name: string
  quantity: number
  price: number
}

export interface OrderConfirmationData {
  customerName: string
  customerEmail: string
  orderNumber: string
  items: OrderEmailItem[]
  subtotal?: number
  shippingCost?: number
  tax?: number
  total: number
  paymentReference?: string | null
  estimatedDelivery?: string | null
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
    postalCode?: string
  }
}

export interface EmailResult {
  sent: boolean
  skipped?: boolean
  reason?: string
  id?: string
}

let resendState: { client: Resend | null; reason?: string } | null = null

/**
 * Lazily create the Resend client and validate the key shape.
 *
 * A missing or malformed key is a configuration problem, not a runtime error:
 * orders must still succeed, so callers get `{ sent: false, skipped: true }`
 * and the reason is logged once by the caller.
 */
function getResend(): { client: Resend | null; reason?: string } {
  if (resendState) return resendState

  const key = process.env.RESEND_API_KEY?.trim()
  if (!key) {
    resendState = { client: null, reason: 'RESEND_API_KEY is not set' }
    return resendState
  }

  // Real Resend keys start with re_ and are ~36 characters. Catching this
  // early turns a silent provider failure into an actionable log line.
  if (!key.startsWith('re_') || key.length < 20) {
    resendState = {
      client: null,
      reason: 'RESEND_API_KEY does not look valid (expected re_...)',
    }
    return resendState
  }

  resendState = { client: new Resend(key) }
  return resendState
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function money(value: number): string {
  return `₦${Math.round(value).toLocaleString('en-NG')}`
}

function buildOrderHtml(data: OrderConfirmationData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e3dc;font-size:14px;color:#3a3530;">${escapeHtml(item.name)} &times; ${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e3dc;font-size:14px;color:#3a3530;text-align:right;white-space:nowrap;">${money(item.price * item.quantity)}</td>
      </tr>`
    )
    .join('')

  const hasBreakdown =
    typeof data.subtotal === 'number' ||
    typeof data.shippingCost === 'number' ||
    typeof data.tax === 'number'

  const breakdownHtml = hasBreakdown
    ? `
            ${typeof data.subtotal === 'number' ? `<tr><td style="padding:2px 0;font-size:13px;color:#6a6560;">Subtotal</td><td style="padding:2px 0;font-size:13px;color:#3a3530;text-align:right;">${money(data.subtotal)}</td></tr>` : ''}
            ${typeof data.shippingCost === 'number' ? `<tr><td style="padding:2px 0;font-size:13px;color:#6a6560;">Delivery</td><td style="padding:2px 0;font-size:13px;color:#3a3530;text-align:right;">${money(data.shippingCost)}</td></tr>` : ''}
            ${typeof data.tax === 'number' && data.tax > 0 ? `<tr><td style="padding:2px 0;font-size:13px;color:#6a6560;">Tax</td><td style="padding:2px 0;font-size:13px;color:#3a3530;text-align:right;">${money(data.tax)}</td></tr>` : ''}`
    : ''

  const estimateHtml = data.estimatedDelivery
    ? `<p style="margin:16px 0 0;font-size:13px;color:#6a6560;">Estimated delivery: ${escapeHtml(data.estimatedDelivery)}</p>`
    : `<p style="margin:16px 0 0;font-size:13px;color:#6a6560;">We&rsquo;ll email you again as soon as your parcel is on its way.</p>`

  const trackingUrl = `${SITE_URL}/track-order?ref=${encodeURIComponent(data.orderNumber)}`

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your AMAPELS order</title>
</head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your order ${escapeHtml(data.orderNumber)} is confirmed. Thank you for shopping with AMAPELS.</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="540" cellpadding="0" cellspacing="0" style="width:100%;max-width:540px;background:#ffffff;border:1px solid #e8e3dc;">
        <tr><td style="padding:48px 40px 32px;text-align:center;border-bottom:1px solid #d4c5a0;">
          <img src="${SITE_URL}/images/brand/wordmark-ink.png" width="190" alt="AMAPELS" style="display:block;margin:0 auto;width:190px;max-width:100%;height:auto;" />
          <p style="margin:14px 0 0;font-size:11px;letter-spacing:3px;color:#9a8a72;text-transform:uppercase;">Nigerian Artistry, Global Elegance</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#3a3530;line-height:1.7;">Dear ${escapeHtml(data.customerName)},</p>
          <p style="margin:0 0 16px;font-size:15px;color:#3a3530;line-height:1.7;">Thank you for your order. Each piece you&rsquo;ve chosen carries a story &mdash; of Nigerian style, of moments waiting to be made. We&rsquo;re honoured to be part of your journey.</p>

          <div style="margin:32px 0;padding:24px;background:#faf8f5;border-left:3px solid #d4c5a0;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;color:#9a8a72;text-transform:uppercase;">Order Reference</p>
            <p style="margin:0;font-size:20px;color:#1a1714;letter-spacing:2px;">${escapeHtml(data.orderNumber)}</p>
            ${data.paymentReference ? `<p style="margin:8px 0 0;font-size:11px;color:#9a8a72;">Payment reference: ${escapeHtml(data.paymentReference)}</p>` : ''}
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
            <tr>
              <td style="padding-bottom:12px;font-size:10px;letter-spacing:2px;color:#9a8a72;text-transform:uppercase;border-bottom:2px solid #1a1714;">Item</td>
              <td style="padding-bottom:12px;font-size:10px;letter-spacing:2px;color:#9a8a72;text-transform:uppercase;border-bottom:2px solid #1a1714;text-align:right;">Amount</td>
            </tr>
            ${itemsHtml}
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
            ${breakdownHtml}
            <tr>
              <td style="padding-top:12px;border-top:2px solid #1a1714;font-size:14px;color:#9a8a72;">Total paid</td>
              <td style="padding-top:12px;border-top:2px solid #1a1714;font-size:22px;color:#1a1714;letter-spacing:1px;text-align:right;">${money(data.total)}</td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
            <tr><td align="center">
              <a href="${trackingUrl}" style="display:inline-block;padding:14px 28px;background:#1a1714;color:#f5f0e8;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">Track Your Order</a>
            </td></tr>
          </table>
          ${estimateHtml}

          <div style="margin:32px 0;padding:20px;background:#faf8f5;">
            <p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;color:#9a8a72;text-transform:uppercase;">Shipping To</p>
            <p style="margin:0;font-size:13px;color:#3a3530;line-height:1.6;">
              ${escapeHtml(data.shippingAddress.street)}<br>
              ${escapeHtml(data.shippingAddress.city)}${data.shippingAddress.postalCode ? `, ${escapeHtml(data.shippingAddress.postalCode)}` : ''}, ${escapeHtml(data.shippingAddress.state)}<br>
              ${escapeHtml(data.shippingAddress.country)}
            </p>
          </div>

          <p style="margin:0;font-size:13px;color:#6a6560;line-height:1.6;font-style:italic;">"Every piece of jewellery tells a story &mdash; ours begins with you."</p>
        </td></tr>
        <tr><td style="padding:32px 40px;background:#1a1714;text-align:center;">
          <img src="${SITE_URL}/images/brand/wordmark-gold.png" width="140" alt="AMAPELS" style="display:block;margin:0 auto 12px;width:140px;max-width:100%;height:auto;" />
          <p style="margin:0;font-size:11px;color:#9a8a72;letter-spacing:2px;">Abuja, Nigeria</p>
          <p style="margin:6px 0 0;font-size:10px;color:#6a6560;">Designed with passion. Worn with purpose.</p>
          <p style="margin:14px 0 0;font-size:10px;color:#6a6560;">Questions? Reply to this email or write to ${escapeHtml(REPLY_TO)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildOrderText(data: OrderConfirmationData): string {
  const lines = [
    `Dear ${data.customerName},`,
    '',
    'Thank you for your order. We are honoured to be part of your journey.',
    '',
    `Order reference: ${data.orderNumber}`,
    data.paymentReference ? `Payment reference: ${data.paymentReference}` : '',
    '',
    'Items:',
    ...data.items.map(
      (item) => `  ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}`
    ),
    '',
    `Total paid: ${money(data.total)}`,
    '',
    'Shipping to:',
    `  ${data.shippingAddress.street}`,
    `  ${data.shippingAddress.city}, ${data.shippingAddress.state}`,
    `  ${data.shippingAddress.country}`,
    '',
    data.estimatedDelivery
      ? `Estimated delivery: ${data.estimatedDelivery}`
      : 'We will email you again as soon as your parcel is on its way.',
    '',
    `Track your order: ${SITE_URL}/track-order?ref=${encodeURIComponent(data.orderNumber)}`,
    '',
    'AMAPELS — Abuja, Nigeria',
    `Questions? Reply to this email or write to ${REPLY_TO}`,
  ]

  return lines.filter((line) => line !== '').join('\n')
}

/**
 * Send the order confirmation. Never throws: a mail outage must not turn a
 * paid order into a failed checkout.
 */
export async function sendOrderConfirmation(
  data: OrderConfirmationData
): Promise<EmailResult> {
  const { client, reason } = getResend()
  if (!client) {
    console.warn(`Order confirmation email skipped: ${reason}`)
    return { sent: false, skipped: true, reason }
  }

  if (!data.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) {
    return { sent: false, skipped: true, reason: 'Invalid customer email address' }
  }

  try {
    const { data: result, error } = await client.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: data.customerEmail,
      subject: `Order ${data.orderNumber} confirmed — AMAPELS`,
      html: buildOrderHtml(data),
      text: buildOrderText(data),
    })

    if (error) {
      console.error('Failed to send order confirmation:', error)
      return { sent: false, reason: error.message }
    }

    return { sent: true, id: result?.id }
  } catch (error) {
    console.error('Order confirmation email error:', error)
    return {
      sent: false,
      reason: error instanceof Error ? error.message : 'Unknown email error',
    }
  }
}
