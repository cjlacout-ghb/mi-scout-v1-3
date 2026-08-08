'use client';

import { db } from '@/lib/dbClient';
import type { EstadoPartido, Bateador, TurnoAlBate, Partido, TipoPitch } from './types';

export const estadoInicial: EstadoPartido = {
  partido: null,
  lineupVisitante: [],
  lineupLocal: [],
  turnosAlBate: [],
  indiceVisitante: 0,
  indiceLocal: 0,
  mitadInning: 'alta',
  inningActual: 1,
  vueltasAlOrdenVisitante: 0,
  vueltasAlOrdenLocal: 0,
  perspectivaZona: 'catcher',
};

// UUID simple sin dependencias externas
export function generarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function normalizarNombre(nombre: string | undefined | null): string {
  if (!nombre) return '';
  return nombre
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ');
}

export function normalizarCamposBateador<T extends Record<string, any>>(
  obj: T
): T {
  const copia = { ...obj };

  if ('nombre' in copia) {
    (copia as any).nombre = normalizarNombre(copia.nombre);
  }
  if ('apellido' in copia) {
    (copia as any).apellido = normalizarNombre(copia.apellido);
  }
  if ('equipo' in copia) {
    (copia as any).equipo = normalizarNombre(copia.equipo);
  }

  return copia;
}

// ─── Helpers de estadísticas ───────────────────────────────────────────────────
import type { EstadisticasBateador, ZonaStrike } from './types';

const TIPOS_PITCH: TipoPitch[] = ['drop', 'riser', 'curva', 'cambio', 'screw', 'otro'];

// Derivar zona desde coordenadas canónicas (catcher).
// Inner zone ocupa 20%-80% en ambos ejes.
function zonaDesdeCoords(x: number, y: number): ZonaStrike {
  const inner = x >= 0.2 && x <= 0.8 && y >= 0.2 && y <= 0.8;
  const left = x < 0.5;
  const top = y < 0.5;
  if (inner) {
    if (top && left) return 3;
    if (top && !left) return 4;
    if (!top && left) return 1;
    return 2;
  }
  if (top && left) return 7;
  if (top && !left) return 8;
  if (!top && left) return 5;
  return 6;
}

function zonaReal(t: TurnoAlBate): ZonaStrike {
  if (t.coordenadas) return zonaDesdeCoords(t.coordenadas.x, t.coordenadas.y);
  return t.zona;
}

export function calcularEstadisticas(
  bateadorId: string,
  turnos: TurnoAlBate[]
): EstadisticasBateador {
  const misTurnos = turnos.filter((t) => t.bateadorId === bateadorId);

  const porZona = {} as EstadisticasBateador['porZona'];
  for (let z = 1; z <= 8; z++) {
    porZona[z as ZonaStrike] = { pitches: 0, hits: 0, outs: 0, contacto: 0, ks: 0, kl: 0, bb: 0 };
  }

  const porPitch = {} as EstadisticasBateador['porPitch'];
  for (const p of TIPOS_PITCH) {
    porPitch[p] = { pitches: 0, hits: 0, ab: 0, ks: 0, kl: 0 };
  }

  let hits = 0, dobles = 0, triples = 0, homeRuns = 0;
  let ks = 0, kl = 0, bb = 0, outs = 0;

  for (const t of misTurnos) {
    const z = zonaReal(t);
    const p = t.tipoPitch;
    porZona[z].pitches++;
    porPitch[p].pitches++;

    switch (t.resultado) {
      case 'HIT':
        hits++;
        porZona[z].hits++;
        porZona[z].contacto++;
        porPitch[p].hits++;
        porPitch[p].ab++;
        if (t.detalleHit?.tipo === 'doble') dobles++;
        if (t.detalleHit?.tipo === 'triple') triples++;
        if (t.detalleHit?.tipo === 'homerun') homeRuns++;
        break;
      case 'ERROR':
        porZona[z].contacto++;
        porPitch[p].ab++;
        break;
      case 'OUT': {
        const esSacrificio = t.detalleOut?.tipo === 'sac fly' || t.detalleOut?.tipo === 'sac bunt';
        outs++;
        porZona[z].outs++;
        porZona[z].contacto++;
        if (!esSacrificio) {
          porPitch[p].ab++;
        }
        break;
      }
      case 'KS':
        ks++;
        porZona[z].ks++;
        porPitch[p].ks++;
        porPitch[p].ab++;
        break;
      case 'KL':
        kl++;
        porZona[z].kl++;
        porPitch[p].kl++;
        porPitch[p].ab++;
        break;
      case 'BB':
      case 'HBP':
        bb++;
        porZona[z].bb++;
        break;
    }
  }

  const sacCount = misTurnos.filter(t => t.resultado === 'OUT' && (t.detalleOut?.tipo === 'sac fly' || t.detalleOut?.tipo === 'sac bunt')).length;
  const ab = misTurnos.length - bb - sacCount;
  const promedio = ab > 0 ? hits / ab : 0;

  return {
    bateadorId,
    turnosAlBate: ab,
    hits,
    dobles,
    triples,
    homeRuns,
    strikeoutsSwinging: ks,
    strikeoutsLooking: kl,
    basesPorBolas: bb,
    outs,
    promedio,
    porZona,
    porPitch,
  };
}

