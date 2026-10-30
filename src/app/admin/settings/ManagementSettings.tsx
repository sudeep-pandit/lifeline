
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ComponentType,
} from "react";

import {
  AlertCircle,
  BellRing,
  Building2,
  CheckCircle2,
  ContactRound,
  Droplet,
  Globe,
  LoaderCircle,
  Palette,
  RefreshCw,
  Save,
  ServerCog,
  ShieldCheck,
} from "lucide-react";

import OrganizationBrandingSettings from "./OrganizationBrandingSettings";
import SecurityAdministrationSettings from "./SecurityAdministrationSettings";
import SystemMaintenanceSettings from "./SystemMaintenanceSettings";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

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

type FieldOption = {
  label: string;
  value: string;
};

type FieldDefinition = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  description?: string;
};

type SectionDefinition = {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  key?: SettingKey;
  fields?: FieldDefinition[];
};

type SettingValues = Record<SettingKey, Record<string, unknown>>;

type Notice = {
  type: "success" | "error";
  text: string;
};

type SettingsResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

/* -------------------------------------------------------------------------- */
/* Settings navigation and fields                                             */
/* -------------------------------------------------------------------------- */

const sections: SectionDefinition[] = [
  {
    id: "branding",
    title: "Organization Branding",
    description: "Manage your organization logo and visual identity.",
    icon: Palette,
  },
  {
    id: "organization_information",
    title: "Organization Information",
    description: "Official details, registration and address.",
    icon: Building2,
    key: "organization_information",
    fields: [
      {
        name: "legalName",
        label: "Legal Organization Name",
        type: "text",
        placeholder: "Lifeline Achham",
      },
      {
        name: "tagline",
        label: "Organization Tagline",
        type: "text",
        placeholder: "Serving communities, saving lives.",
      },
      {
        name: "description",
        label: "Organization Description",
        type: "textarea",
        placeholder: "Describe your organization...",
      },
      {
        name: "registrationNumber",
        label: "Registration Number",
        type: "text",
        placeholder: "Enter registration number",
      },
      {
        name: "panNumber",
        label: "PAN Number",
        type: "text",
        placeholder: "Enter PAN number",
      },
      {
        name: "establishedBS",
        label: "Established (Bikram Sambat)",
        type: "text",
        placeholder: "2082 B.S.",
      },
      {
        name: "establishedAD",
        label: "Established (A.D.)",
        type: "text",
        placeholder: "2025 A.D.",
      },
      {
        name: "address",
        label: "Address",
        type: "text",
        placeholder: "Enter organization address",
      },
      {
        name: "district",
        label: "District",
        type: "text",
        placeholder: "Achham",
      },
      {
        name: "province",
        label: "Province",
        type: "select",
        options: [
          { label: "Koshi Province", value: "Koshi Province" },
          { label: "Madhesh Province", value: "Madhesh Province" },
          { label: "Bagmati Province", value: "Bagmati Province" },
          { label: "Gandaki Province", value: "Gandaki Province" },
          { label: "Lumbini Province", value: "Lumbini Province" },
          { label: "Karnali Province", value: "Karnali Province" },
          {
            label: "Sudurpashchim Province",
            value: "Sudurpashchim Province",
          },
        ],
      },
      {
        name: "country",
        label: "Country",
        type: "text",
        placeholder: "Nepal",
      },
    ],
  },
  {
    id: "contact_social",
    title: "Contact & Social Media",
    description: "Public contact information and social links.",
    icon: ContactRound,
    key: "contact_social",
    fields: [
      {
        name: "publicEmail",
        label: "Public Email",
        type: "email",
        placeholder: "lifelineachham@gmail.com",
      },
      {
        name: "phone",
        label: "Primary Phone",
        type: "tel",
        placeholder: "+977-XXXXXXXXXX",
      },
      {
        name: "alternatePhone",
        label: "Alternative Phone",
        type: "tel",
        placeholder: "Optional alternative phone",
      },
      {
        name: "websiteUrl",
        label: "Website URL",
        type: "url",
        placeholder: "https://lifelineachham.org",
      },
      {
        name: "facebookUrl",
        label: "Facebook URL",
        type: "url",
        placeholder: "https://facebook.com/...",
      },
      {
        name: "instagramUrl",
        label: "Instagram URL",
        type: "url",
        placeholder: "https://instagram.com/...",
      },
      {
        name: "youtubeUrl",
        label: "YouTube URL",
        type: "url",
        placeholder: "https://youtube.com/...",
      },
      {
        name: "officeHours",
        label: "Office Hours",
        type: "text",
        placeholder: "Sunday–Friday, 10:00 AM–5:00 PM",
      },
    ],
  },
  {
    id: "website_configuration",
    title: "Website Configuration",
    description: "Manage basic website display preferences.",
    icon: Globe,
    key: "website_configuration",
    fields: [
      {
        name: "seoTitle",
        label: "Default SEO Title",
        type: "text",
        placeholder: "Lifeline Achham",
      },
      {
        name: "seoDescription",
        label: "Default SEO Description",
        type: "textarea",
        placeholder: "Describe the website for search engines...",
      },
      {
        name: "defaultLanguage",
        label: "Default Language",
        type: "select",
        options: [
          { label: "English", value: "en" },
          { label: "नेपाली", value: "ne" },
        ],
      },
      {
        name: "dateFormat",
        label: "Date Format",
        type: "select",
        options: [
          { label: "A.D. (Gregorian)", value: "AD" },
          { label: "B.S. (Bikram Sambat)", value: "BS" },
          { label: "Both A.D. and B.S.", value: "BOTH" },
        ],
      },
      {
        name: "footerText",
        label: "Footer Text",
        type: "text",
        placeholder: "Lifeline Achham",
      },
      {
        name: "maintenanceMode",
        label: "Maintenance Mode Preference",
        type: "toggle",
        description:
          "This saves a preference only. Public access is not blocked unless maintenance mode is implemented on the server.",
      },
    ],
  },
  {
    id: "notification_preferences",
    title: "Notification Preferences",
    description: "Configure notification-related preferences.",
    icon: BellRing,
    key: "notification_preferences",
    fields: [
      {
        name: "contactEnquiryAlerts",
        label: "Contact Enquiry Alerts",
        type: "toggle",
      },
      {
        name: "bloodDonationAlerts",
        label: "Blood Donation Alerts",
        type: "toggle",
      },
      {
        name: "newDonorAlerts",
        label: "New Donor Alerts",
        type: "toggle",
      },
      {
        name: "programAlerts",
        label: "Program and Event Alerts",
        type: "toggle",
      },
      {
        name: "notificationEmail",
        label: "Notification Email",
        type: "email",
        placeholder: "lifelineachham@gmail.com",
        description:
          "Email delivery requires a configured notification service.",
      },
    ],
  },
  {
    id: "blood_donation_settings",
    title: "Blood Donation Settings",
    description: "Configure blood donation preferences.",
    icon: Droplet,
    key: "blood_donation_settings",
    fields: [
      {
        name: "registrationEnabled",
        label: "Allow Donor Registration",
        type: "toggle",
        description:
          "The donor registration API must enforce this preference.",
      },
      {
        name: "requireVerification",
        label: "Require Donor Verification",
        type: "toggle",
        description:
          "The server-side verification workflow must enforce this preference.",
      },
      {
        name: "showDonorContactPublicly",
        label: "Show Donor Contact Details Publicly",
        type: "toggle",
        description:
          "Only expose donor contact information with appropriate consent and access controls.",
      },
      {
        name: "allowEmergencyRequests",
        label: "Allow Emergency Requests",
        type: "toggle",
        description:
          "The emergency request API must enforce this preference.",
      },
      {
        name: "defaultDistrict",
        label: "Default District",
        type: "text",
        placeholder: "Achham",
      },
    ],
  },
  {
    id: "security",
    title: "Security & Administration",
    description: "Review account security and administrative access.",
    icon: ShieldCheck,
  },
  {
    id: "system",
    title: "System & Maintenance",
    description: "Review infrastructure, storage and maintenance.",
    icon: ServerCog,
  },
];

