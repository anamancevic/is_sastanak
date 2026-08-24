package com.sastanak.is_sastanak.notifications.model;

import com.sastanak.is_sastanak.users.model.Korisnik;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "obavestenje")
@Getter
@Setter
public class Obavestenje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    @ManyToOne
    @JoinColumn(name = "izazvao_korisnik_id")
    private Korisnik izazvao;

    @Column(name = "sadrzaj", nullable = false, length = 500)
    private String sadrzaj;

    @Column(name = "datum_vreme", nullable = false)
    private LocalDateTime datumVreme;

    @Column(name = "procitano", nullable = false)
    private Boolean procitano = false;
}
