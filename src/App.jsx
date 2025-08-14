import React, { useMemo, useState } from "react";
import {
  FileText,
  Database,
  Activity,
  History as HistoryIcon,
  ArrowDownToLine,
  Filter as FilterIcon,
  Search as SearchIcon,
  ShieldCheck,
  GitBranch,
  BarChart3,
  Settings,
  Bell,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// ---------- Constants ----------
const STATUSES = [
  "Submitted",
  "Pending Review",
  "In Progress",
  "Draft",
  "Overdue",
];

const FREQS = ["Daily", "Weekly", "Monthly", "Quarterly", "Annual"];

function classNames(...cls) {
  return cls.filter(Boolean).join(" ");
}

const statusStyles = {
  Submitted: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "Pending Review": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "In Progress": "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Draft: "bg-gray-50 text-gray-700 ring-1 ring-gray-200",
  Overdue: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const palette = {
  Submitted: "#10b981",
  "Pending Review": "#f59e0b",
  "In Progress": "#0ea5e9",
  Draft: "#6b7280",
  Overdue: "#ef4444",
};

// ---------- Seed Data ----------
const SEED = [
  {
    id: 1,
    name: "Basel III — LCR",
    status: "Pending Review",
    dueDate: "2025-08-15",
    frequency: "Monthly",
    owner: "A. Sharma",
    reviewedBy: "M. Rao",
    comments: "Variance vs prior month at +2.1% on HQLA.",
  },
  {
    id: 2,
    name: "CRR — Cash Reserve Ratio",
    status: "Submitted",
    dueDate: "2025-08-07",
    frequency: "Weekly",
    owner: "S. Gupta",
    reviewedBy: "R. Iyer",
    comments: "On-time; no breaks.",
  },
  {
    id: 3,
    name: "RBI OSS — Balance Sheet",
    status: "In Progress",
    dueDate: "2025-08-20",
    frequency: "Monthly",
    owner: "P. Nair",
    reviewedBy: "—",
    comments: "Awaiting GL tie-out for loans.",
  },
  {
    id: 4,
    name: "FEMA — FX Position",
    status: "Overdue",
    dueDate: "2025-08-10",
    frequency: "Daily",
    owner: "K. Verma",
    reviewedBy: "—",
    comments: "Blocked on reference rates import.",
  },
  {
    id: 5,
    name: "CRILC — Large Exposure",
    status: "Draft",
    dueDate: "2025-09-01",
    frequency: "Quarterly",
    owner: "D. Patel",
    reviewedBy: "—",
    comments: "Schema change planned for Q3.",
  },
  {
    id: 6,
    name: "RBI — XBRL Return 3A",
    status: "Pending Review",
    dueDate: "2025-08-16",
    frequency: "Monthly",
    owner: "J. Singh",
    reviewedBy: "A. Rao",
    comments: "DQ issues reduced to 3 warnings.",
  },
  {
    id: 7,
    name: "NSFR — Net Stable Funding",
    status: "Submitted",
    dueDate: "2025-08-12",
    frequency: "Monthly",
    owner: "R. Das",
    reviewedBy: "N. Kulkarni",
    comments: "Checker comments addressed.",
  },
  {
    id: 8,
    name: "FinCEN — SAR Aggregate",
    status: "In Progress",
    dueDate: "2025-08-25",
    frequency: "Monthly",
    owner: "S. Khan",
    reviewedBy: "—",
    comments: "AML false positive review ongoing.",
  },
  {
    id: 9,
    name: "RBI — Return 7 (DPD)",
    status: "Pending Review",
    dueDate: "2025-08-14",
    frequency: "Monthly",
    owner: "V. Menon",
    reviewedBy: "P. Roy",
    comments: "DPD spike explained by system migration.",
  },
  {
    id: 10,
    name: "SEBI — Client Securities Ledger",
    status: "Overdue",
    dueDate: "2025-08-13",
    frequency: "Monthly",
    owner: "M. Jain",
    reviewedBy: "—",
    comments: "Pending reconciliation w/ custodian.",
  },
];

// ---------- Components ----------
export default function RegulatoryReportsMockup() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [freq, setFreq] = useState("");
  const [owner, setOwner] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState("dueDate");
  const [sortDir, setSortDir] = useState("asc");

  const owners = useMemo(
    () => Array.from(new Set(SEED.map((r) => r.owner))).filter((x) => x !== "—"),
    []
  );

  const filtered = useMemo(() => {
    let rows = [...SEED];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q) ||
          r.reviewedBy.toLowerCase().includes(q) ||
          r.comments.toLowerCase().includes(q)
      );
    }
    if (status) rows = rows.filter((r) => r.status === status);
    if (freq) rows = rows.filter((r) => r.frequency === freq);
    if (owner) rows = rows.filter((r) => r.owner === owner);
    if (dateFrom) rows = rows.filter((r) => r.dueDate >= dateFrom);
    if (dateTo) rows = rows.filter((r) => r.dueDate <= dateTo);

    rows.sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      if (A < B) return sortDir === "asc" ? -1 : 1;
      if (A > B) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [search, status, freq, owner, dateFrom, dateTo, sortKey, sortDir]);

  const metrics = useMemo(() => {
    const byStatus = STATUSES.map((s) => ({
      name: s,
      value: SEED.filter((r) => r.status === s).length,
    }));
    const today = new Date().toISOString().slice(0, 10);
    const dueToday = SEED.filter((r) => r.dueDate === today).length;
    const overdue = SEED.filter((r) => r.dueDate < today && r.status !== "Submitted").length;
    return { byStatus, total: SEED.length, dueToday, overdue };
  }, []);

  const onSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900">
      {/* Shell */}
      <div className="grid grid-cols-[240px_1fr] h-full">
        {/* Sidebar */}
        <aside className="bg-slate-900 text-slate-100 flex flex-col">
          <div className="px-4 py-4 flex items-center gap-2 border-b border-white/10">
            <BarChart3 className="w-5 h-5" />
            <span className="font-semibold tracking-tight">RegOps Console</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 text-sm">
            <NavItem icon={<Activity />} label="Activity" />
            <NavItem icon={<FileText />} label="Regulatory Reports" active />
            <NavItem icon={<Database />} label="Data Quality" />
            <NavItem icon={<GitBranch />} label="Data Lineage" />
            <NavItem icon={<HistoryIcon />} label="History" />
            <NavItem icon={<Settings />} label="Settings" />
            <NavItem icon={<Bell />} label="Notifications" />
          </nav>
          <div className="px-4 py-3 text-xs text-slate-400 border-t border-white/10">
            © 2025 Universal Bank
          </div>
        </aside>

        {/* Main */}
        <main className="overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
            <div>
              <div className="text-xs text-slate-500">Home / Regulatory Reporting / Reports</div>
              <h1 className="text-xl font-semibold">Regulatory Reports — My Assignments</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-sm hover:bg-black transition">
                <ArrowDownToLine className="w-4 h-4" /> Export CSV
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm hover:bg-slate-50">
                <FilterIcon className="w-4 h-4" /> Save View
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Controls + Table */}
            <section className="xl:col-span-2 space-y-6">
              {/* Controls */}
              <div className="bg-white rounded-2xl border p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="md:col-span-2 relative">
                    <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name, owner, comment…"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border focus:ring-2 focus:ring-slate-300 outline-none"
                    />
                  </div>
                  <Select label="Status" value={status} setValue={setStatus} options={["", ...STATUSES]} />
                  <Select label="Frequency" value={freq} setValue={setFreq} options={["", ...FREQS]} />
                  <Select label="Owner" value={owner} setValue={setOwner} options={["", ...owners]} />
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border"
                      aria-label="From date"
                    />
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border"
                      aria-label="To date"
                    />
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Kpi title="Total Reports" value={metrics.total} />
                <Kpi title="Due Today" value={metrics.dueToday} />
                <Kpi title="Overdue" value={metrics.overdue} tone="danger" />
                <Kpi title="Pending Review" value={metrics.byStatus.find((d) => d.name === "Pending Review").value} tone="warn" />
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <Th label="Report Name" onClick={() => onSort("name")} active={sortKey === "name"} dir={sortDir} />
                        <th className="px-4 py-3 text-left">Status</th>
                        <Th label="Due Date" onClick={() => onSort("dueDate")} active={sortKey === "dueDate"} dir={sortDir} />
                        <Th label="Frequency" onClick={() => onSort("frequency")} active={sortKey === "frequency"} dir={sortDir} />
                        <Th label="Owner" onClick={() => onSort("owner")} active={sortKey === "owner"} dir={sortDir} />
                        <Th label="Reviewed By" onClick={() => onSort("reviewedBy")} active={sortKey === "reviewedBy"} dir={sortDir} />
                        <th className="px-4 py-3 text-left">Comments</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filtered.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3 font-medium">{r.name}</td>
                          <td className="px-4 py-3">
                            <span className={classNames("px-2.5 py-1 rounded-full text-xs font-medium", statusStyles[r.status])}>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 tabular-nums">{formatDate(r.dueDate)}</td>
                          <td className="px-4 py-3">{r.frequency}</td>
                          <td className="px-4 py-3">{r.owner}</td>
                          <td className="px-4 py-3">{r.reviewedBy}</td>
                          <td className="px-4 py-3 max-w-[360px] truncate" title={r.comments}>
                            {r.comments}
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex items-center justify-end gap-1">
                              <IconButton title="Download">
                                <ArrowDownToLine className="w-4 h-4" />
                              </IconButton>
                              <IconButton title="Data Quality">
                                <ShieldCheck className="w-4 h-4" />
                              </IconButton>
                              <IconButton title="Data Lineage">
                                <GitBranch className="w-4 h-4" />
                              </IconButton>
                              <IconButton title="History">
                                <HistoryIcon className="w-4 h-4" />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 bg-slate-50/60 flex items-center justify-between text-xs text-slate-600">
                  <span>{filtered.length} of {SEED.length} shown</span>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 rounded-lg border">Prev</button>
                    <button className="px-2 py-1 rounded-lg border bg-white">Next</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Right: Chart & Helpers */}
            <section className="space-y-6">
              <div className="bg-white rounded-2xl border p-4 shadow-sm h-[320px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Overall Report Metrics</h3>
                  <span className="text-xs text-slate-500">by status</span>
                </div>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={metrics.byStatus} dataKey="value" nameKey="name" outerRadius={80} label>
                        {metrics.byStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={palette[entry.name]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl border p-4 shadow-sm space-y-3">
                <h3 className="font-semibold">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="justify-between inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-slate-50">
                    SLA Breaches <span className="ml-auto inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-700 text-xs">{metrics.overdue}</span>
                  </button>
                  <button className="justify-between inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-slate-50">
                    Checker Queue <span className="ml-auto inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs">{metrics.byStatus.find((d) => d.name === "Pending Review").value}</span>
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-slate-50">
                    Refresh Data
                  </button>
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-slate-50">
                    Manage Subscriptions
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 mt-0.5" />
                  <div>
                    <div className="font-semibold">Maker–Checker Workflow</div>
                    <p className="text-xs text-white/80 mt-1">
                      Use <span className="font-medium">Pending Review</span> to signal the Checker queue. Actions are audited and changes tracked to ensure compliance.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button
      className={classNames(
        "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition",
        active ? "bg-white/10" : "hover:bg-white/5"
      )}
      aria-current={active ? "page" : undefined}
    >
      <span className="opacity-90">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function Select({ label, value, setValue, options }) {
  return (
    <label className="relative">
      <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-slate-500">{label}</span>
      <select
        className="w-full appearance-none px-3 py-2 rounded-xl border pr-8 bg-white"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt || "All"}
          </option>
        ))}
      </select>
      <ChevronRight className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 rotate-90" />
    </label>
  );
}

function Kpi({ title, value, tone }) {
  const toneCls =
    tone === "danger"
      ? "bg-rose-50 text-rose-700"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700"
      : "bg-slate-50 text-slate-700";
  return (
    <div className={classNames("rounded-2xl border p-4 shadow-sm", toneCls)}>
      <div className="text-xs opacity-80">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Th({ label, onClick, active, dir }) {
  return (
    <th className="px-4 py-3 text-left">
      <button onClick={onClick} className="inline-flex items-center gap-1 font-medium">
        {label}
        {active && (
          <span className="text-xs text-slate-400">{dir === "asc" ? "▲" : "▼"}</span>
        )}
      </button>
    </th>
  );
}

function IconButton({ title, children }) {
  return (
    <button
      className="p-2 rounded-lg border hover:bg-slate-50"
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
