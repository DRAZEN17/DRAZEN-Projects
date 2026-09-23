import { Helmet } from 'react-helmet-async';
import { Phone, Mail } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { Card } from '@/components/ui/Card';
import { PropertyMap } from '@/components/map/PropertyMap';

// Publicly published contact details and approximate hub-city coordinates
// for Nigeria's 11 licensed electricity distribution companies. NDEPMP is
// not affiliated with any of them — always confirm against the company's
// own channel before relying on this.
const discos = [
  { code: 'AEDC', name: 'Abuja Electricity Distribution Company', states: ['FCT', 'Niger', 'Kogi', 'Nasarawa'], phone: '0803 907 0070', lat: 9.0765, lng: 7.3986 },
  { code: 'BEDC', name: 'Benin Electricity Distribution Company', states: ['Edo', 'Delta', 'Ekiti', 'Ondo'], phone: '0803 901 2323', email: 'customercomplaints@bedcpower.com', lat: 6.335, lng: 5.6037 },
  { code: 'EEDC', name: 'Enugu Electricity Distribution Company', states: ['Enugu', 'Anambra', 'Abia', 'Imo', 'Ebonyi'], phone: '084 700 100', email: 'customerservice@enugudisco.com', lat: 6.5244, lng: 7.5086 },
  { code: 'EKEDC', name: 'Eko Electricity Distribution Company', states: ['Lagos (Island & environs)', 'Ogun (Agbara)'], phone: '0708 065 5555', email: 'customercare@ekedp.com', lat: 6.455, lng: 3.3841 },
  { code: 'IBEDC', name: 'Ibadan Electricity Distribution Company', states: ['Oyo', 'Ogun', 'Osun', 'Kwara'], website: 'ibedc.com', lat: 7.3775, lng: 3.947 },
  { code: 'IKEDC', name: 'Ikeja Electric', states: ['Lagos (Ikeja & environs)'], phone: '01 448 3900', lat: 6.6018, lng: 3.3515 },
  { code: 'JED', name: 'Jos Electricity Distribution Plc', states: ['Plateau', 'Bauchi', 'Benue', 'Gombe'], phone: '0706 940 3531', email: 'customercare@jedplc.com', lat: 9.8965, lng: 8.8583 },
  { code: 'KAEDCO', name: 'Kaduna Electric', states: ['Kaduna', 'Kebbi', 'Sokoto', 'Zamfara'], phone: '0817 403 5711', email: 'info@kadunaelectric.com', lat: 10.5105, lng: 7.4165 },
  { code: 'KEDCO', name: 'Kano Electricity Distribution Company', states: ['Kano', 'Katsina', 'Jigawa'], phone: '0700 5555 111', email: 'customercare@kedco.ng', lat: 12.0022, lng: 8.592 },
  { code: 'PHED', name: 'Port Harcourt Electricity Distribution', states: ['Rivers', 'Bayelsa', 'Cross River', 'Akwa Ibom'], phone: '0700 225 7433', email: 'customercare@phed.com.ng', lat: 4.8156, lng: 7.0498 },
  { code: 'YEDC', name: 'Yola Electricity Distribution Company', states: ['Adamawa', 'Taraba', 'Borno', 'Yobe'], phone: '0700 042 2559', email: 'info@yedc.com.ng', lat: 9.2035, lng: 12.4954 },
];

export default function CoveragePage() {
  const markers = discos.map((d) => ({ id: d.code, lat: d.lat, lng: d.lng, label: `${d.code} — ${d.name}` }));

  return (
    <>
      <Helmet>
        <title>Coverage — NDEPMP</title>
      </Helmet>
      <PageHero
        eyebrow="Coverage"
        title="Distribution companies and the states they serve"
        description="Electricity distribution in Nigeria is franchised by geography. Find the company responsible for supply and billing in your state."
      />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="mb-6 max-w-2xl text-sm text-ink-muted">
          Contact details below are publicly published by each company. NDEPMP is independent and not affiliated
          with any of them — verify against their official site before relying on a number or address. Markers show
          each company&apos;s approximate hub city, not full service-area boundaries.
        </p>

        <PropertyMap markers={markers} height="380px" zoom={6} />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {discos.map((disco) => (
            <Card key={disco.code}>
              <div>
                <h3 className="font-display text-lg font-semibold">{disco.code}</h3>
                <p className="text-xs text-ink-muted">{disco.name}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {disco.states.map((s) => (
                  <span key={s} className="rounded-full bg-canvas-alt px-2.5 py-1 text-xs text-ink-muted">
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-1.5 text-sm">
                {disco.phone && (
                  <span className="flex items-center gap-2 text-ink-muted">
                    <Phone size={13} /> {disco.phone}
                  </span>
                )}
                {disco.email && (
                  <span className="flex items-center gap-2 text-ink-muted">
                    <Mail size={13} /> {disco.email}
                  </span>
                )}
                {!disco.phone && disco.website && (
                  <span className="flex items-center gap-2 text-ink-muted">
                    <Mail size={13} /> {disco.website}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
