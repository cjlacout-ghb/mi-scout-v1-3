import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { Partido, Bateador, TurnoAlBate, EstadoPartido } from '@/lib/types';

function parseDetalle(jsonStr: string | null) {
  if (!jsonStr) return undefined;
  try { return JSON.parse(jsonStr); } catch { return undefined; }
}

export async function GET(req: Request) {
  const db = getDb();
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  
  let partidoRow;
  if (id) {
    partidoRow = db.prepare('SELECT * FROM partidos WHERE id = ?').get(id) as any;
  } else {
    // Buscar partido activo (finalizado = 0)
    partidoRow = db.prepare('SELECT * FROM partidos WHERE finalizado = 0 LIMIT 1').get() as any;
  }
  
  if (!partidoRow) {
    return NextResponse.json({ estado: null });
  }

  const partido: Partido = {
    id: partidoRow.id,
    fecha: partidoRow.fecha,
    visitante: partidoRow.visitante,
    local: partidoRow.local,
    descripcion: partidoRow.descripcion,
    innings: partidoRow.innings,
    creadoEn: partidoRow.creado_en,
    finalizado: partidoRow.finalizado === 1
  };

  const bateadoresRows = db.prepare('SELECT * FROM bateadores WHERE partido_id = ? ORDER BY orden ASC').all(partido.id) as any[];
  const turnosRows = db.prepare('SELECT * FROM turnos_al_bate WHERE partido_id = ? ORDER BY timestamp ASC').all(partido.id) as any[];

  const lineupVisitante: Bateador[] = [];
  const lineupLocal: Bateador[] = [];

  bateadoresRows.forEach(row => {
    const b: Bateador = {
      id: row.id,
      orden: row.orden,
      numero: row.numero,
      apellido: row.apellido,
      nombre: row.nombre,
      equipo: row.equipo,
      ladoBateo: row.lado_bateo,
      activo: row.activo === 1,
      esAbridor: row.es_abridor === 1,
      reemplazadoPorId: row.reemplazado_por_id || undefined,
      reemplazadoAInning: row.reemplazado_a_inning || undefined,
      rol: row.rol
    };
    if (b.rol === 'visitante') lineupVisitante.push(b);
    else lineupLocal.push(b);
  });

  const turnosAlBate: TurnoAlBate[] = turnosRows.map(row => ({
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

  const estado: EstadoPartido = {
    partido,
    lineupVisitante,
    lineupLocal,
    turnosAlBate,
    indiceVisitante: partidoRow.indice_visitante,
    indiceLocal: partidoRow.indice_local,
    mitadInning: partidoRow.mitad_inning,
    inningActual: partidoRow.inning_actual,
    vueltasAlOrdenVisitante: partidoRow.vueltas_al_orden_visitante,
    vueltasAlOrdenLocal: partidoRow.vueltas_al_orden_local,
    perspectivaZona: partidoRow.perspectiva_zona
  };

  return NextResponse.json({ estado });
}

export async function POST(req: Request) {
  const db = getDb();
  const body = await req.json();
  const payload = body.payload; // { partido, lineupVisitante, lineupLocal, perspectivaZona }

  // Verificar si ya hay un partido activo
  const activo = db.prepare('SELECT id FROM partidos WHERE finalizado = 0 LIMIT 1').get();
  if (activo) {
    return NextResponse.json({ error: 'Ya hay un partido activo' }, { status: 400 });
  }

  const p = payload.partido;
  
  db.prepare(`
    INSERT INTO partidos (
      id, fecha, visitante, local, descripcion, innings, creado_en, finalizado,
      perspectiva_zona
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
  `).run(
    p.id, p.fecha, p.visitante, p.local, p.descripcion, p.innings, p.creadoEn,
    payload.perspectivaZona || 'catcher'
  );

  const insertBateador = db.prepare(`
    INSERT INTO bateadores (
      id, partido_id, orden, numero, apellido, nombre, equipo, lado_bateo,
      activo, es_abridor, rol
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const saveBateadores = db.transaction((bateadores: Bateador[]) => {
    for (const b of bateadores) {
      insertBateador.run(
        b.id, p.id, b.orden, b.numero, b.apellido, b.nombre || '', b.equipo,
        b.ladoBateo, b.activo ? 1 : 0, b.esAbridor ? 1 : 0, b.rol
      );
    }
  });

  saveBateadores([...payload.lineupVisitante, ...payload.lineupLocal]);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  getDb().prepare('DELETE FROM partidos WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
