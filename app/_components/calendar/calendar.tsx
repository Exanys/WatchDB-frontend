'use client';
import CalendarColumn from "@/app/_components/calendar/calendar-column";
import {Title} from "@/utils/titles-data";
import {useEffect, useState} from "react";
import {DateTime} from "luxon";
import CalendarUtils from "@/utils/calendar-utils";
import {mockData} from "@/utils/mock-movie-db";

const daysNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export default function Calendar(params: {weekNumber: number}) {
    const [days, setDays] = useState([{day: 'Times', date: '', program: [] as Array<Title>}]);

    useEffect(() => {
        const weekPeriod = CalendarUtils.getWeekPeriodByWeekNumber(params.weekNumber);
        const programs = mockData.filter(dayData => CalendarUtils.isDateInPeriod(dayData.date, weekPeriod));
        const daysProgram = daysNames.map((day, index) => {
            const date = DateTime.fromFormat(weekPeriod.start, CalendarUtils.DB_DATE_FORMAT).plus({days: index}).toFormat(CalendarUtils.DB_DATE_FORMAT);
            const dayProgram = programs.find(program => program.date == date)
            return {
                day,
                date,
                program:  (dayProgram !== undefined ? dayProgram.programs : []) as Array<Title>
            }
        });
        //add daysProgram to days
        setDays([...days, ...daysProgram]);
    }, [days, params.weekNumber]);

    return (
        <div className="calendar">
            {days.map((day, dayIndex): JSX.Element => {return (
                <><div className={"calendar-day calendar-day-" + (dayIndex ? 'day' : 'time')} key={'days'+day}>
                    <div className="calendar-day-name">{day.day}</div>
                    <div className="calendar-day-times">
                        <CalendarColumn renderTimes={!dayIndex} titles={day.program} date={day.date} />
                    </div>
                </div></>
            )})}
        </div>
    );
}