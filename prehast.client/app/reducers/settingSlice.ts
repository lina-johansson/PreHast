import { createSlice } from '@reduxjs/toolkit'

interface SettingState {
    darkTheme: boolean,
    modalAddUsers:boolean,
    modalAddCat:boolean,
}

// Define the initial state using that type
 
const initialState: SettingState ={
   darkTheme:true,
   modalAddUsers:false,
   modalAddCat:false
}  

export const settingSlice=createSlice({
    name:'setting',
    initialState,
    reducers:{
        toggleTheme:(state)=>{
            state.darkTheme = !state.darkTheme;
        },
        toggleModal: (state, action) => {
            state.modalAddUsers = action.payload;
        },
        toggleCatModal: (state, action) => {
            state.modalAddCat = action.payload;
        },
       
    }
    
})
 
export const { toggleTheme, toggleModal, toggleCatModal } = settingSlice.actions
export default settingSlice.reducer


 