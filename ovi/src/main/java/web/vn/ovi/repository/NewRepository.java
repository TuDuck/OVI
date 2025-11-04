package web.vn.ovi.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import web.vn.ovi.entity.dto.NewsDto;

import  java.util.List;
@Repository
public interface NewRepository extends JpaRepository<NewsDto,Long>,JpaSpecificationExecutor<NewsDto>{
       public List<NewsDto> findAll();
       public NewsDto save(NewsDto news);
}
