package web.vn.ovi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import web.vn.ovi.entity.dto.ServiceDetailDto;

import java.util.List;

@Repository
public interface ServiceDetailRepository extends JpaRepository<ServiceDetailDto, Long>, JpaSpecificationExecutor<ServiceDetailDto> {

    // Lấy tất cả service details theo serviceId
    List<ServiceDetailDto> findByServiceId(Long serviceId);

}
