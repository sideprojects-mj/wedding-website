package com.example.weddingSite;

import jakarta.validation.Valid;
import java.util.List;

public class BridalShowerPartyUpdateRequest {
    @Valid
    private List<BridalShowerPartyMemberRsvpRequest> guests;

    public List<BridalShowerPartyMemberRsvpRequest> getGuests() {
        return guests == null ? List.of() : guests;
    }
}
