
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import * as XLSX from "xlsx";
import {
  Activity,
  Download,
  FileSpreadsheet,
  Filter,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Upload,
  Users,
  X,
} from "lucide-react";

// ============================================================
// Shared values: dashboard filters, template and import
// ============================================================

const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;

const DONOR_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
] as const;

const NEPAL_PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
] as const;

const TEMPLATE_HEADERS = [
  "Full Name",
  "Phone",
  "Email",
  "Date of Birth (AD)",
  "Date of Birth (BS)",
  "Blood Group",
  "Province",
  "District",
  "Local Level",
  "Ward Name",
  "Ward Number",
  "Address",
  "Consent Given",
] as const;

type Donor = {
  id: string;
  donorCode: string;
  fullName: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  dateOfBirthBS: string | null;
  bloodGroup: string;
  province: string | null;
  district: string;
  localLevel: string | null;
  wardName: string | null;
  wardNumber: number | null;
  address: string | null;
  status: string;
  isVerified: boolean;
  consentGiven: boolean;
  lastDonationAt: string | null;
  createdAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    activeCount: number;
    verifiedCount: number;
    bloodGroupCounts: {
      bloodGroup: string;
      count: number;
    }[];
  };
};

type DonorForm = {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  dateOfBirthBS: string;
  bloodGroup: string;
  province: string;
  district: string;
  localLevel: string;
  wardName: string;
  wardNumber: string;
  address: string;
  consentGiven: boolean;
};

const EMPTY_FORM: DonorForm = {
  fullName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  dateOfBirthBS: "",
  bloodGroup: "",
  province: "",
  district: "",
  localLevel: "",
  wardName: "",
  wardNumber: "",
  address: "",
  consentGiven: false,
};

function displayBloodGroup(value: string) {
  return value.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
}

function displayDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function excelDate(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, "0"),
      String(value.getDate()).padStart(2, "0"),
    ].join("-");
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return [
        date.y,
        String(date.m).padStart(2, "0"),
        String(date.d).padStart(2, "0"),
      ].join("-");
    }
  }

  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return [
      parsed.getFullYear(),
      String(parsed.getMonth() + 1).padStart(2, "0"),
      String(parsed.getDate()).padStart(2, "0"),
    ].join("-");
  }

  return text;
}

function normalizeBloodGroup(value: unknown): string {
  const text = String(value ?? "").trim().toUpperCase();

  const aliases: Record<string, string> = {
    "A+": "A_POSITIVE",
    "A POSITIVE": "A_POSITIVE",
    "A_POSITIVE": "A_POSITIVE",
    "A-": "A_NEGATIVE",
    "A NEGATIVE": "A_NEGATIVE",
    "A_NEGATIVE": "A_NEGATIVE",
    "B+": "B_POSITIVE",
    "B POSITIVE": "B_POSITIVE",
    "B_POSITIVE": "B_POSITIVE",
    "B-": "B_NEGATIVE",
    "B NEGATIVE": "B_NEGATIVE",
    "B_NEGATIVE": "B_NEGATIVE",
    "AB+": "AB_POSITIVE",
    "AB POSITIVE": "AB_POSITIVE",
    "AB_POSITIVE": "AB_POSITIVE",
    "AB-": "AB_NEGATIVE",
    "AB NEGATIVE": "AB_NEGATIVE",
    "AB_NEGATIVE": "AB_NEGATIVE",
    "O+": "O_POSITIVE",
    "O POSITIVE": "O_POSITIVE",
    "O_POSITIVE": "O_POSITIVE",
    "O-": "O_NEGATIVE",
    "O NEGATIVE": "O_NEGATIVE",
    "O_NEGATIVE": "O_NEGATIVE",
  };

  return aliases[text] ?? text;
}

function normalizeProvince(value: unknown): string {
  const text = String(value ?? "").trim();
  const match = NEPAL_PROVINCES.find(
    (province) => province.toLowerCase() === text.toLowerCase(),
  );
  return match ?? text;
}

function getCell(
  row: Record<string, unknown>,
  header: string,
): unknown {
  return row[header] ?? "";
}

