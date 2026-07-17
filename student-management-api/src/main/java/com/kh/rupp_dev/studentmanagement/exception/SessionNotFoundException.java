package com.kh.rupp_dev.studentmanagement.exception;

import org.springframework.http.HttpStatus;

public class SessionNotFoundException extends AppException {
    public SessionNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
