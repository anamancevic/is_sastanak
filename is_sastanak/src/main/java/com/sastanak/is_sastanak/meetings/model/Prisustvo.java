package com.sastanak.is_sastanak.meetings.model;

import com.sastanak.is_sastanak.users.model.Korisnik;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "prisustvo")
@Getter
@Setter

public class Prisustvo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusPrisustva status;

    @Column(name = "planiran", nullable = false)
    private Boolean planiran = true;

    @ManyToOne
    @JoinColumn(name = "sastanak_id", nullable = false)
    private Sastanak sastanak;

    @ManyToOne
    @JoinColumn(name = "korisnik_id")
    private Korisnik korisnik;
}
