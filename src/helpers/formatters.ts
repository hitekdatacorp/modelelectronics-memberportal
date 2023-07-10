

export function toCurrencyString(val: number) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    return formatter.format(val);
}

export function dateTimeToShortDateString(date: Date | string | null): string | null{

    if(date === null) return '';

    if(typeof(date) === 'string'){
        date = new Date(date);
    }
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

export function dateToUrlReadyParam(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}