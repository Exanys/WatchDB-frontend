import Calendar from "@/app/_components/calendar/calendar";
import {DateTime} from "luxon";

export default function Home() {
  return (
    <main className="">
      <Calendar weekNumber={DateTime.now().weekNumber}/>
    </main>
  )
}
