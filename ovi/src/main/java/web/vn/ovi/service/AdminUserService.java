package web.vn.ovi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import web.vn.ovi.entity.dto.AdminUserDto;
import web.vn.ovi.repository.AdminUserRepository;
import web.vn.ovi.utils.JwtTokenUtil;

@Service
public class AdminUserService implements UserDetailsService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUserDto user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Dùng User (class có sẵn trong Spring Security)
        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getRole())  // ví dụ: ADMIN, USER
                .build();
    }

}
