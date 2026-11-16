export const REFUND_CATEGORY = 'reembolso_arrepentimiento';

export const SUPPORT_CATEGORIES = [
  { value: 'consulta_general', label: 'Consulta general' },
  { value: 'problema_tecnico', label: 'Problema técnico' },
  { value: 'pagos_y_estrellas', label: 'Pagos y estrellas ⭐' },
  { value: REFUND_CATEGORY, label: 'Solicitud de Reembolso / Arrepentimiento' },
  { value: 'reporte_conducta', label: 'Reporte de conducta o contenido' },
];

export const getSupportCategoryLabel = (value) =>
  SUPPORT_CATEGORIES.find((category) => category.value === value)?.label || 'Consulta general';