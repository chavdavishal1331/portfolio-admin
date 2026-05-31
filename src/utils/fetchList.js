/** Normalize API list responses and surface errors in the UI. */
export async function fetchList(request, setItems, setError, emptyLabel) {
  try {
    const { data } = await request();
    if (!Array.isArray(data)) {
      setItems([]);
      setError?.(`Could not load ${emptyLabel} (invalid server response).`);
      return;
    }
    setItems(data);
    setError?.("");
  } catch (err) {
    setItems([]);
    const msg =
      err.response?.data?.message ||
      err.message ||
      `Could not load ${emptyLabel}. Check login and backend URL.`;
    setError?.(msg);
  }
}

export function assertSavedItem(data, label = "Item") {
  if (!data || !data._id) {
    throw new Error(`${label} was not saved. Try again.`);
  }
  return data;
}
