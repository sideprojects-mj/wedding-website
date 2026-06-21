package com.example.weddingSite;

import java.util.List;

public record BridalShowerCsvImportResult(
        int guestsCreated,
        int guestsUpdated,
        List<String> errors
) {
}
