package com.example.weddingSite;

import java.time.LocalDateTime;

public record BridalShowerRsvpDto(
        Long id,
        String guestName,
        String email,
        Boolean attending,
        Boolean responded,
        String message,
        LocalDateTime submittedAt
) {
    public static BridalShowerRsvpDto from(BridalShowerRsvp rsvp) {
        return new BridalShowerRsvpDto(
                rsvp.getId(),
                rsvp.getGuestName(),
                rsvp.getEmail(),
                rsvp.getAttending(),
                Boolean.TRUE.equals(rsvp.getResponded()) || Boolean.TRUE.equals(rsvp.getAttending()),
                rsvp.getMessage(),
                rsvp.getSubmittedAt()
        );
    }
}
