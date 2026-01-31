import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { DATA_KEYS } from '../lib/dataManager';

const mockReviews = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely amazing Hyderabadi Biryani! The flavors were authentic and the service was excellent. Will definitely come back!",
    helpful: 12,
    isVisible: true,
    status: 'approved',
    userId: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    name: "Priya Sharma",
    rating: 4,
    date: "1 week ago",
    comment: "Great ambiance and delicious Andhra food. The Gongura Mutton was outstanding. Slightly expensive but worth it.",
    helpful: 8,
    isVisible: true,
    status: 'approved',
    userId: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    name: "Mohammed Ali",
    rating: 5,
    date: "2 weeks ago",
    comment: "Best restaurant for authentic South Indian cuisine in the city. The Chef's Special Tandoori Platter is a must-try!",
    helpful: 15,
    isVisible: true,
    status: 'approved',
    userId: null,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    name: "Sneha Reddy",
    rating: 4,
    date: "3 weeks ago",
    comment: "Loved the traditional flavors and the warm hospitality. The Pesarattu reminded me of home. Highly recommended!",
    helpful: 6,
    isVisible: true,
    status: 'approved',
    userId: null,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function ReviewsPage() {
  const { state: authState } = useAuth();
  const { data: reviews, addItem: addReview } = useRealtimeData(DATA_KEYS.REVIEWS, mockReviews);
  
  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewerName, setReviewerName] = useState(authState.user?.name || '');
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = reviews.length > 0 
    ? reviews.filter((review: any) => review.isVisible).reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.filter((review: any) => review.isVisible).length 
    : 4.6;
  const totalReviews = reviews.filter((review: any) => review.isVisible).length;

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleStarHover = (hoveredStar: number) => {
    setHoveredRating(hoveredStar);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || !reviewerName.trim() || !reviewText.trim()) {
      alert('Please fill in all fields and select a rating.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview = {
        id: Date.now(),
        name: reviewerName.trim(),
        rating: rating,
        date: 'Just now',
        comment: reviewText.trim(),
        helpful: 0,
        userId: authState.user?._id || null,
        createdAt: new Date().toISOString(),
        isVisible: true,
        status: 'approved'
      } as any;

      addReview(newReview);

      // Reset form
      setRating(0);
      setReviewerName('');
      setReviewText('');
      
      alert('Thank you for your review! It has been submitted successfully.');
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStarColor = (starIndex: number) => {
    const currentRating = hoveredRating || rating;
    return starIndex <= currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-lg text-gray-600">
            See what our customers are saying about their dining experience
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.filter((review: any) => review.isVisible).map((review: any) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.name}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{review.date}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <button className="flex items-center space-x-1 hover:text-primary-600">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-primary-600">
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            <div className="text-center">
              <button className="btn-primary px-8 py-3">
                Load More Reviews
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Rating */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Overall Rating</h3>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {averageRating}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Based on {totalReviews} reviews</p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">
                      {rating === 5 ? 173 : rating === 4 ? 49 : rating === 3 ? 17 : rating === 2 ? 5 : 3}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write a Review */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((starRating) => (
                      <button
                        key={starRating}
                        type="button"
                        onClick={() => handleStarClick(starRating)}
                        onMouseEnter={() => handleStarHover(starRating)}
                        onMouseLeave={handleStarLeave}
                        className={`transition-colors duration-200 hover:scale-110 transform ${
                          getStarColor(starRating)
                        }`}
                      >
                        <Star className="w-6 h-6" />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-gray-600">
                        {rating} star{rating !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder={authState.isAuthenticated ? authState.user?.name || "Enter your name" : "Enter your name"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !rating || !reviewerName.trim() || !reviewText.trim()}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
              
              {!authState.isAuthenticated && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Tip:</strong> Sign in to auto-fill your name and track your reviews!
                  </p>
                </div>
              )}
            </div>

            {/* Popular Dishes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Most Reviewed Dishes</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hyderabadi Biryani</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">4.8</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Andhra Chicken Curry</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">4.7</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gongura Mutton</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}