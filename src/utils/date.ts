export function toDatetime(date: Date) {
  let year = date.getFullYear();
  let mounth = toDubleDigit(date.getMonth() + 1);
  let day = toDubleDigit(date.getDate());
  let hours = toDubleDigit(date.getHours());
  let minutes = toDubleDigit(date.getMinutes());
  let seconds = toDubleDigit(date.getSeconds());
  return (
    year +
    '-' +
    mounth +
    '-' +
    day +
    ' ' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds
  );
}

function toDubleDigit(digit: number) {
  return digit <= 9 ? '0' + digit : digit;
}
