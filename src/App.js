import { useEffect, useRef, useState } from 'react';
import { calculateMortgageStats } from './utils/finance';
import './App.css';

const FAQ_ITEMS = [
  {
    q: 'What is a mortgage arrangement fee?',
    a: 'An arrangement fee (also called a product fee) is a charge from the lender for setting up your mortgage deal. It typically ranges from \u00A3500 to \u00A32,000 and can usually be added to your loan or paid upfront. Adding it increases your total interest paid.',
  },
  {
    q: "What's the difference between repayment and interest-only?",
    a: 'With a repayment mortgage, each monthly payment reduces your outstanding balance, so you fully own the property at the end. With interest-only, you only pay the interest each month and the full loan amount remains due at the end of the term.',
  },
  {
    q: 'Does a longer term always mean lower payments?',
    a: 'Yes, spreading repayments over more years reduces the monthly amount, but you pay more in total interest. Compare different terms to see the trade-off.',
  },
  {
    q: 'How accurate are these results?',
    a: 'This calculator provides a reliable estimate based on your inputs. Actual payments can vary depending on lender terms, rate type, and additional fees.',
  },
];

const LIMITS = {
  loanAmount: { min: 1000, max: 5000000 },
  loanTerm: { min: 1, max: 40 },
  interestRate: { min: 0, max: 30 },
  arrangeFee: { min: 0, max: 100000 },
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function toNumber(value) {
  if (value === '') {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function validateInputs({ loanAmount, loanTerm, interestRate, arrangeFee }) {
  const errors = {};
  const parsedLoanAmount = toNumber(loanAmount);
  const parsedLoanTerm = toNumber(loanTerm);
  const parsedRate = toNumber(interestRate);
  const parsedFee = toNumber(arrangeFee);

  if (!Number.isFinite(parsedLoanAmount)) {
    errors.loanAmount = 'Enter a valid loan amount.';
  } else if (
    parsedLoanAmount < LIMITS.loanAmount.min ||
    parsedLoanAmount > LIMITS.loanAmount.max
  ) {
    errors.loanAmount = `Loan amount must be between ${formatCurrency(
      LIMITS.loanAmount.min,
    )} and ${formatCurrency(LIMITS.loanAmount.max)}.`;
  }

  if (!Number.isFinite(parsedLoanTerm)) {
    errors.loanTerm = 'Select a valid loan term.';
  } else if (
    parsedLoanTerm < LIMITS.loanTerm.min ||
    parsedLoanTerm > LIMITS.loanTerm.max
  ) {
    errors.loanTerm = `Loan term must be between ${LIMITS.loanTerm.min} and ${LIMITS.loanTerm.max} years.`;
  }

  if (!Number.isFinite(parsedRate)) {
    errors.interestRate = 'Enter a valid interest rate.';
  } else if (parsedRate < LIMITS.interestRate.min || parsedRate > LIMITS.interestRate.max) {
    errors.interestRate = `Interest rate must be between ${LIMITS.interestRate.min}% and ${LIMITS.interestRate.max}%.`;
  }

  if (!Number.isFinite(parsedFee)) {
    errors.arrangeFee = 'Enter a valid arrangement fee.';
  } else if (parsedFee < LIMITS.arrangeFee.min || parsedFee > LIMITS.arrangeFee.max) {
    errors.arrangeFee = `Arrangement fee must be between ${formatCurrency(
      LIMITS.arrangeFee.min,
    )} and ${formatCurrency(LIMITS.arrangeFee.max)}.`;
  }

  return {
    errors,
    values: {
      loanAmount: parsedLoanAmount,
      loanTerm: parsedLoanTerm,
      interestRate: parsedRate,
      arrangeFee: parsedFee,
    },
  };
}

function App() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [mortgageType, setMortgageType] = useState('repayment');
  const [loanTerm, setLoanTerm] = useState(25);
  const [interestRate, setInterestRate] = useState(4.5);
  const [arrangeFee, setArrangeFee] = useState(0);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [result, setResult] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const donutRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!result || !donutRef.current) {
      return;
    }

    const canvas = donutRef.current;
    const ctx = canvas.getContext('2d');
    const width = 110;
    const height = 110;
    const cx = width / 2;
    const cy = height / 2;
    const radius = 44;
    const innerRadius = 28;

    const total = result.totalLoan + result.totalInterest;
    const principalAngle = total > 0 ? (result.totalLoan / total) * 2 * Math.PI : 0;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#a3d9c3';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + principalAngle);
    ctx.fillStyle = '#006a4d';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f8faf9';
    ctx.fill();
  }, [result]);

  const clearFieldError = (field) => {
    setErrors((current) => ({ ...current, [field]: '' }));
    setFormError('');
  };

  const handleCalculate = () => {
    const validated = validateInputs({
      loanAmount,
      loanTerm,
      interestRate,
      arrangeFee,
    });

    if (Object.keys(validated.errors).length > 0) {
      setErrors(validated.errors);
      setFormError('Please correct the highlighted fields and try again.');
      setHasCalculated(false);
      return;
    }

    setErrors({});
    setFormError('');
    setIsCalculating(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const stats = calculateMortgageStats({
        principal: validated.values.loanAmount,
        annualRate: validated.values.interestRate,
        termYears: validated.values.loanTerm,
        mortgageType,
        arrangementFee: validated.values.arrangeFee,
      });

      if (!Number.isFinite(stats.monthly) || stats.monthly < 0) {
        setFormError('Unable to calculate with these values. Please check your inputs.');
        setIsCalculating(false);
        setHasCalculated(false);
        return;
      }

      setResult(stats);
      setHasCalculated(true);
      setIsCalculating(false);
    }, 800);
  };

  const displayRate = Number.isFinite(Number(interestRate)) ? Number(interestRate) : 0;
  const sliderRate = Math.max(0.5, Math.min(15, displayRate || 0.5));

  return (
    <div className="page-wrap">
      <header className="page-header">
        <div className="logo-row">
          <div className="logo-icon" aria-hidden="true">
            <svg viewBox="0 0 128 88" role="img" aria-label="Lloyds horse logo">
              <path
                d="M18 70c7-8 15-8 26-8 11 0 23-1 31-8 8-7 12-19 10-31-2-10-8-18-6-28
                   2-8 10-14 18-14-7 4-11 10-11 16 0 6 4 10 9 13 9 6 15 16 16 27 1 12-3 24-11 33
                   16 0 27 6 37 20-14-6-27-8-41-6-9 16-26 28-44 28-15 0-27-5-34-14z"
                fill="#008a73"
              />
              <circle cx="76" cy="18" r="2.5" fill="#0f3d34" />
            </svg>
          </div>
          <span className="brand">Lloyds Bank</span>
        </div>
        <h1>Mortgage Calculator</h1>
        <p>Estimate your monthly payments and total cost in seconds.</p>
      </header>

      <div className="steps-bar" aria-label="Progress steps">
        <div className="step active" id="step1">
          <div className="step-circle">1</div>
          <div className="step-label">Your Details</div>
        </div>
        <div className={`step-line ${hasCalculated ? 'done' : ''}`} id="line1" />
        <div className={`step ${hasCalculated ? 'done' : ''}`} id="step2">
          <div className="step-circle">2</div>
          <div className="step-label">Mortgage Options</div>
        </div>
        <div className={`step-line ${hasCalculated ? 'done' : ''}`} id="line2" />
        <div className={`step ${hasCalculated ? 'active' : ''}`} id="step3">
          <div className="step-circle">3</div>
          <div className="step-label">Your Results</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="input-panel">
            <div className="start-here">Start Here</div>

            <div className="section-title">Step 1 - Loan Details</div>

            <div className="field-group">
              <label className="field-label" htmlFor="loanAmount">
                Loan Amount
                <button className="tooltip-btn" tabIndex={-1} type="button">
                  ?
                  <span className="tooltip-text">
                    The total amount you plan to borrow from the bank, not including your
                    deposit.
                  </span>
                </button>
              </label>
              <div className="input-wrapper">
                <span className="input-prefix">{'\u00A3'}</span>
                <input
                  className={`field-input ${errors.loanAmount ? 'invalid' : ''}`}
                  type="number"
                  id="loanAmount"
                  min={LIMITS.loanAmount.min}
                  max={LIMITS.loanAmount.max}
                  value={loanAmount}
                  aria-invalid={Boolean(errors.loanAmount)}
                  onChange={(event) => {
                    setLoanAmount(toNumber(event.target.value));
                    clearFieldError('loanAmount');
                  }}
                />
              </div>
              {errors.loanAmount ? <div className="field-error">{errors.loanAmount}</div> : null}
              <div className="field-hint">Enter the amount after your deposit.</div>
            </div>

            <div className="section-title section-gap">Step 2 - Mortgage Options</div>

            <div className="field-group">
              <label className="field-label" htmlFor="mortgageType">
                Mortgage Type
                <button className="tooltip-btn" tabIndex={-1} type="button">
                  ?
                  <span className="tooltip-text">
                    Repayment means principal plus interest. Interest-only means monthly
                    interest payments with principal due at the end.
                  </span>
                </button>
              </label>
              <select
                className="field-input no-prefix"
                id="mortgageType"
                value={mortgageType}
                onChange={(event) => setMortgageType(event.target.value)}
              >
                <option value="repayment">Repayment</option>
                <option value="interest">Interest-Only</option>
              </select>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="loanTerm">
                Loan Term
                <button className="tooltip-btn" tabIndex={-1} type="button">
                  ?
                  <span className="tooltip-text">
                    Longer terms reduce monthly payments but increase total interest paid.
                  </span>
                </button>
              </label>
              <select
                className={`field-input no-prefix ${errors.loanTerm ? 'invalid' : ''}`}
                id="loanTerm"
                value={loanTerm}
                aria-invalid={Boolean(errors.loanTerm)}
                onChange={(event) => {
                  setLoanTerm(toNumber(event.target.value));
                  clearFieldError('loanTerm');
                }}
              >
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="25">25 Years</option>
                <option value="30">30 Years</option>
                <option value="35">35 Years</option>
              </select>
              {errors.loanTerm ? <div className="field-error">{errors.loanTerm}</div> : null}
            </div>

            <button
              className={`advanced-toggle ${advancedOpen ? 'open' : ''}`}
              id="advToggle"
              type="button"
              onClick={() => setAdvancedOpen((open) => !open)}
            >
              <span className="arrow">{'\u25B6'}</span> Advanced Settings (Interest Rate, Fees)
            </button>

            <div className={`advanced-section ${advancedOpen ? 'open' : ''}`} id="advSection">
              <div className="field-group">
                <label className="field-label" htmlFor="interestRate">
                  Annual Interest Rate
                  <button className="tooltip-btn" tabIndex={-1} type="button">
                    ?
                    <span className="tooltip-text">
                      The yearly interest rate charged by your lender.
                    </span>
                  </button>
                </label>
                <div className="input-wrapper">
                  <input
                    className={`field-input suffix-input no-prefix ${
                      errors.interestRate ? 'invalid' : ''
                    }`}
                    type="number"
                    id="interestRate"
                    step="0.1"
                    min={LIMITS.interestRate.min}
                    max={LIMITS.interestRate.max}
                    value={interestRate}
                    aria-invalid={Boolean(errors.interestRate)}
                    onChange={(event) => {
                      setInterestRate(toNumber(event.target.value));
                      clearFieldError('interestRate');
                    }}
                  />
                  <span className="input-suffix">%</span>
                </div>
                <div className="slider-row">
                  <input
                    type="range"
                    id="rateSlider"
                    min="0.5"
                    max="15"
                    step="0.1"
                    value={sliderRate}
                    onChange={(event) => {
                      setInterestRate(toNumber(event.target.value));
                      clearFieldError('interestRate');
                    }}
                  />
                  <span className="slider-val" id="sliderLabel">
                    {displayRate.toFixed(1)}%
                  </span>
                </div>
                {errors.interestRate ? (
                  <div className="field-error">{errors.interestRate}</div>
                ) : null}
                <div className="field-hint">Current typical UK rate: 4-5%.</div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="arrangeFee">
                  Arrangement Fee (optional)
                  <button className="tooltip-btn" tabIndex={-1} type="button">
                    ?
                    <span className="tooltip-text">
                      A one-off fee charged by the lender to set up the mortgage.
                    </span>
                  </button>
                </label>
                <div className="input-wrapper">
                  <span className="input-prefix">{'\u00A3'}</span>
                  <input
                    className={`field-input ${errors.arrangeFee ? 'invalid' : ''}`}
                    type="number"
                    id="arrangeFee"
                    min={LIMITS.arrangeFee.min}
                    max={LIMITS.arrangeFee.max}
                    value={arrangeFee}
                    aria-invalid={Boolean(errors.arrangeFee)}
                    onChange={(event) => {
                      setArrangeFee(toNumber(event.target.value));
                      clearFieldError('arrangeFee');
                    }}
                  />
                </div>
                {errors.arrangeFee ? <div className="field-error">{errors.arrangeFee}</div> : null}
              </div>
            </div>

            {formError ? <div className="form-error">{formError}</div> : null}

            <button
              className={`calc-btn ${isCalculating ? 'loading' : ''}`}
              id="calcBtn"
              type="button"
              onClick={handleCalculate}
              disabled={isCalculating}
            >
              <span className="btn-text">CALCULATE MY MORTGAGE</span>
              <span className="spinner" />
            </button>
          </div>

          <div className="results-panel">
            {!hasCalculated ? (
              <div className="results-empty" id="emptyState">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <p className="empty-main">Your results will appear here</p>
                <p className="empty-sub">
                  Fill in your details and hit <strong>Calculate</strong>.
                </p>
              </div>
            ) : null}

            <div className={`result-block ${hasCalculated ? 'visible' : ''}`} id="resultBlock">
              <div className="section-title">Step 3 - Your Results</div>

              <div className="result-kpi">
                <div className="kpi-label">ESTIMATED MONTHLY PAYMENT</div>
                <div className="kpi-value" id="resMonthly">
                  {result ? formatCurrency(result.monthly) : '-'}
                </div>
                <div className="kpi-sub" id="resMonthlyNote">
                  {loanTerm}-year {mortgageType === 'interest' ? 'interest-only' : 'repayment'} at{' '}
                  {displayRate}%
                </div>
              </div>

              <div className="result-row">
                <span className="rr-label">Total Amount Repaid</span>
                <span className="rr-value" id="resTotal">
                  {result ? formatCurrency(result.totalPaid) : '-'}
                </span>
              </div>
              <div className="result-row">
                <span className="rr-label">Total Interest Paid</span>
                <span className="rr-value highlight" id="resInterest">
                  {result ? formatCurrency(result.totalInterest) : '-'}
                </span>
              </div>
              <div className="result-row">
                <span className="rr-label">Loan Term</span>
                <span className="rr-value" id="resTerm">
                  {loanTerm} years
                </span>
              </div>
              <div className="result-row">
                <span className="rr-label">Interest Rate</span>
                <span className="rr-value" id="resRate">
                  {displayRate}% per annum
                </span>
              </div>

              <div className="chart-area">
                <div className="chart-title">Principal vs Interest Breakdown</div>
                <div className="principal-caption">Principal portion</div>
                <div className="amort-bar">
                  <div
                    className="amort-fill"
                    id="amortFill"
                    style={{ width: `${result ? result.principalPct : 0}%` }}
                  />
                </div>
                <div className="percent-row">
                  <span id="principalPct" className="principal-pct">
                    Principal {result ? result.principalPct : 0}%
                  </span>
                  <span id="interestPct" className="interest-pct">
                    Interest {result ? result.interestPct : 0}%
                  </span>
                </div>

                <div className="donut-wrap donut-space">
                  <canvas id="donut" ref={donutRef} width="110" height="110" />
                  <div className="legend">
                    <div className="legend-item">
                      <div className="legend-dot principal-dot" />
                      <span id="legendPrincipal">
                        Principal - {result ? formatCurrency(result.totalLoan) : '\u00A30.00'}
                      </span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-dot interest-dot" />
                      <span id="legendInterest">
                        Interest - {result ? formatCurrency(result.totalInterest) : '\u00A30.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <details className="explainer">
                <summary>How is this calculated?</summary>
                <p>
                  Your monthly payment is derived from the standard mortgage amortisation
                  formula: M = P[r(1+r)^n] / [(1+r)^n-1], where P is principal, r is monthly
                  interest rate, and n is the number of monthly payments.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      <section className="faq-section">
        <div className="faq-title">Frequently Asked Questions</div>

        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div className="faq-item" key={item.q}>
              <button
                className={`faq-q ${isOpen ? 'open' : ''}`}
                type="button"
                onClick={() => setOpenFaqIndex((current) => (current === index ? -1 : index))}
              >
                {item.q}
                <span className="faq-arrow">+</span>
              </button>
              <div className={`faq-a ${isOpen ? 'open' : ''}`}>{item.a}</div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default App;
