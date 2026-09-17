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
 * Opens official Razorpay standard checkout popup
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
}) {
  const isLoaded = await loadRazorpayScript();
  const keyId = order?.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Swq7otFr6CedcA';
  const amountInPaise = order?.amount ? Math.round(Number(order.amount)) : 50000;
  const rawPhone = prefill?.phone || '9876543210';
  const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10) || '9876543210';

  if (isLoaded && typeof window !== 'undefined' && window.Razorpay) {
    try {
      const rzpOptions = {
        key: keyId,
        amount: amountInPaise,
        currency: order?.currency || 'INR',
        name: name || 'Digital Heroes',
        description: description || 'Direct Charity Donation',
        prefill: {
          name: prefill?.name || 'Hero Golfer',
          email: prefill?.email || 'player@digitalheroes.co.in',
          contact: cleanPhone,
        },
        notes: {
          platform: 'Digital Heroes',
          type: order?.notes?.type || 'donation',
        },
        theme: {
          color: theme?.color || '#0c2340',
        },
        handler: function (response) {
          if (onSuccess) {
            onSuccess({
              orderId: response.razorpay_order_id || order?.id || `order_${Date.now()}`,
              paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              signature: response.razorpay_signature || `sig_${Math.random().toString(36).substring(2, 10)}`,
            });
          }
        },
        modal: {
          ondismiss: function () {
            if (onFailure) onFailure(new Error('Razorpay window closed'));
          },
          escape: true,
          backdropclose: false,
        },
      };

      if (
        order?.id &&
        !order.isSimulated &&
        !order.id.startsWith('order_demo_') &&
        !order.id.startsWith('order_sim_')
      ) {
        rzpOptions.order_id = order.id;
      }

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', function (response) {
        console.warn('Razorpay payment failed:', response);
        if (onFailure) {
          onFailure(new Error(response.error?.description || 'Razorpay payment failed'));
        }
      });

      rzp.open();
      return;
    } catch (err) {
      console.error('Error opening Razorpay checkout:', err);
      if (onFailure) onFailure(err);
    }
  }
}



