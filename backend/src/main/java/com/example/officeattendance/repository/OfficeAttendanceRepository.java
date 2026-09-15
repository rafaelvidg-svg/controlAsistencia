package com.example.officeattendance.repository;

import com.example.officeattendance.entity.OfficeAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfficeAttendanceRepository extends JpaRepository<OfficeAttendance, Long> {

    Optional<OfficeAttendance> findByAttendanceDate(LocalDate attendanceDate);

    @Query("SELECT oa FROM OfficeAttendance oa WHERE oa.attendanceDate BETWEEN :startDate AND :endDate ORDER BY oa.attendanceDate ASC")
    List<OfficeAttendance> findByDateBetween(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(oa) FROM OfficeAttendance oa WHERE oa.attendanceDate BETWEEN :startDate AND :endDate")
    long countByDateBetween(@Param("startDate") LocalDate startDate,
                            @Param("endDate") LocalDate endDate);
}
