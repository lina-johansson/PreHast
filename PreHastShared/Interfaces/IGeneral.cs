using System;
using System.Collections.Generic;
using System.Text;
using PreHast.Server.DTO;

namespace PreHastShared.Interfaces
{
    public interface IGeneral
    {
       // Task<IEnumerable<LocationUnitsDto>> GetAllLocationUnits(int locationId);
        Task<string> GetCurrentUserId();
    }
}
