import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const dbCars = await query('SELECT * FROM cars ORDER BY name ASC');
    
    // Map snake_case to camelCase
    const cars = dbCars.map((car: any) => ({
      id: car.id,
      name: car.name,
      model: car.model,
      registrationNumber: car.registration_number,
      fuelType: car.fuel_type,
      lastService: car.last_service || '',
      nextService: car.next_service || '',
      mileage: car.mileage || 0,
    }));

    return NextResponse.json(cars);
  } catch (error: any) {
    console.error('GET /api/cars failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;
    const { id, name, model, registrationNumber, fuelType, lastService, nextService, mileage } = body;

    if (!name || !model || !registrationNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const carId = id || Date.now().toString();

    await query(
      `INSERT INTO cars (id, name, model, registration_number, fuel_type, last_service, next_service, mileage)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         model = EXCLUDED.model,
         registration_number = EXCLUDED.registration_number,
         fuel_type = EXCLUDED.fuel_type,
         last_service = EXCLUDED.last_service,
         next_service = EXCLUDED.next_service,
         mileage = EXCLUDED.mileage`,
      [carId, name, model, registrationNumber, fuelType || 'Petrol', lastService || null, nextService || null, mileage || 0]
    );

    return NextResponse.json({ success: true, id: carId });
  } catch (error: any) {
    console.error('POST /api/cars failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing car ID' }, { status: 400 });
    }

    await query('DELETE FROM cars WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/cars failed:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
