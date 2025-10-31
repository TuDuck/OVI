package web.vn.ovi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.vn.ovi.entity.dto.AdminUserDto;
import web.vn.ovi.repository.AdminUserRepository;
import web.vn.ovi.service.AdminUserService;
import web.vn.ovi.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AdminUserController {
//    private final AuthenticationManager authenticationManager;
//    private final JwtTokenUtil jwtTokenUtil;
    private final AdminUserRepository adminUserRepository;
    private final AdminUserService adminUserService;

    @Autowired
    private AuthService authService;

    public AdminUserController(
//            AuthenticationManager authenticationManager,
//                               JwtTokenUtil jwtTokenUtil,
                               AdminUserRepository adminUserRepository,
                               AdminUserService adminUserService
    ) {
//        this.authenticationManager = authenticationManager;
//        this.jwtTokenUtil = jwtTokenUtil;
        this.adminUserRepository = adminUserRepository;
        this.adminUserService = adminUserService;
    }

    // 🧩 API đăng nhập
    @PostMapping("/public/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        return ResponseEntity.ok(authService.login(username, password));
    }

    // 🧩 API đăng ký admin (nếu cần)
    @PostMapping("/public/register")
    public ResponseEntity<?> register(@RequestBody AdminUserDto userDto) {
        if (adminUserRepository.findByUsername(userDto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }
        adminUserRepository.save(userDto);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/public/delete")
    public ResponseEntity<String> deleteUser(@RequestParam int id){
        if(adminUserRepository.existsById(id)){
            adminUserRepository.deleteById(id);
        }
        return  ResponseEntity.ok("đã xóa:" + id);
    }

    // 🧩 API test token hợp lệ (dựa trên JwtTokenUtil)
    @GetMapping("/token")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authService.getUserInfoFromToken(token));
    }
}
