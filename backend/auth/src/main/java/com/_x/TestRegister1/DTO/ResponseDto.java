package com._x.TestRegister1.DTO;

import java.time.LocalDateTime;

public record ResponseDto(
        String status,
        String message,
        LocalDateTime timestamp
) {

    public ResponseDto(String status, String message) {
        this(status, message, LocalDateTime.now());
    }


}