function validateImportRow(
  row: Record<string, unknown>,
  rowNumber: number,
): { payload?: Record<string, unknown>; error?: string } {
  const fullName = String(getCell(row, "Full Name")).trim();
  const phone = String(getCell(row, "Phone")).trim();
  const email = String(getCell(row, "Email")).trim().toLowerCase();
  const dateOfBirth = excelDate(getCell(row, "Date of Birth (AD)"));
  const dateOfBirthBS = excelDate(getCell(row, "Date of Birth (BS)"));
  const bloodGroup = normalizeBloodGroup(getCell(row, "Blood Group"));
  const province = normalizeProvince(getCell(row, "Province"));
  const district = String(getCell(row, "District")).trim();
  const localLevel = String(getCell(row, "Local Level")).trim();
  const wardName = String(getCell(row, "Ward Name")).trim();
  const wardNumberText = String(getCell(row, "Ward Number")).trim();
  const address = String(getCell(row, "Address")).trim();
  const consent = String(getCell(row, "Consent Given"))
    .trim()
    .toUpperCase();

  const prefix = `Excel row ${rowNumber}: `;

  if (!fullName || !phone || !district || !localLevel || !wardName) {
    return {
      error: prefix + "Name, phone, district, local level and ward name are required.",
    };
  }

  if (!NEPAL_PROVINCES.includes(province as (typeof NEPAL_PROVINCES)[number])) {
    return {
      error: prefix + `Invalid province "${province}". Use one of the province names in the template.`,
    };
  }

  if (!BLOOD_GROUPS.includes(bloodGroup as (typeof BLOOD_GROUPS)[number])) {
    return {
      error: prefix + `Invalid blood group "${bloodGroup}".`,
    };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirthBS)) {
    return {
      error: prefix + "Date of Birth (BS) is required in YYYY-MM-DD format.",
    };
  }

  const [bsYear, bsMonth, bsDay] = dateOfBirthBS.split("-").map(Number);
  if (
    bsYear < 1900 ||
    bsYear > 2200 ||
    bsMonth < 1 ||
    bsMonth > 12 ||
    bsDay < 1 ||
    bsDay > 32
  ) {
    return {
      error: prefix + "Date of Birth (BS) has an invalid date format or range.",
    };
  }

  let parsedAD = "";
  if (dateOfBirth) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
      return {
        error: prefix + "Date of Birth (AD) must use YYYY-MM-DD format.",
      };
    }

    const [year, month, day] = dateOfBirth.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));

    if (
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() !== month - 1 ||
      parsed.getUTCDate() !== day ||
      parsed.getTime() > Date.now()
    ) {
      return {
        error: prefix + "Date of Birth (AD) is invalid or in the future.",
      };
    }

    parsedAD = dateOfBirth;
  }

  const wardNumber = Number(wardNumberText);
  if (
    !wardNumberText ||
    !Number.isInteger(wardNumber) ||
    wardNumber < 1 ||
    wardNumber > 32
  ) {
    return {
      error: prefix + "Ward Number must be an integer from 1 to 32.",
    };
  }

  if (consent !== "YES") {
    return {
      error: prefix + 'Consent Given must be "YES". Registration without consent is not allowed.',
    };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      error: prefix + "Email address is invalid.",
    };
  }

  return {
    payload: {
      fullName,
      phone,
      email,
      dateOfBirth: parsedAD || null,
      dateOfBirthBS,
      bloodGroup,
      province,
      district,
      localLevel,
      wardName,
      wardNumber,
      address,
      consentGiven: true,
    },
  };
}

// ============================================================
// Component
// ============================================================

