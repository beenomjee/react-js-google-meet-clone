import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.scss'
import { BrowserRouter } from 'react-router-dom'
import { Provider as StoreProvider } from 'react-redux'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StoreProvider store={store}>
    <BrowserRouter>
      <App />
<<<<<<< Updated upstream
=======
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
>>>>>>> Stashed changes
    </BrowserRouter>
  </StoreProvider>
)
