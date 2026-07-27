package com.kh.rupp_dev.studentmanagement.otp.config;

import org.springframework.data.redis.core.convert.Bucket;
import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class RateLimitConfig {
    private final ConcurrentMap<String, Bucket> sendBuckets = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, Bucket> receiveBuckets = new ConcurrentHashMap<>();
}
