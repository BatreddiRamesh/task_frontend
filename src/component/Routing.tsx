import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '../component/Layout'
import Login from './Login'
import Register from './Register'
import ManageFile from './ManageFile'
import { Typography } from '@mui/material'

function Routing() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
       <Route path="/managefile" element={<ManageFile/>} />
        <Route index element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        
        

        

        
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default Routing
