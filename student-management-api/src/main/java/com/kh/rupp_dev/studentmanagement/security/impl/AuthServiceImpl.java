package com.kh.rupp_dev.studentmanagement.security.impl;

import com.kh.rupp_dev.studentmanagement.dto.request.AuthRequest;
import com.kh.rupp_dev.studentmanagement.dto.request.UserRequest;
import com.kh.rupp_dev.studentmanagement.dto.response.UserResponse;
import com.kh.rupp_dev.studentmanagement.entity.RefreshToken;
import com.kh.rupp_dev.studentmanagement.entity.Role;
import com.kh.rupp_dev.studentmanagement.entity.User;
import com.kh.rupp_dev.studentmanagement.constant.RoleName;
import com.kh.rupp_dev.studentmanagement.constant.Status;
import com.kh.rupp_dev.studentmanagement.exception.ResourceNotFoundException;
import com.kh.rupp_dev.studentmanagement.jwt.JwtService;
import com.kh.rupp_dev.studentmanagement.repository.RoleRepository;
import com.kh.rupp_dev.studentmanagement.service.RefreshTokenService;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
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

import com.kh.rupp_dev.studentmanagement.mapper.UserMapper;
import com.kh.rupp_dev.studentmanagement.repository.UserRepository;
import com.kh.rupp_dev.studentmanagement.security.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

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

		Role role = roleRepository.findByNameAndStatus(request.getRole(), Status.ACTIVE.name())
						.orElseThrow(()-> new ResourceNotFoundException("Role not found with name: " + RoleName.ROLE_STAFF.name()));

		user.setRole(role);
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
		response.setRole(user.getRoles());
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

}
