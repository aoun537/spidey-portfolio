export const contact = {
  eyebrow: "Get In Touch",
  heading: "CONTACT.",
  fields: {
    name: { label: "Your Name", placeholder: "Peter Parker" },
    email: { label: "Your Email", placeholder: "peter@stark.com" },
    message: {
      label: "Message",
      placeholder: "Let's build something amazing together...",
      rows: 4,
    },
  },
  submit: "Send Message",
  success: {
    title: "Message Sent!",
    body: "Thanks for reaching out. I'll get back to you shortly.",
    /** The reference reverts the success panel after 4 seconds. */
    resetAfterMs: 4000,
  },
} as const;
