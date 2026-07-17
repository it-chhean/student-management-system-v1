package com.kh.rupp_dev.studentmanagement.dto.response;

import com.kh.rupp_dev.studentmanagement.entity.Role;
import jakarta.persistence.SecondaryTable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Integer id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private String bio;

    private boolean verified;

    private String verificationToken;

    private String refreshToken;

    private boolean status;

    private Set<Role> roles;

    private int attempt;

    private LocalDate lockTime;
}
