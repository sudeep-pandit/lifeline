import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  HeartHandshake,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProjectStatus = "Ongoing" | "Planned" | "Completed";

type Project = {
  slug: string;
  title: string;
  category: string;
  status: ProjectStatus;
  location: string;
  duration: string;
  summary: string;
  description: string;
  image: string;
  objectives: string[];
  activities: string[];
  timeline: {
    stage: string;
    title: string;
    description: string;
  }[];
  outcomes: string[];
  gallery: string[];
  documents: {
    title: string;
    type: string;
  }[];
};

const projects: Record<string, Project> = {
  "community-engagement-initiative": {
    slug: "community-engagement-initiative",
    title: "Community Engagement Initiative",
    category: "Community Development",
    status: "Ongoing",
    location: "Achham, Nepal",
    duration: "Project timeline",
    summary:
      "A focused initiative designed to encourage community participation, collaboration and meaningful local action.",
    description:
      "This project is designed as a community-centered initiative that creates opportunities for people to participate, share perspectives and contribute to local action. The project structure can be adapted as activities, partnerships and implementation details are finalized.",
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=2000&q=90",
    objectives: [
      "Encourage meaningful community participation.",
      "Create opportunities for collaboration and local dialogue.",
      "Support practical community-led activities.",
      "Document learning and experiences from implementation.",
    ],
    activities: [
      "Community discussions and consultations.",
      "Participation-focused local activities.",
      "Coordination with relevant community stakeholders.",
      "Documentation and review of project progress.",
    ],
    timeline: [
      {
        stage: "01",
        title: "Preparation",
        description:
          "Understand the context, identify priorities and prepare the project structure.",
      },
      {
        stage: "02",
        title: "Community Engagement",
        description:
          "Connect with community members and create opportunities for participation.",
      },
      {
        stage: "03",
        title: "Implementation",
        description:
          "Carry out planned activities through coordinated local action.",
      },
      {
        stage: "04",
        title: "Review & Learning",
        description:
          "Document progress, reflect on experiences and identify improvements.",
      },
    ],
    outcomes: [
      "Greater opportunities for community participation.",
      "Improved coordination around project activities.",
      "Documented experiences and lessons for future initiatives.",
      "A stronger foundation for continued community engagement.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
    ],
    documents: [
      {
        title: "Project Overview",
        type: "Document",
      },
      {
        title: "Project Activity Report",
        type: "Report",
      },
      {
        title: "Project Information",
        type: "Publication",
      },
    ],
  },

  "youth-learning-initiative": {
    slug: "youth-learning-initiative",
    title: "Youth Learning Initiative",
    category: "Education & Youth",
    status: "Planned",
    location: "Achham, Nepal",
    duration: "Project timeline",
    summary:
      "A focused initiative supporting learning opportunities, youth participation and knowledge sharing.",
    description:
      "The Youth Learning Initiative is structured around opportunities for young people to learn, participate and share knowledge. Detailed activities and implementation information can be updated through the future CMS as the project develops.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2000&q=90",
    objectives: [
      "Encourage youth participation in learning activities.",
      "Support knowledge sharing and practical learning opportunities.",
      "Create spaces for collaboration and discussion.",
      "Encourage youth-led ideas and participation.",
    ],
    activities: [
      "Learning sessions and workshops.",
      "Youth discussion and knowledge-sharing activities.",
      "Collaborative learning opportunities.",
      "Documentation of participation and learning.",
    ],
    timeline: [
      {
        stage: "01",
        title: "Planning",
        description:
          "Define learning priorities, participants and practical activities.",
      },
      {
        stage: "02",
        title: "Preparation",
        description:
          "Prepare learning resources, coordination and implementation arrangements.",
      },
      {
        stage: "03",
        title: "Learning Activities",
        description:
          "Deliver planned learning and participation activities.",
      },
      {
        stage: "04",
        title: "Reflection",
        description:
          "Review participation, learning and opportunities for improvement.",
      },
    ],
    outcomes: [
      "More opportunities for youth learning and participation.",
      "Increased opportunities for knowledge exchange.",
      "Practical learning experiences.",
      "Documented learning for future initiatives.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=85",
    ],
    documents: [
      {
        title: "Project Concept",
        type: "Document",
      },
      {
        title: "Learning Framework",
        type: "Publication",
      },
      {
        title: "Project Information",
        type: "Document",
      },
    ],
  },

  "health-awareness-initiative": {
    slug: "health-awareness-initiative",
    title: "Health Awareness Initiative",
    category: "Health & Awareness",
    status: "Ongoing",
    location: "Achham, Nepal",
    duration: "Project timeline",
    summary:
      "A community-focused initiative centered on awareness, responsible information sharing and participation.",
    description:
      "This initiative provides a structure for community-focused health awareness activities and responsible information sharing. Specific activities, dates and project outcomes can be maintained through the organization CMS.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=90",
    objectives: [
      "Encourage awareness around relevant health topics.",
      "Support responsible health information sharing.",
      "Create opportunities for community discussion and participation.",
      "Document activities and learning from the initiative.",
    ],
    activities: [
      "Community awareness sessions.",
      "Information-sharing activities.",
      "Community discussions and participation.",
      "Activity documentation and review.",
    ],
    timeline: [
      {
        stage: "01",
        title: "Needs & Planning",
        description:
          "Identify relevant awareness priorities and plan suitable activities.",
      },
      {
        stage: "02",
        title: "Preparation",
        description:
          "Prepare information resources and coordinate implementation.",
      },
      {
        stage: "03",
        title: "Awareness Activities",
        description:
          "Conduct planned awareness and community participation activities.",
      },
      {
        stage: "04",
        title: "Review",
        description:
          "Review activities, participation and lessons for future work.",
      },
    ],
    outcomes: [
      "More opportunities for community health awareness.",
      "Improved access to responsible information.",
      "Greater community participation in awareness activities.",
      "Documented learning for future initiatives.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=85",
    ],
    documents: [
      {
        title: "Awareness Project Overview",
        type: "Document",
      },
      {
        title: "Activity Report",
        type: "Report",
      },
      {
        title: "Health Awareness Resources",
        type: "Publication",
      },
    ],
  },

  "community-capacity-initiative": {
    slug: "community-capacity-initiative",
    title: "Community Capacity Initiative",
    category: "Community Development",
    status: "Planned",
    location: "Achham, Nepal",
    duration: "Project timeline",
    summary:
      "An initiative focused on strengthening participation, collaboration and opportunities for local capacity development.",
    description:
      "The Community Capacity Initiative provides a framework for supporting local participation, collaboration and capacity development. The project details are intentionally structured so that implementation information can be expanded through the CMS.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2000&q=90",
    objectives: [
      "Strengthen opportunities for local capacity development.",
      "Encourage collaboration and knowledge sharing.",
      "Support participation in community-focused activities.",
      "Capture lessons that can support future initiatives.",
    ],
    activities: [
      "Capacity-building sessions.",
      "Knowledge-sharing activities.",
      "Community collaboration and coordination.",
      "Project review and documentation.",
    ],
    timeline: [
      {
        stage: "01",
        title: "Assessment",
        description:
          "Understand relevant priorities and opportunities for capacity development.",
      },
      {
        stage: "02",
        title: "Planning",
        description:
          "Develop activities, resources and coordination arrangements.",
      },
      {
        stage: "03",
        title: "Implementation",
        description:
          "Carry out capacity-focused activities and community participation.",
      },
      {
        stage: "04",
        title: "Learning",
        description:
          "Review progress and document lessons for future work.",
      },
    ],
    outcomes: [
      "More opportunities for local capacity development.",
      "Improved collaboration and knowledge sharing.",
      "Greater participation in community activities.",
      "Documented learning and experience.",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=85",
    ],
    documents: [
      {
        title: "Project Concept",
        type: "Document",
      },
      {
        title: "Capacity Development Framework",
        type: "Publication",
      },
      {
        title: "Project Information",
        type: "Document",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];

  if (!project) {
    notFound();
  }

  return (
    <main className="overflow-hidden bg-[#FCFAF7]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#55152B] pt-[112px]">
        <div className="relative min-h-[500px]">
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-[#55152B]/75" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#55152B]/70 to-[#55152B]/20" />

          <div className="container-main relative z-10 flex min-h-[500px] items-center py-20">
            <div className="max-w-4xl">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                  {project.category}
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    project.status === "Ongoing"
                      ? "bg-[#198754] text-white"
                      : project.status === "Completed"
                        ? "bg-[#2457C5] text-white"
                        : "bg-white/15 text-white"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>

              <p className="mt-6 max-w-3xl text-sm leading-8 text-white/75 sm:text-base lg:text-lg">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/65">
                <span className="flex items-center gap-2">
                  <MapPin size={15} />
                  {project.location}
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays size={15} />
                  {project.duration}
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
                <Link
                  href="/"
                  className="text-white/55 transition hover:text-white"
                >
                  Home
                </Link>

                <span className="text-white/25">/</span>

                <Link
                  href="/work/projects"
                  className="text-white/55 transition hover:text-white"
                >
                  Projects
                </Link>

                <span className="text-white/25">/</span>

                <span className="max-w-[240px] truncate text-white/40">
                  {project.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT AT A GLANCE */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-main">
          <div className="grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            <ProjectMeta
              icon={FolderKanban}
              label="Category"
              value={project.category}
            />

            <ProjectMeta
              icon={CheckCircle2}
              label="Status"
              value={project.status}
            />

            <ProjectMeta
              icon={MapPin}
              label="Location"
              value={project.location}
            />

            <ProjectMeta
              icon={Clock3}
              label="Timeline"
              value={project.duration}
            />
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:gap-20">
            <div>
              <SectionLabel label="Project Overview" />

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Understanding the
                <span className="text-[#7A1F3D]"> project.</span>
              </h2>

              <p className="mt-6 text-sm leading-8 text-slate-500 sm:text-base">
                {project.description}
              </p>

              <p className="mt-5 text-sm leading-8 text-slate-500 sm:text-base">
                This project page is structured to present the initiative
                clearly while keeping project-specific information ready for
                future updates through the Lifeline Achham CMS.
              </p>
            </div>

            <div className="rounded-3xl bg-[#F7E9EE] p-7 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7A1F3D] text-white">
                <Target size={21} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-[#172033]">
                Project focus
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                A clear project structure helps visitors understand why the
                project exists, what it intends to do and how activities are
                organized.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                <span className="text-xs font-semibold text-[#7A1F3D]">
                  {project.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
            <div>
              <SectionLabel label="Objectives" />

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                What this project
                <span className="text-[#2457C5]"> aims to support.</span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                Objectives can be managed from the CMS and updated as the
                project develops.
              </p>
            </div>

            <div className="space-y-4">
              {project.objectives.map((objective, index) => (
                <div
                  key={objective}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-[#FCFAF7] p-5 sm:p-6"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF] text-xs font-bold text-[#2457C5]">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <p className="pt-1 text-sm font-medium leading-7 text-slate-600">
                    {objective}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="section">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel label="Activities" centered />

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              Turning objectives into
              <span className="text-[#7A1F3D]"> practical action.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Planned activities can be expanded and maintained through the
              project management system.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {project.activities.map((activity, index) => (
              <div
                key={activity}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#2457C5]/20 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D]">
                    <HeartHandshake size={19} />
                  </div>

                  <span className="text-xs font-bold tracking-[0.15em] text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-[#172033]">
                  {activity}
                </h3>

                <div className="mt-5 h-px w-8 bg-[#2457C5] transition-all duration-300 group-hover:w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="border-y border-slate-200 bg-[#FCFAF7] py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel label="Project Timeline" centered />

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              From preparation to
              <span className="text-[#2457C5]"> learning.</span>
            </h2>
          </div>

          <div className="relative mx-auto mt-14 max-w-5xl">
            <div className="absolute bottom-8 left-[23px] top-8 hidden w-px bg-slate-200 md:block" />

            <div className="space-y-6">
              {project.timeline.map((item) => (
                <div
                  key={item.stage}
                  className="relative flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:gap-7 sm:p-7"
                >
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#55152B] text-xs font-bold text-white shadow-lg">
                    {item.stage}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#172033] sm:text-xl">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
            <div className="rounded-3xl bg-[#55152B] p-8 sm:p-10 lg:p-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                <Target size={21} />
              </div>

              <h2 className="mt-7 text-2xl font-bold text-white sm:text-3xl">
                Outcomes
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/60">
                Outcome fields can be updated through the CMS as project
                implementation and documentation progress.
              </p>
            </div>

            <div className="space-y-4">
              {project.outcomes.map((outcome) => (
                <div
                  key={outcome}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF] text-[#2457C5]">
                    <CheckCircle2 size={17} />
                  </div>

                  <p className="text-sm leading-7 text-slate-600">
                    {outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="border-y border-slate-200 bg-white py-20">
        <div className="container-main">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel label="Project Gallery" />

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Project moments &
                <span className="text-[#7A1F3D]"> activities.</span>
              </h2>
            </div>

            <span className="text-xs text-slate-400">
              Images can be managed through the CMS
            </span>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {project.gallery.map((image, index) => (
              <div
                key={image}
                className={`relative overflow-hidden rounded-2xl ${
                  index === 0 ? "md:col-span-2 md:h-[380px]" : "h-[280px]"
                }`}
              >
                <Image
                  src={image}
                  alt={`${project.title} gallery image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/45 to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#172033] backdrop-blur">
                    Project image
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="section">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
            <div>
              <SectionLabel label="Documents & Resources" />

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Project
                <span className="text-[#2457C5]"> resources.</span>
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                Official project documents, reports and publications can be
                added here when available.
              </p>
            </div>

            <div className="space-y-3">
              {project.documents.map((document) => (
                <div
                  key={document.title}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#2457C5]/20 hover:shadow-md"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
                      <FileText size={18} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[#172033]">
                        {document.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {document.type}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="shrink-0 text-xs font-bold text-[#2457C5] transition hover:text-[#17439F]"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED LINKS */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="container-main">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <SectionLabel label="Continue Exploring" />

              <h2 className="mt-3 text-2xl font-bold text-[#172033]">
                Explore more of our work.
              </h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/work/projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-[#2457C5]/30 hover:bg-[#EEF4FF] hover:text-[#2457C5]"
              >
                <ArrowLeft size={16} />
                All Projects
              </Link>

              <Link
                href="/work/programs"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17439F]"
              >
                Explore Programs
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FCFAF7] py-20 sm:py-24">
        <div className="container-main">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#55152B] px-7 py-14 text-center sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-white/[0.045]" />

            <div className="pointer-events-none absolute -bottom-24 left-1/4 h-52 w-52 rounded-full bg-[#2457C5]/15 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mb-5 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2457C5]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                  Get Involved
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Want to support meaningful community work?
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                Connect with Lifeline Achham to learn more about our work,
                discuss collaboration or find meaningful ways to contribute.
              </p>

              <Link
                href="/contact"
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2457C5] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:bg-[#17439F]"
              >
                Contact Us

                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionLabel({
  label,
  centered = false,
}: {
  label: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${
        centered ? "justify-center" : ""
      }`}
    >
      <span className="brand-line" />

      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7A1F3D]">
        {label}
      </span>
    </div>
  );
}

function ProjectMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-6 sm:px-7 lg:px-8">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#2457C5]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-[#172033]">
          {value}
        </p>
      </div>
    </div>
  );
}