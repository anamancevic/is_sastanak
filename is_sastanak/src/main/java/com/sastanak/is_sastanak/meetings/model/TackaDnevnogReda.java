package com.sastanak.is_sastanak.meetings.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tacka_dnevnog_reda")
@Getter
@Setter

public class TackaDnevnogReda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "redni_broj", nullable = false)
    private Integer redniBroj;

    @Column(name = "sadrzaj", nullable = false, length = 500)
    private String sadrzaj;

    @ManyToOne
    @JoinColumn(name = "sastanak_id", nullable = false)
    private Sastanak sastanak;
}
