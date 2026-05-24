import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const dbServices = await query('SELECT * FROM services ORDER BY scheduled_date ASC, id DESC');
    
    // Map snake_case to camelCase
    const services = dbServices.map((service: any) => ({
      id: service.id,
      carId: service.car_id,
      carName: service.car_name,
      serviceType: service.service_type,
      description: service.description || '',
      scheduledDate: service.scheduled_date,
      status: service.status,
      cost: service.cost || 0,
    }));

    return NextResponse.json(services);
  } catch (error: any) {
    console.error('GET /api/services failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;
    const { id, carId, carName, serviceType, description, scheduledDate, status, cost } = body;

    if (!carName || !serviceType || !scheduledDate || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const serviceId = id || Date.now().toString();

    await query(
      `INSERT INTO services (id, car_id, car_name, service_type, description, scheduled_date, status, cost)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         car_id = EXCLUDED.car_id,
         car_name = EXCLUDED.car_name,
         service_type = EXCLUDED.service_type,
         description = EXCLUDED.description,
         scheduled_date = EXCLUDED.scheduled_date,
         status = EXCLUDED.status,
         cost = EXCLUDED.cost`,
      [serviceId, carId || null, carName, serviceType, description || '', scheduledDate, status, cost || 0]
    );

    return NextResponse.json({ success: true, id: serviceId });
  } catch (error: any) {
    console.error('POST /api/services failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as any;
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing service ID or status' }, { status: 400 });
    }

    await query('UPDATE services SET status = $1 WHERE id = $2', [status, id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PATCH /api/services failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing service ID' }, { status: 400 });
    }

    await query('DELETE FROM services WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/services failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
