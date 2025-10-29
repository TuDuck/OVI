package web.vn.ovi.service;


import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import web.vn.ovi.utils.JwtTokenUtil;


import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public Map<String, Object> login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenUtil.generateToken((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", username);
        return response;
    }

    // ✅ Hàm kiểm tra và lấy thông tin từ token
    public Map<String, Object> getUserInfoFromToken(String token) {
        Map<String, Object> info = new HashMap<>();

        try {
            // Bỏ prefix "Bearer " nếu có
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Giải mã token để lấy claims
            Claims claims = jwtTokenUtil.extractAllClaims(token);

            info.put("username", claims.getSubject());
            info.put("issuedAt", claims.getIssuedAt());
            info.put("claims", claims);

        } catch (Exception e) {
            info.put("error", "Token không hợp lệ hoặc đã hết hạn: " + e.getMessage());
        }

        return info;
    }
}
