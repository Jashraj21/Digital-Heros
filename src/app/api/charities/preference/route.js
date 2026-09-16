import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';
import { calculateCharityContribution } from '@/lib/charities/contribution-calculator';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'user-player';

    const preference = store.getCharityPreference(userId);
    const charity = preference ? store.getCharityById(preference.charityId) : null;
    const subscription = store.getSubscription(userId);

    const calculation = calculateCharityContribution({
      subscriptionAmount: subscription?.priceAmount || 25.0,
      contributionPercentage: preference?.contributionPercentage || 10,
      interval: subscription?.plan === 'yearly' ? 'year' : 'month',
    });

    const userDonations = store.getUserDonations(userId);

    return NextResponse.json({
      preference,
      charity,
      calculation,
      userDonations,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId = 'user-player', charityId, contributionPercentage } = await req.json();

    if (!charityId) {
      return NextResponse.json({ error: 'Charity ID is required' }, { status: 400 });
    }

    const updatedPref = store.setCharityPreference(userId, charityId, contributionPercentage);
    const charity = store.getCharityById(charityId);

    return NextResponse.json({
      success: true,
      preference: updatedPref,
      charity,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
