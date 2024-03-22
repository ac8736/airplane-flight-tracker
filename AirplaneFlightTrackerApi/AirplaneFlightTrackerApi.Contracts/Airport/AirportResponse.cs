namespace AirplaneFlightTrackerApi.Contracts.Airport;

public record AirportResponse(
    string Name,
    string Code,
    string City,
    string Country,
    DateTime DateCreated
);