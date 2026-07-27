package com.kh.rupp_dev.studentmanagement.otp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }


    @Async("emailExecutor")
    public void sendOtpViaEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("Your verification code");
            helper.setText("Your code is " + otp + ". It expires in 5 minutes.\n\n"
                    + "If you didn't request this, ignore this email.");
            mailSender.send(message);
            log.info("Otp email dispatched to {}", maskEmail(toEmail));
        }catch (MessagingException ex) {
            log.info("Failed to send OTP email to {}", maskEmail(toEmail));
            throw new RuntimeException("Failed to send OTP email", ex);
        }
    }

    private String maskEmail(String email) {
        int at = email.indexOf('@');
        if (at <= 1) {
            return "***" + email.substring(at);
        }
        return email.charAt(0) + "***" + email.substring(at);
    }
}
