// export const replaceName = (str: string) => {
//     return str
//         .normalize('NFD')
//         .toLocaleLowerCase()
//         .replace(/[\u0300-\u036f]/g, '')
//         .replace(/đ/g, 'd')
//         .replace(/Đ/g, 'D')
//         .replace(/ /g, '-')
//         .replace(/[:!@#$%^&*()?;/]/g, '');
// }

export const replaceName = (str: string) => {
    if (!str || typeof str !== 'string') {
        console.error('Invalid input to replaceName:', str);
        throw new TypeError('Input must be a valid string');
    }
    return str
        .normalize('NFD')
        .toLocaleLowerCase()
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/ /g, '-')
        .replace(/[:!@#$%^&*()?;/]/g, '');
};