package com.example.weddingSite;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public class PartyMemberRsvpRequest {

    @NotNull
    private Long id;

    @Email
    private String email;

    private Boolean attending;

    private MealChoice mealChoice;

    private Boolean invitedToRehearsalDinner;

    private Boolean rehearsalDinnerAttending;

    private String message;

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public Boolean getAttending() {
        return attending;
    }

    public MealChoice getMealChoice() {
        return mealChoice;
    }

    public Boolean getInvitedToRehearsalDinner() {
        return invitedToRehearsalDinner;
    }

    public Boolean getRehearsalDinnerAttending() {
        return rehearsalDinnerAttending;
    }

    public String getMessage() {
        return message;
    }
}
