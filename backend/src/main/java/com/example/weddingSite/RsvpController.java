package com.example.weddingSite;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rsvps")
@CrossOrigin(origins = {
        "http://localhost:8080",
        "https://frontend-9965441404.us-central1.run.app",
})
public class RsvpController {

    private final RsvpRepo rsvpRepository;

    public RsvpController(RsvpRepo rsvpRepository) {
        this.rsvpRepository = rsvpRepository;
    }

    @PostMapping("createRsvp")
    public Rsvp createRsvp(@Valid @RequestBody RsvpRequest request) {
        Rsvp rsvp = new Rsvp();

        rsvp.setGuestName(request.getGuestName());
        rsvp.setEmail(request.getEmail());
        rsvp.setAttending(request.getAttending());
//        rsvp.setPartySize(request.getPartySize());
        rsvp.setMealChoice(request.getMealChoice());
        rsvp.setMessage(request.getMessage());

        return rsvpRepository.save(rsvp);
    }

    @GetMapping("getAll")
    public List<Rsvp> getAllRsvps() {
        return rsvpRepository.findAll();
    }

    @GetMapping("getRsvp")
    public Optional<Rsvp> getRsvp(@RequestParam String name) {
        return rsvpRepository.findByGuestName(name);
    }

    @PutMapping("updateRsvp/{id}")
    public ResponseEntity<Rsvp> updateRsvp(@PathVariable Long id, @Valid @RequestBody RsvpRequest request) {
        return rsvpRepository.findById(id)
                .map(rsvp -> {
                    rsvp.setGuestName(request.getGuestName());
                    rsvp.setEmail(request.getEmail());
                    rsvp.setAttending(request.getAttending());
                    rsvp.setMealChoice(request.getMealChoice());
                    rsvp.setMessage(request.getMessage());

                    return ResponseEntity.ok(rsvpRepository.save(rsvp));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
