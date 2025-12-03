package web.vn.ovi.securiryConfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import web.vn.ovi.service.AdminUserService;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AdminUserService adminUserService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, AdminUserService adminUserService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.adminUserService = adminUserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(AbstractHttpConfigurer::disable).cors(cors -> cors.configurationSource(corsConfigurationSource())).authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // cho preflight
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
        ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class).build();
    }

    // ✅ Thêm bean AuthenticationManager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

//    // ✅ Thêm PasswordEncoder để mã hoá mật khẩu khi xác thực
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }


    // cho phép FE call tới API mà không bị chặn CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "https://ovigroup.vn",       // domain chính
                "https://www.ovigroup.vn",    // nếu có www
                "http://127.0.0.1:5500",   // FE local dev
                "http://127.0.0.1:8081",   // FE build chạy local
                "http://localhost:5500",
                "http://localhost:8081",
                "http://14.225.71.26:8000",
                "http://ovigroup.vn"
//                ,
//                "https://s3xblcp9-5500.asse.devtunnels.ms"
        ));
//        config.addAllowedMethod("*");
//        config.addAllowedHeader("*");
//        config.setAllowCredentials(true); // Nếu có dùng token/cookie

        config.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS")); // CORS preflight
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true); // credentials phải true nếu dùng cookie/token

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
