package com.example.weddingSite;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class BridalShowerRsvpRequest {

    @NotBlank
    private String guestName;

    @Email
    private String email;

    private Boolean attending;

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

    public String getMessage() {
        return message;
    }
}
