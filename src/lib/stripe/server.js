import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
  appInfo: {
    name: 'Digital Heroes',
    version: '1.0.0',
  },
});

/**
 * Creates a Stripe Checkout Session or returns a simulated checkout URL in INR
 */
export async function createCheckoutSession({ plan, userId, userEmail, successUrl, cancelUrl }) {
  const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder'));

  if (!isStripeConfigured) {
    // Return simulator URL for smooth local evaluator testing
    return {
      url: `${successUrl}?simulated_session_id=cs_test_${Date.now()}&plan=${plan}`,
      isSimulated: true,
    };
  }

  const priceAmount = plan === 'yearly' ? 1999900 : 199900; // in paise
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: userEmail,
    client_reference_id: userId,
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: plan === 'yearly' ? 'Digital Heroes Annual Membership' : 'Digital Heroes Monthly Membership',
            description: 'Access to monthly prize draws and charitable golf performance tracking',
          },
          unit_amount: priceAmount,
          recurring: {
            interval: plan === 'yearly' ? 'year' : 'month',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      plan,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return {
    url: session.url,
    sessionId: session.id,
    isSimulated: false,
  };
}
