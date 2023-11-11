import {DateTime} from "luxon";

export interface Period {
    start: string;
    end: string;
}

export default class CalendarUtils{
    public static DB_DATE_FORMAT = 'yyyy-MM-dd';
    private static YEAR_NUMBER = DateTime.now().year;

    public static getWeekPeriodByWeekNumber(weekNumber: number): Period{
        const date = DateTime.fromObject({
            weekYear: CalendarUtils.YEAR_NUMBER,
            weekNumber
        });
        return {
            start: date.startOf('week').toFormat(CalendarUtils.DB_DATE_FORMAT),
            end: date.endOf('week').toFormat(CalendarUtils.DB_DATE_FORMAT)
        }
    }

    public static isDateInPeriod(date: string, period: Period): boolean{
        const start = DateTime.fromFormat(period.start, CalendarUtils.DB_DATE_FORMAT).startOf('day');
        const end = DateTime.fromFormat(period.end, CalendarUtils.DB_DATE_FORMAT).endOf('day');
        const dateObject = DateTime.fromFormat(date, CalendarUtils.DB_DATE_FORMAT);
        return dateObject >= start && dateObject <= end
    }
}