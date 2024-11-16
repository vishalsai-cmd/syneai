import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup';
import CarsList from './components/Cars/CarsList';
import CarForm from './components/Cars/CarForm';
import CarDetail from './components/Cars/CarDetail';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Car Management</h1>
            {isAuthenticated ? (
              <div className="space-x-4">
                <Link to="/cars" className="hover:text-gray-300">My Cars</Link>
                <Link to="/cars/new" className="hover:text-gray-300">Add Car</Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                  }}
                  className="hover:text-gray-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="hover:text-gray-300">Login</Link>
                <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
              </div>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route
            path="/cars"
            element={
              <PrivateRoute>
                <CarsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/new"
            element={
              <PrivateRoute>
                <CarForm onSubmit={async (formData) => {
                  await axios.post('/api/cars', formData, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'multipart/form-data',
                    },
                  });
                  Navigate('/cars');
                }} />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/:id"
            element={
              <PrivateRoute>
                <CarDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/edit/:id"
            element={
              <PrivateRoute>
                <CarForm isEdit={true} />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/cars" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;