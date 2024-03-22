using Microsoft.AspNetCore.Mvc;
using AirplaneFlightTrackerApi.Contracts.Airport;

namespace AirplaneFlightTrackerApi.Controllers;

[ApiController]
[Route("[controller]")]
public class AirportController : ControllerBase
{
    [HttpPost("/create")]
    public IActionResult CreateAirport(CreateAirportRequest request)
    {
        return Ok(request);
    }

    [HttpGet("/{code}")]
    public IActionResult CreateAirport(string code)
    {
        return Ok(code);
    }

    [HttpDelete("/{code}")]
    public IActionResult DeleteAirport(string code)
    {
        return Ok(code);
    }
}