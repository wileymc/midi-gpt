import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabase } from "../../lib/supabase";
import { buffer } from "micro";
import { RandomWordOptions, generateSlug } from "random-word-slugs";

const randomWordOptions: RandomWordOptions<4> = {
  format: "title",
  partsOfSpeech: ["adjective", "adjective", "noun", "noun"],
}; // 9752352516 unique combinations

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret =
  process.env.LOCAL_STRIPE_WEBHOOK_SECRET ??
  process.env.STRIPE_WEBHOOK_SECRET ??
  "";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let event: Stripe.Event;
    const sig = req.headers["stripe-signature"]!;
    const buf = await buffer(req);

    try {
      const rawBody = await buffer(req);
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.log(`❌ Error: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    console.log("✅ Success:", event.id);

    switch (event.type) {
      case "charge.succeeded":
        const charge = event.data.object as Stripe.Charge;
        console.log(`💵 Charge id: ${charge.id}`);

        const userEmail = charge.billing_details.email;

        console.log(charge.billing_details);
        // credit_amount follows SQL naming convention in this case to comply with Supabase Stored Procedures
        let credits = 0;

        // @ts-ignore
        switch (charge.amount) {
          case 500:
            credits = 25;
            break;
          case 2000:
            credits = 100;
            break;
          case 8000:
            credits = 500;
            break;
        }

        const { data: insertCodeData } = await supabase
          .from("credit_codes")
          .insert([
            {
              code: generateSlug(4, randomWordOptions),
              credits,
            },
          ])
          .select();

        await supabase.from("transactions").insert([
          {
            user_email: userEmail,
            credit_code_id: insertCodeData?.[0].id,
            stripe_charge_id: charge.id,
            amount: charge.amount,
          },
        ]);
        break;
      case "payment_intent.payment_failed":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`
        );
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
