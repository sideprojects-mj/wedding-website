package com.example.weddingSite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BridalShowerPartyRepo extends JpaRepository<BridalShowerParty, Long> {
    Optional<BridalShowerParty> findFirstByPartyNameIgnoreCase(String partyName);
}
