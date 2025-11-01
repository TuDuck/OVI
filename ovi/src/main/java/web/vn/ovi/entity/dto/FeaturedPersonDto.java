package web.vn.ovi.entity.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "featured_person")
@Getter
@Setter
public class FeaturedPersonDto {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(
            name = "featured_person_seq",
            sequenceName = "FEATURED_PERSON_SEQ",
            allocationSize = 1
    )
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "role")
    private String role;

    @Column(name = "description")
    private String description;

    @Column(name = "image_data")
    private String imageData;

    @Column(name = "type")
    private String type;

    @Column(name = "status")
    private int status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
