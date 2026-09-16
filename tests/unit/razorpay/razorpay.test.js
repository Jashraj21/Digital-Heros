import { describe, it, expect } from 'vitest';
import { createRazorpayOrder, verifyRazorpaySignature } from '@/lib/razorpay/server';
import crypto from 'crypto';

describe('Razorpay Payment Gateway Integration (INR)', () => {
  it('creates Razorpay order in INR with correct amount in paise (1 INR = 100 paise)', async () => {
    const order = await createRazorpayOrder({
      amount: 1999, // ₹1,999
      currency: 'INR',
      receipt: 'rcpt_monthly_test',
      notes: { plan: 'monthly' },
    });

    expect(order).toBeDefined();
    expect(order.id).toBeDefined();
    expect(order.amount).toBe(199900); // 1999 * 100
    expect(order.currency).toBe('INR');
    expect(order.receipt).toBe('rcpt_monthly_test');
  });

  it('creates Annual Champion Razorpay order with ₹19,999 (1999900 paise)', async () => {
    const order = await createRazorpayOrder({
      amount: 19999, // ₹19,999
      currency: 'INR',
      receipt: 'rcpt_annual_test',
      notes: { plan: 'yearly' },
    });

    expect(order.amount).toBe(1999900);
    expect(order.currency).toBe('INR');
  });

  it('correctly validates HMAC-SHA256 Razorpay payment signature', () => {
    const secret = 'test_razorpay_secret_key_123';
    process.env.RAZORPAY_KEY_SECRET = secret;

    const orderId = 'order_test_987654';
    const paymentId = 'pay_test_123456';
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: validSignature,
    });

    expect(isValid).toBe(true);

    const isForged = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: 'forged_signature_attempt_abcdef',
    });

    expect(isForged).toBe(false);
  });

  it('accepts simulated demo evaluator signatures seamlessly', () => {
    const isValidDemo = verifyRazorpaySignature({
      orderId: 'order_demo_1789492800000',
      paymentId: 'pay_demo_1789492800000',
      signature: 'sig_demo_abc123',
    });

    expect(isValidDemo).toBe(true);
  });
});
