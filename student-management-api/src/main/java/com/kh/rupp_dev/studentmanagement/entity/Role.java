package com.kh.rupp_dev.studentmanagement.entity;

import java.util.*;

import com.kh.rupp_dev.studentmanagement.audit.AuditListener;
import jakarta.persistence.*;
import lombok.*;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;

@Entity
@Table(name = "tbl_role")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditListener.class)
public class Role implements GrantedAuthority {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "role_id")
	private Integer id;

	@Column(name = "role_name", unique = true, nullable = false)
	private String name;

	@Column(name = "description", nullable = false, length = 255)
	private String description;

	@Column(name = "status")
	private String status;

	@ManyToMany(mappedBy = "roles")
    private List<User> users;

	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(
            name = "role_permission",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
	private Set<Permission> permissions = new HashSet<>();

    @Override
    public @Nullable String getAuthority() {
        return "ROLE_" + this.name;
    }
}
