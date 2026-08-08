package com.sastanak.is_sastanak.users.repository;

import com.sastanak.is_sastanak.users.model.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KorisnikRepository extends JpaRepository<Korisnik, Integer> {

    Optional<Korisnik> findByKorisnickoIme(String korisnickoIme);
}
