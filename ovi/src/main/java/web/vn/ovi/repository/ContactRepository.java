package web.vn.ovi.repository;

import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import web.vn.ovi.entity.ContactMessage;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, Long>, JpaSpecificationExecutor<ContactMessage> {
    public List<ContactMessage> findAll();
    public ContactMessage save(ContactMessage contact);

}
