package com.kh.rupp_dev.studentmanagement.controller;

import com.kh.rupp_dev.studentmanagement.dto.request.*;
import com.kh.rupp_dev.studentmanagement.dto.response.UserResponse;
import com.kh.rupp_dev.studentmanagement.payload.MultipleResponse;
import com.kh.rupp_dev.studentmanagement.payload.SingleResponse;
import com.kh.rupp_dev.studentmanagement.security.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/users")
@RequiredArgsConstructor
public class UserController {

	private final AuthService authService;

	@Operation(summary = "Delete user account with Long.")
	@DeleteMapping("/{id}")
	public ResponseEntity<SingleResponse<Void>> delete(@PathVariable Integer id) {
		authService.delete(id);
		return ResponseEntity.ok(SingleResponse.success("Delete account successfully.", null));
	}

	@Operation(summary = "Retrieve all user with verify email.")
	@GetMapping
	public ResponseEntity<MultipleResponse<UserResponse>> getAll(PaginationRequest request) {
		Page<UserResponse> responses = authService.findAll(request.toPageable());
		return ResponseEntity.ok(MultipleResponse.success("Retrieve all user with pagination.", responses));
	}

	@GetMapping("/is-authenticated")
	public boolean isAuthenticated(
			@CurrentSecurityContext(expression = "authentication") Authentication authentication) {
		return authentication.isAuthenticated();
	}

	@PutMapping("/update-status/{id}")
	public ResponseEntity<SingleResponse<Void>> updateStatus(@PathVariable Integer id, @RequestParam String status) {
		authService.updateStatus(id, status);
		return ResponseEntity.ok(SingleResponse.success("Update status successfully.", null));
	}

	@GetMapping("/me")
	public ResponseEntity<SingleResponse<UserResponse>> me() {
		UserResponse response = authService.me();
		return ResponseEntity.ok().body(SingleResponse.success("Successfully to retrieve infomation user." , response));
	}

}
