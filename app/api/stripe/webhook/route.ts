import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const getCustomerUserId = async (customerId: string) => {
    const { data } = await supabaseAdmin.from('profiles').select('id').eq('stripe_customer_id', customerId).single()
    return data?.id
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const userId = await getCustomerUserId(session.customer)
    if (userId) await supabaseAdmin.from('profiles').update({ subscription_status: 'trialing', subscription_id: session.subscription }).eq('id', userId)
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const sub = event.data.object as any
    const userId = await getCustomerUserId(sub.customer)
    if (userId) await supabaseAdmin.from('profiles').update({
      subscription_status: sub.status,
      subscription_id: sub.id,
      trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
    }).eq('id', userId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as any
    const userId = await getCustomerUserId(sub.customer)
    if (userId) await supabaseAdmin.from('profiles').update({ subscription_status: 'cancelled', subscription_id: null }).eq('id', userId)
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as any
    const userId = await getCustomerUserId(invoice.customer)
    if (userId) await supabaseAdmin.from('profiles').update({ subscription_status: 'past_due' }).eq('id', userId)
  }

  return NextResponse.json({ received: true })
}
