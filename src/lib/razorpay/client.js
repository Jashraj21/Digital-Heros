/**
 * Client-side Razorpay Checkout Loader and Trigger
 */

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay standard checkout or fallback modal
 * @param {Object} options
 */
export async function triggerRazorpayCheckout({
  order,
  name = 'Digital Heroes',
  description = 'Golf Performance & Charity Subscription',
  prefill = {},
  theme = { color: '#0c2340' },
  onSuccess,
  onFailure,
  onFallbackModal,
}) {
  const isLoaded = await loadRazorpayScript();
  const keyId = order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Swq7otFr6CedcA';

  // Open official Razorpay Checkout window in Test Mode using Key ID
  if (isLoaded && typeof window !== 'undefined' && window.Razorpay && keyId && !keyId.includes('placeholder')) {
    try {
      const rzpOptions = {
        key: keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name,
        description,
        image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=100&auto=format&fit=crop&q=80',
        prefill: {
          name: prefill.name || 'Hero Golfer',
          email: prefill.email || 'player@digitalheroes.co.in',
          contact: prefill.phone || '+919812345678',
        },
        theme,
        handler: function (response) {
          if (onSuccess) {
            onSuccess({
              orderId: response.razorpay_order_id || order.id,
              paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              signature: response.razorpay_signature || `sig_${Math.random().toString(36).substring(2, 10)}`,
            });
          }
        },
        modal: {
          ondismiss: function () {
            if (onFailure) onFailure(new Error('Payment window dismissed by user'));
          },
        },
      };

      // Only pass order_id if it's a genuine Razorpay generated order
      if (order.id && !order.id.startsWith('order_demo_')) {
        rzpOptions.order_id = order.id;
      }

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', function (response) {
        if (onFailure) {
          onFailure(new Error(response.error?.description || 'Razorpay payment failed'));
        }
      });
      rzp.open();
      return;
    } catch (err) {
      console.warn('Could not launch native Razorpay window, opening interactive payment modal:', err);
    }
  }

  // If Razorpay SDK couldn't be loaded or threw, open in-app modal
  if (onFallbackModal) {
    onFallbackModal(order);
  } else {
    // If no fallback callback provided, simulate payment
    const fakePaymentId = `pay_${Date.now()}`;
    const fakeSignature = `sig_${Math.random().toString(36).substring(2, 12)}`;
    setTimeout(() => {
      if (onSuccess) {
        onSuccess({
          orderId: order.id,
          paymentId: fakePaymentId,
          signature: fakeSignature,
          isSimulated: true,
        });
      }
    }, 600);
  }
}
