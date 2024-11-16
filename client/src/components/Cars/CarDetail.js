import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CarDetail = () => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await axios.get(`syneai.vercel.app/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Car Data:', response.data); // Debugging
      setCar(response.data);
    } catch (error) {
      console.error('Error fetching car:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!car) return <div>Car not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold mb-4">{car.title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {car.images?.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${car.title} - Image ${index + 1}`}
              className="w-full h-48 object-cover rounded"
            />
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="text-gray-700">{car.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Tags</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-200 rounded">{car?.tags?.car_type || 'N/A'}</span>
              <span className="px-3 py-1 bg-gray-200 rounded">{car?.tags?.company || 'N/A'}</span>
              <span className="px-3 py-1 bg-gray-200 rounded">{car?.tags?.dealer || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate(`/cars/edit/${car._id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => navigate('/cars')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
