import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST() {
  const db = getDb();
  
  const activo = db.prepare('SELECT id FROM partidos WHERE finalizado = 0 LIMIT 1').get() as { id: string } | undefined;
  
  if (!activo) {
    return NextResponse.json({ success: true, message: 'No active match to finalize' });
  }

  db.prepare('UPDATE partidos SET finalizado = 1 WHERE id = ?').run(activo.id);
  
  return NextResponse.json({ success: true });
}
