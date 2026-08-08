package com.sastanak.is_sastanak.meetings.repository;

import com.sastanak.is_sastanak.meetings.model.TackaDnevnogReda;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TackaDnevnogRedaRepository extends JpaRepository<TackaDnevnogReda, Integer> {

    List<TackaDnevnogReda> findBySastanakId(Integer sastanakId);
}
