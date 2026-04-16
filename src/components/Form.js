function NumericField({ id, label, value, onChange, min, step, helper }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {helper ? <p className="helper-text">{helper}</p> : null}
    </div>
  );
}

function Form({
  amount,
  rate,
  termYears,
  onAmountChange,
  onRateChange,
  onTermYearsChange,
}) {
  return (
    <section className="form" aria-label="Mortgage input form">
      <NumericField
        id="amount"
        label="Mortgage Amount (£)"
        value={amount}
        onChange={onAmountChange}
        min={1000}
        step={1000}
        helper="Total amount borrowed before interest."
      />

      <NumericField
        id="rate"
        label="Interest Rate (%)"
        value={rate}
        onChange={onRateChange}
        min={0}
        step={0.01}
        helper="Annual interest rate from your lender."
      />

      <NumericField
        id="term"
        label="Mortgage Term (Years)"
        value={termYears}
        onChange={onTermYearsChange}
        min={1}
        step={1}
        helper="Number of years for full repayment."
      />
    </section>
  );
}

export default Form;
