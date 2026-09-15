CREATE TABLE office_attendance (
    id BIGSERIAL PRIMARY KEY,
    attendance_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_office_attendance_date UNIQUE (attendance_date)
);

CREATE INDEX idx_office_attendance_date
    ON office_attendance(attendance_date);
