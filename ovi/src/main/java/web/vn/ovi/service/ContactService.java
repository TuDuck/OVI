package web.vn.ovi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import web.vn.ovi.entity.ContactMessage;
import web.vn.ovi.repository.ContactRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private JavaMailSender mailSender;

    public ContactMessage save(ContactMessage contact) {
        contact.setStatus(0);
        sendConfirmationEmail(contact);
        return contactRepository.save(contact);
    }
    public List<ContactMessage> findAll() {
        return contactRepository.findAll();
    }
    public ContactMessage findById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy contact id = " + id));
    }
    public ContactMessage update(Long id, ContactMessage dto) {
        ContactMessage existing = findById(id);
        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setMessage(dto.getMessage());
        existing.setStatus(dto.getStatus());
        return contactRepository.save(existing);
    }
    public Page<ContactMessage> search(Integer status, String name, int page, int size) {
        Specification<ContactMessage> spec = (root, query, cb) -> cb.conjunction();

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (name != null && !name.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return contactRepository.findAll(spec, pageable);
    }
    public void delete(Long id) {
        contactRepository.deleteById(id);
    }

    private void sendConfirmationEmail(ContactMessage contact) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(contact.getEmail());
        message.setSubject("Cảm ơn bạn đã liên hệ với chúng tôi");
        message.setText(
                "Xin chào " + contact.getName() + ",\n\n" +
                        "Chúng tôi đã nhận được thông tin của bạn:\n\n" +
                        "Nội dung: " + contact.getMessage() + "\n\n" +
                        "Chúng tôi sẽ phản hồi sớm nhất có thể.\n\n" +
                        "Trân trọng,\nĐội ngũ hỗ trợ công ty OVI."
        );

        mailSender.send(message);
    }
}