/* -------------------------------------------------------------------------- */
/* Default settings                                                           */
/* -------------------------------------------------------------------------- */

const defaultSettings: SettingValues = {
  organization_information: {
    legalName: "Lifeline Achham",
    tagline: "Serving communities, saving lives.",
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
    footerText: "Lifeline Achham",
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

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

function parseSettingsData(data: unknown): Record<string, unknown> {
  const incoming: Record<string, unknown> = {};

  // Supports APIs returning:
  // [{ key: "organization_information", value: {...} }]
  if (Array.isArray(data)) {
    for (const item of data) {
      if (isRecord(item) && typeof item.key === "string") {
        incoming[item.key] = item.value;
      }
    }

    return incoming;
  }

  // Also supports APIs returning:
  // { organization_information: {...} }
  if (isRecord(data)) {
    Object.assign(incoming, data);
  }

  return incoming;
}

function mergeSettings(data: unknown): SettingValues {
  const incoming = parseSettingsData(data);
  const merged = { ...defaultSettings } as SettingValues;

  (
    Object.keys(defaultSettings) as SettingKey[]
  ).forEach((key) => {
    const savedValue = incoming[key];

    merged[key] = {
      ...defaultSettings[key],
      ...(isRecord(savedValue) ? savedValue : {}),
    };
  });

  return merged;
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function ManagementSettings() {
  const [values, setValues] = useState<SettingValues>(defaultSettings);
  const [activeSectionId, setActiveSectionId] = useState(
    "organization_information",
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ??
    sections[0];

  /* ------------------------------------------------------------------------ */
  /* Load settings                                                            */
  /* ------------------------------------------------------------------------ */

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setNotice(null);

    try {
      const response = await fetch("/api/settings", {
        method: "GET",
        cache: "no-store",
      });

      const result = (await response.json()) as SettingsResponse;

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to load settings.",
        );
      }

      setValues(mergeSettings(result.data));
    } catch (error) {
      setNotice({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  /* ------------------------------------------------------------------------ */
  /* Update field                                                             */
  /* ------------------------------------------------------------------------ */

  const updateField = useCallback(
    (key: SettingKey, name: string, value: unknown) => {
      setValues((current) => ({
        ...current,
        [key]: {
          ...current[key],
          [name]: value,
        },
      }));

      setNotice(null);
    },
    [],
  );

  /* ------------------------------------------------------------------------ */
  /* Save settings                                                            */
  /* ------------------------------------------------------------------------ */

  const saveSettings = useCallback(
    async (key: SettingKey) => {
      setSaving(true);
      setNotice(null);

      try {
        const response = await fetch("/api/settings", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,
            value: values[key],
          }),
        });

        const result = (await response.json()) as SettingsResponse;

        if (!response.ok || result.success === false) {
          throw new Error(
            result.message || "Unable to save settings.",
          );
        }

        setNotice({
          type: "success",
          text: "Settings saved successfully.",
        });
      } catch (error) {
        setNotice({
          type: "error",
          text: getErrorMessage(error),
        });
      } finally {
        setSaving(false);
      }
    },
    [values],
  );

  /* ------------------------------------------------------------------------ */
  /* Render individual fields                                                 */
  /* ------------------------------------------------------------------------ */

  const renderField = (
    field: FieldDefinition,
    key: SettingKey,
    sectionValues: Record<string, unknown>,
  ) => {
    const rawValue = sectionValues[field.name];

    const value =
      typeof rawValue === "string" ? rawValue : "";

    const checked = rawValue === true;

    const inputClassName =
      "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2457C5] focus:ring-4 focus:ring-blue-100";

    if (field.type === "toggle") {
      return (
        <div
          key={field.name}
          className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor={field.name}
              className="block cursor-pointer text-sm font-semibold text-slate-800"
            >
              {field.label}
            </label>

            {field.description && (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {field.description}
              </p>
            )}
          </div>

          <button
            id={field.name}
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={field.label}
            onClick={() =>
              updateField(key, field.name, !checked)
            }
            className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
              checked ? "bg-[#2457C5]" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${
                checked ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      );
    }

    return (
      <div key={field.name} className="min-w-0">
        <label
          htmlFor={field.name}
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          {field.label}
        </label>

        {field.type === "textarea" ? (
          <textarea
            id={field.name}
            value={value}
            placeholder={field.placeholder}
            rows={4}
            onChange={(event) =>
              updateField(key, field.name, event.target.value)
            }
            className={`${inputClassName} min-h-28 resize-y`}
          />
        ) : field.type === "select" ? (
          <select
            id={field.name}
            value={value}
            onChange={(event) =>
              updateField(key, field.name, event.target.value)
            }
            className={inputClassName}
          >
            <option value="">Select an option</option>

            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field.name}
            type={field.type}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) =>
              updateField(key, field.name, event.target.value)
            }
            className={inputClassName}
          />
        )}

        {field.description && (
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            {field.description}
          </p>
        )}
      </div>
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Main layout                                                              */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#F7F8FC] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
              Administration
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
              Management Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage organization details, website preferences,
              notifications, blood donation settings, and administration.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadSettings()}
            disabled={loading || saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh settings
          </button>
        </header>

        {/* Status notice */}
        {notice && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {notice.type === "success" ? (
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />
            )}

            <p className="text-sm font-medium">{notice.text}</p>
          </div>
        )}

        {/* Sidebar and content */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Navigation */}
          <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="px-3 pb-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Settings menu
              </p>
            </div>

            <nav
              aria-label="Management settings"
              className="space-y-1"
            >
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSectionId === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      setActiveSectionId(section.id);
                      setNotice(null);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-[#7A1F3D]/[0.07] text-[#7A1F3D] ring-1 ring-[#7A1F3D]/10"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-white text-[#7A1F3D] shadow-sm"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {section.title}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {section.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Active section */}
          <main className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2457C5]/[0.08] text-[#2457C5]">
                  <activeSection.icon size={21} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#172033] sm:text-xl">
                    {activeSection.title}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {activeSection.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Organization branding */}
            {activeSection.id === "branding" ? (
              <div className="p-5 sm:p-7">
                <OrganizationBrandingSettings />
              </div>
            ) : null}

            {/* Security and administration */}
            {activeSection.id === "security" ? (
              <div className="p-5 sm:p-7">
                <SecurityAdministrationSettings />
              </div>
            ) : null}

            {/* System and maintenance */}
            {activeSection.id === "system" ? (
              <div className="p-5 sm:p-7">
                <SystemMaintenanceSettings />
              </div>
            ) : null}

            {/* Editable settings forms */}
            {activeSection.key && (
              <div className="p-5 sm:p-7">
                {loading ? (
                  <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500">
                    <LoaderCircle
                      size={28}
                      className="animate-spin text-[#2457C5]"
                    />

                    <p className="text-sm">
                      Loading settings...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {(activeSection.fields ?? []).map((field) =>
                        renderField(
                          field,
                          activeSection.key!,
                          values[activeSection.key!],
                        ),
                      )}
                    </div>

                    <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                      <p className="text-xs leading-5 text-slate-500">
                        Changes are saved to your system settings.
                        Dependent features must enforce their settings
                        on the server.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          void saveSettings(activeSection.key!)
                        }
                        disabled={saving}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7A1F3D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#55152B] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving ? (
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <Save size={17} />
                        )}

                        {saving ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Informational disclaimer */}
        {(activeSectionId === "security" ||
          activeSectionId === "system") && (
          <p className="text-xs leading-5 text-slate-400">
            Security and infrastructure information is guidance only.
            This dashboard does not perform a live security audit,
            database health check, or backup verification.
          </p>
        )}
      </div>
    </div>
  );
}
