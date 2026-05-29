import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PATCH(req: Request) {
  const db = getDb();
  const body = await req.json();
  const { type, payload } = body;

  const activo = db.prepare('SELECT id FROM partidos WHERE finalizado = 0 LIMIT 1').get() as { id: string } | undefined;
  if (!activo) return NextResponse.json({ error: 'No active match' }, { status: 400 });

  const pid = activo.id;

  if (type === 'SET_PERSPECTIVA') {
    db.prepare('UPDATE partidos SET perspectiva_zona = ? WHERE id = ?').run(payload, pid);
  } else if (type === 'SET_BATEADOR_ACTUAL') {
    if (payload.rol === 'visitante') {
      db.prepare('UPDATE partidos SET indice_visitante = ? WHERE id = ?').run(payload.indice, pid);
    } else {
      db.prepare('UPDATE partidos SET indice_local = ? WHERE id = ?').run(payload.indice, pid);
    }
  } else if (type === 'SET_INNING') {
    db.prepare('UPDATE partidos SET inning_actual = ? WHERE id = ?').run(payload, pid);
  } else if (type === 'AVANZAR_BATEADOR' || type === 'CAMBIAR_MITAD_INNING' || type === 'RETROCEDER_MITAD_INNING') {
    // For these full state changes, the client computes the new state and sends it
    // We expect payload to be the full updated EstadoPartido or at least the game state fields
    if (payload.estado) {
        const e = payload.estado;
        db.prepare(`
            UPDATE partidos SET
            indice_visitante = ?, indice_local = ?, mitad_inning = ?, inning_actual = ?,
            vueltas_al_orden_visitante = ?, vueltas_al_orden_local = ?
            WHERE id = ?
        `).run(
            e.indiceVisitante, e.indiceLocal, e.mitadInning, e.inningActual,
            e.vueltasAlOrdenVisitante, e.vueltasAlOrdenLocal, pid
        );
    }
  }

  return NextResponse.json({ success: true });
}
