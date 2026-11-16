import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const ids = Array.isArray(body.artist_ids)
      ? body.artist_ids.filter((id) => typeof id === 'string' && id.trim() !== '').slice(0, 100)
      : [];
    if (ids.length === 0) {

      return Response.json({ stats: {} });
    }

    const gifts = await base44.asServiceRole.entities.GiftTransaction.filter({
      recipient_id: { $in: ids },
      status: 'approved'
    });

    // Solo se devuelven conteos: nunca nombres, mensajes ni montos de nadie
    const stats = {};
    (gifts || []).forEach((gift) => {
      const id = gift.recipient_id;
      if (!stats[id]) stats[id] = { gift_count: 0, stars: 0 };
      stats[id].gift_count += 1;
      stats[id].stars += Number(gift.star_value) || 0;
    });

    return Response.json({ stats });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}