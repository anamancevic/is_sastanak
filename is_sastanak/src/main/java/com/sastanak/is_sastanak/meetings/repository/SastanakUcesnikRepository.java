package com.sastanak.is_sastanak.meetings.repository;

import com.sastanak.is_sastanak.meetings.model.SastanakUcesnik;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SastanakUcesnikRepository extends JpaRepository<SastanakUcesnik, Integer> {
    List<SastanakUcesnik> findBySastanakId(Integer sastanakId);
}
