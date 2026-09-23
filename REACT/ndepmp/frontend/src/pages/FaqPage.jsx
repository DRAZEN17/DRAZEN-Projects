import { Helmet } from 'react-helmet-async';
import { PageHero } from '@/components/layout/PageHero';
import { FaqAccordion } from '@/components/faq/FaqAccordion';

export default function FaqPage() {
  return (
    <>
      <Helmet>
        <title>FAQ — NDEPMP</title>
      </Helmet>
      <PageHero
        eyebrow="Support"
        title="Frequently asked questions"
        description="Common questions about registering a property, obtaining a digital address, and managing your electricity account."
      />
      <section className="px-4 py-16">
        <FaqAccordion />
      </section>
    </>
  );
}
