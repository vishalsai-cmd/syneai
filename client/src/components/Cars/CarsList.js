import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CarsList = () => {
    const [cars, setCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchCars();
    }, []);
  
    const fetchCars = async () => {
      try {
        const response = await axios.get('/api/cars', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSearch = async () => {
      try {
        const response = await axios.get(`/api/cars/search?keyword=${searchTerm}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCars(response.data);
      } catch (error) {
        console.error('Error searching cars:', error);
      }
    };
  
    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this car?')) {
        try {
          await axios.delete(`/api/cars/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setCars(cars.filter(car => car._id !== id));
        } catch (error) {
          console.error('Error deleting car:', error);
        }
      }
    };
  
    if (loading) return <div>Loading...</div>;
  
    return (
      <div className="container mx-auto p-4">
        <div className="mb-4 flex">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cars..."
            className="flex-1 px-3 py-2 border rounded-md mr-2"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map(car => (
            <div key={car._id} className="border rounded-lg p-4">
              <img
                src={car.images[0]}
                alt={car.title}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h3 className="text-xl font-bold">{car.title}</h3>
              <p className="text-gray-600">{car.description}</p>
              <div className="mt-2 space-x-2">
              <button
                onClick={() => navigate(`/cars/${car._id}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View
              </button>
              <button
                onClick={() => navigate(`/cars/edit/${car._id}`)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(car._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarsList