import { Locale } from './types';

type ValueLabelEntry = Record<Locale, string> & { es_short?: string; en_short?: string };

export const valueLabels: Record<string, ValueLabelEntry> = {
  'drop': { es: 'Drop', en: 'Drop' },
  'riser': { es: 'Riser', en: 'Riser' },
  'curva': { es: 'Curva', en: 'Curve' },
  'cambio': { es: 'Cambio', en: 'Changeup' },
  'screw': { es: 'Screw', en: 'Screw' },
  'otro': { es: 'Otro', en: 'Other' },
  
  'asistencia': { es: 'Asistencia', en: 'Assisted', es_short: 'asistencia', en_short: 'assist' },
  'sac bunt': { es: 'Sac Bunt', en: 'Sac bunt', es_short: 'sac bunt', en_short: 'sac bunt' },
  'sac fly': { es: 'Sac Fly', en: 'Sac fly', es_short: 'sac fly', en_short: 'sac fly' },
  'fly': { es: 'Fly', en: 'Fly', es_short: 'fly', en_short: 'fly ball' },
  'linea': { es: 'Línea', en: 'Line out', es_short: 'línea', en_short: 'line out' },
  'error': { es: 'Error', en: 'Error', es_short: 'error', en_short: 'error' },

  'soft': { es: 'soft', en: 'soft' },
  'hard': { es: 'hard', en: 'hard' },

  'single': { es: 'Single', en: 'Single', es_short: 'single', en_short: 'single' },
  'doble': { es: 'Doble', en: 'Double', es_short: 'doble', en_short: 'double' },
  'triple': { es: 'Triple', en: 'Triple', es_short: 'triple', en_short: 'triple' },
  'homerun': { es: 'Home run', en: 'Home run', es_short: 'homerun', en_short: 'homerun' },
  'infield hit': { es: 'Infield hit', en: 'Infield hit', es_short: 'infield hit', en_short: 'infield hit' },
  'bunt': { es: 'Bunt hit', en: 'Bunt hit', es_short: 'bunt', en_short: 'bunt' },

  'alta': { es: 'Alta', en: 'Top' },
  'baja': { es: 'Baja', en: 'Bottom' },
  'visitante': { es: 'Visitante', en: 'Away' },
  'local': { es: 'Local', en: 'Home' },
  'catcher': { es: 'Catcher', en: 'Catcher' },
  'pitcher': { es: 'Pitcher', en: 'Pitcher' },
  // Lado de bateo — forma completa (usada en ModalBateador)
  'D': { es: 'Derecho', en: 'Right', es_short: 'D', en_short: 'R' },
  'Z': { es: 'Zurdo',   en: 'Left',  es_short: 'Z', en_short: 'L' },
  'S': { es: 'Switch',  en: 'Switch', es_short: 'S', en_short: 'S' },
  // Fix defensivo: registros históricos guardados en minúscula por bug anterior
  'd': { es: 'Derecho', en: 'Right', es_short: 'D', en_short: 'R' },
  'z': { es: 'Zurdo',   en: 'Left',  es_short: 'Z', en_short: 'L' },
  's': { es: 'Switch',  en: 'Switch', es_short: 'S', en_short: 'S' },

  // Descripciones de tipos de out (se pueden mapear aqui usando un sufijo o usar dict, pero como están asociadas al value)
  'asistencia_desc': { es: 'Rodado', en: 'Ground ball' },
  'fly_desc': { es: 'Elevado', en: 'Fly ball' },
  'sac bunt_desc': { es: 'Toque de sacrificio', en: 'Sacrifice bunt' },
  'sac fly_desc': { es: 'Elevado de sacrificio', en: 'Sacrifice fly' },
  'linea_desc': { es: 'Line out', en: 'Line drive' },
  
  // Calidad contacto
  'soft_desc': { es: 'Contacto débil', en: 'Weak contact' },
  'hard_desc': { es: 'Contacto fuerte', en: 'Hard contact' },
};
