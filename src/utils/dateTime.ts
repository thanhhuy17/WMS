import { addZeroToNumber } from "./addZeroToNumber";

export class DateTime {
    static CalendarDate = (val: any) => {
        const date = new Date(val)

        return `${date.getFullYear()}-${date.getMonth() + 1}-${addZeroToNumber(date.getDate())}`;
    }
}