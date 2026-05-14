export function isStrongPassword(password) {
  if (!password || password.length < 4) return false
  return true
}

export function formatMoney(n) {
  const x = Number(n)
  if (Number.isNaN(x)) return '—'
  return x.toFixed(2)
}
