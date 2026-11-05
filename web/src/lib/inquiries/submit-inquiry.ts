import { fetchJson } from "@/lib/api/client";
import type { ApiSuccess, InquiryCreateResponse } from "@/types/api";
import { inquiriesEnabled, isFixtureCatalogMode } from "@/lib/api/config";

export type InquirySubmission = {
  fullName: string;
  phone: string;
  email?: string;
  message: string;
  productSlug?: string;
  productName?: string;
};

export type InquirySubmissionResult =
  | { ok: true; reference: string }
  | { ok: false; reason: "disabled" | "fixture_mode" | "api_error"; message: string };

export async function submitInquiry(
  input: InquirySubmission,
): Promise<InquirySubmissionResult> {
  if (isFixtureCatalogMode()) {
    return {
      ok: false,
      reason: "fixture_mode",
      message:
        "Inquiry API is disabled while fixture catalog mode is active. Set NEXT_PUBLIC_CATALOG_DATA_SOURCE=api to enable submissions.",
    };
  }

  if (!inquiriesEnabled()) {
    return {
      ok: false,
      reason: "disabled",
      message: "Inquiry submissions are disabled in this environment.",
    };
  }

  try {
    const response = await fetchJson<ApiSuccess<InquiryCreateResponse>>(
      "/inquiries",
      {
        method: "POST",
        body: input,
      },
    );
    return { ok: true, reference: response.data.reference };
  } catch {
    return {
      ok: false,
      reason: "api_error",
      message:
        "We could not send your inquiry. Please try again, or contact us by phone or email.",
    };
  }
}
