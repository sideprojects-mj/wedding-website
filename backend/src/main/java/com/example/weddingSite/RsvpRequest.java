package com.example.weddingSite;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RsvpRequest {

    @NotBlank
    private String guestName;

    @Email
    private String email;

    @NotNull
    private Boolean attending;

    @Min(0)
    private Integer partySize;

    private String mealChoice;

    private String message;

    public String getGuestName() {
        return guestName;
    }

    public String getEmail() {
        return email;
    }

    public Boolean getAttending() {
        return attending;
    }

    public Integer getPartySize() {
        return partySize;
    }

    public String getMealChoice() {
        return mealChoice;
    }

    public String getMessage() {
        return message;
    }
}