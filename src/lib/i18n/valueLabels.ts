import { Locale } from './types';

type ValueLabelEntry = Record<Locale, string> & { es_short?: string; en_short?: string };

export const valueLabels: Record<string, ValueLabelEntry> = {
  'drop': { es: 'Drop', en: 'Drop' },
  'riser': { es: 'Riser', en: 'Riser' },
  'curva': { es: 'Curva', en: 'Curve' },
  'cambio': { es: 'Cambio', en: 'Changeup' },
  'screw': { es: 'Screw', en: 'Screw' },
  'otro': { es: 'Otro', en: 'Other' },
  
  'asistencia': { es: 'Asistencia', en: 'Assisted' },
  'sac bunt': { es: 'Sac Bunt', en: 'Sac bunt' },
  'sac fly': { es: 'Sac Fly', en: 'Sac fly' },
  'fly': { es: 'Fly', en: 'Fly' },
  'linea': { es: 'Línea', en: 'Line out' },
  'error': { es: 'Error', en: 'Error' },

  'single': { es: 'Single', en: 'Single' },
  'doble': { es: 'Doble', en: 'Double' },
  'triple': { es: 'Triple', en: 'Triple' },
  'homerun': { es: 'Home run', en: 'Home run' },
  'infield hit': { es: 'Infield hit', en: 'Infield hit' },
  'bunt': { es: 'Bunt hit', en: 'Bunt hit' },

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
  'linea_desc': { es: 'Line drive', en: 'Line drive' },
  
  // Calidad contacto
  'soft_desc': { es: 'Contacto débil', en: 'Weak contact' },
  'hard_desc': { es: 'Contacto fuerte', en: 'Hard contact' },
};
