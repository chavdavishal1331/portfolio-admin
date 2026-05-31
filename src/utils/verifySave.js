import { assertSavedItem } from "./fetchList";

export function verifyInList(saved, list, label = "Item") {
  assertSavedItem(saved, label);
  const savedId = String(saved._id);
  if (!Array.isArray(list) || !list.some((item) => String(item._id) === savedId)) {
    throw new Error(
      `${label} was saved but did not appear in the list. Log in again and retry.`
    );
  }
  return saved;
}
