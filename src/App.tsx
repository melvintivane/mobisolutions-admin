import AppProvidersWrapper from './components/wrappers/AppProvidersWrapper'
import configureFakeBackend from './helpers/fake-backend'
import AppRouter from './routes/router'
import { ToastContainer } from 'react-toastify';

import '@/assets/scss/app.scss'
import 'react-toastify/dist/ReactToastify.css'

configureFakeBackend()

const App = () => {
  return (
    <AppProvidersWrapper>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={3000} />
    </AppProvidersWrapper>
  )
}

export default App
