package web.vn.ovi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import web.vn.ovi.entity.dto.CompanyProfileDto;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfileDto, Long> {
}
