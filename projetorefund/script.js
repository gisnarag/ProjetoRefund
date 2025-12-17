//Capturar o formulário para evitar o reload no evento de submit
const form = document.querySelector("form")
const expenseList = document.querySelector("ul")

const expensesTotal = document.querySelector ("aside header h2") //selecionar a strinh do h2 na constante 
const expensesQuantity = document.querySelector("aside header p span") //navegação no HTML para acessar a span que irá corresponder ao expensesQuantity


//Capturar o input para aceitar apenas números
const amount = document.getElementById("amount");

//Capturando os dados do formulário
const expense = document.getElementById("expense");
const category = document.getElementById("category");


//Evento para capturar entrada de valor no input. oninput fica escutando toda vez que entrar algum conteúdo no input e vai disparar o evento.
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "") //criei a variável para capturar o valor do input. Replace para substituir o conteúdo desse valor pela regex, /D -> caracteres não numéricos substituir por nada.

 //Para a formatação funcionar no input, é preciso transformar o value em centavos por isso transformo o value para o tipo number, e divido por 100.
    value = Number(value) / 100


  amount.value = formatCurrencyBRL(value) //atribui a função com o value para formatar o valor do input.
};

//Formatando a moeda
function formatCurrencyBRL(value){ //a função está recebendo o valor do input 
    value = value.toLocaleString("pt-BR", { //no escopo do objeto vou definir a aparência da formatação.
        style: "currency", //propriedade do Js style: defini como sendo moeda.
        currency: "BRL", //Tipo da moeda: Real brasileiro.

    }) //formatando o valor como moeda local do Brasil. 

    return value //O return value devolve esse valor após ter formatado para quem chamou a função.
};

//Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
    event.preventDefault()

//Criei um ID para cada despesa, pois vai diferenciar uma despesa da outra.
    const newExpense = {
        id: new Date().getTime(), //usei o new Date como id porque gera um número único baseado no momento exato da criação da despesa.
        expense: expense.value, //capturando o valor do input na propriedade expense. 
        category_id: category.value, //capturo o valor da option que o usuário selecionou.
        category_name: category.options[category.selectedIndex].text, //eu vou capturar a opção vísivel (texto) que o usuário selecionou. 
        amount: amount.value, 
        created_at: new Date(), //para sinalizar quando a despesa foi criada
}

//Chama a função que vai adicionar o item na lista.
expenseAdd(newExpense)
}


//Criar uma função para adicionar uma nova despesa na lista e montar o jeito que ela vai aparecer: com o ícone, o nome da despesa, a categoria, o valor e o botão para deletar.

