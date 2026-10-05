const REFERENCE_DATE = "25/09/2026";
const WEEKEND = ["sexta-feira", "sábado", "domingo"];
const WEEK = [
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  ...WEEKEND,
];

const form = document.querySelector("form") as HTMLFormElement;
const inputDate = document.getElementById("date") as HTMLDataElement;
const submitBtn = document.getElementById("submitBtn");
const resultDiv = document.querySelector(".results") as HTMLDivElement;
const paragraph = resultDiv.querySelector(".info") as HTMLParagraphElement;
const h2 = resultDiv.querySelector(".feedback") as HTMLHeadingElement;
const gif = resultDiv.querySelector(".gif") as HTMLImageElement;
const formOpener = resultDiv.querySelector(".btn");

formOpener?.addEventListener("click", displayForm);

submitBtn?.addEventListener("click", (e) => {
  e.preventDefault();

  const [inputDay, inputMonth, inputYear] = formatDate(inputDate.value)
    .split("/")
    .map((d) => Number(d));
  if (!inputDay || !inputMonth || !inputYear) return;

  const inputDayName = getDayName(inputDay, inputMonth, inputYear);

  let closestWeekend = inputDay;
  if (!WEEKEND.includes(inputDayName)) {
    const distanceToWeekend =
      WEEK.indexOf(WEEKEND[0] as string) - WEEK.indexOf(inputDayName);
    closestWeekend = inputDay + distanceToWeekend;
  }
  const elapsedDays = getElapsedDays(
    REFERENCE_DATE,
    closestWeekend,
    inputMonth,
    inputYear,
  );
  if (!elapsedDays) return;
  const elapsedWeekends = (elapsedDays / 7).toFixed(0);
  const worksOnWeekend = isOdd(Number(elapsedWeekends));

  const workOnInputDay = findOut(
    inputDay,
    inputMonth,
    inputYear,
    worksOnWeekend,
  );
  displayInfo(inputDay, inputDayName, workOnInputDay);
});

function findOut(
  inputDay: number,
  inputMonth: number,
  inputYear: number,
  worksOnWeekend: boolean,
) {
  const dayName = getDayName(inputDay, inputMonth, inputYear);
  const MON_AND_TUE = WEEK.slice(0, 2);
  console.log(MON_AND_TUE);
  if (
    (WEEKEND.includes(dayName) || MON_AND_TUE.includes(dayName)) &&
    worksOnWeekend
  ) {
    return true;
  } else if (
    !WEEKEND.includes(dayName) &&
    !MON_AND_TUE.includes(dayName) &&
    !worksOnWeekend
  ) {
    return true;
  } else {
    return false;
  }
}

function getElapsedDays(
  referenceDate: string,
  closestWeekend: number,
  inputMonth: number,
  inputYear: number,
) {
  const [referenceDay, referenceMonth, referenceYear] = referenceDate
    .split("/")
    .map((d) => Number(d));

  if (!closestWeekend || !inputMonth || !inputYear) return;
  if (!referenceDay || !referenceMonth || !referenceYear) return;

  if (inputMonth > referenceMonth) {
    let elapsedDays = 0;
    for (let i = referenceMonth; i <= inputMonth; i++) {
      const monthDays = new Date(inputYear, i, 0).getDate();

      elapsedDays += monthDays;
      if (i === inputMonth) elapsedDays -= monthDays - closestWeekend;
    }
    return elapsedDays - referenceDay;
  } else if (inputMonth < referenceMonth) {
    //thus, another year in the future
  }
}

function formatDate(rawDate: string) {
  const localeDate = new Date(rawDate).toLocaleString("pt-BR");
  const datesOnly = localeDate.split(",")[0];

  const dateArr = (datesOnly as string).split("/");
  dateArr[0] = (Number(dateArr[0]) + 1).toString();

  return dateArr.join("/");
}

function getDayName(day: number, month: number, year: number) {
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    weekday: "long",
  });
}

function isOdd(value: number) {
  return value % 2 !== 0;
}

function displayInfo(
  inputDay: number,
  inputDayName: string,
  worksOnInputDay: boolean,
) {
  const mascDays = ["sábado", "domingo"];

  const lastPhrase = worksOnInputDay
    ? "você estará trabalhando."
    : "você estará em casa!";
  const isMascDay = mascDays.includes(inputDayName);

  const feedback = document.createTextNode(
    worksOnInputDay ? "Ainda não..." : "Boa Digão!",
  );
  const result = document.createTextNode(`o dia ${inputDay} cai em 
        ${isMascDay ? "um" : "uma"} ${inputDayName} e ${lastPhrase}`);

  if (!worksOnInputDay) {
    gif.src = "./assets/digo's happy.gif";
    gif.alt = "Gif de comemoração";
  } else {
    gif.src = "./assets/digo's sad.jpeg";
    gif.alt = "Foto triste no trabalho";
  }

  gif.style.display = "inline-block";
  h2.appendChild(feedback);
  paragraph.appendChild(result);
  resultDiv.style.display = "flex";
  form.style.display = "none";
}

function displayForm() {
  form.style.display = "flex";
  inputDate.value = "";
  resultDiv.style.display = "none";
  h2.textContent = "";
  paragraph.textContent = "";
  gif.src = "";
  gif.alt = "";
  gif.style.display = "";
}
