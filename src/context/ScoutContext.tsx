'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { EstadoPartido, Bateador, TurnoAlBate, Partido } from '@/lib/types';
import { estadoInicial, generarId } from '@/lib/storage';

// ─── Acciones ─────────────────────────────────────────────────────────────────
export type Accion =
  | { type: 'INICIAR_PARTIDO'; payload: { partido: Partido; lineupVisitante: Bateador[]; lineupLocal: Bateador[]; perspectivaZona?: 'catcher' | 'pitcher' } }
  | { type: 'NUEVO_PARTIDO' }
  | { type: 'FINALIZAR_PARTIDO' }
  | { type: 'AGREGAR_BATEADOR'; payload: Omit<Bateador, 'id'> }
  | { type: 'AGREGAR_BATEADORES_MASIVO'; payload: Array<Omit<Bateador, 'id'>> }
  | { type: 'EDITAR_BATEADOR'; payload: { id: string; rol: 'visitante' | 'local'; datos: Partial<Omit<Bateador, 'id'>> } }
  | { type: 'REORDENAR_BATEADORES'; payload: { rol: 'visitante' | 'local'; bateadores: Bateador[] } }
  | { type: 'SUSTITUIR_BATEADOR'; payload: { salienteId: string; rol: 'visitante' | 'local'; entrante: Omit<Bateador, 'id' | 'orden'>; inning: number } }
  | { type: 'REINGRESAR_ABRIDOR'; payload: { id: string; rol: 'visitante' | 'local' } }
  | { type: 'REGISTRAR_TURNO'; payload: Omit<TurnoAlBate, 'id' | 'timestamp'> }
  | { type: 'AVANZAR_BATEADOR' }
  | { type: 'CAMBIAR_MITAD_INNING' }
  | { type: 'RETROCEDER_MITAD_INNING' }
  | { type: 'SET_BATEADOR_ACTUAL'; payload: { rol: 'visitante' | 'local'; indice: number } }
  | { type: 'SET_INNING'; payload: number }
  | { type: 'EDITAR_TURNO_AL_BATE'; payload: { id: string; datos: Partial<Omit<TurnoAlBate, 'id' | 'timestamp'>> } }
  | { type: 'ELIMINAR_TURNO_AL_BATE'; payload: string }
  | { type: 'SET_PERSPECTIVA'; payload: 'catcher' | 'pitcher' }
  | { type: 'SET_EQUIPO_AL_BATE'; payload: 'visitante' | 'local' }
  | { type: 'CARGAR_ESTADO'; payload: EstadoPartido }
  | { type: 'SELECCIONAR_JUGADOR'; payload: string | null };

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(estado: EstadoPartido, accion: Accion): EstadoPartido {
  switch (accion.type) {
    case 'CARGAR_ESTADO':
      return accion.payload;

    case 'NUEVO_PARTIDO':
      return estadoInicial;

    case 'FINALIZAR_PARTIDO':
      if (estado.partido) {
        return { ...estado, partido: { ...estado.partido, finalizado: true } };
      }
      return estado;

    case 'INICIAR_PARTIDO':
      return {
        ...estadoInicial,
        partido: accion.payload.partido,
        lineupVisitante: accion.payload.lineupVisitante,
        lineupLocal: accion.payload.lineupLocal,
        perspectivaZona: accion.payload.perspectivaZona || 'catcher',
      };

    case 'SET_PERSPECTIVA':
      return { ...estado, perspectivaZona: accion.payload };

    case 'AGREGAR_BATEADOR': {
      const nuevo: Bateador = { ...accion.payload, id: (accion as any)._id || generarId() };
      const isVisitante = nuevo.rol === 'visitante';
      const lineup = isVisitante ? estado.lineupVisitante : estado.lineupLocal;
      const newLineup = [...lineup, nuevo];
      
      const newState = {
        ...estado,
        [isVisitante ? 'lineupVisitante' : 'lineupLocal']: newLineup
      };

      if ((accion.payload as any).hacerActivo) {
        const nuevosActivos = newLineup.filter(b => b.activo);
        if (isVisitante) {
          newState.indiceVisitante = nuevosActivos.length - 1;
          newState.jugadorSeleccionadoId = null;
        } else {
          newState.indiceLocal = nuevosActivos.length - 1;
          newState.jugadorSeleccionadoId = null;
        }
      }
      
      return newState as EstadoPartido;
    }

    case 'AGREGAR_BATEADORES_MASIVO': {
      if (accion.payload.length === 0) return estado;
      const rol = accion.payload[0].rol;
      // Use pre-generated IDs if available in the payload, otherwise generate
      const ids = (accion as any)._ids || accion.payload.map(() => generarId());
      const nuevos: Bateador[] = accion.payload.map((b, i) => ({ ...b, id: ids[i] }));
      if (rol === 'visitante') {
        return { ...estado, lineupVisitante: [...estado.lineupVisitante, ...nuevos] };
      }
      return { ...estado, lineupLocal: [...estado.lineupLocal, ...nuevos] };
    }

    case 'EDITAR_BATEADOR': {
      const isVisitante = accion.payload.rol === 'visitante';
      const lineup = isVisitante ? estado.lineupVisitante : estado.lineupLocal;
      const newLineup = lineup.map((b) =>
        b.id === accion.payload.id ? { ...b, ...accion.payload.datos } : b
      );
      if (isVisitante) return { ...estado, lineupVisitante: newLineup };
      return { ...estado, lineupLocal: newLineup };
    }

    case 'REORDENAR_BATEADORES': {
      if (accion.payload.rol === 'visitante') {
        return { ...estado, lineupVisitante: accion.payload.bateadores };
      }
      return { ...estado, lineupLocal: accion.payload.bateadores };
    }

    case 'SUSTITUIR_BATEADOR': {
      const { salienteId, rol, entrante, inning } = accion.payload;
      const isVisitante = rol === 'visitante';
      const lineup = isVisitante ? estado.lineupVisitante : estado.lineupLocal;
      
      const saliente = lineup.find((b) => b.id === salienteId);
      if (!saliente) return estado;

      const nuevoId = (accion as any)._nuevoId || generarId();
      const newLineup = lineup.map((b) => {
        if (b.id === salienteId) {
          return { ...b, activo: false, reemplazadoPorId: nuevoId, reemplazadoAInning: inning };
        }
        return b;
      });

      const nuevoBateador: Bateador = {
        ...entrante,
        rol,
        id: nuevoId,
        orden: saliente.orden,
        activo: true,
      };

      const idx = newLineup.findIndex((b) => b.id === salienteId);
      newLineup.splice(idx + 1, 0, nuevoBateador);

      if (isVisitante) return { ...estado, lineupVisitante: newLineup };
      return { ...estado, lineupLocal: newLineup };
    }

    case 'REINGRESAR_ABRIDOR': {
      const { id, rol } = accion.payload;
      const isVisitante = rol === 'visitante';
      const lineup = isVisitante ? estado.lineupVisitante : estado.lineupLocal;
      
      const abridor = lineup.find((b) => b.id === id);
      if (!abridor || !abridor.esAbridor || abridor.activo) return estado;

      const sustitutoId = abridor.reemplazadoPorId;

      const newLineup = lineup.map((b) => {
        if (b.id === id) {
          return { ...b, activo: true, reemplazadoPorId: undefined, reemplazadoAInning: undefined };
        }
        if (b.id === sustitutoId) {
          return { ...b, activo: false };
        }
        return b;
      });

      if (isVisitante) return { ...estado, lineupVisitante: newLineup };
      return { ...estado, lineupLocal: newLineup };
    }

    case 'REGISTRAR_TURNO': {
      const turno: TurnoAlBate = {
        ...accion.payload,
        id: (accion as any)._id || generarId(),
        timestamp: (accion as any)._timestamp || new Date().toISOString(),
      };
      return { ...estado, turnosAlBate: [...estado.turnosAlBate, turno] };
    }

    case 'EDITAR_TURNO_AL_BATE': {
      const turnosAlBate = estado.turnosAlBate.map((t) =>
        t.id === accion.payload.id ? { ...t, ...accion.payload.datos } : t
      );
      return { ...estado, turnosAlBate };
    }

    case 'ELIMINAR_TURNO_AL_BATE': {
      const turnosAlBate = estado.turnosAlBate.filter((t) => t.id !== accion.payload);
      return { ...estado, turnosAlBate };
    }

    case 'AVANZAR_BATEADOR': {
      const isVisitante = estado.mitadInning === 'alta';
      const lineup = isVisitante ? estado.lineupVisitante : estado.lineupLocal;
      const activos = lineup.filter((b) => b.activo);
      if (activos.length === 0) return estado;
      
      const indiceActual = isVisitante ? estado.indiceVisitante : estado.indiceLocal;
      let siguiente = indiceActual + 1;
      if (activos.length >= 9) {
        siguiente = siguiente % activos.length;
      }
      
      if (isVisitante) {
        const vueltas = siguiente < indiceActual ? estado.vueltasAlOrdenVisitante + 1 : estado.vueltasAlOrdenVisitante;
        return { ...estado, indiceVisitante: siguiente, vueltasAlOrdenVisitante: vueltas };
      } else {
        const vueltas = siguiente < indiceActual ? estado.vueltasAlOrdenLocal + 1 : estado.vueltasAlOrdenLocal;
        return { ...estado, indiceLocal: siguiente, vueltasAlOrdenLocal: vueltas };
      }
    }

    case 'CAMBIAR_MITAD_INNING': {
      const nuevoMitad = estado.mitadInning === 'alta' ? 'baja' : 'alta';
      const nuevoInning = estado.mitadInning === 'alta' ? estado.inningActual : estado.inningActual + 1;
      const isVisitante = nuevoMitad === 'alta';
      const lineup = isVisitante ? estado.lineupVisitante : estado.lineupLocal;
      const activos = lineup.filter(b => b.activo);
      
      let nuevoIndice = isVisitante ? estado.indiceVisitante : estado.indiceLocal;
      
      const turnosEquipo = estado.turnosAlBate.filter(t => activos.some(b => b.id === t.bateadorId));
      if (turnosEquipo.length > 0) {
        const ultimoTurno = turnosEquipo[turnosEquipo.length - 1];
        const lastBatterIndex = activos.findIndex(b => b.id === ultimoTurno.bateadorId);
        if (lastBatterIndex !== -1) {
          nuevoIndice = lastBatterIndex + 1;
          if (activos.length >= 9) {
            nuevoIndice = nuevoIndice % activos.length;
          }
        }
      } else {
        nuevoIndice = 0;
      }

      if (isVisitante) {
        return { ...estado, mitadInning: nuevoMitad, inningActual: nuevoInning, indiceVisitante: nuevoIndice };
      } else {
        return { ...estado, mitadInning: nuevoMitad, inningActual: nuevoInning, indiceLocal: nuevoIndice };
      }
    }

    case 'RETROCEDER_MITAD_INNING': {
      const nuevoMitad = estado.mitadInning === 'baja' ? 'alta' : 'baja';
      const nuevoInning = estado.mitadInning === 'baja' ? estado.inningActual : Math.max(1, estado.inningActual - 1);
      if (nuevoInning === estado.inningActual && estado.mitadInning === 'alta') return estado;

      const isVisitante = nuevoMitad === 'alta';
      const lineup = isVisitante ? estado.lineupVisitante : estado.lineupLocal;
      const activos = lineup.filter(b => b.activo);
      
      let nuevoIndice = isVisitante ? estado.indiceVisitante : estado.indiceLocal;
      
      const turnosEquipo = estado.turnosAlBate.filter(t => activos.some(b => b.id === t.bateadorId));
      if (turnosEquipo.length > 0) {
        const ultimoTurno = turnosEquipo[turnosEquipo.length - 1];
        const lastBatterIndex = activos.findIndex(b => b.id === ultimoTurno.bateadorId);
        if (lastBatterIndex !== -1) {
          nuevoIndice = lastBatterIndex + 1;
          if (activos.length >= 9) {
            nuevoIndice = nuevoIndice % activos.length;
          }
        }
      } else {
        nuevoIndice = 0;
      }

      if (isVisitante) {
        return { ...estado, mitadInning: nuevoMitad, inningActual: nuevoInning, indiceVisitante: nuevoIndice };
      } else {
        return { ...estado, mitadInning: nuevoMitad, inningActual: nuevoInning, indiceLocal: nuevoIndice };
      }
    }

    case 'SET_BATEADOR_ACTUAL': {
      if (accion.payload.rol === 'visitante') {
        return { ...estado, indiceVisitante: accion.payload.indice, jugadorSeleccionadoId: null };
      }
      return { ...estado, indiceLocal: accion.payload.indice, jugadorSeleccionadoId: null };
    }

    case 'SET_INNING':
      return { ...estado, inningActual: accion.payload };

    case 'SET_EQUIPO_AL_BATE':
      return { ...estado, mitadInning: accion.payload === 'visitante' ? 'alta' : 'baja' };

    case 'SELECCIONAR_JUGADOR':
      return { ...estado, jugadorSeleccionadoId: accion.payload };

    default:
      return estado;
  }
}

