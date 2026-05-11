package com.example.weddingSite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RsvpRepo extends JpaRepository<Rsvp, Long> {

    Optional<Rsvp> findByGuestName(String guestName);

}
