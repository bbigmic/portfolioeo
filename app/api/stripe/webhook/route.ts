import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              isPremium: true,
              stripeSubscriptionId: session.subscription as string,
            } as any,
          })
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId } as any,
        })

        if (user) {
          // Jeśli subskrypcja jest aktywna (nawet jeśli zaplanowana do anulowania), zachowaj premium
          // Premium zostanie usunięte dopiero gdy subskrypcja faktycznie się zakończy
          if (subscription.status === "active" || subscription.status === "trialing") {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                isPremium: true,
                stripeSubscriptionId: subscription.id,
              } as any,
            })
          } else {
            // Subskrypcja została faktycznie zakończona
            await prisma.user.update({
              where: { id: user.id },
              data: {
                isPremium: false,
                stripeSubscriptionId: null,
              } as any,
            })
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId } as any,
        })

        if (user) {
          // Subskrypcja została usunięta - deaktywuj premium
          // Dane użytkownika (customName, customLogo, etc.) pozostają zachowane
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isPremium: false,
              stripeSubscriptionId: null,
            } as any,
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

