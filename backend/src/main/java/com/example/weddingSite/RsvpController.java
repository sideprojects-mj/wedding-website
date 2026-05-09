package com.example.weddingSite;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rsvps")
@CrossOrigin(origins = "http://localhost:3000")
public class RsvpController {

    private final RsvpRepo rsvpRepository;

    public RsvpController(RsvpRepo rsvpRepository) {
        this.rsvpRepository = rsvpRepository;
    }

    @PostMapping
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

    @GetMapping
    public List<Rsvp> getAllRsvps() {
        return rsvpRepository.findAll();
    }
}