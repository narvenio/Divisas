const id_hojadatos = `1wjsn7SFBWQk-aWXVSJ7MWTguGx1wJa8Vt-Z5BI4f_Vc`;
const apikey = `AIzaSyAP_fOHpPUB3o3UP64YtYGB6Kz83a5GF6s`;
const rango = `Hoja 1!A1:B59`;
let tasas = [];
let monedas = [];
let simbolos = [
    "$",
    "€",
    "£",
    "¥",
    "Bs",
    "Bs",
    "¥",
    "$",
    "$",
    "$",
    "$",
    "C$",
    "S/",
    "Bs.",
    "₲",
    "RD$",
    "L",
    "C$",
    "₡",
    "₩",
    "NT$",
    "$",
    //"€",
    //"€",
    //"€",
    //"€",
    //"€",
    //"€",
    //"€",
    //"€",
    //"€",
    //"€",
    "kr",
    "kr",
    "CHF",
    "kr",
    "zł",
    "Ft",
    "Kč",
    "lei",
    "лв",
    //"€",
    "дин",
    "₽",
    "₴",
    "£",
    "ع.د",
    "د.ا",
    "ل.ل",
    "د.إ",
    "HK$",
    "MOP$",
    "฿",
    "₫",
    "₭",
    "៛",
    "S$",
    "₺",
    "﷼",
    "₪",
]
let pluares =[
    "Dolares Estadounidenses",
    "Euros",
    "Libras",
    "Yenes",
    "Bolivares",
    "Bolivares",
    "Yuanes",
    "Pesos Argentinos",
    "Pesos Chilenos",
    "Pesos Colombianos",
    "Pesos Mexicanos",
    "Dolares Canadienses",
    "Soles",
    "Bolivianos",
    "Guaranis",
    "Lempiras",
    "Córdobas",
    "Colones",
    "Wones",
    "Dolares Taiwaneses",
    "Coronas Suecas",
    "Coronas Danesas",
    "Francos",
    "Coronas Noruegas",
    "Zlotys",
    "Forintos",
    "Coronas Checas",
    "Leis",
    "Levs",
    "Dínares",
    "Rublos",
    "Grivnas",
    "Libras",
    "Dínares",
    "Dínares",
    "Libras",
    "Dirhams",
    "Dolares",
    "Patacas",
    "Bahts",
    "Dongs",
    "Kips",
    "Riels",
    "Dolares",
    "Liras",
    "Riyales",
    "Nuevos Shequeles",
]




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

function borrar(){
    document.getElementById("monto").value = "";
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

    let montoConvertido;
    let MonedaPlural_Origen;
    let MonedaPlural_Destino;
    let simboloDestino;

    const indiceDestino = monedas.indexOf(codigoDestino);
    const indiceOrigen= monedas.indexOf(codigoOrigen);

    simboloDestino =  simbolos[indiceDestino];

    MonedaPlural_Origen = pluares[indiceOrigen];
    MonedaPlural_Destino = pluares[indiceDestino];
    

    if (codigoOrigen === `USD`){
        const indiceDestino = monedas.indexOf(codigoDestino); // para saber la tasa de la tasa destino(de la moneda destino)
        if (indiceDestino === -1){
            document.getElementById("resultado").textContent = "Error: Moneda de Destino No Seleccionada";
            return;
        }
        const tasaDestino = parseFloat(tasas[indiceDestino]); // recuperamos la tasa en el array y lo convertimos en numero para evitar problemas
        montoConvertido = monto * tasaDestino;
        console.log(montoConvertido);
    } else{
        montoConvertido = convertirMoneda(codigoOrigen, monto, codigoDestino); // si la moneda no es usd se utiliza la forma normal
    }


    if (codigoDestino === `USD`){
        const indiceOrigen = monedas.indexOf(codigoOrigen); // para saber la tasa de la moneda de origen
        if (indiceOrigen === -1){
            document.getElementById("resultado").textContent = "Error: Moneda Origen No Seleccionada";
            return;
        }

        const tasaOrigen = parseFloat(tasas[indiceOrigen]);
        montoConvertido = monto / tasaOrigen;
        
        
        console.log(montoConvertido)
    } else{
        montoConvertido = convertirMoneda(codigoOrigen, monto, codigoDestino) // si la moneda no es "USD" en destino pues se calcula normal
    }
    
   

    if (montoConvertido === null) {
        document.getElementById("resultado").textContent = "Error: No se pudo realizar la conversión.";
    } else {
        document.getElementById("resultado").textContent = `${monto} ${MonedaPlural_Origen} son ${montoConvertido.toFixed(2)} ${simboloDestino} ${MonedaPlural_Destino}`;
        console.log(`Monto convertido:`, montoConvertido);
        borrar();
}
}
