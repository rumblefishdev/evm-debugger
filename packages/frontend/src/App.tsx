import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { MainDisplay } from './pages/MainDisplay'
import { SelectTransactionScreen } from './pages/SelectTransactionScreen'

const router = createBrowserRouter([
    {
        path: '/',
        element: <SelectTransactionScreen />,
    },
    {
        path: '/mainDisplay',
        element: <MainDisplay />,
    },
])

function App() {
    return <RouterProvider router={router}></RouterProvider>
}

export default App
