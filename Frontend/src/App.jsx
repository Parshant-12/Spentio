import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Components/Authentication/Login';
import Signup from '../Components/Authentication/SignUp';
import Layout from '../Components/Layouts/Layout';
import Dashboard from '../Components/Pages/Dashboard';
import Analysis from '../Components/Pages/Analysis';
import AddTransaction from '../Components/Pages/AddTransaction';
import TransactionsHistory from '../Components/Pages/TransactionsHistory';
import Budget from '../Components/Pages/Budget';
import AiChat from '../Components/Pages/AiChat';
import BillsAndEMIs from '../Components/Pages/Bills&EMIs';
import Udhar from '../Components/Pages/Udhar';
import Settings from '../Components/Pages/Settings';
import Subscription from '../Components/Pages/Subscriptions';
import Calculator from '../Components/Pages/Calculator';
import PrivateRoute from '../Components/Layouts/PrivateRoutes';
import ForgotPassword from '../Components/Authentication/ForgotPassword';
import ResetPassword from '../Components/Authentication/ResetPassword';
import Home from '../Components/Pages/Home';
import ScrollTotop from '../Components/Layouts/ScrollTotop'

function App() {
  return (
    <Router>
      <ScrollTotop />
      <Routes>

        <Route path='/reset-password/:token' element={<ResetPassword/>} />
        <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
        <Route path='/Login' element={<Login />} />
        <Route path='/SignUp' element={<Signup />} />
        <Route path='/' element={<Home/>}/>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path='/Dashboard' element={<Dashboard />} />
            <Route path='/Analysis' element={<Analysis />} />
            <Route path='/AddTransaction' element={<AddTransaction />} />
            <Route path='/TransactionsHistory' element={<TransactionsHistory />} />
            <Route path='/AiChat' element={<AiChat />} />
            <Route path='/Budget' element={<Budget />} />
            <Route path='/BillsAndEMIs' element={<BillsAndEMIs />} />
            <Route path='/Udhar' element={<Udhar />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/Subscription' element={<Subscription />} />
            <Route path='/Calculator' element={<Calculator />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;