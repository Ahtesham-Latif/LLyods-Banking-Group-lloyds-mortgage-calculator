function Results({ monthlyPayment }) {
  const formattedPayment =
    monthlyPayment > 0
      ? new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
        }).format(monthlyPayment)
      : '£0.00';

  return (
    <section className="results" aria-live="polite">
      <p className="results__label">Estimated Monthly Repayment</p>
      <p className="results__value">{formattedPayment}</p>
    </section>
  );
}

export default Results;
