let clp = document.querySelector("#clp"); //monto en pesos chilenos
let select = document.querySelector("#divisa"); //bloque select donde estará la divisa
let buscarbutton = document.querySelector("#buscarbutton"); //boton de buscar
let resultado = document.querySelector("#resultado");
let myChart = document.getElementById("myChart");
let chartInstance = null;

//funcion de llamado a los datos
async function getDivisas() {
  //busca los datos
  try {
    const res = await fetch("https://mindicador.cl/api/");
    const divisas = await res.json();
    return divisas;
  } catch (error) {
    resultado.innerHTML =
      "Ha ocurrido un error inesperado!!. Por favor intenta mas tarde";
  }
}

async function renderDivisas() {
  //renderiza las divisas en el select
  const divisas = await getDivisas();
  let template = `<option value="" disabled selected>Seleccione una moneda</option>`;
  try {
    for (let propiedad in divisas) {
      if (
        divisas[propiedad].nombre !== undefined &&
        divisas[propiedad].nombre !== ""
      ) {
        template += `<option value="${divisas[propiedad].valor}" id="${divisas[propiedad].codigo}">${divisas[propiedad].nombre}</option>`;
      }
    }
    select.innerHTML = template;
  } catch (error) {
    resultado.innerHTML =
      "Ha ocurrido un error inesperado. Por favor intenta mas tarde";
  }
}
renderDivisas(); //funcion de dibujar el

buscarbutton.addEventListener("click", function () {
  let resultadoText = "Resultado: ";
  if (!isNaN(clp.value)) {
    resultadoText += clp.value / select.value;
    resultadoText += `<br><p>Tipo de Cambio: `;
    resultadoText += select.value;
    resultado.innerHTML = resultadoText;
    const selectIndex = select.selectedIndex;
    const optionselected = select.options[selectIndex];
    renderGrafica(optionselected.id);
  } else {
    alert("por favor ingresar un numero");
  }
});

async function getDataDivisas(selectid) {
  let link = "https://mindicador.cl/api/";
  link += selectid;
  link += "/2024";
  const res = await fetch(link);
  const datos = await res.json();
  const labels = datos.serie.map((item) => item.fecha.slice(0, 10)).reverse();
  const valores = datos.serie.map((item) => Number(item.valor)).reverse();
  const datasets = [
    {
      label: "Tipo de Cambio durante 2024",
      borderColor: "red",
      data: valores,
    },
  ];
  return { labels, datasets }; //retorna "data"
}

async function renderGrafica(selectid) {
  const data = await getDataDivisas(selectid);
  const config = { type: "line", data };
  myChart.style.backgroundColor = "white";
  if (chartInstance !== null) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(myChart, config);
}
