package com.example.weddingSite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RsvpPartyRepo extends JpaRepository<RsvpParty, Long> {

    Optional<RsvpParty> findFirstByPartyNameIgnoreCase(String partyName);
}
