package com.example.weddingSite;

import java.time.LocalDateTime;

public record RsvpDto(
        Long id,
        String guestName,
        String email,
        Boolean attending,
        Boolean responded,
        Boolean invitedToRehearsalDinner,
        Boolean rehearsalDinnerAttending,
        Boolean rehearsalDinnerResponded,
        MealChoice mealChoice,
        String message,
        LocalDateTime submittedAt,
        Long partyId,
        String partyName
) {
    public static RsvpDto from(Rsvp rsvp) {
        RsvpParty party = rsvp.getParty();
        return new RsvpDto(
                rsvp.getId(),
                rsvp.getGuestName(),
                rsvp.getEmail(),
                rsvp.getAttending(),
                Boolean.TRUE.equals(rsvp.getResponded()) || Boolean.TRUE.equals(rsvp.getAttending()),
                Boolean.TRUE.equals(rsvp.getInvitedToRehearsalDinner()),
                rsvp.getRehearsalDinnerAttending(),
                Boolean.TRUE.equals(rsvp.getRehearsalDinnerResponded()) || Boolean.TRUE.equals(rsvp.getRehearsalDinnerAttending()),
                rsvp.getMealChoice(),
                rsvp.getMessage(),
                rsvp.getSubmittedAt(),
                party == null ? null : party.getId(),
                party == null ? null : party.getPartyName()
        );
    }
}
