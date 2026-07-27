package com.kh.rupp_dev.studentmanagement.security.impl;

import com.kh.rupp_dev.studentmanagement.constant.RoleName;
import com.kh.rupp_dev.studentmanagement.constant.Status;
import com.kh.rupp_dev.studentmanagement.dto.request.*;
import com.kh.rupp_dev.studentmanagement.dto.response.SendOtpRespone;
import com.kh.rupp_dev.studentmanagement.dto.response.UserResponse;
import com.kh.rupp_dev.studentmanagement.dto.response.VerifyOtpResponse;
import com.kh.rupp_dev.studentmanagement.entity.RefreshToken;
import com.kh.rupp_dev.studentmanagement.entity.Role;
import com.kh.rupp_dev.studentmanagement.entity.User;
import com.kh.rupp_dev.studentmanagement.exception.ResourceNotFoundException;
import com.kh.rupp_dev.studentmanagement.jwt.JwtService;
import com.kh.rupp_dev.studentmanagement.mapper.UserMapper;
import com.kh.rupp_dev.studentmanagement.otp.service.EmailService;
import com.kh.rupp_dev.studentmanagement.repository.RoleRepository;
import com.kh.rupp_dev.studentmanagement.repository.UserRepository;
import com.kh.rupp_dev.studentmanagement.security.AuthService;
import com.kh.rupp_dev.studentmanagement.service.RefreshTokenService;
import com.kh.rupp_dev.studentmanagement.utils.Util;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Set;

import static java.lang.System.currentTimeMillis;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final UserMapper userMapper;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final RoleRepository roleRepository;
	private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

	@Override
	@Transactional
	public UserResponse register(UserRequest request) {
		return userRepository.findByEmail(request.getEmail())
				.map(this::handleExistingUser)
				.orElseGet(() -> createNewUser(request));
	}

	@Override
	public UserResponse login(AuthRequest request) {
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

		if(!user.isStatus()) {
			log.info("User has been freeze with status: {}" , false);
			throw new RuntimeException("User has been freeze with status: " + user.isStatus());
		}

		Authentication authToken;
		try {
			authToken = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							request.getEmail(),
							request.getPassword()));
		} catch (JwtException | AuthenticationException ex) {
			user.setAttempt(user.getAttempt() + 1);
			if (user.getAttempt() >= 5) {
				user.setStatus(false);
				user.setLockTime(java.time.LocalDate.now());
			}
			userRepository.save(user);
			throw ex;
		}

		user.setAttempt(0);
		user.setLockTime(null);
		
		SecurityContextHolder.getContext().setAuthentication(authToken);
		User saved = userRepository.save(user);
		UserResponse response = toResponse(saved);
		response.setVerificationToken(jwtService.generateToken(user.getEmail()));
		return response;
	}

	private UserResponse handleExistingUser(User existingUser) {
		if (existingUser.isVerified()) {
			throw new IllegalStateException("User already exists and is verified");
		}
		String token = jwtService.generateToken(existingUser.getEmail());
		existingUser.setVerificationToken(token);
		userRepository.save(existingUser);
		return toResponse(existingUser);
	}

	private UserResponse createNewUser(UserRequest request) {
		User user = userMapper.toEntity(request);
		user.setStatus(true);
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		RefreshToken refresh = refreshTokenService.create();
		refresh.setUser(user);
		user.setRefreshToken(refresh);
		user.setRefreshToken(refresh);
		String token = jwtService.generateToken(user.getEmail());
		user.setVerificationToken(token);
		user.setVerified(false);

		Set<Role> role = Collections.singleton(roleRepository.findByNameAndStatus(request.getRole(), Status.ACTIVE.name())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with name: " + RoleName.ROLE_STAFF.name())
            )
        );

		user.setRoles(role);
		log.info("New user created: {}", user);
		User saved = userRepository.save(user);
		return toResponse(saved);
	}

	@Override
	public void delete(Integer id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
		log.info("Delete user with id: {}", id);
		userRepository.delete(user);
	}

	@Override
	public Page<UserResponse> findAll(Pageable pageable) {
		Page<User> users = userRepository.findAll(pageable);
		return users.map(this::toResponse);
	}

	@Override
	public User getUser(Integer id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
	}

	@Override
	public void updateStatus(Integer id, String status) {
		User user = this.findByOrThrow(id);
		user.setStatus(Boolean.parseBoolean(status));
		userRepository.save(user);
	}

	@Override
	public User getUserAuthenticated() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        return userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new UsernameNotFoundException("User not found with Email: " + authentication.getName()));
	}

	private UserResponse toResponse(User user) {
		UserResponse response = userMapper.toResponse(user);
		response.setRefreshToken(user.getRefreshToken().getToken());
		response.setRoles(user.getRoles());
		return response;
	}

	private User findByOrThrow(Integer id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
	}

	@Override
	public UserResponse me() {
		User user = this.getUserAuthenticated();
		return userMapper.toResponse(user);
	}

    @Override
    public UserResponse changePassword(ChangePasswordRequest request) throws BadRequestException {
        User user = this.getUserAuthenticated();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Password don't match");
        }

        String newPasswordBCrypt = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(newPasswordBCrypt);

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse resetPassword(ResetPasswordRequest request) {
        User user = this.getUserAuthenticated();
        validateOtp(user, request.getOtp());
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetOptExpireAt(0L);
        user.setResetOtp(null);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public VerifyOtpResponse verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with Email: " + email));

        validateOtp(user, otp);
        validationOtpExpire(user);

        return VerifyOtpResponse
                .builder()
                .message("Verify OTP 6 digit successfully.")
                .email(user.getEmail())
                .build();
    }

    @Override
    public SendOtpRespone sendResetOtp(SendOtpRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Email not found."));

        String otpCode = Util.generateOtp();
        user.setResetOtp(otpCode);
        long expireDate = System.currentTimeMillis() + (60 * 5 * 1000);
        user.setResetOptExpireAt(expireDate);
        emailService.sendOtpViaEmail(user.getEmail(), otpCode);
        User saved = userRepository.save(user);
        return SendOtpRespone
                .builder()
                .otp(saved.getResetOtp())
                .build();
    }

    private void validateOtp(User user, String otp) {
        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)) {
            throw new IllegalArgumentException("Otp doesn't match");
        }
    }

    private void validationOtpExpire(User user) {
        if (user.getResetOptExpireAt() < currentTimeMillis()) {
            throw new IllegalArgumentException("Otp is expired");
        }
    }

}
