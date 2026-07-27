package com.kh.rupp_dev.studentmanagement.otp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class OptStoreSerivce {

    private final StringRedisTemplate redisTemplate;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Value("${otp.expiry-seconds}")
    private long expirySeconds;

    @Value("${otp.max-attampts}")
    private int maxAttempt;

    @Value("${otp.resend-cooldown-seconds}")
    private long resendCoolDownSeconds;

    public OptStoreSerivce(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private String otpKey(String email) {
        return "opt:" + email.toLowerCase();
    }

    private String attemptsKey(String email) {
        return "opt:attempts:" + email.toLowerCase();
    }

    private String cooldownKey(String email) {
        return "opt:cooldown:" + email.toLowerCase();
    }

    public boolean canRequestOtp(String email) {
        return Boolean.FALSE.equals(redisTemplate.opsForHash().hasKey(attemptsKey(email), email));
    }

    public void storeOtp(String email, String otp) {
        String hash = encoder.encode(otp);
        assert hash != null;
        redisTemplate.opsForValue().set(otpKey(email), hash, Duration.ofSeconds(expirySeconds));
        redisTemplate.opsForValue().set(cooldownKey(email), hash, Duration.ofSeconds(resendCoolDownSeconds));
        redisTemplate.delete(attemptsKey(email));
    }

    public VerifyResult verifyOtp(String email, String condidate) {
        String key = otpKey(email);
        String hash = redisTemplate.opsForValue().get(key);

        if (hash == null) {
            return VerifyResult.failure("expired_or_not_found");
        }

        Long attempts = redisTemplate.opsForValue().increment(attemptsKey(email));
        redisTemplate.expire(attemptsKey(email), expirySeconds, TimeUnit.SECONDS);

        if (!encoder.matches(condidate, hash)) {
            return VerifyResult.failure("invalid_opt");
        }

        redisTemplate.delete(key);
        redisTemplate.delete(attemptsKey(email));

        return VerifyResult.success(email);
    }

    public record VerifyResult(boolean success, String reason) {
        static VerifyResult success(String email) {
            return new VerifyResult(true, null);
        }
        static VerifyResult failure(String reason) {
            return new VerifyResult(false, reason);
        }
    }
}
