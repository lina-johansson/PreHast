using System;
using System.Collections.Generic;
using System.Text;

namespace PreHastShared.Interfaces
{
    public interface ICRUD <T,T2, PkType> where T:class where T2 :class
    {
        Task<IEnumerable<T2>> GetAll();
        Task<T?> GetById(PkType id);
        Task<T?> Create(T t);
        Task<T?> Update(PkType id, T t);
        Task<T?> Delete(PkType id);
      
        bool  DataExists(PkType id);


    }
}