export async function obtenerTurnosAcumulados(
  apellido: string,
  numero: string,
  equipo: string,
  nombre?: string
): Promise<TurnoAlBate[]> {
  let batters = await db.bateadores
    .where('[apellido+numero+equipo]')
    .equals([apellido, numero, equipo])
    .toArray();
    
  if (nombre) {
    const nombreNormalizado = normalizarNombre(nombre);
    batters = batters.filter(
      (b) => normalizarNombre(b.nombre) === nombreNormalizado
    );
  }
  
  const ids = batters.map((b) => b.id);
  return db.turnos_al_bate.where('bateadorId').anyOf(ids).toArray();
}

export function calcularHeatMap(turnos: TurnoAlBate[]): Partial<Record<ZonaStrike, number>> {
  const heatMap: Partial<Record<ZonaStrike, number>> = {};
  for (let z = 1; z <= 8; z++) {
    const zona = z as ZonaStrike;
    const zt = turnos.filter((t) => zonaReal(t) === zona);
    const hits = zt.filter((t) => t.resultado === 'HIT').length;
    const outs = zt.filter((t) => t.resultado === 'OUT' && t.detalleOut?.tipo !== 'sac fly' && t.detalleOut?.tipo !== 'sac bunt').length;
    const ks = zt.filter((t) => t.resultado === 'KS').length;
    const kl = zt.filter((t) => t.resultado === 'KL').length;
    const err = zt.filter((t) => t.resultado === 'ERROR').length;
    const ab = hits + outs + ks + kl + err;
    heatMap[zona] = ab > 0 ? hits / ab : -1;
  }
  return heatMap;
}

// ─── Generador de reporte MD ───────────────────────────────────────────────────
import type { ZonaStrike as ZS } from './types';


export function generarReporteMD(bateador: import('./types').Bateador, stats: EstadisticasBateador, turnos: import('./types').TurnoAlBate[], partido: import('./types').Partido): string {
  let md = `# Reporte de Scouting — ${bateador.apellido}${bateador.nombre ? `, ${bateador.nombre}` : ''} (#${bateador.numero})\n\n`;
  md += `Equipo: ${bateador.equipo}\n\n`;
  const avg = stats.promedio.toFixed(3).replace('0.', '.');
  const misTurnos = turnos.filter((t) => t.bateadorId === bateador.id);

  // Zonas calientes (contacto >= 1 hit)
  const zonasCalientes = (Object.entries(stats.porZona) as [string, { hits: number; pitches: number }][])
    .filter(([, v]) => v.hits > 0)
    .sort((a, b) => b[1].hits - a[1].hits);

  const zonasFrias = (Object.entries(stats.porZona) as [string, { hits: number; pitches: number; outs: number; ks: number; kl: number }][])
    .filter(([, v]) => {
      const ab = v.hits + v.outs + v.ks + v.kl;
      return ab > 0 && v.hits === 0;
    })
    .sort((a, b) => b[1].pitches - a[1].pitches);
  md += `Partido: ${partido.descripcion}  \n`;
  md += `Fecha: ${new Date(partido.fecha + 'T12:00:00').toLocaleDateString('es-AR')}\n\n`;
  md += `---\n\n`;

  md += `## Resumen\n\n`;
  md += `AB:${stats.turnosAlBate} H:${stats.hits} 2B:${stats.dobles} 3B:${stats.triples} HR:${stats.homeRuns} K:${stats.strikeoutsSwinging + stats.strikeoutsLooking} BB:${stats.basesPorBolas} AVG:${avg}\n\n`;

  md += `---\n\n`;

  if (zonasCalientes.length > 0) {
    md += `## Zonas Calientes\n\n`;
    for (const [z, v] of zonasCalientes) {
      const pct = v.pitches > 0 ? Math.round((v.hits / v.pitches) * 100) : 0;
      md += `- Zona ${z}: ${v.hits} hit(s) en ${v.pitches} pitch(es) — ${pct}% efectividad\n`;
    }
    md += '\n';
  }

  if (zonasFrias.length > 0) {
    md += `## Zonas Frías\n\n`;
    for (const [z, v] of zonasFrias) {
      md += `- Zona ${z}: 0 hits en ${v.pitches} pitch(es)\n`;
    }
    md += '\n';
  }

  md += `---\n\n`;
  md += `## Detalle de Turnos al Bate\n\n`;
  for (let i = 0; i < misTurnos.length; i++) {
    const t = misTurnos[i];
    md += `### Turno ${i + 1} — Inning ${t.inning}\n\n`;
    md += `- Zona: ${t.zona}\n`;
    md += `- Tipo de pitch: ${t.tipoPitch.charAt(0).toUpperCase() + t.tipoPitch.slice(1)}\n`;
    md += `- Resultado: ${t.resultado}`;
    if (t.detalleOut) {
      if (t.resultado === 'ERROR') {
        md += ` → Error al ${t.detalleOut.defensor} (${t.detalleOut.calidad.toUpperCase()})`;
      } else {
        md += ` → ${t.detalleOut.tipo.charAt(0).toUpperCase() + t.detalleOut.tipo.slice(1)} al ${t.detalleOut.defensor} (${t.detalleOut.calidad.toUpperCase()})`;
      }
    }
    if (t.detalleHit) {
      md += ` → ${t.detalleHit.tipo.charAt(0).toUpperCase() + t.detalleHit.tipo.slice(1)} al ${t.detalleHit.ubicacion} (${t.detalleHit.calidad.toUpperCase()})`;
    }
    md += '\n\n';
  }

  if (bateador.notas && bateador.notas.trim() !== '') {
    md += `---\n\n## Notas sobre el jugador\n\n${bateador.notas.trim()}\n\n`;
  }

  md += `---\n\nGenerado por MiScout v1.3\n`;
  return md;
}

