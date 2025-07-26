import React from 'react';

const feedback = [
  { user: 'Alice', rating: 4, comment: 'Great service!' },
  { user: 'Bob', rating: 3, comment: 'Average experience.' },
];

const RatingsAndReviews = () => {
  const averageRating = (
    feedback.reduce((acc, val) => acc + val.rating, 0) / feedback.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>

      <div className="mb-4 text-lg">
        <strong>Average Rating:</strong> {averageRating} / 5
      </div>

      <div className="space-y-4">
        {feedback.map((f, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded">
            <p><strong>User:</strong> {f.user}</p>
            <p><strong>Rating:</strong> {f.rating} ⭐</p>
            <p><strong>Comment:</strong> {f.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingsAndReviews;
