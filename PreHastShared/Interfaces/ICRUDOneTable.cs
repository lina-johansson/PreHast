using System;
using System.Collections.Generic;
using System.Text;

namespace PreHastShared.Interfaces
{
    //T لغرض العرض
    //T1 لغرض الادخال
    public interface ICRUDOneTable<T,T1,PkType> where T:class  where T1 : class
    {
        Task<IEnumerable<T>?> GetAll();
        Task<IEnumerable<T>?> GetAllBuilds(bool Mokhasas, bool Moashar);
        Task<T?> GetById(PkType id);
        Task<T1?> Create(T1 t);
        Task<T1?> Update(PkType id, T1 t);
        Task<bool> Delete(PkType id);
      
        bool  DataExists(PkType id);
        Task<bool> Truth(PkType id,bool truth);

        Task<string> GetCurrentUserId();
    }
}
