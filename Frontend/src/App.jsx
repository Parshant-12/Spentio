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

function App() {
  // Toggle this flag manually to change development layout views
  const isAuthenticated = true; 

  return (
    <Router>
      <Routes>
        <Route 
          path='/' 
          element={isAuthenticated ? <Navigate to="/Dashboard" /> : <Navigate to="/Login" />} 
        />
        
        <Route path='/Login' element={<Login />} />
        <Route path='/SignUp' element={<Signup />} />

        {/* Everything inside here automatically gets the shared Sidebar and Header! */}
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
      </Routes>
    </Router>
  );
}

export default App;