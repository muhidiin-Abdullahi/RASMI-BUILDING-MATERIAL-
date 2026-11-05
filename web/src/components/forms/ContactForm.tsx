"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { submitInquiry } from "@/lib/inquiries/submit-inquiry";
import { Button } from "@/components/ui/Button";

/** Mirrors the API's createInquirySchema so errors show before submitting. */
const inquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name."),
  phone: z.string().trim().min(5, "Please enter a valid phone number."),
  email: z.union([
    z.literal(""),
    z.string().trim().email("Please enter a valid email address."),
  ]),
  message: z
    .string()
    .trim()
    .min(5, "Please tell us a little about what you need."),
});

type FieldName = keyof z.infer<typeof inquirySchema>;
type FieldErrors = Partial<Record<FieldName, string>>;

const productTypes = [
  "Bathroom Mirrors",
  "Basin Mixer Taps",
  "Sanitary Ware",
  "Tiles & Finishing Materials",
];

type ContactFormProps = {
  id?: string;
  compact?: boolean;
  initialProductSlug?: string;
  initialProductName?: string;
};

function buildInitialMessage(productName?: string): string {
  return productName ? `I would like more information about ${productName}.` : "";
}

export function ContactForm({
  id = "contact-form",
  compact = false,
  initialProductSlug,
  initialProductName,
}: ContactFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(() =>
    buildInitialMessage(initialProductName),
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitError(null);
    setSuccessReference(null);

    const formData = new FormData(form);
    const parsed = inquirySchema.safeParse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      message,
    });

    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as FieldName;
        errors[field] ??= issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    const productType = String(formData.get("productType") ?? "");
    const result = await submitInquiry({
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      email: parsed.data.email || undefined,
      message: [
        parsed.data.message,
        productType ? `Category interest: ${productType}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      productSlug: initialProductSlug,
      productName: initialProductName,
    });

    setSubmitting(false);

    if (result.ok) {
      setSuccessReference(result.reference);
      form.reset();
      setMessage(buildInitialMessage(initialProductName));
      return;
    }

    setSubmitError(result.message);
  }

  function fieldProps(name: FieldName) {
    const hasError = Boolean(fieldErrors[name]);
    return {
      "aria-invalid": hasError,
      "aria-describedby": hasError ? `${id}-${name}-error` : undefined,
    };
  }

  function fieldError(name: FieldName) {
    return fieldErrors[name] ? (
      <p id={`${id}-${name}-error`} className="rbm-field-error">
        {fieldErrors[name]}
      </p>
    ) : null;
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-4" noValidate>
      {initialProductName ? (
        <p className="border-l-2 border-rbm-orange bg-rbm-surface px-4 py-3 text-sm text-rbm-text-primary">
          Inquiring about <strong>{initialProductName}</strong>
        </p>
      ) : null}

      {successReference ? (
        <p
          className="flex gap-2 rounded-sm border border-green-700/30 bg-green-50 px-4 py-3 text-sm text-rbm-text-primary"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden />
          <span>
            Thank you. We have received your inquiry and will be in touch soon.
            Your reference is <strong>{successReference}</strong>.
          </span>
        </p>
      ) : null}

      {submitError ? (
        <p
          className="rounded-sm border border-rbm-orange/40 bg-rbm-orange/5 px-4 py-3 text-sm text-rbm-text-primary"
          role="alert"
        >
          {submitError}
        </p>
      ) : null}

      <div className={compact ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"}>
        <div>
          <label htmlFor={`${id}-name`} className="rbm-label">
            Full name
          </label>
          <input
            id={`${id}-name`}
            name="fullName"
            type="text"
            autoComplete="name"
            className="rbm-input"
            required
            {...fieldProps("fullName")}
          />
          {fieldError("fullName")}
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="rbm-label">
            Phone number
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            className="rbm-input"
            required
            {...fieldProps("phone")}
          />
          {fieldError("phone")}
        </div>
      </div>

      <div className={compact ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"}>
        <div>
          <label htmlFor={`${id}-email`} className="rbm-label">
            Email <span className="font-normal text-rbm-text-secondary">(optional)</span>
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            className="rbm-input"
            {...fieldProps("email")}
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor={`${id}-product-type`} className="rbm-label">
            Product type
          </label>
          <select
            id={`${id}-product-type`}
            name="productType"
            className="rbm-select"
            defaultValue=""
          >
            <option value="">Select a category</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className="rbm-label">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          className="rbm-textarea"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us about your project or product requirements"
          required
          {...fieldProps("message")}
        />
        {fieldError("message")}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send Inquiry"}
      </Button>
    </form>
  );
}
