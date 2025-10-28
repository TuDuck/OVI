package web.vn.ovi.dto.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ContactDto{
    @Id
    @Column(name = "contact_id")
    private String contactId;
}
