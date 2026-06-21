package com.example.weddingSite;

import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
@RequestMapping("/api/bridal-shower/rsvps")
@CrossOrigin(origins = {
        "http://localhost:8080",
        "https://frontend-9965441404.us-central1.run.app",
        "https://thejosephswedding.xyz",
})
public class BridalShowerRsvpController {

    private final BridalShowerRsvpRepo rsvpRepository;

    public BridalShowerRsvpController(BridalShowerRsvpRepo rsvpRepository) {
        this.rsvpRepository = rsvpRepository;
    }

    @PostMapping("create")
    public ResponseEntity<BridalShowerRsvpDto> create(@Valid @RequestBody BridalShowerRsvpRequest request) {
        BridalShowerRsvp rsvp = new BridalShowerRsvp();
        applyRequest(rsvp, request, false);
        return ResponseEntity.ok(BridalShowerRsvpDto.from(rsvpRepository.save(rsvp)));
    }

    @PostMapping(value = "importCsv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BridalShowerCsvImportResult> importCsv(@RequestParam("file") MultipartFile file) throws IOException {
        String csv = new String(file.getBytes(), StandardCharsets.UTF_8);
        List<List<String>> rows = parseCsv(csv);
        List<String> errors = new ArrayList<>();

        if (rows.isEmpty()) {
            return ResponseEntity.ok(new BridalShowerCsvImportResult(0, 0, List.of("CSV file is empty.")));
        }

        Map<String, Integer> headers = headerMap(rows.get(0));
        if (!headers.containsKey("guestname")) {
            return ResponseEntity.ok(new BridalShowerCsvImportResult(
                    0,
                    0,
                    List.of("CSV must include a guestName column.")
            ));
        }

        int guestsCreated = 0;
        int guestsUpdated = 0;

        for (int rowIndex = 1; rowIndex < rows.size(); rowIndex += 1) {
            List<String> row = rows.get(rowIndex);
            if (isBlankRow(row)) {
                continue;
            }

            String guestName = csvValue(row, headers, "guestname");
            String email = csvValue(row, headers, "email");

            if (guestName.isBlank()) {
                errors.add("Row " + (rowIndex + 1) + ": guestName is required.");
                continue;
            }

            BridalShowerRsvp rsvp = rsvpRepository.findFirstByGuestNameIgnoreCase(guestName).orElse(null);
            boolean createdGuest = false;
            if (rsvp == null) {
                rsvp = new BridalShowerRsvp();
                rsvp.setGuestName(guestName);
                rsvp.setAttending(false);
                rsvp.setResponded(false);
                createdGuest = true;
            }

            rsvp.setEmail(email.isBlank() ? null : email);
            rsvpRepository.save(rsvp);

            if (createdGuest) {
                guestsCreated += 1;
            } else {
                guestsUpdated += 1;
            }
        }

        return ResponseEntity.ok(new BridalShowerCsvImportResult(guestsCreated, guestsUpdated, errors));
    }

    @GetMapping("getAll")
    public List<BridalShowerRsvpDto> getAll() {
        return rsvpRepository.findAllByOrderByGuestNameAsc().stream().map(BridalShowerRsvpDto::from).toList();
    }

    @GetMapping("getRsvp")
    public BridalShowerRsvpLookupResponse getRsvp(@RequestParam String name) {
        return rsvpRepository.findFirstByGuestNameIgnoreCase(name)
                .map(rsvp -> new BridalShowerRsvpLookupResponse(BridalShowerRsvpDto.from(rsvp)))
                .orElseGet(() -> new BridalShowerRsvpLookupResponse(null));
    }

    @PutMapping("updateRsvp/{id}")
    public ResponseEntity<BridalShowerRsvpDto> update(@PathVariable Long id, @Valid @RequestBody BridalShowerRsvpRequest request) {
        return rsvpRepository.findById(id)
                .map(rsvp -> {
                    applyRequest(rsvp, request, true);
                    return ResponseEntity.ok(BridalShowerRsvpDto.from(rsvpRepository.save(rsvp)));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private void applyRequest(BridalShowerRsvp rsvp, BridalShowerRsvpRequest request, boolean submitted) {
        rsvp.setGuestName(request.getGuestName());
        rsvp.setEmail(request.getEmail());
        rsvp.setAttending(Boolean.TRUE.equals(request.getAttending()));
        rsvp.setResponded(request.getAttending() != null);
        rsvp.setMessage(request.getMessage());

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

    private boolean isBlankRow(List<String> row) {
        return row.stream().allMatch(value -> value == null || value.isBlank());
    }
}
