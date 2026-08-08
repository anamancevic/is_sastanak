package com.sastanak.is_sastanak.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "uloga")
@Getter
@Setter

public class Uloga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "naziv", nullable = false, unique = true, length = 50)
    private String naziv;
}
