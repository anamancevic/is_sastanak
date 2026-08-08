package com.sastanak.is_sastanak.users.repository;

import com.sastanak.is_sastanak.users.model.KorisnikUloga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KorisnikUlogaRepository extends JpaRepository<KorisnikUloga, Integer> {

    //lista korisnik_uloga sa istim korisnikId
    List<KorisnikUloga> findByKorisnikId(Integer korisnikId);
}
