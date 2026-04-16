import { calculateMortgageStats } from './utils/finance';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const SCENARIOS = [
  {
    label: 'Basic Mortgage',
    loanAmount: 150000,
    interestRate: 3.5,
    loanTerm: 25,
    mortgageType: 'repayment',
    rateType: 'Fixed',
    propertyValue: null,
  },
  {
    label: 'Large Loan',
    loanAmount: 500000,
    interestRate: 4.2,
    loanTerm: 30,
    mortgageType: 'repayment',
    rateType: 'Adjustable',
    propertyValue: null,
  },
  {
    label: 'Short Term',
    loanAmount: 200000,
    interestRate: 3.0,
    loanTerm: 15,
    mortgageType: 'repayment',
    rateType: 'Fixed',
    propertyValue: null,
  },
  {
    label: 'High Rate',
    loanAmount: 120000,
    interestRate: 5.5,
    loanTerm: 20,
    mortgageType: 'repayment',
    rateType: 'Fixed',
    propertyValue: null,
  },
  {
    label: 'Low Adj. Rate',
    loanAmount: 75000,
    interestRate: 2.8,
    loanTerm: 10,
    mortgageType: 'repayment',
    rateType: 'Adjustable',
    propertyValue: null,
  },
  {
    label: 'Interest-Only',
    loanAmount: 250000,
    interestRate: 4.0,
    loanTerm: 25,
    mortgageType: 'interest',
    rateType: 'Fixed',
    propertyValue: null,
  },
  {
    label: 'High LTV',
    loanAmount: 350000,
    interestRate: 4.5,
    loanTerm: 30,
    mortgageType: 'repayment',
    rateType: 'Fixed',
    propertyValue: 400000,
  },
  {
    label: 'Low LTV',
    loanAmount: 100000,
    interestRate: 3.75,
    loanTerm: 20,
    mortgageType: 'repayment',
    rateType: 'Fixed',
    propertyValue: 250000,
  },
];

function computeScenario(s) {
  const stats = calculateMortgageStats({
    principal: s.loanAmount,
    annualRate: s.interestRate,
    termYears: s.loanTerm,
    mortgageType: s.mortgageType,
    arrangementFee: 0,
  });
  const ltv =
    s.propertyValue && s.propertyValue > 0
      ? Math.round((s.loanAmount / s.propertyValue) * 100)
      : null;
  return { ...stats, ltv };
}

export default function ScenarioTable() {
  const computed = SCENARIOS.map((s) => ({ ...s, result: computeScenario(s) }));

  return (
    <section className="scenario-section">
      <div className="scenario-header">
        <div className="scenario-title">Scenario Comparison</div>
        <p className="scenario-subtitle">
          Compare 8 common mortgage scenarios side by side, calculated using the same formula as
          the calculator above.
        </p>
      </div>

      <div className="scenario-scroll">
        <table className="scenario-table">
          <thead>
            <tr>
              <th className="col-label">Scenario</th>
              <th>Loan Amount</th>
              <th>Rate</th>
              <th>Term</th>
              <th>Type</th>
              <th>Rate Kind</th>
              <th>LTV</th>
              <th className="col-highlight">Monthly Payment</th>
              <th>Total Repaid</th>
              <th>Total Interest</th>
            </tr>
          </thead>
          <tbody>
            {computed.map((s, i) => (
              <tr key={s.label} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td className="col-label scenario-name">{s.label}</td>
                <td>{formatCurrency(s.loanAmount)}</td>
                <td>{s.interestRate}%</td>
                <td>{s.loanTerm} yrs</td>
                <td>
                  <span className={`badge ${s.mortgageType === 'interest' ? 'badge-interest' : 'badge-repayment'}`}>
                    {s.mortgageType === 'interest' ? 'Interest-Only' : 'Repayment'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${s.rateType === 'Adjustable' ? 'badge-adj' : 'badge-fixed'}`}>
                    {s.rateType}
                  </span>
                </td>
                <td>{s.result.ltv !== null ? `${s.result.ltv}%` : '—'}</td>
                <td className="col-highlight monthly-val">
                  {formatCurrency(s.result.monthly)}
                  <span className="monthly-sub">/mo</span>
                </td>
                <td className="total-val">{formatCurrency(s.result.totalPaid)}</td>
                <td className="interest-val">{formatCurrency(s.result.totalInterest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="scenario-note">
        * Adjustable Rate scenarios shown at initial fixed rate. Actual payments may vary when rate
        resets. LTV shown only where property value is known.
      </p>
    </section>
  );
}