package com.sastanak.is_sastanak.meetings.model;

import com.sastanak.is_sastanak.users.model.Korisnik;
import com.sastanak.is_sastanak.users.model.OrganizacionaCelina;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sastanak")
@Getter
@Setter

public class Sastanak {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "tema", nullable = false, length = 200)
    private String tema;

    @Column(name = "datum_odrzavanja", nullable = false)
    private LocalDateTime datumOdrzavanja;

    @Column(name = "prostorija", length = 100)
    private String prostorija;

    @Column(name = "obrazlozenje", length = 500)
    private String obrazlozenje;

    @Column(name = "zakljucak", columnDefinition = "TEXT")
    private String zakljucak;

    @Column(name = "akt_delovodni_broj", length = 50)
    private String aktDelovodniBroj;

    @Column(name = "akt_datum")
    private LocalDate aktDatum;

    @Column(name = "akt_organizacija", length = 150)
    private String aktOrganizacija;

    @Column(name = "dan_odrzavanja", length = 50)
    private String danOdrzavanja;

    @Enumerated(EnumType.STRING)
    @Column(name = "tip", nullable = false)
    private TipSastanka tip;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusSastanka status;

    @Enumerated(EnumType.STRING)
    @Column(name = "ucestalost")
    private Ucestalost ucestalost;

    @ManyToOne
    @JoinColumn(name = "kategorija_id", nullable = false)
    private KategorijaSastanka kategorija;

    @ManyToOne
    @JoinColumn(name = "rukovodilac_id", nullable = false)
    private Korisnik rukovodilac;

    @ManyToOne
    @JoinColumn(name = "zapisnicar_id")
    private Korisnik zapisnicar;

    @ManyToOne
    @JoinColumn(name = "organizaciona_celina_id", nullable = false)
    private OrganizacionaCelina organizacionaCelina;

}
