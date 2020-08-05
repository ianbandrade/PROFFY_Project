export default function convertHourToMinutes(time: String) {
  const [hour, minutes] = time.split(':').map(Number);

  return hour * 60 + minutes;
}
