package com.sastanak.is_sastanak.users.repository;

import com.sastanak.is_sastanak.users.model.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface KorisnikRepository extends JpaRepository<Korisnik, Integer> {

    Optional<Korisnik> findByKorisnickoIme(String korisnickoIme);

    @Query("SELECT DISTINCT ku.korisnik FROM KorisnikUloga ku WHERE ku.uloga.naziv = :naziv")
    List<Korisnik> findByNazivUloge(String naziv);

    List<Korisnik> findByOrganizacionaCelinaId(Integer celinaId);
}
