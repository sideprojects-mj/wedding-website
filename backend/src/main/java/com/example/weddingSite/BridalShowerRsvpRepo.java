package com.example.weddingSite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BridalShowerRsvpRepo extends JpaRepository<BridalShowerRsvp, Long> {
    Optional<BridalShowerRsvp> findFirstByGuestNameIgnoreCase(String guestName);

    List<BridalShowerRsvp> findAllByOrderByGuestNameAsc();
}
