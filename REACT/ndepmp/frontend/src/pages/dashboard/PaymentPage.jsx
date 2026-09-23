import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMockBackend } from '@/lib/mockBackend';
import { PAYMENT_PROVIDERS } from '@/data/nigeria';

export default function PaymentPage() {
  const { billId } = useParams();
  const navigate = useNavigate();
  const { bills, properties, payBill } = useMockBackend();
  const bill = bills.find((b) => b.id === billId);
  const property = bill ? properties.find((p) => p.id === bill.propertyId) : null;

  const [provider, setProvider] = useState(PAYMENT_PROVIDERS[0].value);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  if (!bill) {
    return <p className="text-sm text-ink-muted">Bill not found.</p>;
  }

  const confirmPayment = () => {
    setProcessing(true);
    // Simulated gateway round-trip. A real provider SDK (Paystack/Flutterwave)
    // plugs in right here — the rest of the flow doesn't change.
    setTimeout(() => {
      const payment = payBill(bill.id, provider);
      setReceipt(payment);
      setProcessing(false);
    }, 700);
  };

  if (receipt) {
    return (
      <div className="mx-auto max-w-md">
        <Helmet>
          <title>Payment receipt — NDEPMP</title>
        </Helmet>
        <Card className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 size={22} />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold">Payment successful</h1>
          <p className="mt-1 text-sm text-ink-muted">Receipt {receipt.paymentUid}</p>

          <div className="mt-6 flex flex-col gap-2 rounded-xl bg-canvas-alt p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Property</span>
              <span>{property?.street}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Amount</span>
              <span className="font-semibold">₦{receipt.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Provider</span>
              <span className="capitalize">{receipt.provider.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Paid at</span>
              <span>{new Date(receipt.paidAt).toLocaleString()}</span>
            </div>
          </div>

          <Button variant="primary" className="mt-6 w-full" onClick={() => navigate('/dashboard/bills')}>
            Back to bills
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <Helmet>
        <title>Pay bill — NDEPMP</title>
      </Helmet>
      <h1 className="font-display text-2xl font-semibold">Pay bill</h1>
      <p className="mt-1 text-sm text-ink-muted">{property?.street}</p>

      <Card className="mt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-ink-muted">Amount due</span>
          <span className="font-display text-2xl font-semibold">₦{bill.amount.toLocaleString()}</span>
        </div>
        <p className="mt-1 text-xs text-ink-muted">{bill.period} · {bill.consumptionKwh} kWh</p>

        <p className="mt-6 text-sm font-medium text-ink-muted">Choose a payment provider</p>
        <div className="mt-3 flex flex-col gap-2">
          {PAYMENT_PROVIDERS.map((p) => (
            <label
              key={p.value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand/5"
            >
              <input
                type="radio"
                name="provider"
                value={p.value}
                checked={provider === p.value}
                onChange={() => setProvider(p.value)}
              />
              <CreditCard size={15} className="text-ink-muted" />
              {p.label}
            </label>
          ))}
        </div>

        <Button variant="primary" className="mt-6 w-full" onClick={confirmPayment} disabled={processing}>
          {processing ? 'Processing…' : `Pay ₦${bill.amount.toLocaleString()}`}
        </Button>
        <p className="mt-2 text-center text-xs text-ink-muted">
          Simulated for this demo — no real transaction is made.
        </p>
      </Card>
    </div>
  );
}
