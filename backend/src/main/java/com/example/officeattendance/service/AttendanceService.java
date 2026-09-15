package com.example.officeattendance.service;

import com.example.officeattendance.config.AttendanceProperties;
import com.example.officeattendance.dto.AttendanceMonthResponse;
import com.example.officeattendance.dto.AttendanceRequest;
import com.example.officeattendance.dto.AttendanceResponse;
import com.example.officeattendance.entity.OfficeAttendance;
import com.example.officeattendance.exception.AttendanceAlreadyExistsException;
import com.example.officeattendance.exception.AttendanceNotFoundException;
import com.example.officeattendance.repository.OfficeAttendanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final OfficeAttendanceRepository officeAttendanceRepository;
    private final AttendanceProperties attendanceProperties;

    public AttendanceService(OfficeAttendanceRepository officeAttendanceRepository, AttendanceProperties attendanceProperties) {
        this.officeAttendanceRepository = officeAttendanceRepository;
        this.attendanceProperties = attendanceProperties;
    }

    @Transactional
    public AttendanceResponse saveAttendance(AttendanceRequest request) {
        LocalDate attendanceDate = Optional.ofNullable(request.getDate())
                .orElseThrow(() -> new IllegalArgumentException("La fecha es obligatoria"));

        if (officeAttendanceRepository.findByAttendanceDate(attendanceDate).isPresent()) {
            throw new AttendanceAlreadyExistsException("Attendance already exists for this date");
        }

        OfficeAttendance saved = officeAttendanceRepository.save(new OfficeAttendance(attendanceDate));
        return new AttendanceResponse(saved.getId(), saved.getAttendanceDate());
    }

    @Transactional
    public void deleteAttendance(String date) {
        LocalDate attendanceDate = parseDate(date);

        OfficeAttendance existing = officeAttendanceRepository.findByAttendanceDate(attendanceDate)
                .orElseThrow(() -> new AttendanceNotFoundException("Attendance not found for date: " + date));

        officeAttendanceRepository.delete(existing);
    }

    @Transactional(readOnly = true)
    public AttendanceMonthResponse getMonthlyAttendance(int year, int month) {
        validateYearMonth(year, month);

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<OfficeAttendance> records = officeAttendanceRepository.findByDateBetween(startDate, endDate);

        List<LocalDate> dates = records.stream()
                .map(OfficeAttendance::getAttendanceDate)
                .sorted(Comparator.naturalOrder())
                .collect(Collectors.toList());

        long attendedDays = dates.size();
        long remainingDays = Math.max(0, attendanceProperties.getMonthlyGoal() - attendedDays);
        double percentage = (attendanceProperties.getMonthlyGoal() == 0)
                ? 0.0
                : (double) attendedDays / attendanceProperties.getMonthlyGoal() * 100;

        return new AttendanceMonthResponse(
                year,
                month,
                attendanceProperties.getMonthlyGoal(),
                attendedDays,
                remainingDays,
                percentage,
                dates
        );
    }

    private void validateYearMonth(int year, int month) {
        if (year < 1 || month < 1 || month > 12) {
            throw new IllegalArgumentException("Parámetros de año y mes inválidos");
        }
    }

    private LocalDate parseDate(String date) {
        try {
            return LocalDate.parse(date);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Formato de fecha inválido. Usa YYYY-MM-DD");
        }
    }
}
