/** Same-origin path to this app's Route Handlers. */
export const API_BASE_PATH = "/api/v1";

export function isFixtureCatalogMode(): boolean {
  return process.env.NEXT_PUBLIC_CATALOG_DATA_SOURCE === "fixture";
}

export function inquiriesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_INQUIRIES_ENABLED !== "false";
}
