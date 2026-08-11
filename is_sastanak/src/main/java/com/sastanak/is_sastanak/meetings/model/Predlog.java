package com.sastanak.is_sastanak.meetings.model;

import com.sastanak.is_sastanak.users.model.Korisnik;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "predlog")
@Getter
@Setter
public class Predlog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sastanak_id", nullable = false)
    private Sastanak sastanak;

    @ManyToOne
    @JoinColumn(name = "tacka_id", nullable = false)
    private TackaDnevnogReda tacka;

    @ManyToOne
    @JoinColumn(name = "korisnik_id")
    private Korisnik korisnik;

    @Column(name = "tekst", nullable = false)
    private String tekst;
}
