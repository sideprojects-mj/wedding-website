package com.example.weddingSite;

import java.util.List;

public record PartyDto(Long id, String partyName, List<RsvpDto> guests) {
    public static PartyDto from(RsvpParty party, List<Rsvp> guests) {
        return new PartyDto(
                party.getId(),
                party.getPartyName(),
                guests.stream().map(RsvpDto::from).toList()
        );
    }
}
