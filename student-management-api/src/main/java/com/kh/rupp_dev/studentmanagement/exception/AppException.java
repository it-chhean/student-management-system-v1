package com.kh.rupp_dev.studentmanagement.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class AppException extends RuntimeException {

    public final HttpStatus status;

    public AppException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

}
