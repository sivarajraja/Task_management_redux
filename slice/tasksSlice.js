import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasksList:[],
    selectedTask:{},
    isLoading:false,
    error:""
}
const BASE_URL = 'http://localhost:8000/tasks';

//GET
export const getTasksFromServer = createAsyncThunk(
    "tasks/getTasksFromServer",
    async (_,{rejectWithValue}) => {
        const response = await fetch(BASE_URL)
        if(response.ok){
            const jsonResponse = await response.json()
            return jsonResponse
        }
        else{
            return rejectWithValue({error:"No tasks Found!"})
        }
    }
)

//POST
export const postTasksToServer = createAsyncThunk(
    "tasks/postTasksToServer",
    async (task,{rejectWithValue}) => {
        const options = {
            method:"POST",
            body : JSON.stringify(task),
            headers :{
                "content-type" : "application/json; charset=UTF-8"
            }
        }
        const response = await fetch(BASE_URL,options)
        if(response.ok){
            const jsonResponse = await response.json()
            return jsonResponse
        }
        else{
            return rejectWithValue({error:"Task not added!"})
        }
    }
)

//PATCH
export const updateTasksInServer = createAsyncThunk(
    "tasks/updateTasksInServer",
    async (task,{rejectWithValue}) => {
        const options = {
            method:"PATCH",
            body : JSON.stringify(task),
            headers :{
                "content-type" : "application/json; charset=UTF-8"
            }
        }
        const response = await fetch(BASE_URL+'/'+task.id,options)
        if(response.ok){
            const jsonResponse = await response.json()
            return jsonResponse
        }
        else{
            return rejectWithValue({error:"Task not updated!"})
        }
    }
)

//DELETE
export const deleteTasksInServer = createAsyncThunk(
    "tasks/deleteTasksInServer",
    async (task,{rejectWithValue}) => {
        const options = {
            method:"DELETE",
            body : JSON.stringify(task),
            headers :{
                "content-type" : "application/json; charset=UTF-8"
            }
        }
        const response = await fetch(BASE_URL+'/'+task.id,options)
        if(response.ok){
            const jsonResponse = await response.json()
            return jsonResponse
        }
        else{
            return rejectWithValue({error:"Task not deleted!"})
        }
    }
)

const tasksSlice = createSlice({
    name: "tasksSlice",
    initialState,
    reducers:{
        addTaskToList:(state,action) => {
            const id = Math.random()*100;
            let task = {...action.payload,id}
            state.tasksList.push(task)
        },
        removeTaskFromList:(state,action) => {
            state.tasksList = state.tasksList.filter((task)=>task.id !== action.payload.id)          
        },
        updateTaskInList:(state,action) => {
            state.tasksList = state.tasksList.map((task)=>task.id===action.payload.id? action.payload:task)
        },
        setSelectedTask:(state,action) => {
            state.selectedTask = action.payload
        }
    },
    extraReducers:(builders)=>{
        builders
        //GET
        .addCase(getTasksFromServer.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(getTasksFromServer.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.tasksList = action.payload
            state.error = ''
        })
        .addCase(getTasksFromServer.rejected,(state,action)=>{
            state.isLoading = false;
            state.tasksList = []
            state.error = action.payload.error
        })
        //POST
        .addCase(postTasksToServer.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(postTasksToServer.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.tasksList.push(action.payload)
            state.error = ''
        })
        .addCase(postTasksToServer.rejected,(state,action)=>{
            state.isLoading = false;
            state.error = action.payload.error
        })
        //PATCH
        .addCase(updateTasksInServer.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(updateTasksInServer.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.tasksList = state.tasksList.map((task)=> task.id === action.payload.id ? action.payload:task)
            state.error = ''
        })
        .addCase(updateTasksInServer.rejected,(state,action)=>{
            state.isLoading = false;
            state.error = action.payload.error
        })
        //DELETE
        .addCase(deleteTasksInServer.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(deleteTasksInServer.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.tasksList = state.tasksList.filter((task)=>task.id !== action.payload.id)
            state.error = ''
        })
        .addCase(deleteTasksInServer.rejected,(state,action)=>{
            state.isLoading = false;
            state.error = action.payload.error
        })
    }
})

export const {addTaskToList,removeTaskFromList,updateTaskInList,setSelectedTask} = tasksSlice.actions

export default tasksSlice.reducer