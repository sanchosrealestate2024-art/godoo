"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-full items-center justify-center border border-white/20 p-10 text-center"
      >
        <p className="font-display text-2xl text-white">
          Thank you — we&apos;ll be in touch shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone" name="phone" />
        <Field label="Project Type" name="project_type" />
      </div>
      <Field label="Subject" name="subject" />
      <div>
        <label className="eyebrow mb-2 block">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full border-b border-white/20 bg-transparent py-2 text-white focus:border-white focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="border border-white/50 px-8 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-obsidian disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong — please try again.</p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="eyebrow mb-2 block">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full border-b border-white/20 bg-transparent py-2 text-white focus:border-white focus:outline-none"
      />
    </div>
  );
}
