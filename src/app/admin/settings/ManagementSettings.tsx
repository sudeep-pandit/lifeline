"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  ContactRound,
  Globe,
  BellRing,
  Droplet,
  ShieldCheck,
  ServerCog,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Palette,
} from "lucide-react";
import OrganizationBrandingSettings from "./OrganizationBrandingSettings";

type SettingKey =
  | "organization_information"
  | "contact_social"
  | "website_configuration"
  | "notification_preferences"
  | "blood_donation_settings";

type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "toggle";

type FieldDefinition = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  description?: string;
};

type SectionDefinition = {
  id: string;
  title: string;
  description: string;
  icon: typeof Building2;
  fields?: FieldDefinition[];
  key?: SettingKey;
  comingSoon?: boolean;
};

const sections: SectionDefinition[] = [
  {
    id: "branding",
    title: "Organization Branding",
    description: "Manage your official organization logo and visual identity.",
    icon: Palette,
  },
  {
    id: "organization_information",
    key: "organization_information",
    title: "Organization Information",
    description: "Manage Lifeline Achham's official organization details.",
    icon: Building2,
    fields: [
      { name: "legalName", label: "Legal Organization Name", type: "text", placeholder: "Lifeline Achham" },
      { name: "tagline", label: "Tagline", type: "text", placeholder: "Serving our community with compassion" },
      { name: "description", label: "Organization Description", type: "textarea", placeholder: "Describe your organization's mission..." },
      { name: "registrationNumber", label: "Registration Number", type: "text", placeholder: "Official registration number" },
      { name: "panNumber", label: "PAN Number", type: "text", placeholder: "Organization PAN number" },
      { name: "establishedBS", label: "Established (B.S.)", type: "text", placeholder: "2082 B.S." },
      { name: "establishedAD", label: "Established (A.D.)", type: "text", placeholder: "2025 A.D." },
      { name: "address", label: "Street / Local Address", type: "text", placeholder: "Sanfe, Achham" },
      { name: "district", label: "District", type: "text", placeholder: "Achham" },
      {
        name: "province",
        label: "Province",
        type: "select",
        options: [
          { label: "Sudurpashchim Province", value: "Sudurpashchim Province" },
          { label: "Koshi Province", value: "Koshi Province" },
          { label: "Madhesh Province", value: "Madhesh Province" },
          { label: "Bagmati Province", value: "Bagmati Province" },
          { label: "Gandaki Province", value: "Gandaki Province" },
          { label: "Lumbini Province", value: "Lumbini Province" },
          { label: "Karnali Province", value: "Karnali Province" },
        ],
      },
      { name: "country", label: "Country", type: "text", placeholder: "Nepal" },
    ],
  },
  {
    id: "contact_social",
    key: "contact_social",
    title: "Contact & Social Media",
    description: "Set public contact details and official social links.",
    icon: ContactRound,
    fields: [
      { name: "publicEmail", label: "Public Email", type: "email", placeholder: "lifelineachham@gmail.com" },
      { name: "phone", label: "Contact Phone", type: "tel", placeholder: "+977 ..." },
      { name: "alternatePhone", label: "Alternate Phone", type: "tel", placeholder: "Optional" },
      { name: "websiteUrl", label: "Website URL", type: "url", placeholder: "https://lifelineachham.org" },
      { name: "facebookUrl", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/..." },
      { name: "instagramUrl", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/..." },
      { name: "youtubeUrl", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/..." },
      { name: "officeHours", label: "Office Hours", type: "text", placeholder: "Sunday–Friday, 10 AM–5 PM" },
    ],
  },
  {
    id: "website_configuration",
    key: "website_configuration",
    title: "Website Configuration",
    description: "Configure public website metadata and display preferences.",
    icon: Globe,
    fields: [
      { name: "seoTitle", label: "SEO Title", type: "text", placeholder: "Lifeline Achham | Community Health & Blood Donation" },
      { name: "seoDescription", label: "SEO Description", type: "textarea", placeholder: "A short description for search engines." },
      {
        name: "defaultLanguage",
        label: "Default Language",
        type: "select",
        options: [
          { label: "English", value: "en" },
          { label: "Nepali", value: "ne" },
        ],
      },
      {
        name: "dateFormat",
        label: "Date Format",
        type: "select",
        options: [
          { label: "AD — YYYY-MM-DD", value: "AD" },
          { label: "BS — Bikram Sambat", value: "BS" },
          { label: "Both AD and BS", value: "BOTH" },
        ],
      },
      { name: "footerText", label: "Footer Text", type: "text", placeholder: "Serving our community with compassion." },
      {
        name: "maintenanceMode",
        label: "Maintenance Mode Preference",
        type: "toggle",
        description: "This saves your preference only. Site-wide maintenance is not activated by this setting yet.",
      },
    ],
  },
  {
    id: "notification_preferences",
    key: "notification_preferences",
    title: "Notifications",
    description: "Choose which administrative events should generate alerts.",
    icon: BellRing,
    fields: [
      { name: "contactEnquiryAlerts", label: "Contact Enquiry Alerts", type: "toggle" },
      { name: "bloodDonationAlerts", label: "Blood Donation Alerts", type: "toggle" },
      { name: "newDonorAlerts", label: "New Donor Registration Alerts", type: "toggle" },
      { name: "programAlerts", label: "Program & Campaign Alerts", type: "toggle" },
      { name: "notificationEmail", label: "Notification Recipient Email", type: "email", placeholder: "lifelineachham@gmail.com" },
    ],
  },
  {
    id: "blood_donation_settings",
    key: "blood_donation_settings",
    title: "Blood Donation",
    description: "Configure donor registration and verification preferences.",
    icon: Droplet,
    fields: [
      { name: "registrationEnabled", label: "Allow Donor Registration", type: "toggle" },
      { name: "requireVerification", label: "Require Donor Verification", type: "toggle" },
      {
        name: "showDonorContactPublicly",
        label: "Show Donor Contact Details Publicly",
        type: "toggle",
        description: "Keep disabled unless donors have explicitly consented to public contact disclosure.",
      },
      { name: "allowEmergencyRequests", label: "Allow Emergency Blood Requests", type: "toggle" },
      { name: "defaultDistrict", label: "Default District", type: "text", placeholder: "Achham" },
    ],
  },
  {
    id: "security",
    title: "Security & Administration",
    description: "Account security, permissions and administrative controls.",
    icon: ShieldCheck,
    comingSoon: true,
  },
  {
    id: "system",
    title: "System & Maintenance",
    description: "System health, storage and maintenance tools.",
    icon: ServerCog,
    comingSoon: true,
  },
];

const settingDefaults: Record<SettingKey, Record<string, unknown>> = {
  organization_information: {
    legalName: "Lifeline Achham",
    tagline: "",
    description: "",
    registrationNumber: "",
    panNumber: "",
    establishedBS: "2082 B.S.",
    establishedAD: "",
    address: "",
    district: "Achham",
    province: "Sudurpashchim Province",
    country: "Nepal",
  },
  contact_social: {
    publicEmail: "lifelineachham@gmail.com",
    phone: "",
    alternatePhone: "",
    websiteUrl: "https://lifelineachham.org",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    officeHours: "",
  },
  website_configuration: {
    seoTitle: "Lifeline Achham",
    seoDescription: "",
    defaultLanguage: "en",
    dateFormat: "BOTH",
    footerText: "",
    maintenanceMode: false,
  },
  notification_preferences: {
    contactEnquiryAlerts: true,
    bloodDonationAlerts: true,
    newDonorAlerts: true,
    programAlerts: true,
    notificationEmail: "lifelineachham@gmail.com",
  },
  blood_donation_settings: {
    registrationEnabled: true,
    requireVerification: true,
    showDonorContactPublicly: false,
    allowEmergencyRequests: true,
    defaultDistrict: "Achham",
  },
};

type Notice = {
  type: "success" | "error";
  text: string;
};

export default function ManagementSettings() {
  const [activeId, setActiveId] = useState("branding");
  const [values, setValues] = useState<Record<SettingKey, Record<string, unknown>>>(settingDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setNotice(null);

    try {
      const response = await fetch("/api/settings", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load settings.");
      }

      const nextValues = { ...settingDefaults };

      for (const section of sections) {
        if (!section.key) continue;

        const stored = result.data?.[section.key];

        if (stored && typeof stored === "object" && !Array.isArray(stored)) {
          nextValues[section.key] = {
            ...settingDefaults[section.key],
            ...stored,
          };
        }
      }

      setValues(nextValues);
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to load settings.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const activeSection = sections.find((section) => section.id === activeId) ?? sections[0];
  const isBranding = activeSection.id === "branding";
  const isComingSoon = activeSection.comingSoon === true;

  function updateField(name: string, value: unknown) {
    if (!activeSection.key) return;

    const key = activeSection.key;

    setValues((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [name]: value,
      },
    }));

    setNotice(null);
  }

  async function saveSettings() {
    if (!activeSection.key) return;

    setSaving(true);
    setNotice(null);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: activeSection.key,
          value: values[activeSection.key],
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save settings.");
      }

      setNotice({
        type: "success",
        text: `${activeSection.title} saved successfully.`,
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to save settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#7A1F3D]">
            <Settings2 size={17} />
            Administration
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Management Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your organization, website preferences, notifications and blood donation configuration.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadSettings()}
          disabled={loading || saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh settings
        </button>
      </header>

      {notice && (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
          )}
          <p>{notice.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Settings Sections
          </p>

          <nav className="space-y-1" aria-label="Settings sections">
            {sections.map((section) => {
              const Icon = section.icon;
              const active = activeId === section.id;

              return (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => {
                    setActiveId(section.id);
                    setNotice(null);
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-[#7A1F3D] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="min-w-0 flex-1">{section.title}</span>
                  {section.comingSoon && (
                    <span className={`text-[10px] ${active ? "text-white/70" : "text-slate-400"}`}>
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {isBranding ? (
            <div className="p-5 sm:p-7">
              <OrganizationBrandingSettings />
            </div>
          ) : isComingSoon ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EDF1] text-[#7A1F3D]">
                <activeSection.icon size={26} />
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">
                {activeSection.title}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {activeSection.description} This section will be enabled after its controls and permission checks are implemented.
              </p>
              <span className="mt-5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                Coming soon
              </span>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7EDF1] text-[#7A1F3D]">
                    <activeSection.icon size={21} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {activeSection.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {activeSection.description}
                    </p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
                  <RefreshCw size={18} className="animate-spin" />
                  Loading settings...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-7">
                    {(activeSection.fields ?? []).map((field) => {
                      const key = activeSection.key!; 
                      const value = values[key][field.name];
                      const id = `setting-${key}-${field.name}`;

                      if (field.type === "toggle") {
                        return (
                          <div key={field.name} className="sm:col-span-2">
                            <label
                              htmlFor={id}
                              className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
                            >
                              <span>
                                <span className="block text-sm font-semibold text-slate-800">
                                  {field.label}
                                </span>
                                {field.description && (
                                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                                    {field.description}
                                  </span>
                                )}
                              </span>
                              <input
                                id={id}
                                type="checkbox"
                                checked={value === true}
                                onChange={(event) => updateField(field.name, event.target.checked)}
                                className="mt-0.5 h-5 w-5 shrink-0 accent-[#7A1F3D]"
                              />
                            </label>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={field.name}
                          className={field.type === "textarea" ? "sm:col-span-2" : ""}
                        >
                          <label
                            htmlFor={id}
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            {field.label}
                          </label>

                          {field.type === "textarea" ? (
                            <textarea
                              id={id}
                              rows={4}
                              value={typeof value === "string" ? value : ""}
                              placeholder={field.placeholder}
                              onChange={(event) => updateField(field.name, event.target.value)}
                              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7A1F3D] focus:ring-4 focus:ring-[#7A1F3D]/10"
                            />
                          ) : field.type === "select" ? (
                            <select
                              id={id}
                              value={typeof value === "string" ? value : ""}
                              onChange={(event) => updateField(field.name, event.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-[#7A1F3D] focus:ring-4 focus:ring-[#7A1F3D]/10"
                            >
                              {(field.options ?? []).map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              id={id}
                              type={field.type}
                              value={typeof value === "string" ? value : ""}
                              placeholder={field.placeholder}
                              onChange={(event) => updateField(field.name, event.target.value)}
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7A1F3D] focus:ring-4 focus:ring-[#7A1F3D]/10"
                            />
                          )}

                          {field.description && (
                            <p className="mt-1.5 text-xs leading-5 text-slate-500">
                              {field.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:px-7">
                    <p className="text-xs text-slate-500">
                      Changes are saved to the database when you select Save Settings.
                    </p>
                    <button
                      type="button"
                      onClick={() => void saveSettings()}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#611630] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? (
                        <RefreshCw size={17} className="animate-spin" />
                      ) : (
                        <Save size={17} />
                      )}
                      {saving ? "Saving..." : "Save Settings"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}