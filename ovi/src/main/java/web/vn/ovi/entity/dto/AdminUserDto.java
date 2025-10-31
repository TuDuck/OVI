package web.vn.ovi.entity.dto;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_user")
public class AdminUserDto {
    @Id
    @Column(name = "id")
    @NotNull
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(
            name = "admin_user_seq",
            sequenceName = "admin_user_seq",
            allocationSize = 1
    )
    private int id ;

    @Column(name = "username")
    @NotBlank(message = "Username không được để trống")
    private String username;

    @Column(name = "password")
    @NotBlank(message = "Password không được để trống")
    @Size(min = 8, message = "Password phải có ít nhất 8 ký tự")
    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Column(name = "role")
    private String role = "ADMIN";

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @NotNull
    public int getId() {
        return id;
    }

    public void setId(@NotNull int id) {
        this.id = id;
    }

    public @NotBlank(message = "Username không được để trống") String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank(message = "Username không được để trống") String username) {
        this.username = username;
    }

    public @NotBlank(message = "Password không được để trống") @Size(min = 8, message = "Password phải có ít nhất 8 ký tự") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password không được để trống") @Size(min = 8, message = "Password phải có ít nhất 8 ký tự") String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public @Email(message = "Email không hợp lệ") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Email không hợp lệ") String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
