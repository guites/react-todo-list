export const getCurrentTime = () => {
    return new Intl.DateTimeFormat('pt-br', {
        timeStyle: 'short',
    }).format(new Date());
};

export const getCurrentDate = () => {
    const d = new Date();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month, day].join('-');
};

export const getCurrentDateTime = date => {
    const setDate = date ? new Date(date) : new Date();
    return new Intl.DateTimeFormat('pt-br', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(setDate);
};

export const formatForDateInput = date => {
    let d = date || getCurrentDateTime();
    return d
        .replace(/ \d{1,2}:\d{1,2}/, '')
        .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$3-$2-$1');
};

export const formatAsBrDate = date => {
    if (/\d{4}-\d{2}-\d{2}/.test(date)) {
        return date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1');
    }
};

export const formatForTimeInput = date => {
    let d = date || getCurrentDateTime();
    // returns ex. 12:25 or ''
    return d.replace(/\d{1,2}\/\d{1,2}\/\d{4} /, '');
};

export const capitalize = word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};
