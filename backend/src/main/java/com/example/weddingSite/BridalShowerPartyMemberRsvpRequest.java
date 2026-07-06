package com.example.weddingSite;

import jakarta.validation.constraints.NotNull;

public class BridalShowerPartyMemberRsvpRequest {
    @NotNull
    private Long id;

    private String guestName;

    private String email;

    private Boolean attending;

    private String message;

    public Long getId() {
        return id;
    }

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
