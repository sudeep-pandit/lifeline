
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedEnquiryTypes = [
  "General Enquiry",
  "Blood Donation",
  "Volunteer",
  "Partnership",
  "Program / Project",
  "Media & Communication",
];

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid submission." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const name = cleanText(data.name);
    const email = cleanText(data.email).toLowerCase();
    const phone = cleanText(data.phone);
    const enquiryType = cleanText(data.enquiryType ?? data.enquiry);
    const subject = cleanText(data.subject);
    const message = cleanText(data.message);

    if (!name || !email || !enquiryType || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (
      name.length > 120 ||
      email.length > 254 ||
      phone.length > 30 ||
      subject.length > 200 ||
      message.length > 10000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more fields exceed the allowed length.",
        },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!allowedEnquiryTypes.includes(enquiryType)) {
      return NextResponse.json(
        { success: false, message: "Please select a valid enquiry type." },
        { status: 400 }
      );
    }

    const savedMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        enquiryType,
        subject,
        message,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully.",
        data: savedMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Public message submission failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "We could not send your message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
