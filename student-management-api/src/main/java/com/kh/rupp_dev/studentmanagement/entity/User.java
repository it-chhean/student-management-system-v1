package com.kh.rupp_dev.studentmanagement.entity;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;


import com.kh.rupp_dev.studentmanagement.audit.AuditListener;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "tbl_user")
@Data
@NoArgsConstructor
@EntityListeners(AuditListener.class)
public class User implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Integer id;

	@Column(name = "user_name", length = 25, nullable = false, unique = true)
	private String fullName;

	@Column(name = "email", length = 25, nullable = false, unique = true)
	private String email;

	@Column(name = "password_hash", nullable = false , length = 255)
	private String password;

	@Column(name = "phone_number" , length = 12)
	private String phoneNumber;

	@Column(name = "bio" , length = 255)
	private String bio;

	@Column(name = "verification_token")
	private String verificationToken;

	@Column(name = "verified", nullable = false)
	private boolean verified;

	@Column(name = "user_login_attempt")
	private int attempt;

	@Column(name = "user_account_lock_time")
	private LocalDate lockTime;

	@Column(name = "user_status" , nullable = false)
	private boolean status;

	@Column(name = "created_at", nullable = false, updatable = false)
	@CreationTimestamp
	private LocalDateTime createdAt;

	@OneToOne(mappedBy = "user" , cascade = CascadeType.ALL)
	private RefreshToken refreshToken;

    @ManyToMany(fetch =  FetchType.LAZY)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

	@OneToMany(mappedBy = "instructor" ,  cascade = CascadeType.ALL)
	private List<Course> courses;

	@Column(name = "totp_secret")
	private String totpSecret;

	@Column(name = "totp_enabled", nullable = false)
	private boolean totpEnabled = false;

	@Override
	@NullMarked
	public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles;
	}

    @Override
    public String getPassword() {
        return this.password;
    }

	@Override
	@NullMarked
	public String getUsername() {
		return email;
	}

}
