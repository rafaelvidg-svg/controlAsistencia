package com.example.officeattendance.service;

import com.example.officeattendance.config.AttendanceProperties;
import com.example.officeattendance.dto.AttendanceMonthResponse;
import com.example.officeattendance.entity.OfficeAttendance;
import com.example.officeattendance.repository.OfficeAttendanceRepository;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final OfficeAttendanceRepository officeAttendanceRepository;
    private final AttendanceProperties attendanceProperties;

    public ReportService(OfficeAttendanceRepository officeAttendanceRepository, AttendanceProperties attendanceProperties) {
        this.officeAttendanceRepository = officeAttendanceRepository;
        this.attendanceProperties = attendanceProperties;
    }

    public byte[] generateReport(int year, int month, String format) {
        validateYearMonth(year, month);

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<OfficeAttendance> records = officeAttendanceRepository.findByDateBetween(startDate, endDate)
                .stream()
                .sorted(Comparator.comparing(OfficeAttendance::getAttendanceDate))
                .collect(Collectors.toList());

        AttendanceMonthResponse summary = new AttendanceService(officeAttendanceRepository, attendanceProperties)
                .getMonthlyAttendance(year, month);

        if ("pdf".equalsIgnoreCase(format)) {
            return generatePdf(summary, records);
        }

        if ("xlsx".equalsIgnoreCase(format)) {
            return generateXlsx(summary, records);
        }

        throw new IllegalArgumentException("Formato no soportado. Usa xlsx o pdf");
    }

    private byte[] generateXlsx(AttendanceMonthResponse summary, List<OfficeAttendance> records) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Asistencia");

            int rowIndex = 0;
            Row header = sheet.createRow(rowIndex++);
            header.createCell(0).setCellValue("Mes");
            header.createCell(1).setCellValue("Año");
            header.createCell(2).setCellValue("Objetivo");
            header.createCell(3).setCellValue("Días asistidos");
            header.createCell(4).setCellValue("Días restantes");
            header.createCell(5).setCellValue("Porcentaje");

            Row row1 = sheet.createRow(rowIndex++);
            row1.createCell(0).setCellValue(summary.getMonth());
            row1.createCell(1).setCellValue(summary.getYear());
            row1.createCell(2).setCellValue(summary.getGoal());
            row1.createCell(3).setCellValue(summary.getAttendedDays());
            row1.createCell(4).setCellValue(summary.getRemainingDays());
            row1.createCell(5).setCellValue(summary.getPercentage());

            Row datesHeader = sheet.createRow(rowIndex++);
            datesHeader.createCell(0).setCellValue("Lista de fechas");

            for (int i = 0; i < records.size(); i++) {
                Row dateRow = sheet.createRow(rowIndex++);
                dateRow.createCell(0).setCellValue(records.get(i).getAttendanceDate().toString());
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error al generar el archivo Excel", e);
        }
    }

    private byte[] generatePdf(AttendanceMonthResponse summary, List<OfficeAttendance> records) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph("REPORTE DE ASISTENCIA A OFICINA", titleFont);
            document.add(title);

            document.add(new Paragraph(" ", normalFont));
            document.add(new Paragraph("Mes: " + summary.getMonth() + "/" + summary.getYear(), normalFont));
            document.add(new Paragraph("Objetivo mensual: " + summary.getGoal() + " días", normalFont));
            document.add(new Paragraph("Días asistidos: " + summary.getAttendedDays(), normalFont));
            document.add(new Paragraph("Días restantes: " + summary.getRemainingDays(), normalFont));
            document.add(new Paragraph("Porcentaje de cumplimiento: " + String.format("%.2f%%", summary.getPercentage()), normalFont));

            document.add(new Paragraph(" ", normalFont));
            document.add(new Paragraph("DÍAS DE ASISTENCIA", subtitleFont));

            for (OfficeAttendance record : records) {
                document.add(new Paragraph(record.getAttendanceDate().toString(), normalFont));
            }

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error al generar el archivo PDF", e);
        }
    }

    private void validateYearMonth(int year, int month) {
        if (year < 1 || month < 1 || month > 12) {
            throw new IllegalArgumentException("Parámetros de año y mes inválidos");
        }
    }
}
