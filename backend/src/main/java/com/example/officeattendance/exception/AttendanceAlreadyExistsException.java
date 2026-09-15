package com.example.officeattendance.exception;

public class AttendanceAlreadyExistsException extends RuntimeException {

    public AttendanceAlreadyExistsException(String message) {
        super(message);
    }
}
