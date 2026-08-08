package com.sastanak.is_sastanak.meetings.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "kategorija_sastanka")
@Getter
@Setter

public class KategorijaSastanka {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "naziv", nullable = false, unique = true, length = 80)
    private String naziv;
}
