package com.kh.rupp_dev.studentmanagement.security;

import com.kh.rupp_dev.studentmanagement.filter.JwtAuthenticationFilter;
import com.kh.rupp_dev.studentmanagement.security.handler.CustomLoginSuccessHandler;
import com.kh.rupp_dev.studentmanagement.security.handler.CustomLoginFailureHandler;
import com.kh.rupp_dev.studentmanagement.security.handler.CustomeAccessDeniedHandler;
import com.kh.rupp_dev.studentmanagement.security.handler.CustomeAuthenticationEntryPoint;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

	private final UserDetailsService userDetailsService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomeAccessDeniedHandler accessDeniedHandler;
	private final CustomeAuthenticationEntryPoint authenticationEntryPoint;
	private final CustomLoginFailureHandler loginFailureHandler;
	private final CustomLoginSuccessHandler loginSuccessHandler;

	private static final String[] PUBLIC_URLS = {
            "/auth/**", "/oauth2/**" , "/css/**", "/js/**",
            "/images/**", "/swagger-ui.html", "/swagger-ui/**",
            "/v3/api-docs", "/v3/api-docs/**", "/swagger-resources/**",
            "/webjars/**" , "/uploads/**"
    };

    @Value("${app.cors.allowed-origins}")
    private List<String> allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) {
		return http
				.csrf(AbstractHttpConfigurer::disable)
				.httpBasic(AbstractHttpConfigurer::disable)
				.formLogin(login -> {
					login.failureHandler(loginFailureHandler);
					login.successHandler(loginSuccessHandler);
					login.disable();
				})
				.cors(cors -> cors
                        .configurationSource(configurationSource())
                )
				.sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
				.authorizeHttpRequests(
						registry -> registry
								.requestMatchers(PUBLIC_URLS).permitAll()
								.requestMatchers("/api/v1/roles/**").hasRole("ADMIN")
								.requestMatchers("/api/v1/permissions/**").hasRole("ADMIN")
								.requestMatchers("/api/v1/users/**").hasRole("ADMIN")
								.requestMatchers("/api/v1/students/**").hasAnyRole("ADMIN", "STAFF")
								.requestMatchers("/api/v1/departments/**").hasAnyRole("ADMIN", "STAFF")
								.requestMatchers("/api/v1/courses/**").hasAnyRole("ADMIN", "STAFF")
								.requestMatchers("/api/v1/classes/**").hasAnyRole("ADMIN", "STAFF")
								.requestMatchers("/api/v1/subjects/**").hasAnyRole("ADMIN", "STAFF")
								.requestMatchers("/api/v1/semesters/**").hasAnyRole("ADMIN", "STAFF")
								.requestMatchers("/api/v1/scores/**").hasAnyRole("ADMIN", "STAFF")
								.anyRequest().authenticated())
				.authenticationProvider(authenticationProvider())
				.exceptionHandling(ex -> {
					ex.authenticationEntryPoint(authenticationEntryPoint);
					ex.accessDeniedHandler(accessDeniedHandler);
				})
				.authenticationProvider(authenticationProvider())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
		return config.getAuthenticationManager();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
		provider.setPasswordEncoder(passwordEncoder());
		return provider;
	}

	@Bean
	public CorsConfigurationSource configurationSource() {
		CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
		config.setAllowedHeaders(List.of("*"));
		config.setAllowedMethods(List.of("*"));
		config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**" , config);
		return source;
	}

}