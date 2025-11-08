"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ICS_URL = "https://calendar.google.com/calendar/ical/c_lublpqqigfijlbc1l4rudcpi5s%40group.calendar.google.com/public/basic.ics";
// Node 18+ has global fetch; if you're on an older version, you'll need node-fetch.
async function fetchIcs(url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ICS (${res.status} ${res.statusText})`);
    }
    return await res.text();
}
// iCalendar allows "folded" lines: a line can be continued on the next line,
// starting with a space or tab. This function unfolds them.
function unfoldLines(raw) {
    const lines = raw.split(/\r?\n/);
    const unfolded = [];
    for (const line of lines) {
        if (line.length === 0)
            continue; // skip empty lines
        if (line.startsWith(" ") || line.startsWith("\t")) {
            // continuation of previous line
            if (unfolded.length > 0) {
                unfolded[unfolded.length - 1] += line.slice(1);
            }
        }
        else {
            unfolded.push(line);
        }
    }
    return unfolded;
}
// Very small ICS date parser that handles the common Google formats:
// - "YYYYMMDD"
// - "YYYYMMDDTHHMMSSZ"
// - "YYYYMMDDTHHMMSS" (treated as local time)
function parseICalDate(value) {
    if (!value)
        return null;
    const s = value.trim();
    // Date only: YYYYMMDD
    if (/^\d{8}$/.test(s)) {
        const year = Number(s.slice(0, 4));
        const month = Number(s.slice(4, 6)) - 1;
        const day = Number(s.slice(6, 8));
        return new Date(year, month, day);
    }
    // Date-time: YYYYMMDDTHHMMSS(Z optional)
    const match = /^(\d{8})T(\d{6})(Z)?$/.exec(s);
    if (!match) {
        // Unknown format – return null so caller can decide what to do
        return null;
    }
    const datePart = match[1];
    const timePart = match[2];
    const isUTC = !!match[3];
    const year = Number(datePart.slice(0, 4));
    const month = Number(datePart.slice(4, 6)) - 1;
    const day = Number(datePart.slice(6, 8));
    const hour = Number(timePart.slice(0, 2));
    const minute = Number(timePart.slice(2, 4));
    const second = Number(timePart.slice(4, 6));
    if (isUTC) {
        return new Date(Date.UTC(year, month, day, hour, minute, second));
    }
    else {
        return new Date(year, month, day, hour, minute, second);
    }
}
// Parse the ICS text and return a list of events.
function parseIcs(ics) {
    const lines = unfoldLines(ics);
    const events = [];
    let inEvent = false;
    let current = {};
    for (const line of lines) {
        if (line === "BEGIN:VEVENT") {
            inEvent = true;
            current = {};
            continue;
        }
        if (line === "END:VEVENT") {
            if (inEvent) {
                const uid = current["UID"] ?? "";
                const summary = current["SUMMARY"] ?? "";
                const start = parseICalDate(current["DTSTART"]);
                const end = parseICalDate(current["DTEND"]);
                const description = current["DESCRIPTION"];
                events.push({ uid, summary, start, end, description });
            }
            inEvent = false;
            current = {};
            continue;
        }
        if (!inEvent)
            continue;
        // Property: "KEY;PARAM=...:VALUE" or "KEY:VALUE"
        const [left, value = ""] = line.split(":", 2);
        const [rawName] = left.split(";", 1);
        const name = rawName.toUpperCase();
        current[name] = value;
    }
    return events;
}
async function main() {
    try {
        const icsText = await fetchIcs(ICS_URL);
        const events = parseIcs(icsText);
        // Example: print upcoming events in chronological order.
        const now = new Date();
        events
            .filter(e => e.start !== null)
            .sort((a, b) => (a.start.getTime() - b.start.getTime()))
            .forEach(e => {
            if (e.start && e.start >= now) {
                console.log(JSON.stringify({
                    uid: e.uid,
                    summary: e.summary,
                    start: e.start.toISOString(),
                    end: e.end ? e.end.toISOString() : null,
                }));
            }
        });
    }
    catch (err) {
        console.error("Error:", err);
    }
}
main();
//# sourceMappingURL=calendarIcal.js.map