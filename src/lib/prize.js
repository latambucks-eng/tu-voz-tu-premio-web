// Distribución del premio configurado por el administrador.
// Cada sala tiene un premio fijo en USD y se entrega íntegro al ganador.
export function getPrizeSplit(totalPrize) {
  const total = parseFloat(totalPrize) || 0;
  return {
    total: Math.round(total * 100) / 100,
    winner: Math.round(total * 100) / 100
  };
}