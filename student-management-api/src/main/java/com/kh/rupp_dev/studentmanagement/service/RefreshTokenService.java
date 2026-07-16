package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.dto.response.RefreshTokenResponse;
import com.kh.rupp_dev.studentmanagement.entity.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {

    RefreshToken create();

    Optional<RefreshToken> findByToken(String refresh);

    RefreshTokenResponse verify(String token);

}
