const id_hojadatos = `1wjsn7SFBWQk-aWXVSJ7MWTguGx1wJa8Vt-Z5BI4f_Vc`;
const apikey = `AIzaSyAP_fOHpPUB3o3UP64YtYGB6Kz83a5GF6s`;
const rango = `Hoja 1!A1:B20`;
let tasas = [];
let monedas = [];



async function cargarTasasDelCambio() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${id_hojadatos}/values/${rango}?key=${apikey}`;
    console.log(url);

    try{
        const response = await fetch(url);
        if (!response.ok) throw new console.error("Error en la solicitud a Google Sheets");

        const data = await response.json();
    
    if (!data.values || data.values.lenght === 0){
        console.error("No se encontraron Datos en la Hoja de Datos");
        return;
    }

    monedas = [];
    tasas = [];

    data.values.forEach(row => {
       if (row.length >= 2){
        const identificador = row[0].trim();
        let tasa = row[1].trim();

        if (tasa.includes(",")) {
            tasa = tasa.replace(",", ".");
        }

        const tasanumerica = (tasa);

        if (!isNaN(tasanumerica)){
            monedas.push(identificador);
            tasas.push(tasanumerica);  
        }else {
            console.warn(`Tasa invalida para la moneda ${identificador}: ${row[1]}`);
        }
        }else{
            console.warn(`Fila incompleta encontrada:`, row);
        } 
    });
    console.log("Monedas cargadas:", monedas);
    console.log("Tasas Cargadas:", tasas);
    

}catch (error){
    console.error(`Error`, error);
}
}



function convertirMoneda(monedaOrigen, monto, monedaDestino){

    const indiceOrigen  = monedas.indexOf(monedaOrigen);
    const indiceDestino = monedas.indexOf(monedaDestino);
    
    if (indiceOrigen === -1 || indiceDestino === -1 ){
        console.error("Codigo de Moneda no encontrado");
        return null;
    }
    const tasaOrigen  = parseFloat(tasas[indiceOrigen]);
    const tasaDestino = parseFloat(tasas[indiceDestino]);
    
    console.log(`Tasa de origen ${monedaOrigen}: ${tasaOrigen}`);
    console.log(`Tasa de origen ${monedaDestino}: ${tasaDestino}`);
    
    if (tasaOrigen == null || tasaDestino == null){
        console.error("Tasa de Cambio no encontrada para una de las monedas");
        return null;
    }

    const montoConvertido = monto * (tasaDestino / tasaOrigen);
    return montoConvertido;
    
    
}


async function convertir() {

    if (tasas.length === 0 || monedas.length === 0){
        await cargarTasasDelCambio();
        
    }
   

    const codigoOrigen = document.getElementById("monedaOrigen").value;
    const codigoDestino = document.getElementById("monedaDestino").value;
    const monto = parseFloat(document.getElementById("monto").value);

    if (isNaN(monto) || monto <= 0){
        document.getElementById("resultado").textContent = "Error: Ingresa un monto valido.";
        return;
    }

    const montoConvertido = convertirMoneda(codigoOrigen, monto, codigoDestino).toFixed(2);

   
    console.log(montoConvertido);

    if (montoConvertido === null) {
        document.getElementById("resultado").textContent = "Error: No se pudo realizar la conversión.";
    } else {
        document.getElementById("resultado").textContent = `Monto Convertido: ${montoConvertido}`;
        console.log(`Monto convertido:`, montoConvertido);
}
}