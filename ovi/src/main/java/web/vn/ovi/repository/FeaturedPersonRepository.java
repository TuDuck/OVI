package web.vn.ovi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.vn.ovi.entity.dto.FeaturedPersonDto;

import java.util.List;

@Repository
public interface FeaturedPersonRepository extends JpaRepository<FeaturedPersonDto, Integer> {
    public List<FeaturedPersonDto> findByType(String type);
    Page<FeaturedPersonDto> findAll(Specification<FeaturedPersonDto> spec, Pageable pageable);
}
