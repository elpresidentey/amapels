import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const FROM_EMAIL = 'AMAPELS <orders@amapels.com>'

interface OrderConfirmationData {
  customerName: string
  customerEmail: string
  orderNumber: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    country: string
  }
}

function buildOrderHtml(data: OrderConfirmationData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e3dc;font-size:14px;color:#3a3530;">${item.name} × ${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e3dc;font-size:14px;color:#3a3530;text-align:right;">₦${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="540" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e8e3dc;">
        <tr><td style="padding:48px 40px 32px;text-align:center;border-bottom:1px solid #d4c5a0;">
          <h1 style="margin:0;font-size:22px;letter-spacing:6px;color:#1a1714;font-weight:400;">AMAPELS</h1>
          <p style="margin:8px 0 0;font-size:11px;letter-spacing:3px;color:#9a8a72;text-transform:uppercase;">Nigerian Artistry, Global Elegance</p>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="font-size:15px;color:#3a3530;line-height:1.7;">Dear ${data.customerName},</p>
          <p style="font-size:15px;color:#3a3530;line-height:1.7;">Thank you for your order. Each piece you've chosen carries a story — of Lagos craftsmanship, of moments waiting to be made. We are honoured to be part of your journey.</p>

          <div style="margin:32px 0;padding:24px;background:#faf8f5;border-left:3px solid #d4c5a0;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;color:#9a8a72;text-transform:uppercase;">Order Reference</p>
            <p style="margin:0;font-size:20px;color:#1a1714;letter-spacing:2px;">${data.orderNumber}</p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0;">
            <tr><td style="padding-bottom:12px;font-size:10px;letter-spacing:2px;color:#9a8a72;text-transform:uppercase;border-bottom:2px solid #1a1714;">Item</td>
                <td style="padding-bottom:12px;font-size:10px;letter-spacing:2px;color:#9a8a72;text-transform:uppercase;border-bottom:2px solid #1a1714;text-align:right;">Amount</td></tr>
            ${itemsHtml}
          </table>

          <div style="margin:24px 0 32px;padding:20px 0;border-top:2px solid #1a1714;text-align:right;">
            <p style="margin:0;font-size:14px;color:#9a8a72;">Total</p>
            <p style="margin:4px 0 0;font-size:22px;color:#1a1714;letter-spacing:1px;">₦${data.total.toLocaleString()}</p>
          </div>

          <div style="margin:32px 0;padding:20px;background:#faf8f5;">
            <p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;color:#9a8a72;text-transform:uppercase;">Shipping To</p>
            <p style="margin:0;font-size:13px;color:#3a3530;line-height:1.6;">${data.shippingAddress.street}<br>${data.shippingAddress.city}, ${data.shippingAddress.state}<br>${data.shippingAddress.country}</p>
          </div>

          <p style="font-size:13px;color:#6a6560;line-height:1.6;font-style:italic;">"Every piece of jewellery tells a story — ours begins with you."</p>
        </td></tr>
        <tr><td style="padding:32px 40px;background:#1a1714;text-align:center;">
          <p style="margin:0;font-size:11px;color:#9a8a72;letter-spacing:2px;">AMAPELS — Lagos, Nigeria</p>
          <p style="margin:6px 0 0;font-size:10px;color:#6a6560;">Handcrafted with passion. Worn with purpose.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  if (!resend) {
    console.warn('Resend not configured — email not sent')
    return
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Your AMAPELS Order — ${data.orderNumber}`,
      html: buildOrderHtml(data),
    })

    if (error) {
      console.error('Failed to send order confirmation:', error)
    }
  } catch (error) {
    console.error('Email send error:', error)
  }
}