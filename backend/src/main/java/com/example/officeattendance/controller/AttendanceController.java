package com.example.officeattendance.controller;

import com.example.officeattendance.dto.AttendanceMonthResponse;
import com.example.officeattendance.dto.AttendanceRequest;
import com.example.officeattendance.dto.AttendanceResponse;
import com.example.officeattendance.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS})
@Tag(name = "Attendance", description = "Endpoints para gestionar asistencias")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/attendance")
    @Operation(summary = "Registrar asistencia", description = "Crea un registro de asistencia para una fecha específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Asistencia creada con éxito"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "409", description = "El día ya está registrado")
    })
    public ResponseEntity<AttendanceResponse> createAttendance(@Valid @RequestBody AttendanceRequest request) {
        AttendanceResponse response = attendanceService.saveAttendance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/attendance/{date}")
    @Operation(summary = "Eliminar asistencia", description = "Elimina el registro de asistencia para una fecha específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Asistencia eliminada con éxito"),
            @ApiResponse(responseCode = "404", description = "No existe asistencia para esa fecha")
    })
    public ResponseEntity<Void> deleteAttendance(
            @Parameter(description = "Fecha en formato YYYY-MM-DD", example = "2026-09-10")
            @PathVariable String date) {
        attendanceService.deleteAttendance(date);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/attendance")
    @Operation(summary = "Obtener asistencias del mes", description = "Devuelve las asistencias del mes, contador y porcentaje")
    public ResponseEntity<AttendanceMonthResponse> getMonthlyAttendance(
            @RequestParam int year,
            @RequestParam int month) {
        AttendanceMonthResponse response = attendanceService.getMonthlyAttendance(year, month);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/attendance/summary")
    @Operation(summary = "Obtener resumen mensual", description = "Devuelve resumen mensual de asistencias")
    public ResponseEntity<AttendanceMonthResponse> getMonthlySummary(
            @RequestParam int year,
            @RequestParam int month) {
        AttendanceMonthResponse response = attendanceService.getMonthlyAttendance(year, month);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Devuelve el estado del servicio")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
