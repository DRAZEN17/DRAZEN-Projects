import { Helmet } from 'react-helmet-async';
import { Hero } from '@/components/home/Hero';
import { PlatformModules } from '@/components/home/PlatformModules';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CtaBanner } from '@/components/home/CtaBanner';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>NDEPMP</title>
      </Helmet>
      <Hero />
      <PlatformModules />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
