import { assertSavedItem } from "./fetchList";

export function verifyInList(saved, list, label = "Item") {
  assertSavedItem(saved, label);
  if (!Array.isArray(list) || !list.some((item) => item._id === saved._id)) {
    throw new Error(
      `${label} was saved but did not appear in the list. Log in again and retry.`
    );
  }
  return saved;
}
