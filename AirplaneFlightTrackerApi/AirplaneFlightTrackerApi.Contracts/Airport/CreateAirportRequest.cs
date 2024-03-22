namespace AirplaneFlightTrackerApi.Contracts.Airport;

public record CreateAirportRequest(
    string Name,
    string Code,
    string City,
    string Country
);