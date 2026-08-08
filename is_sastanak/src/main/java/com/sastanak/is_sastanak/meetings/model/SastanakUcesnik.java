package com.sastanak.is_sastanak.meetings.model;

import com.sastanak.is_sastanak.users.model.Korisnik;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "sastanak_ucesnik")
@Getter
@Setter

public class SastanakUcesnik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "sastanak_id", nullable = false)
    private Sastanak sastanak;

    @ManyToOne
    @JoinColumn(name = "korisnik_id")
    private Korisnik korisnik;

    @Column(name = "planiran", nullable = false)
    private Boolean planiran = true;
}
