package com.example.officeattendance.controller;

import com.example.officeattendance.dto.AttendanceRequest;
import com.example.officeattendance.dto.AttendanceResponse;
import com.example.officeattendance.entity.OfficeAttendance;
import com.example.officeattendance.service.AttendanceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AttendanceController.class, RootController.class})
class AttendanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AttendanceService attendanceService;

    @Test
    void createAttendance_shouldReturnCreated() throws Exception {
        AttendanceRequest request = new AttendanceRequest();
        request.setDate(LocalDate.of(2026, 9, 10));

        AttendanceResponse response = new AttendanceResponse(1L, LocalDate.of(2026, 9, 10));
        when(attendanceService.saveAttendance(any(AttendanceRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/attendance")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.date").value("2026-09-10"));
    }

    @Test
    void getMonthlyAttendance_shouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/attendance")
                        .param("year", "2026")
                        .param("month", "9"))
                .andExpect(status().isOk());

        Mockito.verify(attendanceService).getMonthlyAttendance(2026, 9);
    }

    @Test
    void rootEndpoint_shouldReturnApiInfo() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("office-attendance"))
                .andExpect(jsonPath("$.status").value("ok"));
    }
}