// ─── API Sync ─────────────────────────────────────────────────────────────────
async function syncApi(accion: Accion, nuevoEstado: EstadoPartido, oldEstado: EstadoPartido) {
  try {
    switch (accion.type) {
      case 'INICIAR_PARTIDO':
        await fetch('/api/partido', { method: 'POST', body: JSON.stringify(accion) });
        break;
      case 'NUEVO_PARTIDO':
      case 'FINALIZAR_PARTIDO':
        // En vez de DELETE, llamamos a finalizar
        await fetch('/api/partido/finalizar', { method: 'POST' });
        break;
      case 'SET_PERSPECTIVA':
      case 'SET_BATEADOR_ACTUAL':
      case 'SET_INNING':
      case 'AVANZAR_BATEADOR':
      case 'CAMBIAR_MITAD_INNING':
      case 'RETROCEDER_MITAD_INNING':
      case 'SELECCIONAR_JUGADOR':
        await fetch('/api/partido/estado', {
          method: 'PATCH',
          body: JSON.stringify({
            type: accion.type,
            payload: 'payload' in accion ? accion.payload : { estado: nuevoEstado }
          })
        });
        break;
      case 'AGREGAR_BATEADOR': {
        const _id = (accion as any)._id;
        const b = { ...accion.payload, id: _id };
        await fetch('/api/bateadores', { method: 'POST', body: JSON.stringify({ type: accion.type, payload: b }) });
        break;
      }
      case 'AGREGAR_BATEADORES_MASIVO': {
        const _ids = (accion as any)._ids;
        const bs = accion.payload.map((b, i) => ({ ...b, id: _ids[i] }));
        await fetch('/api/bateadores', { method: 'POST', body: JSON.stringify({ type: accion.type, payload: bs }) });
        break;
      }
      case 'EDITAR_BATEADOR':
      case 'REORDENAR_BATEADORES':
        await fetch('/api/bateadores', { method: 'PATCH', body: JSON.stringify(accion) });
        break;
      case 'SUSTITUIR_BATEADOR': {
        const entranteId = (accion as any)._nuevoId;
        const _entrante = { ...accion.payload.entrante, id: entranteId, rol: accion.payload.rol };
        await fetch('/api/bateadores', { method: 'PATCH', body: JSON.stringify({
          type: accion.type,
          payload: { ...accion.payload, entrante: _entrante }
        })});
        break;
      }
      case 'REINGRESAR_ABRIDOR': {
        // Compute sustitutoId to send
        const lineup = accion.payload.rol === 'visitante' ? oldEstado.lineupVisitante : oldEstado.lineupLocal;
        const abridor = lineup.find(b => b.id === accion.payload.id);
        const sustitutoId = abridor?.reemplazadoPorId;
        await fetch('/api/bateadores', { method: 'PATCH', body: JSON.stringify({
          type: accion.type,
          payload: { ...accion.payload, sustitutoId }
        })});
        break;
      }
      case 'REGISTRAR_TURNO': {
        const t: TurnoAlBate = {
          ...accion.payload,
          id: (accion as any)._id,
          timestamp: (accion as any)._timestamp,
        };
        await fetch('/api/turnos', { method: 'POST', body: JSON.stringify(t) });
        break;
      }
      case 'EDITAR_TURNO_AL_BATE':
        await fetch('/api/turnos', { method: 'PATCH', body: JSON.stringify(accion.payload) });
        break;
      case 'ELIMINAR_TURNO_AL_BATE':
        await fetch(`/api/turnos?id=${accion.payload}`, { method: 'DELETE' });
        break;
    }
  } catch (error) {
    console.error('Error syncing to API:', error);
  }
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
interface ContextType {
  estado: EstadoPartido;
  dispatch: React.Dispatch<Accion>;
  bateadorActual: Bateador | null;
  bateadoresActivos: Bateador[];
  equipoAlBate: 'visitante' | 'local';
  isLoading: boolean;
}

const ScoutContext = createContext<ContextType | null>(null);

export function ScoutProvider({ children }: { children: React.ReactNode }) {
  const [estado, _dispatch] = useReducer(reducer, estadoInicial);
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const estadoRef = React.useRef(estado);
  React.useEffect(() => {
    estadoRef.current = estado;
  }, [estado]);

  // Custom dispatch to handle API sync side-effects and inject IDs
  const dispatch = useCallback(async (accion: Accion) => {
    const currentState = estadoRef.current;
    
    // Inject IDs for creates so we know them synchronously for API and Reducer
    if (accion.type === 'AGREGAR_BATEADOR') (accion as any)._id = generarId();
    if (accion.type === 'AGREGAR_BATEADORES_MASIVO') (accion as any)._ids = accion.payload.map(() => generarId());
    if (accion.type === 'SUSTITUIR_BATEADOR') (accion as any)._nuevoId = generarId();
    if (accion.type === 'REGISTRAR_TURNO') {
      (accion as any)._id = generarId();
      (accion as any)._timestamp = new Date().toISOString();
    }

    // 1. Update React State immediately (optimistic UI)
    _dispatch(accion);

    // 2. Compute new state for some actions
    const nuevoEstado = reducer(currentState, accion);

    // 3. Sync to API in background
    if (accion.type !== 'CARGAR_ESTADO') {
      syncApi(accion, nuevoEstado, currentState);
    }
  }, []);

  // Fetch initial state from API
  useEffect(() => {
    fetch('/api/partido')
      .then(r => r.json())
      .then(data => {
        if (data.estado && data.estado.partido) {
          dispatch({ type: 'CARGAR_ESTADO', payload: data.estado });
        }
        setMounted(true);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching initial state', err);
        setMounted(true);
        setIsLoading(false);
      });
  }, []);

  const equipoAlBate = estado.mitadInning === 'alta' ? 'visitante' : 'local';
  const lineupActual = (equipoAlBate === 'visitante' ? estado.lineupVisitante : estado.lineupLocal) || [];
  const bateadoresActivos = lineupActual.filter((b) => b.activo);
  const indiceActivo = equipoAlBate === 'visitante' ? (estado.indiceVisitante || 0) : (estado.indiceLocal || 0);
  
  let bateadorActual = bateadoresActivos[indiceActivo] ?? null;

  // Si hay un jugador seleccionado explícitamente, usar ese siempre.
  if (estado.jugadorSeleccionadoId) {
    const todos = [...(estado.lineupVisitante || []), ...(estado.lineupLocal || [])];
    const seleccionado = todos.find(b => b.id === estado.jugadorSeleccionadoId);
    if (seleccionado) {
      bateadorActual = seleccionado;
    }
  }

  return (
    <ScoutContext.Provider value={{ estado, dispatch, bateadorActual, bateadoresActivos, equipoAlBate, isLoading }}>
      {children}
    </ScoutContext.Provider>
  );
}

export function useScout() {
  const ctx = useContext(ScoutContext);
  if (!ctx) throw new Error('useScout debe usarse dentro de ScoutProvider');
  return ctx;
}
