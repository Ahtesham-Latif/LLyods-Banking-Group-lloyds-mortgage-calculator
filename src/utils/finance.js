export function calculateMonthlyPayment(amount, annualRate, termYears) {
  const principal = Number(amount);
  const rate = Number(annualRate);
  const years = Number(termYears);

  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(years) ||
    Number.isNaN(principal) ||
    Number.isNaN(rate) ||
    Number.isNaN(years) ||
    principal <= 0 ||
    years <= 0
  ) {
    return 0;
  }

  const totalPayments = years * 12;

  if (rate <= 0) {
    return principal / totalPayments;
  }

  const monthlyRate = rate / 100 / 12;
  const growthFactor = Math.pow(1 + monthlyRate, totalPayments);
  const denominator = growthFactor - 1;

  if (!Number.isFinite(growthFactor) || denominator === 0) {
    return 0;
  }

  const payment = (principal * monthlyRate * growthFactor) / denominator;
  return Number.isFinite(payment) && payment >= 0 ? payment : 0;
}

export function calculateMortgageStats({
  principal,
  annualRate,
  termYears,
  mortgageType,
  arrangementFee,
}) {
  const parsedPrincipal = Number(principal);
  const parsedRate = Number(annualRate);
  const parsedYears = Number(termYears);
  const parsedFee = Number(arrangementFee);

  const basePrincipal = Number.isFinite(parsedPrincipal) && parsedPrincipal > 0 ? parsedPrincipal : 0;
  const rate = Number.isFinite(parsedRate) && parsedRate >= 0 ? parsedRate : 0;
  const years = Number.isFinite(parsedYears) && parsedYears > 0 ? parsedYears : 0;
  const fee = Number.isFinite(parsedFee) && parsedFee > 0 ? parsedFee : 0;
  const safeYears = years > 0 ? years : 1;
  const totalLoan = basePrincipal + fee;

  let monthly = 0;
  let totalPaid = 0;
  let totalInterest = 0;

  if (mortgageType === 'interest') {
    monthly = (totalLoan * (rate / 100)) / 12;
    totalPaid = monthly * safeYears * 12 + totalLoan;
    totalInterest = totalPaid - totalLoan;
  } else {
    monthly = calculateMonthlyPayment(totalLoan, rate, safeYears);
    totalPaid = monthly * safeYears * 12;
    totalInterest = totalPaid - totalLoan;
  }

  monthly = Number.isFinite(monthly) && monthly >= 0 ? monthly : 0;
  totalPaid = Number.isFinite(totalPaid) && totalPaid >= 0 ? totalPaid : 0;
  totalInterest = Number.isFinite(totalInterest) && totalInterest >= 0 ? totalInterest : 0;

  const principalPct = totalPaid > 0 ? Math.max(0, Math.min(100, Math.round((totalLoan / totalPaid) * 100))) : 0;
  const interestPct = 100 - principalPct;

  return {
    monthly,
    totalPaid,
    totalInterest,
    totalLoan,
    principalPct,
    interestPct,
  };
}
