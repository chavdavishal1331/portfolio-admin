import { notifyPortfolioUpdate } from "./notifyPortfolioUpdate";
import { verifyInList } from "./verifySave";

/** Reload list, verify persistence, notify portfolio site to refresh. */
export async function afterContentSave(reloadFn, saved, label) {
  await new Promise((r) => setTimeout(r, 350));
  const list = await reloadFn();
  verifyInList(saved, list, label);
  notifyPortfolioUpdate();
  return list;
}
