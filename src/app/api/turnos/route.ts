import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { TurnoAlBate } from '@/lib/types';

export async function POST(req: Request) {
  const db = getDb();
  const t: TurnoAlBate = await req.json();

  const activo = db.prepare('SELECT id FROM partidos WHERE finalizado = 0 LIMIT 1').get() as { id: string } | undefined;
  if (!activo) return NextResponse.json({ error: 'No active match' }, { status: 400 });

  db.prepare(`
    INSERT INTO turnos_al_bate (
      id, bateador_id, partido_id, inning, zona, coordenadas_x, coordenadas_y,
      tipo_pitch, resultado, detalle_out, detalle_hit, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    t.id, t.bateadorId, activo.id, t.inning, t.zona, 
    t.coordenadas?.x ?? null, t.coordenadas?.y ?? null,
    t.tipoPitch, t.resultado, 
    t.detalleOut ? JSON.stringify(t.detalleOut) : null, 
    t.detalleHit ? JSON.stringify(t.detalleHit) : null, 
    t.timestamp
  );

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const db = getDb();
  const { id, datos } = await req.json();

  const sets: string[] = [];
  const values: any[] = [];
  
  if (datos.zona !== undefined) { sets.push('zona = ?'); values.push(datos.zona); }
  if (datos.inning !== undefined) { sets.push('inning = ?'); values.push(datos.inning); }
  if (datos.tipoPitch !== undefined) { sets.push('tipo_pitch = ?'); values.push(datos.tipoPitch); }
  if (datos.resultado !== undefined) { sets.push('resultado = ?'); values.push(datos.resultado); }
  
  if (datos.coordenadas !== undefined) {
    sets.push('coordenadas_x = ?'); values.push(datos.coordenadas?.x ?? null);
    sets.push('coordenadas_y = ?'); values.push(datos.coordenadas?.y ?? null);
  }

  if ('detalleOut' in datos) {
    sets.push('detalle_out = ?'); 
    values.push(datos.detalleOut ? JSON.stringify(datos.detalleOut) : null);
  }
  if ('detalleHit' in datos) {
    sets.push('detalle_hit = ?'); 
    values.push(datos.detalleHit ? JSON.stringify(datos.detalleHit) : null);
  }

  if (sets.length > 0) {
    values.push(id);
    db.prepare(`UPDATE turnos_al_bate SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  getDb().prepare('DELETE FROM turnos_al_bate WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
