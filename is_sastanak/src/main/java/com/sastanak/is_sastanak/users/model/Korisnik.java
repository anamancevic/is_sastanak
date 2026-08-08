package com.sastanak.is_sastanak.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "korisnik")
@Getter
@Setter

public class Korisnik {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ime", nullable = false, length = 100)
    private String ime;

    @Column(name = "ime_oca", length = 100)
    private String imeOca;

    @Column(name = "prezime", nullable = false, length = 100)
    private String prezime;

    @Column(name = "jmbg", nullable = false, unique = true, length = 13)
    private String jmbg;

    @Column(name = "radno_mesto", length = 150)
    private String radnoMesto;

    @Column(name = "kontakt_telefon_posao", length = 30)
    private String kontaktTelefonPosao;

    @Column(name = "mobilni_telefon", length = 30)
    private String mobilniTelefon;

    @Column(name = "mejl", length = 150)
    private String mejl;

    @Column(name = "korisnicko_ime", nullable = false, unique = true, length = 50)
    private String korisnickoIme;

    @Column(name = "lozinka_hash", nullable = false, length = 255)
    private String lozinkaHash;

    @ManyToOne
    @JoinColumn(name = "organizaciona_celina_id", nullable = false)
    private OrganizacionaCelina organizacionaCelina;

}
