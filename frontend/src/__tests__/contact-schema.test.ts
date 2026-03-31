import { describe, it, expect } from "vitest";
import { z } from "zod";

// Replicate the contact form schema from Contact.tsx
const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  service: z.enum(["AI Chatbot", "Automation", "Web App", "RAG System", "Other"]),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

describe("Contact form schema validation", () => {
  const valid = {
    name: "Test User",
    email: "test@example.com",
    subject: "Test Subject",
    service: "AI Chatbot" as const,
    message: "This is a test message long enough to pass.",
  };

  it("accepts valid form data", () => {
    expect(() => schema.parse(valid)).not.toThrow();
  });

  it("rejects invalid email", () => {
    const result = schema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = schema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects short message (< 20 chars)", () => {
    const result = schema.safeParse({ ...valid, message: "Too short" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid service value", () => {
    const result = schema.safeParse({ ...valid, service: "InvalidService" });
    expect(result.success).toBe(false);
  });

  it("rejects name over 100 characters", () => {
    const result = schema.safeParse({ ...valid, name: "a".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("accepts all valid service options", () => {
    const services = ["AI Chatbot", "Automation", "Web App", "RAG System", "Other"] as const;
    for (const service of services) {
      expect(() => schema.parse({ ...valid, service })).not.toThrow();
    }
  });
});
