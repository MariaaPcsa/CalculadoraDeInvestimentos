
//Validação ser é um array e se compo e maior que zero
const isNonEmptyArray = (arrayElement) => {
    return Array.isArray(arrayElement) && arrayElement.length > 0;
  };

//Validando ser a tabele tem os arrays
export const createTable = (columnsArray, dataArray, tableId) => {
    if (
        !isNonEmptyArray(columnsArray) &&
        !isNonEmptyArray(dataArray) &&
        !tableId
      ) {
        throw new Error(
          'Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado'
        );
      }
      //Acesando a tabela pelo id e validando se foi informado id ou foi informado o id diferente 
      const tableElement = document.getElementById(tableId);
      if (!tableElement || tableElement.nodeName !== 'TABLE') {
        throw new Error('Id informado não corresponde a nenhum elemento table');
      }
    

      //chamada da função que cria o elemento  Header e  Body da tabela 
    createTableHeader(tableElement, columnsArray);
   createTableBody(tableElement, dataArray, columnsArray);
    };

    // função que criar o header com referecia da tabela e colulas 
    function createTableHeader(tableReference, columnsArray) {
        /*    <table></table> || 
              <table>
                <thead></thead>
                <tbody></tbody>
              </table> */


        function createTheadElement(tableReference) {
          const thead = document.createElement('thead'); //<thead></thead>
          tableReference.appendChild(thead); //<table><thead></thead></table>
          return thead;
        }
        //valida se a tabela tem u thead vaso não em na função createTheadElemen
        const tableHeaderReference =
          tableReference.querySelector('thead') ?? createTheadElement(tableReference);

          // adiocondo  a linha da tabela e com stilização do twindds , com o forEach para fazer um lupe para cada interção
        //<table><thead></thead></table>
        const headerRow = document.createElement('tr'); //<tr></tr>
        ['bg-blue-900', 'text-slate-200', 'sticky', 'top-0'].forEach((cssClass) =>
          // função
          headerRow.classList.add(cssClass)
        );
        for (const tableColumnObject of columnsArray) {
          const headerElement = /*html*/ `<th class='text-center' >${tableColumnObject.columnLabel}</th>`;
          headerRow.innerHTML += headerElement;
        }
        //<tr><th class='text-center'>NomeDaColuna</th><th class='text-center'>NomeDaColuna</th></tr>
        tableHeaderReference.appendChild(headerRow);
      }


      function createTableBody(tableReference, tableItems, columnsArray) {
        function createTbodyElement(tableReference) {
          const tbody = document.createElement('tbody');
          tableReference.appendChild(tbody);
          return tbody;
        }

         //Valida ser a tabela tem um thead caso não entra na função function createTableBody

        const tableBodyReference =
          tableReference.querySelector('tbody') ?? createTbodyElement(tableReference);

          //criando uma linha  com o dado do entries vai acessar o elemento do nex
      
        for (const [itemIndex, tableItem] of tableItems.entries()) {
          const tableRow = document.createElement('tr');

          //foramatação da linha para que quando o resto da divisão do elemento for impar alterar a cor  da linha 
          if (itemIndex % 2 !== 0) {
            tableRow.classList.add('bg-blue-200');
          }
          // Criando uma céluda e cada coluna 
          for (const tableColumn of columnsArray) {
            const formatFn = tableColumn.format ?? ((info) => info);
            tableRow.innerHTML += /*html*/ `<td class='text-center'>${formatFn(
              tableItem[tableColumn.accessor]
            )}</td>`;
          }
          tableBodyReference.appendChild(tableRow);

         
        }
      }
      
    
