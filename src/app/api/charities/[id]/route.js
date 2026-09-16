import { NextResponse } from 'next/server';
import { store } from '@/lib/data/mock-store';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const charity = store.getCharityById(id);

    if (!charity) {
      return NextResponse.json({ error: 'Charity not found' }, { status: 404 });
    }

    const donations = store.getDonationsByCharity(charity.id);
    return NextResponse.json({ charity, donations });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const updated = store.updateCharity(id, body);
    return NextResponse.json({ success: true, charity: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    store.deleteCharity(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
