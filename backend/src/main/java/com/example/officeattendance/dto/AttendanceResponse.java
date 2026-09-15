package com.example.officeattendance.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

public class AttendanceResponse {

    @Schema(description = "Identificador del registro", example = "1")
    private Long id;

    @Schema(description = "Fecha de asistencia", example = "2026-09-10")
    private LocalDate date;

    public AttendanceResponse() {
    }

    public AttendanceResponse(Long id, LocalDate date) {
        this.id = id;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
