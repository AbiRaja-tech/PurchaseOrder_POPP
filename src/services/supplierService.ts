export async function fetchSuppliers() {
  const res = await fetch('/api/suppliers');
  if (!res.ok) throw new Error('Failed to fetch suppliers');
  return res.json();
}
