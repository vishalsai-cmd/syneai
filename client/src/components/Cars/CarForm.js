import { useState } from 'react';

const CarForm = ({ car, onSubmit }) => {
  const [title, setTitle] = useState(car?.title || '');
  const [description, setDescription] = useState(car?.description || '');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState(car?.tags || { car_type: '', company: '', dealer: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags));
    images.forEach((image) => formData.append('images', image));

    try {
      await onSubmit(formData);
      setError('');
      setTitle('');
      setDescription('');
      setImages([]);
      setTags({ car_type: '', company: '', dealer: '' });
    } catch (error) {
      /* console.error('Error during form submission:', error);  */
      setError(error.response?.data?.error || 'Car has been added to your list');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <input
          type="file"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
          accept="image/*"
          className="w-full"
        />
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={tags.car_type}
          onChange={(e) => setTags({ ...tags, car_type: e.target.value })}
          placeholder="Car Type"
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          value={tags.company}
          onChange={(e) => setTags({ ...tags, company: e.target.value })}
          placeholder="Company"
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          value={tags.dealer}
          onChange={(e) => setTags({ ...tags, dealer: e.target.value })}
          placeholder="Dealer"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {car ? 'Update Car' : 'Add Car'}
      </button>
    </form>
  );
};

export default CarForm;
