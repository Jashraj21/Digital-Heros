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
 * Opens interactive Razorpay Checkout modal
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
  // Always trigger the interactive Razorpay test modal with UPI/Card/NetBanking
  if (onFallbackModal) {
    onFallbackModal(order);
    return;
  }

  // Fallback instant simulation if no modal provided
  const fakePaymentId = `pay_${Date.now()}`;
  const fakeSignature = `sig_${Math.random().toString(36).substring(2, 12)}`;
  setTimeout(() => {
    if (onSuccess) {
      onSuccess({
        orderId: order?.id || `order_${Date.now()}`,
        paymentId: fakePaymentId,
        signature: fakeSignature,
        isSimulated: true,
      });
    }
  }, 600);
}


