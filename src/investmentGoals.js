// Função para converter de taxa anual para taxa mensal
function convertToMonthReturnRate(yearReturnRate) {
    return (yearReturnRate) ** (1 / 12);
}

// Função de retorno para ser exportada para outrs arquivos
 export function generateReturnsArray(
    startingAmount = 0,
    timeHorizon = 0,
    timePeriod = 'monthly',
    monthlyContribution = 0,
    returnRate = 0,
    returnTimeFrame = 'monthly'
) {
    // Validação caso não seja informado nenhum valor ou não for informado o tempo
    if (!timeHorizon || !startingAmount) {
        throw new Error("Investimento inicial e prazo devem ser preenchidos com valores positivos");
    }

    // Validando taxa de retorno convertendo para mensal
    const finalReturnRate = returnTimeFrame === "monthly" ? 1 + returnRate / 100 : convertToMonthReturnRate(1 + returnRate / 100);

    // Validando período convertendo para mensal
    const finalTimeHorizon = timePeriod === 'monthly' ? timeHorizon : timeHorizon * 12;

    // Objeto inicial
    const referenceInvestedAmountObject = {
        investedAmount: startingAmount,
        interestReturns: 0,
        totalInterestReturns: 0,
        month: 0,
        totalAmount: startingAmount
    };
    
    const returnsArray = [referenceInvestedAmountObject];

    // Referenciando ao investimento inicial investedAmount e controle de tempo month
    for (let timeReference = 1; 
        timeReference <= finalTimeHorizon; 
        timeReference++) {

// Referência ao término do mês
            const totalAmount =
      returnsArray[timeReference - 1].totalAmount * finalReturnRate +
      monthlyContribution;
      // Referência ao interestReturns quanto tem de investimento
    const interestReturns =
      returnsArray[timeReference - 1].totalAmount * (finalReturnRate - 1);
      // Referência a totalInterestReturns quanto foi investido ao término de cada mês 
    const investedAmount = startingAmount + monthlyContribution * timeReference;
    // Referência ao total investido
    const totalInterestReturns = totalAmount - investedAmount;

        // // Criando o novo objeto
        returnsArray.push({
            investedAmount: investedAmount,
            interestReturns: interestReturns,
            totalInterestReturns: totalInterestReturns,
            month: timeReference,
            totalAmount: totalAmount
        });
    }

    return returnsArray;
}
