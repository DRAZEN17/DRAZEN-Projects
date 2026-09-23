import { useRef, useState } from "react";
import RevealTag from "../components/RevealTag";
import Icon from "../components/Icon";
import Footer from "../components/Footer";
import FormField from "../components/FormField";
import { contactInfo } from "../constants";
import { useScrollReveal } from "../hooks/useScrollReveal";

const Contact = () => {
  const rootRef = useRef(null);
  useScrollReveal(rootRef);
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div ref={rootRef}>
      <div className="md:pt-40 pt-24 md:px-10 px-5 md:pb-24 pb-16 grid lg:grid-cols-2 md:gap-16 gap-10">
        <div className="fade-up">
          <RevealTag>Get In Touch</RevealTag>
          <h1 className="font-display italic md:text-5xl text-3xl text-ink mt-5">
            We&apos;d love to hear from you.
          </h1>
          <p className="font-sans text-ink-soft mt-6 leading-relaxed max-w-md">
            Questions about an order, a return, or a collaboration — send us a
            note and our studio team will get back to you within one business
            day.
          </p>

          <div className="flex flex-col gap-4 mt-10">
            <p className="flex items-center gap-3 font-sans text-sm text-ink-soft">
              <Icon name="share" className="size-4 text-taupe" />
              {contactInfo.email}
            </p>
            <p className="flex items-center gap-3 font-sans text-sm text-ink-soft">
              <Icon name="bag" className="size-4 text-taupe" />
              {contactInfo.phone}
            </p>
            <p className="flex items-center gap-3 font-sans text-sm text-ink-soft">
              <Icon name="truck" className="size-4 text-taupe" />
              {contactInfo.hours}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="fade-up flex flex-col gap-5">
          <FormField label="Name" required />
          <FormField label="Email" type="email" required />
          <FormField label="Message" textarea required />
          <button type="submit" className="btn-solid w-fit mt-2" disabled={sent}>
            {sent ? "Message Sent" : "Send Message"}
          </button>
          {sent && (
            <p className="font-sans text-sm text-taupe">
              Thanks — this is a front-end demo, so nothing was actually sent, but
              that&apos;s exactly what a confirmation would look like.
            </p>
          )}
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
