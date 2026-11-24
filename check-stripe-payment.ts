import "dotenv/config";

const checkPayment = async () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }

  const paymentIntentId = "pi_3Ue4sT8ZecjKjFRr13wxSUPh";

  const response = await fetch(
    `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.log("Stripe API Error:", result.error?.message);
    return;
  }

  console.log("Stripe Payment Details:", {
    id: result.id,
    amount: result.amount,
    currency: result.currency,
    status: result.status,
    livemode: result.livemode,
    created: new Date(result.created * 1000).toISOString(),
  });
};

checkPayment().catch(console.error);
