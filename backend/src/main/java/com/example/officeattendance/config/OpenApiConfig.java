package com.example.officeattendance.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI officeAttendanceOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Office Attendance API")
                        .description("API para registrar y consultar asistencias a oficina.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Office Attendance Team")
                                .email("support@example.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
