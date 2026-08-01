package com.kh.rupp_dev.studentmanagement.service;

import com.kh.rupp_dev.studentmanagement.entity.User;
import org.jspecify.annotations.NullMarked;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.kh.rupp_dev.studentmanagement.repository.UserRepository;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public AppUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @NullMarked
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = this.findUserEntity(email);
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .authorities(user.getAuthorities())
                .build();
    }

    public User findUserEntity(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

}
