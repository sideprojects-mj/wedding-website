package com.example.weddingSite;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Rsvp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String guestName;

    private String email;

    private Boolean attending;

    private Boolean responded = false;

    private Boolean invitedToRehearsalDinner = false;

    private Boolean rehearsalDinnerAttending;

    private Boolean rehearsalDinnerResponded = false;

    @Enumerated(EnumType.STRING)
    private MealChoice mealChoice;

    private String message;

    private LocalDateTime submittedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "party_id")
    private RsvpParty party;

    public Long getId() {
        return id;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getAttending() {
        return attending;
    }

    public void setAttending(Boolean attending) {
        this.attending = attending;
    }

    public Boolean getResponded() {
        return responded;
    }

    public void setResponded(Boolean responded) {
        this.responded = responded;
    }

    public Boolean getInvitedToRehearsalDinner() {
        return invitedToRehearsalDinner;
    }

    public void setInvitedToRehearsalDinner(Boolean invitedToRehearsalDinner) {
        this.invitedToRehearsalDinner = invitedToRehearsalDinner;
    }

    public Boolean getRehearsalDinnerAttending() {
        return rehearsalDinnerAttending;
    }

    public void setRehearsalDinnerAttending(Boolean rehearsalDinnerAttending) {
        this.rehearsalDinnerAttending = rehearsalDinnerAttending;
    }

    public Boolean getRehearsalDinnerResponded() {
        return rehearsalDinnerResponded;
    }

    public void setRehearsalDinnerResponded(Boolean rehearsalDinnerResponded) {
        this.rehearsalDinnerResponded = rehearsalDinnerResponded;
    }

    public MealChoice getMealChoice() {
        return mealChoice;
    }

    public void setMealChoice(MealChoice mealChoice) {
        this.mealChoice = mealChoice;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public RsvpParty getParty() {
        return party;
    }

    public void setParty(RsvpParty party) {
        this.party = party;
    }
}
