import {Title, TitleRenderData} from "@/utils/titles-data";

export default function CalendarColumn(params: {renderTimes: boolean, titles: Array<Title>, date: string}) {


    const isPartOfTitleInTime = (timeStart: Date, timeEnd: Date, titleStart: Date, titleEnd: Date): number => {
        if (timeStart >= titleStart && timeStart <= titleEnd) {
            return -(titleStart.getMinutes()*100/60);
        }else if (timeEnd >= titleStart && timeEnd <= titleEnd) {
            return (titleEnd.getMinutes()*100/60);
        }
        return 0;
    }

    const generateRenderData = (title_name: string, title_length: number, title_type: string, height_percentage: number): TitleRenderData => {
        return {
            titleName: title_name,
            titleLength: title_length,
            titleType: title_type,
            heightPercentage: height_percentage
        }
    }
    const isTimeBetween = (timeStart: Date, timeEnd: Date, titleStart: Date, titleEnd: Date): boolean => {
        return timeStart <= titleStart && timeEnd >= titleEnd
    }
    const titleRenderData = (start: Date, end: Date, title: Title): TitleRenderData|null => {
        const {titleName, titleLength, titleType} = title;
        let titleRenderData: TitleRenderData|null = null;
        title.titleTimes.forEach((time) => {
            const [titleStart, titleEnd] = time.split(';').map(t=> new Date(params.date + ' ' + t + ':00'));
            if (isTimeBetween(start, end, titleStart, titleEnd)) {
                titleRenderData = generateRenderData(titleName, titleLength, titleType, 100);
            }
            const partedTime = isPartOfTitleInTime(start, end, titleStart, titleEnd);
            partedTime !== 0 && (titleRenderData = generateRenderData(titleName, titleLength, titleType, partedTime));
        })
        return titleRenderData;
    }
    const getRenderData = (time: Date): Array<TitleRenderData> => {
        const endTime = new Date(params.date + ' ' + (time.getHours() + 1) + ':00:00');
        let titlesForRender: Array<TitleRenderData> = [];
        params.titles.forEach((title) => {
           const data = titleRenderData(time, endTime, title);
           if (data) {
               titlesForRender.push(data);
           }
        })
        return titlesForRender;
    }

    const renderTitles = (time: Date): JSX.Element => {
        const renderData: Array<TitleRenderData> = getRenderData(time);
        return <div className={'calendar-day-times-entry-titles'}>
            {renderData.map((data) => {
                return <div className={'calendar-day-times-entry-title rounded'}
                            style={{
                                height: data.heightPercentage + '%',
                                width: 100/renderData.length + '%',
                                alignSelf: data.heightPercentage > 0 ? 'flex-start' : 'flex-end',
                            }}
                            key={data.titleName}>
                    {data.titleLength}
                </div>;
            })}
            </div>;
    }

    return (
        <>
        {Array(24).fill(0).map((_, index) => {
            const time = new Date(params.date + ' ' + index + ':00:00');
            return (<>
                    <div className={"calendar-day-times-entry calendar-day-times__"+ (!params.renderTimes ? 'days' : 'times')}
                         key={'times-'+!params.renderTimes ? 'time' : params.date+index}>
                        {index}:00
                        {!params.renderTimes && renderTitles(time)}
                    </div>
                </>
            );
    })}
        </>)
};