import "dotenv/config";

async function checkAccount() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }

  const response = await fetch("https://api.stripe.com/v1/account", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const account = (await response.json()) as {
    id?: string;
    business_profile?: {
      name?: string;
    };
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    throw new Error(account.error?.message ?? "Stripe API request failed");
  }

  console.log("Backend Stripe Account ID:", account.id);
  console.log("Account Name:", account.business_profile?.name);
}

checkAccount().catch(console.error);
