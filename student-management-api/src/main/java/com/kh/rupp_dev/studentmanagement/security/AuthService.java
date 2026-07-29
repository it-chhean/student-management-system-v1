package com.kh.rupp_dev.studentmanagement.security;

import com.kh.rupp_dev.studentmanagement.dto.request.*;
import com.kh.rupp_dev.studentmanagement.dto.response.SendOtpRespone;
import com.kh.rupp_dev.studentmanagement.dto.response.UserResponse;
import com.kh.rupp_dev.studentmanagement.dto.response.VerifyOtpResponse;
import com.kh.rupp_dev.studentmanagement.entity.User;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.support.SimpleTriggerContext;

public interface AuthService {

	/**
	 * Register new User with fullName , email and Password
	 * @return UserResponse
	 */
	UserResponse register(UserRequest request);

	/**
	 * Login account with email and password
	 * @return UserResponse
	 */
	UserResponse login(AuthRequest request);

	/**
	 * Delete user account with Long
	 */
	void delete(Integer id);

	/**
	 * Retrieve all user has been verified account with pagination
	 */
	Page<UserResponse> findAll(Pageable pageable);

	/**
	 * This method use for set foreign into weak entity set
	 * return Users Object but be care full make sure user is verfied
	 */
	User getUser(Integer id);

    /**
     * This method use to update Status of auth is avaiable or not.
     * */
	void updateStatus(Integer id , String status);

	/**
	 * This method use to find user has been authentication. For retrieve foreign key
	 * @return User object
	 */
	User getUserAuthenticated();

    /**
     * This me method is display our information.
     *  */
	UserResponse me();

    UserResponse changePassword(ChangePasswordRequest request) throws BadRequestException;

    UserResponse resetPassword(ResetPasswordRequest request);

    VerifyOtpResponse verifyOtp(VerifyOtpRequest request);

    SendOtpRespone sendResetOtp(SendOtpRequest request);

}
