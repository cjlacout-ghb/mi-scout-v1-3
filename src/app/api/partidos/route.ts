import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  
  const partidos = db.prepare('SELECT * FROM partidos WHERE finalizado = 1 ORDER BY fecha DESC, creado_en DESC').all();
  
  return NextResponse.json({ partidos });
}
