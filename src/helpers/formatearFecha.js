// export const formatearFecha = fecha => {
//     const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
//     return fecha.toLocaleString('en-US', options);
// }

export const formatearFecha = fecha => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}