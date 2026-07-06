package com.example.weddingSite;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class BridalShowerPartyRequest {
    @NotBlank
    private String partyName;

    @NotBlank
    private String guestName;

    @Email
    private String email;

    public String getPartyName() {
        return partyName;
    }

    public String getGuestName() {
        return guestName;
    }

    public String getEmail() {
        return email;
    }
}
