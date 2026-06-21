package com.example.weddingSite;

import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/rsvps")
@CrossOrigin(origins = {
        "http://localhost:8080",
        "https://frontend-9965441404.us-central1.run.app",
        "https://thejosephswedding.xyz",
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


    @PostMapping(value = "importCsv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CsvImportResult> importCsv(@RequestParam("file") MultipartFile file) throws IOException {
        String csv = new String(file.getBytes(), StandardCharsets.UTF_8);
        List<List<String>> rows = parseCsv(csv);
        List<String> errors = new ArrayList<>();

        if (rows.isEmpty()) {
            return ResponseEntity.ok(new CsvImportResult(0, 0, 0, List.of("CSV file is empty.")));
        }

        Map<String, Integer> headers = headerMap(rows.get(0));
        if (!headers.containsKey("partyname") || !headers.containsKey("guestname")) {
            return ResponseEntity.ok(new CsvImportResult(
                    0,
                    0,
                    0,
                    List.of("CSV must include partyName and guestName columns.")
            ));
        }

        int partiesCreated = 0;
        int guestsCreated = 0;
        int guestsUpdated = 0;

        for (int rowIndex = 1; rowIndex < rows.size(); rowIndex += 1) {
            List<String> row = rows.get(rowIndex);
            if (isBlankRow(row)) {
                continue;
            }

            String partyName = csvValue(row, headers, "partyname");
            String guestName = csvValue(row, headers, "guestname");
            String email = csvValue(row, headers, "email");
            boolean invitedToRehearsalDinner = parseBoolean(csvValue(row, headers, "invitedtorehearsaldinner"));

            if (partyName.isBlank() || guestName.isBlank()) {
                errors.add("Row " + (rowIndex + 1) + ": partyName and guestName are required.");
                continue;
            }

            RsvpParty party = partyRepository.findFirstByPartyNameIgnoreCase(partyName).orElse(null);
            if (party == null) {
                party = new RsvpParty();
                party.setPartyName(partyName);
                party = partyRepository.save(party);
                partiesCreated += 1;
            }

            Rsvp rsvp = rsvpRepository.findFirstByGuestNameIgnoreCase(guestName).orElse(null);
            boolean createdGuest = false;
            if (rsvp == null) {
                rsvp = new Rsvp();
                rsvp.setGuestName(guestName);
                rsvp.setAttending(false);
                rsvp.setResponded(false);
                createdGuest = true;
            }

            rsvp.setParty(party);
            rsvp.setEmail(email.isBlank() ? null : email);
            rsvp.setInvitedToRehearsalDinner(invitedToRehearsalDinner);
            if (!invitedToRehearsalDinner) {
                rsvp.setRehearsalDinnerAttending(null);
                rsvp.setRehearsalDinnerResponded(false);
            }
            rsvpRepository.save(rsvp);

            if (createdGuest) {
                guestsCreated += 1;
            } else {
                guestsUpdated += 1;
            }
        }

        return ResponseEntity.ok(new CsvImportResult(partiesCreated, guestsCreated, guestsUpdated, errors));
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
        String normalizedName = name == null ? "" : name.trim();
        return rsvpRepository.findFirstByGuestNameIgnoreCase(normalizedName)
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


    private List<List<String>> parseCsv(String csv) {
        List<List<String>> rows = new ArrayList<>();
        List<String> row = new ArrayList<>();
        StringBuilder value = new StringBuilder();
        boolean inQuotes = false;

        for (int index = 0; index < csv.length(); index += 1) {
            char current = csv.charAt(index);
            if (current == '"') {
                if (inQuotes && index + 1 < csv.length() && csv.charAt(index + 1) == '"') {
                    value.append('"');
                    index += 1;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (current == ',' && !inQuotes) {
                row.add(value.toString().trim());
                value.setLength(0);
            } else if ((current == '\n' || current == '\r') && !inQuotes) {
                if (current == '\r' && index + 1 < csv.length() && csv.charAt(index + 1) == '\n') {
                    index += 1;
                }
                row.add(value.toString().trim());
                rows.add(row);
                row = new ArrayList<>();
                value.setLength(0);
            } else {
                value.append(current);
            }
        }

        if (value.length() > 0 || !row.isEmpty()) {
            row.add(value.toString().trim());
            rows.add(row);
        }
        return rows;
    }
    private Map<String, Integer> headerMap(List<String> headerRow) {
        Map<String, Integer> headers = new HashMap<>();
        for (int index = 0; index < headerRow.size(); index += 1) {
            headers.put(normalizeHeader(headerRow.get(index)), index);
        }
        return headers;
    }

    private String normalizeHeader(String value) {
        return value == null ? "" : value.trim().replace("_", "").replace(" ", "").toLowerCase(Locale.ROOT);
    }

    private String csvValue(List<String> row, Map<String, Integer> headers, String header) {
        Integer index = headers.get(header);
        if (index == null || index >= row.size()) {
            return "";
        }
        return row.get(index).trim();
    }

    private boolean parseBoolean(String value) {
        String normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        return normalized.equals("true") || normalized.equals("yes") || normalized.equals("y") || normalized.equals("1");
    }

    private boolean isBlankRow(List<String> row) {
        return row.stream().allMatch(value -> value == null || value.isBlank());
    }

    private PartyDto toPartyDto(RsvpParty party) {
        return PartyDto.from(party, rsvpRepository.findAllByPartyIdOrderByGuestNameAsc(party.getId()));
    }
}
