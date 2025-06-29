export async function fetchSuppliers() {
  const res = await fetch('/api/suppliers');
  if (!res.ok) throw new Error('Failed to fetch suppliers');
  return res.json();
}

export async function createSupplier(supplier: { name: string; contact_name: string; email: string; phone: string; address: string }) {
  const res = await fetch('/api/suppliers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  });
  if (!res.ok) throw new Error('Failed to create supplier');
  return res.json();
}
