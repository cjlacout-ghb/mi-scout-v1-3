import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { Bateador } from '@/lib/types';

export async function POST(req: Request) {
  const db = getDb();
  const body = await req.json();
  const { type, payload } = body;

  const activo = db.prepare('SELECT id FROM partidos WHERE finalizado = 0 LIMIT 1').get() as { id: string } | undefined;
  if (!activo) return NextResponse.json({ error: 'No active match' }, { status: 400 });

  const pid = activo.id;
  const insert = db.prepare(`
    INSERT INTO bateadores (
      id, partido_id, orden, numero, apellido, nombre, equipo, lado_bateo,
      activo, es_abridor, rol
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  if (type === 'AGREGAR_BATEADOR') {
    const b = payload;
    insert.run(
      b.id, pid, b.orden, b.numero, b.apellido, b.nombre || '', b.equipo,
      b.ladoBateo, b.activo ? 1 : 0, b.esAbridor ? 1 : 0, b.rol
    );
  } else if (type === 'AGREGAR_BATEADORES_MASIVO') {
    const trx = db.transaction((bateadores: Bateador[]) => {
      for (const b of bateadores) {
        insert.run(
          b.id, pid, b.orden, b.numero, b.apellido, b.nombre || '', b.equipo,
          b.ladoBateo, b.activo ? 1 : 0, b.esAbridor ? 1 : 0, b.rol
        );
      }
    });
    trx(payload);
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const db = getDb();
  const body = await req.json();
  const { type, payload } = body;

  if (type === 'EDITAR_BATEADOR') {
    const sets: string[] = [];
    const values: any[] = [];
    
    for (const [k, v] of Object.entries(payload.datos)) {
      if (k === 'ladoBateo') { sets.push('lado_bateo = ?'); values.push(v); }
      else if (k === 'activo') { sets.push('activo = ?'); values.push(v ? 1 : 0); }
      else if (k === 'esAbridor') { sets.push('es_abridor = ?'); values.push(v ? 1 : 0); }
      else if (k === 'reemplazadoPorId') { sets.push('reemplazado_por_id = ?'); values.push(v); }
      else if (k === 'reemplazadoAInning') { sets.push('reemplazado_a_inning = ?'); values.push(v); }
      else { sets.push(`${k} = ?`); values.push(v); }
    }
    
    if (sets.length > 0) {
      values.push(payload.id);
      db.prepare(`UPDATE bateadores SET ${sets.join(', ')} WHERE id = ?`).run(...values);
    }
  } else if (type === 'SUSTITUIR_BATEADOR') {
    // { salienteId, rol, entrante, inning }
    // En ScoutContext, se muta el saliente, y se inserta el nuevo.
    // Aquí hacemos lo mismo.
    const { salienteId, entrante, inning } = payload;
    
    // Asumimos que el front manda entrante.id, si no, hay que tener cuidado.
    // El front generó un id, lo enviaremos por payload completo desde el middleware.
    // Vamos a pedir que manden 'nuevoId' en el payload.
    
    db.prepare(`
      UPDATE bateadores 
      SET activo = 0, reemplazado_por_id = ?, reemplazado_a_inning = ? 
      WHERE id = ?
    `).run(entrante.id, inning, salienteId);
    
    const saliente = db.prepare('SELECT partido_id, orden FROM bateadores WHERE id = ?').get(salienteId) as any;
    
    db.prepare(`
      INSERT INTO bateadores (
        id, partido_id, orden, numero, apellido, nombre, equipo, lado_bateo,
        activo, es_abridor, rol
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      entrante.id, saliente.partido_id, saliente.orden, entrante.numero, entrante.apellido, 
      entrante.nombre || '', entrante.equipo, entrante.ladoBateo, 1, 0, entrante.rol
    );

  } else if (type === 'REINGRESAR_ABRIDOR') {
    // { id, sustitutoId }
    // En el front calculan sustitutoId (el reemplazadoPorId del abridor)
    const { id, sustitutoId } = payload;
    
    db.prepare(`
      UPDATE bateadores 
      SET activo = 1, reemplazado_por_id = NULL, reemplazado_a_inning = NULL 
      WHERE id = ?
    `).run(id);
    
    if (sustitutoId) {
      db.prepare('UPDATE bateadores SET activo = 0 WHERE id = ?').run(sustitutoId);
    }

  } else if (type === 'REORDENAR_BATEADORES') {
    // { bateadores } -> array de Bateador
    const trx = db.transaction((bateadores: Bateador[]) => {
      const stmt = db.prepare('UPDATE bateadores SET orden = ? WHERE id = ?');
      for (const b of bateadores) {
        stmt.run(b.orden, b.id);
      }
    });
    trx(payload.bateadores);
  }

  return NextResponse.json({ success: true });
}
