import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'
import { sendOrderConfirmation, type OrderConfirmationData } from '@/lib/email'
import { getOrder } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * Admin-only: send a sample order confirmation to check Resend + branding.
 * Pass { "orderId": "..." } to use a real order as the preview, or
 * { "to": "you@example.com" } to choose the recipient (defaults to ADMIN_EMAIL).
 */
export async function POST(request: NextRequest) {
  const authError = requireAdmin(request)
  if (authError) return authError

  let body: { to?: string; orderId?: string } = {}
  try {
    body = await request.json()
  } catch {
    // empty body is fine
  }

  const recipient = (body.to || process.env.ADMIN_EMAIL || '').trim()
  if (!recipient) {
    return NextResponse.json(
      { error: 'No recipient. Set ADMIN_EMAIL or pass "to".' },
      { status: 400 }
    )
  }

  let sample: OrderConfirmationData = {
    customerName: 'AMAPELS Test',
    customerEmail: recipient,
    orderNumber: 'AMP-TEST-0001',
    items: [
      { name: 'Zulaiha Necklace', quantity: 1, price: 10000 },
      { name: 'Gift Wrap', quantity: 1, price: 2500 },
    ],
    subtotal: 12500,
    shippingCost: 2500,
    tax: 0,
    total: 15000,
    paymentReference: 'TEST-REFERENCE-0001',
    estimatedDelivery: null as string | null,
    shippingAddress: {
      street: '12 Adetokunbo Ademola Crescent',
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria',
      postalCode: '900001',
    },
  }

  if (body.orderId) {
    try {
      const order = await getOrder(body.orderId)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      sample = {
        customerName: order.customer_name,
        customerEmail: recipient,
        orderNumber: order.order_number,
        items: (order.items || []).map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        tax: order.tax,
        total: order.total,
        paymentReference: order.payment_reference,
        estimatedDelivery: order.estimated_delivery,
        shippingAddress: {
          street: order.shipping_address?.street || '',
          city: order.shipping_address?.city || '',
          state: order.shipping_address?.state || '',
          country: order.shipping_address?.country || '',
          postalCode: order.shipping_address?.postalCode || '',
        },
      }
    } catch (error) {
      return NextResponse.json(
        { error: `Could not load order: ${(error as Error).message}` },
        { status: 500 }
      )
    }
  }

  const result = await sendOrderConfirmation(sample)
  return NextResponse.json(
    { ...result, to: recipient, from: process.env.EMAIL_FROM || 'AMAPELS <orders@amapelsng.com>' },
    { status: result.sent ? 200 : 503 }
  )
}
