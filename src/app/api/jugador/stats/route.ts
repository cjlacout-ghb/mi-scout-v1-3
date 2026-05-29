import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { TurnoAlBate } from '@/lib/types';

function parseDetalle(jsonStr: string | null) {
  if (!jsonStr) return undefined;
  try { return JSON.parse(jsonStr); } catch { return undefined; }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const apellido = url.searchParams.get('apellido');
  const numero = url.searchParams.get('numero');
  const equipo = url.searchParams.get('equipo');

  if (!apellido || !numero || !equipo) {
    return NextResponse.json({ error: 'Missing identity parameters' }, { status: 400 });
  }

  const db = getDb();
  
  // Find all batter IDs that match this identity
  const batterIds = db.prepare('SELECT id FROM bateadores WHERE apellido = ? AND numero = ? AND equipo = ?')
    .all(apellido, numero, equipo)
    .map((row: any) => row.id as string);

  if (batterIds.length === 0) {
    return NextResponse.json({ turnos: [] });
  }

  // Use IN clause to get all at-bats for these IDs
  const placeholders = batterIds.map(() => '?').join(',');
  const rows = db.prepare(`SELECT * FROM turnos_al_bate WHERE bateador_id IN (${placeholders}) ORDER BY timestamp ASC`)
    .all(...batterIds) as any[];

  const turnos: TurnoAlBate[] = rows.map(row => ({
    id: row.id,
    bateadorId: row.bateador_id,
    inning: row.inning,
    zona: row.zona,
    coordenadas: (row.coordenadas_x != null && row.coordenadas_y != null) 
      ? { x: row.coordenadas_x, y: row.coordenadas_y } : undefined,
    tipoPitch: row.tipo_pitch,
    resultado: row.resultado,
    detalleOut: parseDetalle(row.detalle_out),
    detalleHit: parseDetalle(row.detalle_hit),
    timestamp: row.timestamp
  }));

  return NextResponse.json({ turnos });
}
