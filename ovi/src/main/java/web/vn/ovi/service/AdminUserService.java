package web.vn.ovi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import web.vn.ovi.entity.dto.AdminUserDto;
import web.vn.ovi.repository.AdminUserRepository;
import web.vn.ovi.utils.JwtTokenUtil;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminUserService implements UserDetailsService {

    @Autowired
    private  AdminUserRepository adminUserRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public  UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUserDto user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Dùng User (class có sẵn trong Spring Security)
        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole())  // ví dụ: ADMIN, USER
                .build();
    }

//    public Map<String, Object> login(String username, String password) {
//        // Xác thực username/password qua AuthenticationManager
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(username, password)
//        );
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        // Lấy thông tin UserDetails
//        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//
//        // Sinh token từ UserDetails (đúng kiểu của bạn)
//        String token = jwtTokenUtil.generateToken(userDetails);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("token", token);
//        response.put("username", userDetails.getUsername());
//        response.put("roles", userDetails.getAuthorities());
//        return response;
//    }
}
