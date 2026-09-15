package com.example.officeattendance.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "Root", description = "Información general del servicio")
public class RootController {

    @GetMapping(value = {"/", ""})
    @Operation(summary = "Información del API", description = "Devuelve información básica del servicio y enlaces a Swagger/OpenAPI")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("name", "office-attendance");
        response.put("status", "ok");
        response.put("swagger", "/swagger-ui.html");
        response.put("apiDocs", "/v3/api-docs");
        response.put("basePath", "/api");
        return ResponseEntity.ok(response);
    }
}
