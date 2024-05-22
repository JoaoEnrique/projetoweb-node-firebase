import moment from 'moment';

export const formatarData = (date) => {
    return moment(date).format('DD/MM/YYYY')
}

export const ifEquals = (arg1, arg2) => {
    return arg1 == arg2;
}