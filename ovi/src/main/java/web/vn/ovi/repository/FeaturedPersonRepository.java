package web.vn.ovi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.vn.ovi.entity.dto.FeaturedPersonDto;

import java.util.List;

@Repository
public interface FeaturedPersonRepository extends JpaRepository<FeaturedPersonDto, Integer> {
    public List<FeaturedPersonDto> findAll();

}
