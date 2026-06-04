import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const dbExpenses = await query('SELECT * FROM expenses ORDER BY date DESC, id DESC');
    
    const expenses = dbExpenses.map((entry: any) => ({
      id: entry.id,
      description: entry.description,
      amount: entry.amount,
      category: entry.category,
      date: entry.date,
    }));

    return NextResponse.json(expenses);
  } catch (error: any) {
    console.error('GET /api/expenses failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;
    const { id, description, amount, category, date } = body;

    if (!description || amount === undefined || !category || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const expenseId = id || Date.now().toString();

    await query(
      `INSERT INTO expenses (id, description, amount, category, date)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         description = EXCLUDED.description,
         amount = EXCLUDED.amount,
         category = EXCLUDED.category,
         date = EXCLUDED.date`,
      [expenseId, description, Number(amount), category, date]
    );

    return NextResponse.json({ success: true, id: expenseId });
  } catch (error: any) {
    console.error('POST /api/expenses failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing expense log ID' }, { status: 400 });
    }

    await query('DELETE FROM expenses WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/expenses failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
