package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.entity.User;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.kh.rupp_dev.studentmanagement.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @NullMarked
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = this.findUserEntity(email);

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getAuthorities())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isStatus())
                .build();
    }

    public User findUserEntity(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + email));
    }

}
