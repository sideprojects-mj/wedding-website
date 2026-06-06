package com.example.weddingSite;

import java.util.List;

public record CsvImportResult(
        int partiesCreated,
        int guestsCreated,
        int guestsUpdated,
        List<String> errors
) {
}
