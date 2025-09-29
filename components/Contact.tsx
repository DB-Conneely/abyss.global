// components/Contact.tsx (Updated)

import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  const [status, setStatus] = useState<string>("");

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setStatus("Message sent successfully!");
        reset();
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch {
      setStatus("Failed to send message. Please try again.");
    }
  };

  return (
    <section className="section" id="contact">
      <h2 className="glow">Get in Contact</h2>
      <div className="contact-layout">
        {" "}
        {/* NEW: Parent flex container for side-by-side */}
        <div className="contact-info">
          {" "}
          {/* NEW: Info column */}
          <p>
            Open to opportunities and discussions, anything from contract work
            to ideas, please feel free to get in contact.
          </p>
          <p>Reach me below:</p>
          <a href="mailto:dconneelybz@outlook.com" className="submit-button">
            Email
          </a>{" "}
          {/* Updated: Text to 'Email'; keep mailto */}
          <a href="https://t.me/sk3neels" className="submit-button">
            Telegram
          </a>{" "}
          {/* Updated: Use submit-button class */}
          <a href="https://x.com/SK3Neels" className="submit-button">
            X (Twitter)
          </a>{" "}
          {/* Updated: Use submit-button class */}
        </div>
        {/* Contact Form in Container */}
        <div className="contact-container">
          {" "}
          {/* Existing form container */}
          <form onSubmit={handleSubmit(onSubmit)} id="contact">
            <h3 className="glow">Contact Form</h3>
            <h4>Send us a message for a custom quote</h4>
            <fieldset>
              <input
                {...register("firstName", { required: true })}
                placeholder="Your First Name (required)"
                type="text"
                className="input-purple"
                autoComplete="given-name"
              />
              {errors.firstName && (
                <span className="text-red-500">Required</span>
              )}
            </fieldset>
            <fieldset>
              <input
                {...register("lastName", { required: true })}
                placeholder="Your Last Name (required)"
                type="text"
                className="input-purple"
                autoComplete="family-name"
              />
              {errors.lastName && (
                <span className="text-red-500">Required</span>
              )}
            </fieldset>
            <fieldset>
              <input
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                placeholder="Your Email Address (required)"
                type="email"
                className="input-purple"
                autoComplete="email"
              />
              {errors.email && (
                <span className="text-red-500">Valid email required</span>
              )}
            </fieldset>
            <fieldset>
              <input
                {...register("subject", { required: true })}
                placeholder="Subject (required)"
                type="text"
                className="input-purple"
                autoComplete="off"
              />
              {errors.subject && <span className="text-red-500">Required</span>}
            </fieldset>
            <fieldset>
              <textarea
                {...register("message", { required: true })}
                placeholder="Type your message here... (required)"
                rows={6}
                className="input-purple"
                autoComplete="off"
              />
              {errors.message && <span className="text-red-500">Required</span>}
            </fieldset>
            <fieldset>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </fieldset>
            {status && (
              <p
                style={{
                  color: status.includes("success") ? "green" : "red",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
