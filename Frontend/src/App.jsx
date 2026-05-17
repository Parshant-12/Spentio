import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Components/Authentication/Login';
import Signup from '../Components/Authentication/SignUp';
import Layout from '../Components/Layouts/Layout';
import Dashboard from '../Components/Pages/Dashboard';
import Analysis from '../Components/Pages/Analysis';
import AddTransaction from '../Components/Pages/AddTransaction';

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;