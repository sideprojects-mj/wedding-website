package com.example.weddingSite;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rsvps")
@CrossOrigin(origins = {
        "http://localhost:8080",
        "https://frontend-9965441404.us-central1.run.app",
})
public class RsvpController {

    private final RsvpRepo rsvpRepository;
    private final RsvpPartyRepo partyRepository;

    public RsvpController(RsvpRepo rsvpRepository, RsvpPartyRepo partyRepository) {
        this.rsvpRepository = rsvpRepository;
        this.partyRepository = partyRepository;
    }

    @PostMapping("createRsvp")
    public ResponseEntity<RsvpDto> createRsvp(@Valid @RequestBody RsvpRequest request) {
        Rsvp rsvp = new Rsvp();
        applyRsvpRequest(rsvp, request, false);

        return ResponseEntity.ok(RsvpDto.from(rsvpRepository.save(rsvp)));
    }

    @PostMapping("createParty")
    public ResponseEntity<PartyDto> createParty(@Valid @RequestBody PartyRequest request) {
        RsvpParty party = new RsvpParty();
        party.setPartyName(request.getPartyName());
        RsvpParty savedParty = partyRepository.save(party);

        Rsvp firstGuest = new Rsvp();
        firstGuest.setGuestName(request.getGuestName());
        firstGuest.setEmail(request.getEmail());
        firstGuest.setInvitedToRehearsalDinner(Boolean.TRUE.equals(request.getInvitedToRehearsalDinner()));
        firstGuest.setAttending(false);
        firstGuest.setResponded(false);
        firstGuest.setParty(savedParty);
        rsvpRepository.save(firstGuest);

        return ResponseEntity.ok(toPartyDto(savedParty));
    }

    @GetMapping("getAll")
    public List<RsvpDto> getAllRsvps() {
        return rsvpRepository.findAllByOrderByGuestNameAsc().stream().map(RsvpDto::from).toList();
    }

    @GetMapping("getParties")
    public List<PartyDto> getParties() {
        return partyRepository.findAll().stream().map(this::toPartyDto).toList();
    }

    @GetMapping("getRsvp")
    public RsvpLookupResponse getRsvp(@RequestParam String name) {
        return rsvpRepository.findFirstByGuestNameIgnoreCase(name)
                .map(rsvp -> {
                    RsvpParty party = rsvp.getParty();
                    PartyDto partyDto = party == null
                            ? new PartyDto(null, rsvp.getGuestName(), List.of(RsvpDto.from(rsvp)))
                            : toPartyDto(party);
                    return new RsvpLookupResponse(RsvpDto.from(rsvp), partyDto);
                })
                .orElseGet(() -> new RsvpLookupResponse(null, null));
    }

    @PutMapping("updateRsvp/{id}")
    public ResponseEntity<RsvpDto> updateRsvp(@PathVariable Long id, @Valid @RequestBody RsvpRequest request) {
        return rsvpRepository.findById(id)
                .map(rsvp -> {
                    applyRsvpRequest(rsvp, request, true);
                    return ResponseEntity.ok(RsvpDto.from(rsvpRepository.save(rsvp)));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("updateParty/{partyId}")
    public ResponseEntity<PartyDto> updateParty(@PathVariable Long partyId, @Valid @RequestBody PartyUpdateRequest request) {
        return partyRepository.findById(partyId)
                .map(party -> {
                    request.getGuests().forEach(member -> rsvpRepository.findById(member.getId()).ifPresent(rsvp -> {
                        if (rsvp.getParty() == null || !party.getId().equals(rsvp.getParty().getId())) {
                            return;
                        }

                        rsvp.setEmail(member.getEmail());
                        rsvp.setAttending(Boolean.TRUE.equals(member.getAttending()));
                        rsvp.setResponded(member.getAttending() != null);
                        rsvp.setMealChoice(member.getMealChoice());
                        if (Boolean.TRUE.equals(rsvp.getInvitedToRehearsalDinner())) {
                            rsvp.setRehearsalDinnerAttending(Boolean.TRUE.equals(member.getRehearsalDinnerAttending()));
                            rsvp.setRehearsalDinnerResponded(member.getRehearsalDinnerAttending() != null);
                        } else {
                            rsvp.setRehearsalDinnerAttending(null);
                            rsvp.setRehearsalDinnerResponded(false);
                        }
                        rsvp.setMessage(member.getMessage());
                        rsvp.setSubmittedAt(LocalDateTime.now());
                        rsvpRepository.save(rsvp);
                    }));

                    return ResponseEntity.ok(toPartyDto(party));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("guests/{id}/config")
    public ResponseEntity<RsvpDto> updateGuestConfig(
            @PathVariable Long id,
            @RequestBody GuestConfigRequest request
    ) {
        return rsvpRepository.findById(id)
                .map(rsvp -> {
                    boolean invited = Boolean.TRUE.equals(request.getInvitedToRehearsalDinner());
                    rsvp.setInvitedToRehearsalDinner(invited);
                    if (!invited) {
                        rsvp.setRehearsalDinnerAttending(null);
                        rsvp.setRehearsalDinnerResponded(false);
                    }
                    return ResponseEntity.ok(RsvpDto.from(rsvpRepository.save(rsvp)));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("parties/{partyId}/guests")
    public ResponseEntity<RsvpDto> addGuestToParty(
            @PathVariable Long partyId,
            @Valid @RequestBody RsvpRequest request
    ) {
        return partyRepository.findById(partyId)
                .map(party -> {
                    Rsvp rsvp = new Rsvp();
                    rsvp.setParty(party);
                    applyRsvpRequest(rsvp, request, false);
                    return ResponseEntity.ok(RsvpDto.from(rsvpRepository.save(rsvp)));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private void applyRsvpRequest(Rsvp rsvp, RsvpRequest request, boolean submitted) {
        rsvp.setGuestName(request.getGuestName());
        rsvp.setEmail(request.getEmail());
        rsvp.setAttending(Boolean.TRUE.equals(request.getAttending()));
        rsvp.setResponded(request.getAttending() != null);
        rsvp.setMealChoice(request.getMealChoice());
        if (request.getInvitedToRehearsalDinner() != null) {
            boolean invited = Boolean.TRUE.equals(request.getInvitedToRehearsalDinner());
            rsvp.setInvitedToRehearsalDinner(invited);
            if (!invited) {
                rsvp.setRehearsalDinnerAttending(null);
                rsvp.setRehearsalDinnerResponded(false);
            }
        }
        if (Boolean.TRUE.equals(rsvp.getInvitedToRehearsalDinner())) {
            rsvp.setRehearsalDinnerAttending(Boolean.TRUE.equals(request.getRehearsalDinnerAttending()));
            rsvp.setRehearsalDinnerResponded(request.getRehearsalDinnerAttending() != null);
        } else {
            rsvp.setRehearsalDinnerAttending(null);
            rsvp.setRehearsalDinnerResponded(false);
        }
        rsvp.setMessage(request.getMessage());

        if (request.getPartyId() != null) {
            partyRepository.findById(request.getPartyId()).ifPresent(rsvp::setParty);
        } else if (request.getPartyName() != null && !request.getPartyName().isBlank()) {
            RsvpParty party = new RsvpParty();
            party.setPartyName(request.getPartyName());
            rsvp.setParty(partyRepository.save(party));
        }

        if (submitted) {
            rsvp.setSubmittedAt(LocalDateTime.now());
        }
    }

    private PartyDto toPartyDto(RsvpParty party) {
        return PartyDto.from(party, rsvpRepository.findAllByPartyIdOrderByGuestNameAsc(party.getId()));
    }
}
