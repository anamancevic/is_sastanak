package com.sastanak.is_sastanak.meetings.repository;

import com.sastanak.is_sastanak.meetings.model.Prisustvo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrisustvoRepository extends JpaRepository<Prisustvo, Integer> {
    List<Prisustvo> findBySastanakId(Integer sastanakId);
}
