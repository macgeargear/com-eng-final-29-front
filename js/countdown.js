export function countDown(duedate) {
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;

  function setElementInnerText(id, text) {
    const element = document.getElementById(id);
    element.innerText = text;
  }

  function countDown() {
    const now = new Date().getTime();
    const duedate = new Date("December 31, 2023 23:59:59").getTime();
    const unixTimeLeft = duedate - now;
    // console.log(unixTimeLeft);

    setElementInnerText("days", Math.floor(unixTimeLeft / DAY));
    setElementInnerText("hours", Math.floor((unixTimeLeft % DAY) / HOUR));
    setElementInnerText(
      "minutes",
      Math.floor(((unixTimeLeft % DAY) % HOUR) / MINUTE)
    );
    setElementInnerText(
      "seconds",
      Math.floor((((unixTimeLeft % DAY) % HOUR) % MINUTE) / SECOND)
    );
  }

  function run() {
    setInterval(countDown, SECOND);
  }
  run();
}
