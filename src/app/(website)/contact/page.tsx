"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

const enquiryTypes = [
  "General Enquiry",
  "Blood Donation",
  "Volunteer",
  "Partnership",
  "Program / Project",
  "Media & Communication",
];

const contactCards = [
  {
    icon: Mail,
    title: "Email Us",
    value: "lifelineachham@gmail.com",
    description: "For general enquiries, collaboration and communication.",
    href: "mailto:lifelineachham@gmail.com",
    action: "Send an email",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+977 9865820120",
    description: "For immediate assistance or queries.",
    href: "tel:+9779865820120",
    action: "Make a call",
  },
  {
    icon: MapPin,
    title: "Our Location",
    value: "Achham, Nepal",
    description: "Connected with communities across Achham and beyond.",
    href: "#location",
    action: "View location",
  },
  {
    icon: MessageCircle,
    title: "Stay Connected",
    value: "Community & enquiries",
    description: "Reach out to share an idea, question or opportunity.",
    href: "#contact-form",
    action: "Send a message",
  },
];

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: ContactPayload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      enquiryType: String(formData.get("enquiry") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.enquiryType ||
      !payload.subject ||
      !payload.message
    ) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Accept international phone formats while requiring 7–15 digits.
    const phoneDigits = payload.phone.replace(/\D/g, "");

    if (
      phoneDigits.length < 7 ||
      phoneDigits.length > 15 ||
      !/^[+\d][\d\s().-]*$/.test(payload.phone)
    ) {
      setErrorMessage(
        "Please enter a valid phone number with 7–15 digits.",
      );
      return;
    }

    if (!enquiryTypes.includes(payload.enquiryType)) {
      setErrorMessage("Please select a valid enquiry type.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/messages/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error ||
            result?.message ||
            "We couldn't send your message. Please try again.",
        );
      }

      setSubmitted(true);
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setSubmitted(false);
    setErrorMessage("");
  }

  return (
    <div className="bg-[#FCFAF7] text-[#172033]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[500px] sm:h-[540px] lg:h-[580px]">
          <Image
            src="https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=2200&q=90"
            alt="People connecting and working together"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-[#55152B]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#55152B]/95 via-[#7A1F3D]/70 to-[#2457C5]/20" />

          <div className="relative mx-auto flex h-full max-w-7xl items-start px-5 pt-28 sm:px-8 sm:pt-32 lg:px-10 lg:pt-36">
            <div className="w-full max-w-4xl text-white">
              <div className="mb-8 flex items-center gap-2 text-sm text-white/70">
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
                <span className="text-white/40">/</span>
                <span className="font-medium text-white">Contact</span>
              </div>

              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                <span className="h-[3px] w-9 rounded-full bg-white" />
                Contact Us
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Let&apos;s connect and work together.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                Whether you want to learn more about our work, volunteer,
                collaborate or share an enquiry, we would be glad to hear from
                you.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#contact-form"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] bg-[#2457C5] px-6 text-sm font-bold text-white shadow-lg shadow-[#2457C5]/30 transition duration-200 hover:-translate-y-0.5 hover:bg-[#17439F]"
                >
                  Send a Message
                  <ArrowRight size={17} />
                </a>

                <Link
                  href="/blood-donation"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition duration-200 hover:bg-white/20"
                >
                  Blood Donation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="section">
        <div className="container-main">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
              <span className="brand-line" />
              Get In Touch
              <span className="brand-line" />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
              We&apos;re here to listen.
            </h2>

            <p className="mt-5 text-[15px] leading-8 text-slate-600">
              Reach out to Lifeline Achham for general information,
              collaboration opportunities, volunteering or community-related
              enquiries.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {contactCards.map((card) => {
              const Icon = card.icon;

              return (
                <a
                  key={card.title}
                  href={card.href}
                  className="card card-hover group p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7E9EE] text-[#7A1F3D] transition duration-300 group-hover:bg-[#7A1F3D] group-hover:text-white">
                      <Icon size={21} />
                    </div>

                    <ArrowRight
                      size={17}
                      className="text-slate-300 transition duration-300 group-hover:translate-x-1 group-hover:text-[#2457C5]"
                    />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-[#172033]">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-[#2457C5]">
                    {card.value}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {card.description}
                  </p>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#7A1F3D]">
                    {card.action}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact-form" className="section bg-white">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#2457C5]">
                <span className="h-[3px] w-8 rounded-full bg-[#2457C5]" />
                Send an Enquiry
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">
                Tell us how we can help.
              </h2>

              <p className="mt-5 text-[15px] leading-8 text-slate-600">
                Have a question, idea or opportunity to collaborate? Send us
                a message and share a little context about your enquiry.
              </p>

              <div className="mt-8 space-y-4">
                <InfoPoint
                  icon={<CheckCircle2 size={19} />}
                  title="Community focused"
                  description="Share questions, ideas or opportunities connected with community work."
                  color="burgundy"
                />

                <InfoPoint
                  icon={<MessageCircle size={19} />}
                  title="Volunteer & collaborate"
                  description="Let us know if you are interested in contributing your time, skills or resources."
                  color="blue"
                />

                <InfoPoint
                  icon={<Clock3 size={19} />}
                  title="Clear communication"
                  description="Providing enough context helps the team understand and respond to your enquiry."
                  color="burgundy"
                />
              </div>

              <div className="mt-8 rounded-2xl border border-[#2457C5]/10 bg-[#EEF4FF] p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-[#2457C5]"
                  />

                  <div>
                    <p className="text-sm font-bold text-[#172033]">
                      Please protect your privacy
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Please avoid sending highly sensitive personal,
                      financial or medical information through this general
                      enquiry form.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
              {submitted ? (
                <SuccessMessage onReset={resetForm} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="name"
                      label="Full Name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      required
                      maxLength={120}
                      autoComplete="name"
                    />

                    <FormField
                      id="email"
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      maxLength={254}
                      autoComplete="email"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="Your phone number"
                      required
                      maxLength={30}
                      autoComplete="tel"
                    />

                    <div>
                      <label
                        htmlFor="enquiry"
                        className="mb-2 block text-sm font-bold text-[#172033]"
                      >
                        Enquiry Type
                      </label>

                      <select
                        id="enquiry"
                        name="enquiry"
                        defaultValue=""
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-[#FCFAF7] px-4 text-sm text-[#172033] outline-none transition focus:border-[#2457C5] focus:bg-white focus:ring-4 focus:ring-[#2457C5]/10"
                      >
                        <option value="" disabled>
                          Select an enquiry
                        </option>

                        {enquiryTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <FormField
                    id="subject"
                    label="Subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    required
                    maxLength={200}
                  />

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-bold text-[#172033]"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      required
                      minLength={5}
                      maxLength={10000}
                      rows={7}
                      placeholder="Write your message here..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-[#FCFAF7] px-4 py-3 text-sm leading-6 text-[#172033] outline-none transition placeholder:text-slate-400 focus:border-[#2457C5] focus:bg-white focus:ring-4 focus:ring-[#2457C5]/10"
                    />
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#2457C5] px-6 text-sm font-bold text-white shadow-md shadow-[#2457C5]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#17439F] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? "Sending Message..." : "Send Message"}
                    <Send
                      size={17}
                      className={isSubmitting ? "animate-pulse" : ""}
                    />
                  </button>

                  <p className="text-xs leading-5 text-slate-400">
                    Your message will be submitted to the Lifeline Achham
                    team for review.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="section">
        <div className="container-main">
          <div className="grid overflow-hidden rounded-[30px] border border-slate-200 bg-white lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-7 sm:p-9 lg:p-12">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7A1F3D]">
                <MapPin size={16} />
                Find Us
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#172033]">
                Connected to Achham.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Lifeline Achham is based in Achham, Nepal. Detailed office
                information can be connected here when the organization
                publishes the official address.
              </p>

              <div className="mt-8 space-y-5">
                <LocationItem
                  icon={<MapPin size={18} />}
                  label="Location"
                  value="Achham, Nepal"
                  color="burgundy"
                />

                <LocationItem
                  icon={<Mail size={18} />}
                  label="Email"
                  value="lifelineachham@gmail.com"
                  color="blue"
                  href="mailto:lifelineachham@gmail.com"
                />
              </div>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#2457C5] transition hover:text-[#17439F]"
              >
                Learn more about Lifeline Achham
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative min-h-[380px] overflow-hidden bg-[#172033]">
              <Image
                src="https://images.unsplash.com/photo-1524666041070-9b8767495e15?auto=format&fit=crop&w=1600&q=90"
                alt="Community landscape"
                fill
                className="object-cover opacity-70"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />

              <div className="absolute inset-0 bg-gradient-to-br from-[#55152B]/70 via-transparent to-[#2457C5]/55" />

              <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 shrink-0" size={19} />
                    <div>
                      <p className="text-sm font-bold">Achham, Nepal</p>
                      <p className="mt-1 text-xs leading-5 text-white/65">
                        Official office and map details can be connected here
                        when finalized.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-sm">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-[30px] bg-[#7A1F3D] px-6 py-12 text-center text-white sm:px-10">
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full border-[40px] border-white/5" />
            <div className="absolute -bottom-28 -right-16 h-64 w-64 rounded-full border-[32px] border-[#2457C5]/30" />

            <div className="relative mx-auto max-w-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <MessageCircle size={21} />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                Have something to share?
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                Your ideas, questions and willingness to contribute can help
                strengthen community action.
              </p>

              <a
                href="#contact-form"
                className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] bg-[#2457C5] px-6 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#17439F]"
              >
                Start a Conversation
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FormField({
  id,
  label,
  name,
  type,
  placeholder,
  required = false,
  maxLength,
  autoComplete,
}: {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-bold text-[#172033]"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-[#FCFAF7] px-4 text-sm text-[#172033] outline-none transition placeholder:text-slate-400 focus:border-[#2457C5] focus:bg-white focus:ring-4 focus:ring-[#2457C5]/10"
      />
    </div>
  );
}

function InfoPoint({
  icon,
  title,
  description,
  color,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  color: "burgundy" | "blue";
}) {
  const isBlue = color === "blue";

  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-[#FCFAF7] p-5">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isBlue
            ? "bg-[#EEF4FF] text-[#2457C5]"
            : "bg-[#F7E9EE] text-[#7A1F3D]"
        }`}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#172033]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function LocationItem({
  icon,
  label,
  value,
  color,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  color: "burgundy" | "blue";
  href?: string;
}) {
  const isBlue = color === "blue";

  const content = (
    <>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isBlue
            ? "bg-[#EEF4FF] text-[#2457C5]"
            : "bg-[#F7E9EE] text-[#7A1F3D]"
        }`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p
          className={`mt-1 text-sm font-bold ${
            isBlue ? "text-[#2457C5]" : "text-[#172033]"
          }`}
        >
          {value}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className="flex items-center gap-4">
        {content}
      </a>
    );
  }

  return <div className="flex items-center gap-4">{content}</div>;
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="status"
      className="flex min-h-[500px] flex-col items-center justify-center text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF4FF] text-[#2457C5]">
        <CheckCircle2 size={31} />
      </div>

      <h3 className="mt-6 text-2xl font-bold text-[#172033]">
        Message sent successfully!
      </h3>

      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
        Thank you for contacting Lifeline Achham. Your message has been
        submitted successfully. Our team will review your enquiry and respond
        when possible.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-7 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#2457C5] px-5 text-sm font-bold text-white transition hover:bg-[#17439F]"
      >
        Send Another Message
        <Send size={16} />
      </button>
    </div>
  );
}
