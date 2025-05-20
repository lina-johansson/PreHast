 
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from '../app/store.ts'
 
 
ReactDOM.createRoot(document.getElementById('root')!).render(
    
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path='/*' element={<App/>}> </Route>
            </Routes>
        </BrowserRouter>
        </Provider>
   

)
