"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import { adminFetch, type AdminApiError } from "@/lib/admin/api-client";
import { contentSections, type Field } from "@/lib/content/fields";
import type { SectionKey, SiteContent } from "@/lib/content/schema";
import { ImageField } from "@/components/admin/ImageField";
import { cn } from "@/lib/cn";

type Values = Record<string, unknown>;
type ErrorMap = Record<string, string>;

type FieldsProps = {
  fields: Field[];
  values: Values;
  /** Dotted location of these values, matching the server's validation errors. */
  prefix: string;
  errors: ErrorMap;
  onChange: (next: Values) => void;
};

function hasErrorsUnder(errors: ErrorMap, path: string) {
  return Object.keys(errors).some((key) => key === path || key.startsWith(`${path}.`));
}

function FieldHint({ hint, error, id }: { hint?: string; error?: string; id: string }) {
  return (
    <>
      {hint ? <p className="rbm-field-hint">{hint}</p> : null}
      {error ? (
        <p id={id} className="rbm-field-error">
          {error}
        </p>
      ) : null}
    </>
  );
}

function ListField({
  field,
  values,
  prefix,
  errors,
  onChange,
}: FieldsProps & { field: Extract<Field, { type: "list" }> }) {
  const items = (values[field.name] as Values[]) ?? [];
  const path = prefix ? `${prefix}.${field.name}` : field.name;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const update = (next: Values[]) => onChange({ ...values, [field.name]: next });

  function move(index: number, delta: number) {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    update(next);
    setOpenIndex(index + delta);
  }

  return (
    <fieldset className="space-y-2">
      <legend className="rbm-label">{field.label}</legend>
      {field.hint ? <p className="rbm-field-hint !mt-0 mb-2">{field.hint}</p> : null}

      {items.map((item, index) => {
        const itemPath = `${path}.${index}`;
        const invalid = hasErrorsUnder(errors, itemPath);
        const title = String(item[field.titleField] ?? "").trim();
        const hidden = item.published === false;
        return (
          <details
            key={index}
            open={openIndex === index || invalid}
            onToggle={(event) => {
              if (event.currentTarget.open) setOpenIndex(index);
              else if (openIndex === index) setOpenIndex(null);
            }}
            className={cn(
              "rounded-sm border bg-white",
              invalid ? "border-rbm-orange" : "border-rbm-border",
            )}
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-rbm-navy">
              <span className="min-w-0 truncate">
                {title || `New ${field.itemLabel}`}
              </span>
              {hidden ? (
                <span className="shrink-0 rounded-sm bg-rbm-surface px-2 py-0.5 text-xs text-rbm-text-secondary">
                  Hidden
                </span>
              ) : null}
            </summary>
            <div className="space-y-4 border-t border-rbm-border p-4">
              <Fields
                fields={field.fields}
                values={item}
                prefix={itemPath}
                errors={errors}
                onChange={(next) =>
                  update(items.map((current, i) => (i === index ? next : current)))
                }
              />
              <div className="flex flex-wrap gap-2 border-t border-rbm-border pt-3">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  className="inline-flex items-center gap-1 rounded-sm border border-rbm-border px-2.5 py-1 text-xs font-medium text-rbm-navy disabled:opacity-40"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                  Move up
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                  className="inline-flex items-center gap-1 rounded-sm border border-rbm-border px-2.5 py-1 text-xs font-medium text-rbm-navy disabled:opacity-40"
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                  Move down
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${title || `this ${field.itemLabel}`}?`)) {
                      update(items.filter((_, i) => i !== index));
                      setOpenIndex(null);
                    }
                  }}
                  className="ml-auto inline-flex items-center gap-1 rounded-sm border border-rbm-orange/40 px-2.5 py-1 text-xs font-medium text-rbm-orange"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Delete
                </button>
              </div>
            </div>
          </details>
        );
      })}

      <button
        type="button"
        onClick={() => {
          update([...items, structuredClone(field.newItem)]);
          setOpenIndex(items.length);
        }}
        className="inline-flex items-center gap-1.5 rounded-sm border border-dashed border-rbm-navy/40 px-3 py-2 font-display text-sm font-semibold text-rbm-navy hover:border-rbm-navy"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add {field.itemLabel}
      </button>
    </fieldset>
  );
}

function Fields({ fields, values, prefix, errors, onChange }: FieldsProps) {
  return (
    <>
      {fields.map((field) => {
        if (field.type === "heading") {
          return (
            <div key={field.label} className="border-t border-rbm-border pt-5 first:border-0 first:pt-0">
              <h3 className="font-display text-lg font-semibold text-rbm-navy">{field.label}</h3>
              {field.hint ? <p className="rbm-field-hint">{field.hint}</p> : null}
            </div>
          );
        }

        if (field.type === "list") {
          return (
            <ListField
              key={field.name}
              field={field}
              fields={fields}
              values={values}
              prefix={prefix}
              errors={errors}
              onChange={onChange}
            />
          );
        }

        const path = prefix ? `${prefix}.${field.name}` : field.name;
        const id = `content-${path}`;
        const errorId = `${id}-error`;
        const error = errors[path];
        const set = (value: unknown) => onChange({ ...values, [field.name]: value });
        const a11y = {
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
        };

        if (field.type === "checkbox") {
          return (
            <div key={field.name}>
              <label className="flex items-center gap-2 text-sm font-medium text-rbm-text-primary">
                <input
                  type="checkbox"
                  checked={Boolean(values[field.name])}
                  onChange={(event) => set(event.target.checked)}
                />
                {field.label}
              </label>
              <FieldHint hint={field.hint} error={error} id={errorId} />
            </div>
          );
        }

        return (
          <div key={field.name}>
            <label htmlFor={id} className="rbm-label">
              {field.label}
            </label>
            {field.type === "image" ? (
              <ImageField
                id={id}
                value={String(values[field.name] ?? "")}
                onChange={set}
                invalid={Boolean(error)}
              />
            ) : field.type === "select" ? (
              <select
                id={id}
                className="rbm-select"
                value={String(values[field.name] ?? "")}
                onChange={(event) => set(event.target.value)}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={id}
                className="rbm-textarea !min-h-20"
                rows={3}
                value={String(values[field.name] ?? "")}
                onChange={(event) => set(event.target.value)}
                {...a11y}
              />
            ) : (
              <input
                id={id}
                className="rbm-input"
                value={String(values[field.name] ?? "")}
                onChange={(event) => set(event.target.value)}
                {...a11y}
              />
            )}
            <FieldHint hint={field.hint} error={error} id={errorId} />
          </div>
        );
      })}
    </>
  );
}

export function ContentEditorClient() {
  const [activeKey, setActiveKey] = useState<SectionKey>(contentSections[0].key);
  const [drafts, setDrafts] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState<SiteContent | null>(null);
  const [defaults, setDefaults] = useState<SiteContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<ErrorMap>({});

  useEffect(() => {
    let active = true;
    void (async () => {
      const result = await adminFetch<{ content: SiteContent; defaults: SiteContent }>(
        "/admin/content",
      );
      if (!active) return;
      if (result.data) {
        setDrafts(result.data.content);
        setSaved(result.data.content);
        setDefaults(result.data.defaults);
      } else {
        setLoadError(result.error?.message ?? "Could not load content.");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const isDirty = (key: SectionKey) =>
    Boolean(drafts && saved) && JSON.stringify(drafts?.[key]) !== JSON.stringify(saved?.[key]);
  const anyDirty = contentSections.some((section) => isDirty(section.key));

  useEffect(() => {
    if (!anyDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);

  if (loadError) {
    return (
      <p className="text-sm text-rbm-orange" role="alert">
        {loadError}
      </p>
    );
  }
  if (!drafts || !saved || !defaults) {
    return <p className="text-sm text-rbm-text-secondary">Loading content…</p>;
  }

  const section = contentSections.find((item) => item.key === activeKey) ?? contentSections[0];

  function switchSection(key: SectionKey) {
    setActiveKey(key);
    setErrors({});
    setNotice(null);
  }

  function updateDraft(next: Values) {
    setDrafts((current) =>
      current ? ({ ...current, [section.key]: next } as SiteContent) : current,
    );
    setNotice(null);
  }

  async function save() {
    if (!drafts) return;
    setSaving(true);
    setNotice(null);
    setErrors({});
    const result = await adminFetch<Values>("/admin/content", {
      method: "PATCH",
      body: JSON.stringify({ section: section.key, data: drafts[section.key] }),
    });
    setSaving(false);

    if (result.error) {
      applyError(result.error);
      return;
    }
    const merged = { ...drafts, [section.key]: result.data } as SiteContent;
    setDrafts(merged);
    setSaved(merged);
    setNotice({ type: "ok", text: "Saved. Your changes are live on the website." });
  }

  function applyError(error: AdminApiError) {
    const map: ErrorMap = {};
    for (const field of error.fields ?? []) {
      map[field.path] ??= field.message;
    }
    setErrors(map);
    setNotice({ type: "error", text: error.message });
  }

  const dirty = isDirty(section.key);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Content sections">
        <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {contentSections.map((item) => (
            <li key={item.key} className="shrink-0">
              <button
                type="button"
                aria-current={item.key === section.key ? "true" : undefined}
                onClick={() => switchSection(item.key)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-sm px-3 py-2 text-left text-sm font-medium",
                  item.key === section.key
                    ? "bg-rbm-navy text-white"
                    : "text-rbm-text-primary hover:bg-white",
                )}
              >
                {item.label}
                {isDirty(item.key) ? (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-rbm-orange-bright"
                    title="Unsaved changes"
                  />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0">
        <div className="rounded-sm border border-rbm-border bg-white p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-rbm-navy">{section.label}</h2>
              <p className="mt-1 text-sm text-rbm-text-secondary">{section.description}</p>
            </div>
            <a
              href={section.previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-rbm-navy hover:text-rbm-orange"
            >
              View page
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <div className="space-y-5">
            <Fields
              fields={section.fields}
              values={drafts[section.key] as Values}
              prefix=""
              errors={errors}
              onChange={updateDraft}
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 mt-4 flex flex-wrap items-center gap-3 border-t border-rbm-border bg-rbm-surface py-3">
          <button
            type="button"
            disabled={saving || !dirty}
            onClick={() => void save()}
            className="rounded-sm bg-rbm-orange px-5 py-2.5 font-display text-sm font-semibold text-white hover:bg-rbm-orange-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            disabled={!dirty}
            onClick={() => {
              updateDraft(saved[section.key] as Values);
              setErrors({});
            }}
            className="rounded-sm border border-rbm-navy/25 bg-white px-4 py-2.5 font-display text-sm font-semibold text-rbm-navy disabled:opacity-50"
          >
            Undo changes
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  `Replace ${section.label} with the original website content? Nothing changes on the website until you save.`,
                )
              ) {
                updateDraft(defaults[section.key] as Values);
              }
            }}
            className="px-2 py-2.5 text-sm font-medium text-rbm-text-secondary hover:text-rbm-orange"
          >
            Restore original
          </button>
          {notice ? (
            <p
              role={notice.type === "error" ? "alert" : "status"}
              className={cn(
                "text-sm font-medium",
                notice.type === "error" ? "text-rbm-orange-dark" : "text-green-800",
              )}
            >
              {notice.text}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
