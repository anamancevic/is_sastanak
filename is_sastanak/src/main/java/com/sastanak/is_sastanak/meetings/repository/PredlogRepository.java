package com.sastanak.is_sastanak.meetings.repository;

import com.sastanak.is_sastanak.meetings.model.Predlog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredlogRepository extends JpaRepository<Predlog, Integer> {
    List<Predlog> findByTackaId(Integer tackaId);

    List<Predlog> findBySastanakId(Integer sastanakId);
}
