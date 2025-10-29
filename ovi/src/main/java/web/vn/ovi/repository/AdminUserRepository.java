package web.vn.ovi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.vn.ovi.entity.dto.AdminUserDto;

import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUserDto,Long> {
    Optional<AdminUserDto> findByUsername(String username);
}
