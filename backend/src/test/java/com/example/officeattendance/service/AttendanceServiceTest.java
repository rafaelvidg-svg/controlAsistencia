package com.example.officeattendance.service;

import com.example.officeattendance.config.AttendanceProperties;
import com.example.officeattendance.dto.AttendanceRequest;
import com.example.officeattendance.dto.AttendanceMonthResponse;
import com.example.officeattendance.entity.OfficeAttendance;
import com.example.officeattendance.exception.AttendanceAlreadyExistsException;
import com.example.officeattendance.repository.OfficeAttendanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

class AttendanceServiceTest {

    private OfficeAttendanceRepository officeAttendanceRepository;
    private AttendanceService attendanceService;

    @BeforeEach
    void setUp() {
        officeAttendanceRepository = Mockito.mock(OfficeAttendanceRepository.class);
        AttendanceProperties properties = new AttendanceProperties();
        properties.setMonthlyGoal(12);
        attendanceService = new AttendanceService(officeAttendanceRepository, properties);
    }

    @Test
    void saveAttendance_shouldReturnResponse() {
        AttendanceRequest request = new AttendanceRequest();
        request.setDate(LocalDate.of(2026, 9, 10));

        OfficeAttendance saved = new OfficeAttendance(LocalDate.of(2026, 9, 10));
        saved = new OfficeAttendance(LocalDate.of(2026, 9, 10));

        when(officeAttendanceRepository.findByAttendanceDate(LocalDate.of(2026, 9, 10)))
                .thenReturn(Optional.empty());

        when(officeAttendanceRepository.save(Mockito.any(OfficeAttendance.class)))
                .thenReturn(saved);

        var response = attendanceService.saveAttendance(request);

        assertEquals(LocalDate.of(2026, 9, 10), response.getDate());
    }

    @Test
    void saveAttendance_shouldThrowIfAlreadyExists() {
        AttendanceRequest request = new AttendanceRequest();
        request.setDate(LocalDate.of(2026, 9, 10));

        when(officeAttendanceRepository.findByAttendanceDate(LocalDate.of(2026, 9, 10)))
                .thenReturn(Optional.of(new OfficeAttendance(LocalDate.of(2026, 9, 10))));

        assertThrows(AttendanceAlreadyExistsException.class, () -> attendanceService.saveAttendance(request));
    }

    @Test
    void getMonthlyAttendance_shouldCalculateMetrics() {
        when(officeAttendanceRepository.findByDateBetween(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30)))
                .thenReturn(List.of(
                        new OfficeAttendance(LocalDate.of(2026, 9, 3)),
                        new OfficeAttendance(LocalDate.of(2026, 9, 8)),
                        new OfficeAttendance(LocalDate.of(2026, 9, 11))
                ));

        AttendanceMonthResponse response = attendanceService.getMonthlyAttendance(2026, 9);

        assertEquals(3, response.getAttendedDays());
        assertEquals(9, response.getRemainingDays());
        assertEquals(25.0, response.getPercentage());
    }
}
