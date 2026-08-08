package com.sastanak.is_sastanak.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "organizaciona_celina")
@Getter
@Setter

public class OrganizacionaCelina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "naziv", nullable = false, length = 150)
    private String naziv;
}
