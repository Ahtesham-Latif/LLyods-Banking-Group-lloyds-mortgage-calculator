export function calculateMonthlyPayment(amount, annualRate, termYears) {
  const principal = Number(amount);
  const rate = Number(annualRate);
  const years = Number(termYears);

  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(years) ||
    principal <= 0 ||
    years <= 0
  ) {
    return 0;
  }

  const totalPayments = years * 12;

  // Handle 0% interest case safely
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
  propertyValue,
}) {
  const basePrincipal = Number(principal) || 0;
  const rate = Number(annualRate) || 0;
  const years = Number(termYears) || 0;
  const fee = Number(arrangementFee) || 0;

  const safeYears = years > 0 ? years : 1;
  const totalPayments = safeYears * 12;
  
  // Lloyds Logic: Fees are usually added to the loan balance
  const totalLoan = basePrincipal + fee;

  const ltv = propertyValue > 0 ? ((totalLoan / propertyValue) * 100).toFixed(1) : null;

  let monthly = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  if (mortgageType === 'interest') {
    // 1. Calculate Monthly (Interest only)
    monthly = (totalLoan * (rate / 100)) / 12;
    
    // 2. Total Interest over the whole term
    totalInterest = monthly * totalPayments;
    
    // 3. Total Repaid = Total Interest + the Principal balloon payment at the end
    totalPaid = totalInterest + totalLoan;
  } else {
    // 1. Calculate Monthly (Capital + Interest)
    monthly = calculateMonthlyPayment(totalLoan, rate, safeYears);
    
    // 2. Total Repaid over the term
    totalPaid = monthly * totalPayments;
    
    // 3. Total Interest
    totalInterest = Math.max(0, totalPaid - totalLoan);
  }

  // 4. Unified Percentage Breakdown for the UI Chart
  // This ensures BOTH mortgage types correctly reflect the total principal vs interest split.
  const principalPct = totalPaid > 0 ? ((totalLoan / totalPaid) * 100).toFixed(1) : 0;
  const interestPct = totalPaid > 0 ? ((totalInterest / totalPaid) * 100).toFixed(1) : 0;

  return {
    monthly: Number.isFinite(monthly) ? monthly : 0,
    totalPaid: Number.isFinite(totalPaid) ? totalPaid : 0,
    totalInterest: Number.isFinite(totalInterest) ? totalInterest : 0,
    totalLoan: totalLoan,
    principalPct,
    interestPct,
    ltv,
  };
}