// backend/src/util/date.util.ts

export function parseClientDateToUTC(raw: string): Date {
    if (!raw) {
        throw new Error("Fecha/hora vacía");
    }

    if (/[zZ]|[+\-]\d{2}:\d{2}$/.test(raw)) {
        const d = new Date(raw);
        if (isNaN(d.getTime())) {
            throw new Error(`Formato de fecha inválido: ${raw}`);
        }
        return d;
    }

    const [datePart, timePart] = raw.split("T");
    if (!datePart || !timePart) {
        const d = new Date(raw);
        if (isNaN(d.getTime())) {
            throw new Error(`Formato de fecha inválido: ${raw}`);
        }
        return d;
    }

    const [yearStr, monthStr, dayStr] = datePart.split("-");
    const [hourStr, minuteStr, secondStr = "0"] = timePart.split(":");

    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    const second = Number(secondStr);

    if (
        [year, month, day, hour, minute, second].some((n) => Number.isNaN(n))
    ) {
        throw new Error(`Formato de fecha inválido: ${raw}`);
    }

    const localMillis = Date.UTC(year, month - 1, day, hour, minute, second);
    const utcOffsetMillis = 6 * 60 * 60 * 1000;
    const utcMillis = localMillis + utcOffsetMillis;

    return new Date(utcMillis);
}