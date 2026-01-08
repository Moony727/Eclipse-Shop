// Простые функции очистки/валидции данных перед отправкой в Firestore
// Используйте эти хелперы перед вызовом create/update, чтобы избежать NaN

export function parseNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function sanitizeProductPayload(payload) {
  // Ожидаемые поля: name (string), description (string), price (number), active (bool), tags (array)
  return {
    name: String(payload.name || '').trim(),
    description: String(payload.description || '').trim(),
    price: parseNumber(payload.price, 0),
    active: !!payload.active,
    tags: Array.isArray(payload.tags) ? payload.tags.map(String) : [],
    createdAt: payload.createdAt || null
  };
}

export function sanitizeOrderPayload(payload, currentUid) {
  // items: [{ productId, quantity }]
  const items = Array.isArray(payload.items) ? payload.items.map(item => ({
    productId: String(item.productId || ''),
    quantity: Math.max(0, Math.floor(parseNumber(item.quantity, 0)))
  })).filter(i => i.productId && i.quantity > 0) : [];

  return {
    userId: currentUid,
    items,
    total: parseNumber(payload.total, items.reduce((s, it) => s + (it.quantity || 0), 0)),
    status: payload.status || 'pending',
    createdAt: payload.createdAt || null
  };
}
