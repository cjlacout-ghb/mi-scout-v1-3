import Dexie, { type Table } from 'dexie';
import type { Partido, Bateador, TurnoAlBate, EstadoPartido } from './types';

// Extend Partido type for Dexie to include running game state fields
export interface PartidoDB extends Partido {
  indiceVisitante?: number;
  indiceLocal?: number;
  mitadInning?: 'alta' | 'baja';
  inningActual?: number;
  vueltasAlOrdenVisitante?: number;
  vueltasAlOrdenLocal?: number;
  perspectivaZona?: 'catcher' | 'pitcher';
}

export class MiScoutDatabase extends Dexie {
  partidos!: Table<PartidoDB, string>;
  bateadores!: Table<Bateador, string>;
  turnos_al_bate!: Table<TurnoAlBate, string>;

  constructor() {
    super('MiScoutDatabase');
    this.version(1).stores({
      partidos: 'id, fecha, finalizado',
      bateadores: 'id, partidoId, rol, [apellido+numero+equipo]',
      turnos_al_bate: 'id, partidoId, bateadorId',
    });
  }
}

export const db = new MiScoutDatabase();

export async function getEstadoPartido(partidoId: string): Promise<EstadoPartido> {
  const partido = await db.partidos.get(partidoId);
  if (!partido) throw new Error('Partido no encontrado');
  
  const bateadoresArr = await db.bateadores.where('partidoId').equals(partidoId).toArray();
  const bateadores = bateadoresArr.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const turnosAlBate = await db.turnos_al_bate.where('partidoId').equals(partidoId).toArray();
  
  // Parche para sustitutos que se guardaron sin "rol" (solo en memoria)
  for (const b of bateadores) {
    if (!b.rol) {
      const saliente = bateadores.find(x => x.reemplazadoPorId === b.id);
      if (saliente && saliente.rol) {
        b.rol = saliente.rol;
      }
    }
  }

  const lineupVisitante = bateadores.filter(b => b.rol === 'visitante');
  const lineupLocal = bateadores.filter(b => b.rol === 'local');
  
  return {
    partido,
    lineupVisitante,
    lineupLocal,
    turnosAlBate,
    indiceVisitante: partido.indiceVisitante ?? 0,
    indiceLocal: partido.indiceLocal ?? 0,
    mitadInning: partido.mitadInning ?? 'alta',
    inningActual: partido.inningActual ?? 1,
    vueltasAlOrdenVisitante: partido.vueltasAlOrdenVisitante ?? 0,
    vueltasAlOrdenLocal: partido.vueltasAlOrdenLocal ?? 0,
    perspectivaZona: partido.perspectivaZona ?? 'catcher',
  };
}

export async function getPartidoActivo(): Promise<EstadoPartido | null> {
  const partido = await db.partidos.filter(p => !p.finalizado).first();
  if (!partido) return null;
  return getEstadoPartido(partido.id);
}

