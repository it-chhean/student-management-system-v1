package com.kh.rupp_dev.studentmanagement.service;

import jakarta.mail.MessagingException;

public interface EmailService {

	void sendVerificationEmail(String email, String verificationToken);

	void sendOtpResetPassword(String email , String otp) throws MessagingException;

}
