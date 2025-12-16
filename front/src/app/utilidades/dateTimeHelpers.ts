export const extractTime = (timeString: string): string => {
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      return timeString;
    }
    const time = new Date(timeString);
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
export const generarHoras = (): string[] => {
    const horas: string[] = [];
    for (let h = 9; h <= 16; h++) {
      for (let m = 0; m < 60; m += 15) {
        const horaFormateada = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        horas.push(horaFormateada);
      }
    }
    return horas;
  };