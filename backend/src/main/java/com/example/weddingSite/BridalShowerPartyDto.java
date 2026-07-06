package com.example.weddingSite;

import java.util.List;

public record BridalShowerPartyDto(Long id, String partyName, List<BridalShowerRsvpDto> guests) {
    public static BridalShowerPartyDto from(BridalShowerParty party, List<BridalShowerRsvp> guests) {
        return new BridalShowerPartyDto(
                party.getId(),
                party.getPartyName(),
                guests.stream().map(BridalShowerRsvpDto::from).toList()
        );
    }
}
