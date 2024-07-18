
import { generateReturnsArray } from "./src/investmentGoals";
//infortando a biblooteca de graficos 
import { Chart } from "chart.js/auto";

// const calculateButton = document.getElementById('calculate-results');


//Variaveis para amazenar os gráficos
const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');

let doughnutChartReference = {};
let progressionChartReference = {};


const finalmoneydistribution =document.getElementById('final-money-distribution');
const progression =document.getElementById('progression');

const form = document.getElementById('investiment-form');
const clearFormButton = document.getElementById('clear-form');
//função para formatar as casa décimais do gráfico Doughnut
function formatCurrency(value) {
  return value.toFixed(2);
}


function renderProgression(evt) {
    evt.preventDefault();
//caso tenha algum compo com um dado errado afunção impede que ele seja execultada 
    if (document.querySelector('.error')) {
        return;
      }
      resetCharts();
     // const startingAmount = Number(form['startingAmount'].value); método para converte , para .       .replace(',', '.')
    const startingAmount = Number(document.getElementById('starting-amount').value.replace(',', '.')
);
    const additionalContribution = Number(document.getElementById('additional-contribution').value.replace(',', '.')
);
    const timeAmount = Number(document.getElementById('time-amount').value);
    const timeAmountPeriod = document.getElementById('time-amount-period').value.replace(',', '.');
    const returnRate = Number(document.getElementById('return-rate').value
    .replace(',', '.'));
    const returnRatePeriod = document.getElementById('evaluatin-period').value;
    const taxRate = Number(
        document.getElementById('tax-rate').value.replace(',', '.')
    );
      

    if (isNaN(startingAmount) || isNaN(additionalContribution) || isNaN(timeAmount) || isNaN(returnRate) || isNaN(taxRate)) {
        console.error("Por favor, insira valores numéricos válidos.");
        return;
    }
//gerando o array 
    const returnsArray = generateReturnsArray(
        startingAmount,
        timeAmount,
        timeAmountPeriod,
        additionalContribution,
        returnRate,
        returnRatePeriod
    );

//Criar um gráfico com a mpmjs
const finalInvestmentObject = returnsArray[returnsArray.length - 1];
doughnutChartReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Total investido', 'Rendimento', 'Imposto'],
      datasets: [
        {
          data: [
            formatCurrency(finalInvestmentObject.investedAmount),
            
            formatCurrency(finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)),
           
        
            formatCurrency(finalInvestmentObject.totalInterestReturns * (taxRate / 100)),
           
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    }
  });
 //gráficos de barras Bar
 progressionChartReference = new Chart(progressionChart, {
    type: 'bar',
    data: {
      labels: returnsArray.map((investmentObject) => investmentObject.month),
      datasets: [
        {
          label: 'Total Investido',
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.investedAmount)
          ),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Retorno do Investimento',
          data: returnsArray.map((investmentObject) =>
            formatCurrency(investmentObject.interestReturns)
          ),
          backgroundColor: 'rgb(54, 162, 235)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    }
  });
}
//função para limpar os grafico
  function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

//função para limpar os grafico
function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}
  
    // Adicionado a função de limpar 
    function clearForm() {
      form['starting-amount'].value = '';
      form['additional-contribution'].value = '';
      form['time-amount'].value = '';
      form['return-rate'].value = '';
      form['tax-rate'].value = '';
    
      resetCharts();
    
      const errorInputContainers = document.querySelectorAll('.error');
     //Acessando todos o elemento que esteja com a classe error e limpa todos os campos um por um 
      for (const errorInputContainer of errorInputContainers) {
        errorInputContainer.classList.remove('error');
        errorInputContainer.parentElement.querySelector('p').remove();
      }
    }
    


///evt.target aponta para o cara do evento que recebeu o blur
function validateInput(evt) {
    //acessando o compo e validado se está vázia termina a função
    if (evt.target.value === '') {
      return;
    }

    //armazenando os elementos da Arvore
const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement.parentElement;
  const inputValue = evt.target.value.replace(',', '.');
  if (
    // classList.contains() para acessar a classe  ('error') e valida ser o valor do  inpunt é Number 
    !parentElement.classList.contains('error') && 
    (isNaN(inputValue) || Number(inputValue) <= 0 ))
  {

 // objetivo: <p class="text-red-500">Insira um valor numérico e maior que zero</p>
    //Criando e elemento HTML e adionando uma class a ele
    const errorTextElement = document.createElement('p'); //<p></p>
    errorTextElement.classList.add('text-red-500'); //<p class='text-red-500'></p>
    errorTextElement.innerText = 'Insira um valor numérico e maior que zero'; //<p class="text-red-500">Insira um valor numérico e maior que zero</p>

    parentElement.classList.add('error');
    //Adionando o elemento 
    grandParentElement.appendChild(errorTextElement);
  }else if (
    parentElement.classList.contains('error') &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove('error');
    //Usando um seletor querySelector para recupera o elemento e remover a mensagem e o contorno do error 
    grandParentElement.querySelector('p').remove();
  }

}
//validando os campos quando o usuario trocar de camps
for (const formElement of form) {
    if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
      formElement.addEventListener('blur', validateInput);
    }
}

form.addEventListener('submit', renderProgression);
// calculateButton.addEventListener('click', renderProgression);
clearFormButton.addEventListener('click', clearForm);