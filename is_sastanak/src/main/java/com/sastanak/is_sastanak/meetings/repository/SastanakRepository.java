package com.sastanak.is_sastanak.meetings.repository;

import com.sastanak.is_sastanak.meetings.model.Sastanak;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SastanakRepository extends JpaRepository<Sastanak, Integer> {
    List<Sastanak> findByOrganizacionaCelinaId(Integer celinaId);
}
