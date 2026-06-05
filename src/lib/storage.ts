'use client';

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
// ─── Helpers de estadísticas ───────────────────────────────────────────────────
import type { EstadisticasBateador, ZonaStrike } from './types';

const TIPOS_PITCH: TipoPitch[] = ['drop', 'riser', 'curva', 'cambio', 'screw', 'otro'];

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
    const z = t.zona;
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
      case 'OUT':
        outs++;
        porZona[z].outs++;
        porZona[z].contacto++;
        porPitch[p].ab++;
        break;
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

  const ab = misTurnos.length;
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

// ─── Generador de reporte MD ───────────────────────────────────────────────────
import type { ZonaStrike as ZS } from './types';


export function generarReporteMD(bateador: import('./types').Bateador, stats: EstadisticasBateador, turnos: import('./types').TurnoAlBate[], partido: import('./types').Partido): string {
  let md = `# Reporte de Scouting — ${bateador.apellido}${bateador.nombre ? `, ${bateador.nombre}` : ''} (#${bateador.numero})\n\n`;
  md += `**Equipo:** ${bateador.equipo}\n\n`;
  const avg = stats.promedio.toFixed(3).replace('0.', '.');
  const misTurnos = turnos.filter((t) => t.bateadorId === bateador.id);

  // Zonas calientes (contacto >= 1 hit)
  const zonasCalientes = (Object.entries(stats.porZona) as [string, { hits: number; pitches: number }][])
    .filter(([, v]) => v.hits > 0)
    .sort((a, b) => b[1].hits - a[1].hits);

  const zonasFrias = (Object.entries(stats.porZona) as [string, { hits: number; pitches: number }][])
    .filter(([, v]) => v.pitches > 0 && v.hits === 0)
    .sort((a, b) => b[1].pitches - a[1].pitches);
  md += `**Partido:** ${partido.descripcion}  \n`;
  md += `**Fecha:** ${new Date(partido.fecha).toLocaleDateString('es-AR')}\n\n`;
  md += `---\n\n`;

  md += `## Resumen\n\n`;
  const padC = (v: string | number, l: number) => {
    const s = String(v);
    const pL = Math.floor((l - s.length) / 2);
    return ' '.repeat(Math.max(0, pL)) + s + ' '.repeat(Math.max(0, l - s.length - pL));
  };

  md += `| AB | H | 2B | 3B | HR | K | BB/HBP | AVG  |\n`;
  md += `|----|---|----|----|----|---|--------|------|\n`;
  md += `| ${padC(stats.turnosAlBate, 2)} | ${padC(stats.hits, 1)} | ${padC(stats.dobles, 2)} | ${padC(stats.triples, 2)} | ${padC(stats.homeRuns, 2)} | ${padC(stats.strikeoutsSwinging + stats.strikeoutsLooking, 1)} | ${padC(stats.basesPorBolas, 6)} | ${padC(avg, 4)} |\n\n`;

  md += `---\n\n`;

  if (zonasCalientes.length > 0) {
    md += `## Zonas Calientes\n\n`;
    for (const [z, v] of zonasCalientes) {
      const pct = v.pitches > 0 ? Math.round((v.hits / v.pitches) * 100) : 0;
      md += `- **Zona ${z}**: ${v.hits} hit(s) en ${v.pitches} pitch(es) — ${pct}% efectividad\n`;
    }
    md += '\n';
  }

  if (zonasFrias.length > 0) {
    md += `## Zonas Frías\n\n`;
    for (const [z, v] of zonasFrias) {
      md += `- **Zona ${z}**: 0 hits en ${v.pitches} pitch(es)\n`;
    }
    md += '\n';
  }

  md += `---\n\n`;
  md += `## Detalle de Turnos al Bate\n\n`;
  for (let i = 0; i < misTurnos.length; i++) {
    const t = misTurnos[i];
    md += `### Turno ${i + 1} — Inning ${t.inning}\n\n`;
    md += `- **Zona:** ${t.zona}\n`;
    md += `- **Tipo de pitch:** ${t.tipoPitch.charAt(0).toUpperCase() + t.tipoPitch.slice(1)}\n`;
    md += `- **Resultado:** ${t.resultado}`;
    if (t.detalleOut) {
      md += ` → ${t.detalleOut.tipo.charAt(0).toUpperCase() + t.detalleOut.tipo.slice(1)} al #${t.detalleOut.defensor} (${t.detalleOut.calidad.toUpperCase()})`;
    }
    if (t.detalleHit) {
      md += ` → ${t.detalleHit.tipo.charAt(0).toUpperCase() + t.detalleHit.tipo.slice(1)} a zona ${t.detalleHit.ubicacion} (${t.detalleHit.calidad.toUpperCase()})`;
    }
    md += '\n\n';
  }

  md += `---\n\n*Generado por MiScout v1.1*\n`;
  return md;
}
