package com.example.officeattendance.controller;

import com.example.officeattendance.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Reports", description = "Endpoints para exportar reportes")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/reports/monthly")
    @Operation(summary = "Descargar reporte mensual", description = "Genera un archivo Excel o PDF con el resumen mensual")
    public ResponseEntity<byte[]> downloadMonthlyReport(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam String format) {

        byte[] content = reportService.generateReport(year, month, format);

        String fileName = "asistencia-" + month + "-" + year + ("xlsx".equalsIgnoreCase(format) ? ".xlsx" : ".pdf");

        MediaType mediaType = "xlsx".equalsIgnoreCase(format)
                ? MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                : MediaType.APPLICATION_PDF;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(mediaType)
                .body(content);
    }
}
