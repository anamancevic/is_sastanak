package com.sastanak.is_sastanak.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "korisnik_uloga")
@Getter
@Setter

public class KorisnikUloga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "korisnik_id", nullable = false)
    private Korisnik korisnik;

    @ManyToOne
    @JoinColumn(name = "uloga_id", nullable = false)
    private Uloga uloga;

    @ManyToOne
    @JoinColumn(name = "organizaciona_celina_id", nullable = false)
    private OrganizacionaCelina organizacionaCelina;

    @Enumerated(EnumType.STRING)
    @Column(name = "tip", nullable = false)
    private TipUloge tipUloge;

    @Column(name = "napomena", length = 255)
    private String napomena;

}
