package web.vn.ovi.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import web.vn.ovi.entity.dto.ServiceDto;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceDto, Integer>,JpaSpecificationExecutor<ServiceDto>{
    public List<ServiceDto> findAll();
    public ServiceDto save(ServiceDto serviceDto);
}