export default function DonorsClient() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [bloodGroupCounts, setBloodGroupCounts] = useState<
    { bloodGroup: string; count: number }[]
  >([]);

  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DonorForm>(EMPTY_FORM);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (search.trim()) params.set("search", search.trim());
      if (province) params.set("province", province);
      if (bloodGroup) params.set("bloodGroup", bloodGroup);
      if (status) params.set("status", status);

      const response = await fetch(`/api/donors?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const result = (await response.json()) as ApiResponse<Donor[]>;

      if (!response.ok || !result.success || !result.data || !result.meta) {
        throw new Error(result.message || "Could not load donors.");
      }

      setDonors(result.data);
      setTotal(result.meta.total);
      setActiveCount(result.meta.activeCount);
      setVerifiedCount(result.meta.verifiedCount);
      setBloodGroupCounts(result.meta.bloodGroupCounts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load donors.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, province, bloodGroup, status]);

  useEffect(() => {
    void fetchDonors();
  }, [fetchDonors]);

  function resetFilters() {
    setSearch("");
    setProvince("");
    setBloodGroup("");
    setStatus("");
    setPage(1);
  }

  function updateForm<K extends keyof DonorForm>(
    key: K,
    value: DonorForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          wardNumber: Number(form.wardNumber),
          email: form.email || null,
          dateOfBirth: form.dateOfBirth || null,
        }),
      });

      const result = (await response.json()) as ApiResponse<Donor>;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Donor registration failed.");
      }

      setNotice(
        `Donor ${result.data?.donorCode ?? ""} registered successfully.`,
      );
      setForm(EMPTY_FORM);
      setShowForm(false);
      setPage(1);
      await fetchDonors();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Donor registration failed.",
      );
    } finally {
      setSaving(false);
    }
  }

  function downloadTemplate() {
    const sample = [
      "Sample Donor",
      "9800000000",
      "sample@example.com",
      "2000-01-15",
      "2056-10-01",
      "A_POSITIVE",
      "Sudurpashchim Province",
      "Achham",
      "Sanphebagar Municipality",
      "Ward 1",
      1,
      "Sanphebagar, Achham, Nepal",
      "YES",
    ];

    const donorsSheet = XLSX.utils.aoa_to_sheet([
      [...TEMPLATE_HEADERS],
      sample,
    ]);

    donorsSheet["!cols"] = [
      { wch: 24 },
      { wch: 16 },
      { wch: 28 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 25 },
      { wch: 18 },
      { wch: 28 },
      { wch: 16 },
      { wch: 14 },
      { wch: 34 },
      { wch: 18 },
    ];

    const instructions = [
      ["LIFELINE ACHHAM — DONOR IMPORT TEMPLATE"],
      [""],
      ["IMPORTANT"],
      ["Delete the sample row before importing real donors."],
      ["Each data row must represent one donor."],
      ["Do not add donor codes, status or verification columns."],
      [""],
      ["FIELD", "REQUIREMENT"],
      ["Full Name", "Required"],
      ["Phone", "Required"],
      ["Email", "Optional; must be a valid email if provided"],
      ["Date of Birth (AD)", "Optional; YYYY-MM-DD; must not be in the future"],
      ["Date of Birth (BS)", "Required; YYYY-MM-DD"],
      ["Blood Group", `Required; use: ${BLOOD_GROUPS.join(", ")}`],
      ["Province", `Required; use exact values: ${NEPAL_PROVINCES.join("; ")}`],
      ["District", "Required"],
      ["Local Level", "Required"],
      ["Ward Name", "Required"],
      ["Ward Number", "Required integer from 1 to 32"],
      ["Address", "Optional"],
      ["Consent Given", 'Must be YES. Other values are rejected.'],
      [""],
      ["NOTE", "B.S. date checking validates the format and basic ranges only, not the full Nepali calendar."],
    ];

    const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions);
    instructionsSheet["!cols"] = [{ wch: 26 }, { wch: 100 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, donorsSheet, "Donors");
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");

    XLSX.writeFile(workbook, "Lifeline-Achham-Donor-Template.xlsx");
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setImporting(true);
    setError("");
    setNotice("");

    let successCount = 0;
    const errors: string[] = [];

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      const sheet = workbook.Sheets.Donors ?? workbook.Sheets[workbook.SheetNames[0]];

      if (!sheet) throw new Error("The Excel workbook has no readable worksheet.");

      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
        raw: false,
      });

      if (rows.length === 0) {
        throw new Error("The Excel file contains no donor rows.");
      }

      const missingHeaders = TEMPLATE_HEADERS.filter(
        (header) => !(header in rows[0]),
      );

      if (missingHeaders.length > 0) {
        throw new Error(
          `Template columns are missing: ${missingHeaders.join(", ")}. Download the latest template and try again.`,
        );
      }

      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        const rowNumber = index + 2;

        // Skip completely blank rows.
        if (
          Object.values(row).every(
            (value) => String(value ?? "").trim() === "",
          )
        ) {
          continue;
        }

        // Avoid importing the template's example row accidentally.
        if (
          String(getCell(row, "Full Name")).trim() === "Sample Donor" &&
          String(getCell(row, "Phone")).trim() === "9800000000"
        ) {
          errors.push(
            `Excel row ${rowNumber}: sample row detected. Delete it before importing.`,
          );
          continue;
        }

        const validated = validateImportRow(row, rowNumber);

        if (!validated.payload) {
          errors.push(validated.error || `Excel row ${rowNumber}: invalid row.`);
          continue;
        }

        try {
          const response = await fetch("/api/donors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validated.payload),
          });

          const result = (await response.json()) as ApiResponse<Donor>;

          if (!response.ok || !result.success) {
            errors.push(
              `Excel row ${rowNumber}: ${result.message || "Registration failed."}`,
            );
            continue;
          }

          successCount++;
        } catch {
          errors.push(`Excel row ${rowNumber}: network error while importing.`);
        }
      }

      setPage(1);
      await fetchDonors();

      const summary = `${successCount} donor(s) imported successfully.`;
      setNotice(
        errors.length
          ? `${summary} ${errors.length} row(s) need attention.`
          : summary,
      );

      if (errors.length) {
        setError(errors.slice(0, 12).join("\n") +
          (errors.length > 12 ? `\n…and ${errors.length - 12} more error(s).` : ""));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not import the Excel file.",
      );
    } finally {
      setImporting(false);
    }
  }

  async function exportAllFilteredDonors() {
    setError("");
    setNotice("");

    try {
      const allDonors: Donor[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const params = new URLSearchParams({
          page: String(currentPage),
          pageSize: "50",
        });

        if (search.trim()) params.set("search", search.trim());
        if (province) params.set("province", province);
        if (bloodGroup) params.set("bloodGroup", bloodGroup);
        if (status) params.set("status", status);

        const response = await fetch(`/api/donors?${params.toString()}`, {
          cache: "no-store",
        });

        const result = (await response.json()) as ApiResponse<Donor[]>;

        if (!response.ok || !result.success || !result.data || !result.meta) {
          throw new Error(result.message || "Export failed.");
        }

        allDonors.push(...result.data);
        totalPages = result.meta.totalPages;
        currentPage++;
      } while (currentPage <= totalPages);

      const rows = allDonors.map((donor) => ({
        "Donor Code": donor.donorCode,
        "Full Name": donor.fullName,
        Phone: donor.phone,
        Email: donor.email ?? "",
        "Date of Birth (AD)": donor.dateOfBirth
          ? excelDate(donor.dateOfBirth)
          : "",
        "Date of Birth (BS)": donor.dateOfBirthBS ?? "",
        "Blood Group": donor.bloodGroup,
        Province: donor.province ?? "",
        District: donor.district,
        "Local Level": donor.localLevel ?? "",
        "Ward Name": donor.wardName ?? "",
        "Ward Number": donor.wardNumber ?? "",
        Address: donor.address ?? "",
        Status: donor.status,
        Verified: donor.isVerified ? "YES" : "NO",
        "Consent Given": donor.consentGiven ? "YES" : "NO",
        "Last Donation": donor.lastDonationAt
          ? excelDate(donor.lastDonationAt)
          : "",
        "Registered At": excelDate(donor.createdAt),
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Donors");
      XLSX.writeFile(workbook, "Lifeline-Achham-Donors.xlsx");

      setNotice(`Exported ${allDonors.length} donor record(s).`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not export donors.",
      );
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Blood Donors
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Register, search and manage Lifeline Achham donor records.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FileSpreadsheet size={17} />
            Excel Template
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {importing ? (
              <LoaderCircle className="animate-spin" size={17} />
            ) : (
              <Upload size={17} />
            )}
            {importing ? "Importing…" : "Import Excel"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => {
              setError("");
              setNotice("");
              setForm(EMPTY_FORM);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <Plus size={17} />
            Register Donor
          </button>
        </div>
      </div>

      {(error || notice) && (
        <div
          className={`whitespace-pre-line rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error || notice}
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => {
              setError("");
              setNotice("");
            }}
            className="float-right ml-3"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Matching Donors"
          value={total}
          icon={<Users size={20} />}
        />
        <StatCard
          label="Active Donors"
          value={activeCount}
          icon={<Activity size={20} />}
        />
        <StatCard
          label="Verified Donors"
          value={verifiedCount}
          icon={<Users size={20} />}
        />
        <StatCard
          label="Blood Groups"
          value={bloodGroupCounts.length}
          icon={<Filter size={20} />}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter size={17} />
          Search and filters
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <label className="relative block">
            <span className="sr-only">Search donors</span>
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Name, code, phone…"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <select
            value={province}
            onChange={(event) => {
              setProvince(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All provinces</option>
            {NEPAL_PROVINCES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            value={bloodGroup}
            onChange={(event) => {
              setBloodGroup(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All blood groups</option>
            {BLOOD_GROUPS.map((item) => (
              <option key={item} value={item}>
                {displayBloodGroup(item)}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All statuses</option>
            {DONOR_STATUSES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void fetchDonors()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              type="button"
              onClick={resetFilters}
              title="Clear filters"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-600 hover:bg-slate-50"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            Excel import accepts the same province and blood group values as these filters.
          </p>
          <button
            type="button"
            onClick={exportAllFilteredDonors}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-100"
          >
            <Download size={17} />
            Export filtered records
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">Donor directory</h2>
            <p className="mt-1 text-xs text-slate-500">
              {total} matching record(s)
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Page {page} of {totalPages}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Donor</th>
                <th className="px-5 py-3 font-semibold">Blood group</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Date of birth (BS)</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-slate-500">
                    <LoaderCircle className="mx-auto mb-2 animate-spin" size={22} />
                    Loading donors…
                  </td>
                </tr>
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-slate-500">
                    No donors found. Adjust the filters or register a donor.
                  </td>
                </tr>
              ) : (
                donors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {donor.fullName}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {donor.donorCode}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-red-50 px-2.5 py-1 font-bold text-red-700">
                        {displayBloodGroup(donor.bloodGroup)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      <div>{donor.phone}</div>
                      {donor.email && (
                        <div className="mt-1 text-xs text-slate-500">
                          {donor.email}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <div>{donor.district}</div>
                      <div className="mt-1 text-xs">
                        {donor.localLevel ?? "—"}
                        {donor.wardNumber ? ` · Ward ${donor.wardNumber}` : ""}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {donor.province ?? "—"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {donor.dateOfBirthBS || "—"}
                      {donor.dateOfBirth && (
                        <div className="mt-1 text-xs text-slate-400">
                          AD: {displayDate(donor.dateOfBirth)}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          donor.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : donor.status === "SUSPENDED"
                              ? "bg-red-50 text-red-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {donor.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          donor.isVerified
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {donor.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            Showing {donors.length} record(s) on this page
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 sm:items-center">
          <div className="my-6 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Register a donor
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Donor code is generated automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close registration form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5 p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Full name *">
                  <input
                    required
                    maxLength={120}
                    value={form.fullName}
                    onChange={(event) => updateForm("fullName", event.target.value)}
                    className={inputClass}
                    placeholder="Donor's full name"
                  />
                </Field>

                <Field label="Phone *">
                  <input
                    required
                    maxLength={30}
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    className={inputClass}
                    placeholder="98XXXXXXXX"
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                    className={inputClass}
                    placeholder="name@example.com"
                  />
                </Field>

                <Field label="Date of birth (AD)">
                  <input
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={form.dateOfBirth}
                    onChange={(event) => updateForm("dateOfBirth", event.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Date of birth (BS) *">
                  <input
                    required
                    type="text"
                    pattern="\d{4}-\d{2}-\d{2}"
                    title="Use YYYY-MM-DD format"
                    value={form.dateOfBirthBS}
                    onChange={(event) => updateForm("dateOfBirthBS", event.target.value)}
                    className={inputClass}
                    placeholder="2056-10-01"
                  />
                </Field>

                <Field label="Blood group *">
                  <select
                    required
                    value={form.bloodGroup}
                    onChange={(event) => updateForm("bloodGroup", event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((item) => (
                      <option key={item} value={item}>
                        {displayBloodGroup(item)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Province *">
                  <select
                    required
                    value={form.province}
                    onChange={(event) => updateForm("province", event.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select province</option>
                    {NEPAL_PROVINCES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </Field>

                <Field label="District *">
                  <input
                    required
                    value={form.district}
                    onChange={(event) => updateForm("district", event.target.value)}
                    className={inputClass}
                    placeholder="e.g. Achham"
                  />
                </Field>

                <Field label="Local level *">
                  <input
                    required
                    value={form.localLevel}
                    onChange={(event) => updateForm("localLevel", event.target.value)}
                    className={inputClass}
                    placeholder="Municipality or rural municipality"
                  />
                </Field>

                <Field label="Ward name *">
                  <input
                    required
                    value={form.wardName}
                    onChange={(event) => updateForm("wardName", event.target.value)}
                    className={inputClass}
                    placeholder="e.g. Ward 1"
                  />
                </Field>

                <Field label="Ward number *">
                  <input
                    required
                    type="number"
                    min={1}
                    max={32}
                    step={1}
                    value={form.wardNumber}
                    onChange={(event) => updateForm("wardNumber", event.target.value)}
                    className={inputClass}
                    placeholder="1–32"
                  />
                </Field>

                <Field label="Address">
                  <input
                    value={form.address}
                    onChange={(event) => updateForm("address", event.target.value)}
                    className={inputClass}
                    placeholder="Street or tole"
                  />
                </Field>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.consentGiven}
                  onChange={(event) => updateForm("consentGiven", event.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border-slate-300"
                />
                <span>
                  <span className="font-semibold">Consent confirmed *</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Confirm that the donor has agreed to the collection and use of their information for blood donation coordination.
                  </span>
                </span>
              </label>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  {saving && <LoaderCircle className="animate-spin" size={17} />}
                  {saving ? "Registering…" : "Register donor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
