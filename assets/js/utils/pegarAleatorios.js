export function pegarAleatorios(array, quantidade) {
    const copia = [...array];
    const resultado = [];
    for (let i = 0; i < quantidade && copia.length > 0; i++) {
        const indiceAleatorio = Math.floor(Math.random() * copia.length);
        resultado.push(copia.splice(indiceAleatorio, 1)[0]);
    }
    return resultado;
}