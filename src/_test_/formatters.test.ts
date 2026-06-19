import { describe, it, expect } from "vitest";
import {
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  formatPrecip,
  formatDayLabel,
  formatDate,
} from "../utils/formatters";

describe("formatters", () => {
  describe("formatTemperature", () => {
    it("rounds to nearest integer", () => {
      expect(formatTemperature(20.4)).toBe("20°C");
      expect(formatTemperature(20.5)).toBe("21°C");
    });
  });

  describe("formatWindSpeed", () => {
    it("formats with km/h unit", () => {
      expect(formatWindSpeed(15)).toBe("15 km/h");
    });
  });

  describe("formatPressure", () => {
    it("formats with hPa unit", () => {
      expect(formatPressure(1013)).toBe("1013 hPa");
    });
  });

  describe("formatVisibility", () => {
    it("formats with km unit", () => {
      expect(formatVisibility(10)).toBe("10 km");
    });
  });

  describe("formatPrecip", () => {
    it("formats with mm unit", () => {
      expect(formatPrecip(0)).toBe("0 mm");
      expect(formatPrecip(2.5)).toBe("2.5 mm");
    });
  });

  describe("formatDayLabel", () => {
    it("returns Today for current date", () => {
      const today = new Date().toLocaleDateString("en-CA");
      expect(formatDayLabel(today)).toBe("Today");
    });

    it("returns day name for next day", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toLocaleDateString("en-CA");
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      expect(formatDayLabel(tomorrowStr)).toBe(dayNames[tomorrow.getDay()]);
    });

    it("returns day abbreviation for other dates", () => {
      expect(formatDayLabel("2026-06-16")).toBe("Tue");
      expect(formatDayLabel("2026-06-17")).toBe("Wed");
    });
  });

  describe("formatDate", () => {
    it('formats date as "Mon DD, YYYY"', () => {
      expect(formatDate("2026-06-16")).toBe("Jun 16, 2026");
      expect(formatDate("2026-12-25")).toBe("Dec 25, 2026");
    });
  });
});
