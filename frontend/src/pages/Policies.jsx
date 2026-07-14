const SECTIONS = [
  {
    title: "Cash Discount Policy",
    items: [
      "2.5% on invoice value for advance payment (cash / digital).",
      "2.0% on invoice value for payment on delivery (cash / digital).",
      "1.0% on invoice value for payment within 7 days from delivery (cheque must clear within 7 days).",
      "Minimum accumulated invoice value for CD eligibility: ₹40,000.",
      "CD excluded for ASK products, Niterra (NGK) products and Diamond products.",
      "No CD if any previous invoice is due or outstanding.",
    ],
  },
  {
    title: "Credit Policy",
    items: [
      "Maximum credit period: 21 days from date of goods delivery.",
      "Credit granted only against a post-dated cheque of full invoice value.",
      "PDC to be handed over to the delivery representative at the time of delivery.",
      "If digital payment is subsequently made, the corresponding PDC will be returned.",
    ],
  },
  {
    title: "Warranty · Claim · Return",
    items: [
      "Spare Parts / ABS Items: manufacturing defects must be reported within 7 days of delivery. Claims covered by the respective OEM policy. Return value settled subsequently, not instantly.",
      "Battery: warranty card must be filled with all mandatory details. Claims settled per the mother-company's policy.",
      "Tyre: submit brand-issued claim paper with tyre + customer details for warranty processing.",
      "Lubricants — Leakage: leaking containers to be replaced immediately. Do not accept leaking containers at delivery.",
      "Lubricants — Seal Breach: ZERO TOLERANCE. Once the foil seal is broken, the product cannot be returned (adulteration prevention).",
    ],
  },
];

export default function Policies() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-16" data-testid="policies-page">
      <div className="overline mb-4">// Fine Print</div>
      <h1 className="text-5xl md:text-6xl font-black uppercase text-white leading-none">
        Business <span className="text-[color:var(--ne-accent)]">Policies.</span>
      </h1>
      <p className="mt-4 text-white/60 max-w-2xl">
        Full transparency on credit, cash discounts, warranties and returns. Every partner sees the same terms.
      </p>

      <div className="mt-14 space-y-4">
        {SECTIONS.map((s, i) => (
          <div key={s.title} className="ne-card p-8" data-testid={`policy-${i}`}>
            <div className="flex items-baseline gap-4 mb-6">
              <div className="mono text-[color:var(--ne-accent)] text-sm">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="text-2xl md:text-3xl font-black uppercase text-white">{s.title}</h2>
            </div>
            <ul className="space-y-3">
              {s.items.map((t, k) => (
                <li key={k} className="flex items-start gap-3 text-white/75 leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-[color:var(--ne-accent)] mt-2 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