function expenseAdd(newExpense) { //Eu vou passar como parâmetro, ou seja, chamar a newExpensive

//Lidar com exceções com o bloco de try 

try {
//Criei o elemento de li para adicionar o li na lista (ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    //Cria o icone da despesa na li
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `assets/${newExpense.category_id}.svg`) 
    /*
    setAttribute -> Cria ou muda um atributo, nesse caso o src que define o caminho da imagem.
    
    Eu interpolei para quando o user selecionar a option, dinâmicamente o icon id do objeto presente em newExpense complete a imagem em svg.
    */ 
    expenseIcon.setAttribute("alt", `assets/${newExpense.category_name}.svg`) 

    //Cria a info da despesa na li
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense //expense é o valor do input, então eu estou atribuindo o valor do texto que o user digitou ao expenseName.  

    //Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name //categoria visível para o user selecionada

     expenseInfo.append(expenseName, expenseCategory)

    //Cria o valor da despesa 
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}` 

    /*
    innerHTML → coloca ou altera o conteúdo HTML dentro de um elemento. Nesse caso, estou inserindo dentro do elemento expenseAmounr o <small>. 
    
    ${...} → coloca o valor de uma variável amount dentro do texto.
    
    newExpense.amount.toUpperCase().replace("R$", "") -> pega o valor de amount, transforma em maiúsculas, e remove o “R$” (se existir).
    */

    //Cria o ícone de remover 
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "assets/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    //Adicionando o icon na li
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    expenseList.append(expenseItem)

//Limpa o formulário para um novo item ser adicionado.
formClear()


//Atualiza os totais após ter adicionado o item na lista
    updateTotals ()
} catch (error){
    alert ("Não foi possível atualizar a lista de despesas.")
    console.log(error)
}
}

//Criar uma função para atualizar os totais 

function updateTotals () {
    try {
        //Recuperar todas os itens (li) da lista (ul)
        //Criei a constante e dentro dela atribui a minha ul,
        const items = expenseList.children //.children exibe a quantidade de filhos que existe na ul expenseList 

        //Atualiza a quantidade de itens da lista 
       expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

//Variável para incrementar o total
    let total = 0 

//Percorre cada item (li) da lista (ul)
    for(let item = 0; item < items.length; item++){ 
        const itemAmount = items[item].querySelector(".expense-amount") //O JS pega o elemento que está na posição item dentro do array items, busca dentro desse item o elemento que tem a classe .expenseAmount, nesse caso é a <span>. A variável itemAmount = <span class="expense-amount"><small>R$</small>1.420,57</span>
   
let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".") //formatando o itemAmount para remover caracteres não numéricos, e outro replace substitui a vírgula pelo ponto. 

//Converte o valor para float, visto que são valores que possuem casas decimais. Antes: "1.420,57" era texto, o JavaScript não consegue fazer contas com isso. Depois: 1.420,57 é número, agora dá pra somar e fazer contas.
value = parseFloat(value)
 
//Verifica se é um número válido 
if (isNaN(value)) {
    return alert(
        "Não foi possível calcular o total. O valor não parece ser um número.")

    }
//Incrementar o valor total. 
total += Number(value) //agora para exibir esse total, eu criei a const expenseTotal para navegar o h2 do HTML onde fica vísivel os valores da despesa.
    }
    
/* 
O for é uma estrutura de repetição que executa um bloco de código várias vezes, enquanto uma condição for verdadeira.

let item = 0
→ Cria uma variável chamada item e começa com o valor 0.
Isso é o ponto de partida do loop.

item < item.length
→ É a condição que o for verifica antes de cada repetição.
Enquanto ela for verdadeira, o bloco dentro do {} será executado.

item++
→ Significa item = item + 1.
A cada repetição, o valor de item aumenta em 1
*/

/*
    ${items.length} → mostra quantos itens existem.

    ? → é o operador ternário

    items.length > 1 ? "despesas" : "despesa" → se houver mais de 1 item, mostra "despesas", senão "despesa".
*/

//Criando a small para adicionar o R$ formatado
const symbolBRL = document.createElement("small")
symbolBRL.textContent = "R$"

//Formata o valor e remove o R$ que setá exibido pela small com um estilo customizado
total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

expensesTotal.innerHTML = "" //Limpa o conteúdo do elemento

//Adiciona o símbolo da moeda e o valor total formatado
expensesTotal.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais.")

    }
}

//Evento que captura clique nos itens da lista (ul)
expenseList.addEventListener("click", function (event){
//Verifica se o evento clicado é o ícone de remover 
    if(event.target.classList.contains("remove-icon")) {//contains verifica se dentro da classe contém essa classe remove icon, se tiver então o js reconhece, e vai disparar o evento. event.target → é quem sofreu a ação (quem recebeu o clique.

    //Para remover a li pai do elemento clicado 
   const item = event.target.closest(".expense") //O closest() sobe na árvore do HTML procurando o elemento mais próximo que tenha o seletor especificado, ou seja, closest(".expense") vai subir até o <li class="expense"> que é o parente mais próximo que tem essa classe.

   //Remove o item da lista
   item.remove()
}

//Atualiza os totais
updateTotals()
})

function formClear (){
    //limpa dos inputs
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus() //usei o método focus para focar no input de despesas após ter limpado.
}

