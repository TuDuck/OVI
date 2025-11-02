package web.vn.ovi.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_message")
public class ContactDto {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(
            name = "contact_message_seq",
            sequenceName = "contact_message_seq",
            allocationSize = 1
    )
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Column(name = "id")
    @NotNull
    private Long id;

    @Column(name = "name")
    @NotBlank(message = "Tên không được để trống")
    private String name;

    @Column(name = "email", unique = true, nullable = false)
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @Column(name = "phone", unique = true, nullable = false)
    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @Column(name = "message")
    private String message;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "status")
    @Min(value = 0, message = "Trạng thái chỉ có thể là 0 hoặc 1")
    @Max(value = 1, message = "Trạng thái chỉ có thể là 0 hoặc 1")
    private int status = 0;

    // ===== Getter & Setter =====

    @NotNull
    public Long getId() {
        return id;
    }

    public void setId(@NotNull Long id) {
        this.id = id;
    }

    public @NotBlank(message = "Tên không được để trống") String getName() {
        return name;
    }

    public void setName(@NotBlank(message = "Tên không được để trống") String name) {
        this.name = name;
    }

    public @Email(message = "Email không hợp lệ") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Email không hợp lệ") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Số điện thoại không được để trống") String getPhone() {
        return phone;
    }

    public void setPhone(@NotBlank(message = "Số điện thoại không được để trống") String phone) {
        this.phone = phone;
    }

    public @NotBlank(message = "Nội dung tin nhắn không được để trống") String getMessage() {
        return message;
    }

    public void setMessage(@NotBlank(message = "Nội dung tin nhắn không được để trống") String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(@Min(value = 0, message = "Trạng thái chỉ có thể là 0 hoặc 1")
                          @Max(value = 1, message = "Trạng thái chỉ có thể là 0 hoặc 1") int status) {
        this.status = status;
    }
}
