package com.example.weddingSite;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class PartyUpdateRequest {

    @Valid
    @NotEmpty
    private List<PartyMemberRsvpRequest> guests;

    public List<PartyMemberRsvpRequest> getGuests() {
        return guests;
    }
}
