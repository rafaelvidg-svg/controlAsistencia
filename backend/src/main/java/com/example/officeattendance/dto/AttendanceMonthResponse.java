package com.example.officeattendance.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

public class AttendanceMonthResponse {

    @Schema(description = "Año del mes consultado", example = "2026")
    private int year;

    @Schema(description = "Mes consultado", example = "9")
    private int month;

    @Schema(description = "Objetivo mensual", example = "12")
    private int goal;

    @Schema(description = "Número de días asistidos", example = "8")
    private long attendedDays;

    @Schema(description = "Número de días restantes", example = "4")
    private long remainingDays;

    @Schema(description = "Porcentaje de cumplimiento", example = "66.67")
    private double percentage;

    @Schema(description = "Fechas de asistencia registradas en el mes")
    private List<LocalDate> dates;

    public AttendanceMonthResponse() {
    }

    public AttendanceMonthResponse(int year, int month, int goal, long attendedDays, long remainingDays, double percentage, List<LocalDate> dates) {
        this.year = year;
        this.month = month;
        this.goal = goal;
        this.attendedDays = attendedDays;
        this.remainingDays = remainingDays;
        this.percentage = percentage;
        this.dates = dates;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getGoal() {
        return goal;
    }

    public void setGoal(int goal) {
        this.goal = goal;
    }

    public long getAttendedDays() {
        return attendedDays;
    }

    public void setAttendedDays(long attendedDays) {
        this.attendedDays = attendedDays;
    }

    public long getRemainingDays() {
        return remainingDays;
    }

    public void setRemainingDays(long remainingDays) {
        this.remainingDays = remainingDays;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public List<LocalDate> getDates() {
        return dates;
    }

    public void setDates(List<LocalDate> dates) {
        this.dates = dates;
    }
}
