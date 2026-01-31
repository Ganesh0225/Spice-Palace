import { useState } from 'react';
import { Star, Eye, EyeOff, Trash2, MessageCircle } from 'lucide-react';
import { useRealtimeData } from '../../hooks/useRealtimeData';
import { DATA_KEYS } from '../../lib/dataManager';

const mockReviews = [
  {
    id: 1,
    name: "Rajesh Kumar",
    rating: 5,
    date: "2024-01-28",
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
    date: "2024-01-27",
    comment: "Great ambiance and delicious Andhra food. The Gongura Mutton was outstanding. Slightly expensive but worth it.",
    helpful: 8,
    isVisible: true,
    status: 'approved',
    userId: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    name: "Anonymous User",
    rating: 1,
    date: "2024-01-26",
    comment: "Terrible food and rude staff. The biryani was cold and tasteless. Never coming back!",
    helpful: 2,
    isVisible: false,
    status: 'pending',
    userId: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    name: "Mohammed Ali",
    rating: 5,
    date: "2024-01-25",
    comment: "Best restaurant for authentic South Indian cuisine in the city. The Chef's Special Tandoori Platter is a must-try!",
    helpful: 15,
    isVisible: true,
    status: 'approved',
    userId: null,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    name: "Sneha Reddy",
    rating: 4,
    date: "2024-01-24",
    comment: "Loved the traditional flavors and the warm hospitality. The Pesarattu reminded me of home. Highly recommended!",
    helpful: 6,
    isVisible: true,
    status: 'approved',
    userId: null,
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function ReviewManagement() {
  const { data: reviews, updateItem: updateReview, removeItem: removeReview, addItem: addReview } = useRealtimeData(DATA_KEYS.REVIEWS, mockReviews);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const showMessage = (message: string) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const toggleVisibility = (reviewId: number) => {
    console.log('=== TOGGLE VISIBILITY ===');
    console.log('Review ID:', reviewId, 'Type:', typeof reviewId);
    console.log('Current reviews:', reviews);
    
    const review = reviews.find((r: any) => {
      console.log(`Comparing review.id (${r.id}, ${typeof r.id}) with reviewId (${reviewId}, ${typeof reviewId})`);
      return r.id == reviewId; // Use loose equality
    });
    
    console.log('Found review:', review);
    
    if (review) {
      try {
        console.log('Calling updateReview with:', {
          id: reviewId, // Pass as number, not string
          currentVisibility: review.isVisible,
          newVisibility: !review.isVisible
        });
        
        const result = updateReview(reviewId, (currentReview: any) => {
          console.log('Updater function called with:', currentReview);
          const updated = {
            ...currentReview,
            isVisible: !currentReview.isVisible,
            status: currentReview.isVisible ? 'hidden' : 'approved'
          };
          console.log('Returning updated review:', updated);
          return updated;
        }, 'id');
        
        console.log('Update result:', result);
        showMessage(`Review ${review.isVisible ? 'hidden' : 'shown'} successfully`);
      } catch (error) {
        console.error('Error updating review:', error);
        showMessage('Error updating review: ' + error);
      }
    } else {
      console.error('Review not found with ID:', reviewId);
      showMessage('Review not found');
    }
  };

  const deleteReview = (reviewId: number) => {
    console.log('=== DELETE REVIEW ===');
    console.log('Review ID:', reviewId, 'Type:', typeof reviewId);
    console.log('Current reviews:', reviews);
    
    if (confirm('Are you sure you want to delete this review?')) {
      const review = reviews.find((r: any) => r.id == reviewId); // Use loose equality
      console.log('Found review to delete:', review);
      
      try {
        console.log('Calling removeReview with ID:', reviewId);
        const result = removeReview(reviewId, 'id'); // Pass as number
        console.log('Delete result:', result);
        showMessage(`Review by ${review?.name || 'user'} deleted successfully`);
      } catch (error) {
        console.error('Error deleting review:', error);
        showMessage('Error deleting review: ' + error);
      }
    }
  };

  const approveReview = (reviewId: number) => {
    console.log('=== APPROVE REVIEW ===');
    console.log('Review ID:', reviewId);
    
    try {
      const result = updateReview(reviewId, (review: any) => ({
        ...review,
        isVisible: true,
        status: 'approved'
      }), 'id');
      console.log('Approve result:', result);
      showMessage('Review approved successfully');
    } catch (error) {
      console.error('Error approving review:', error);
      showMessage('Error approving review: ' + error);
    }
  };

  const filteredReviews = selectedStatus === 'all' 
    ? reviews 
    : reviews.filter((review: any) => review.status === selectedStatus);

  const getStatusStats = () => {
    const approved = reviews.filter((r: any) => r.status === 'approved').length;
    const pending = reviews.filter((r: any) => r.status === 'pending').length;
    const hidden = reviews.filter((r: any) => r.status === 'hidden').length;
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';
    
    return { approved, pending, hidden, total: reviews.length, averageRating };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {statusMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          ✅ {statusMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Management</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              console.log('=== MANUAL TEST ===');
              console.log('Current reviews:', reviews);
              console.log('Reviews length:', reviews.length);
              
              // Test finding a review
              const testReview = reviews.find((r: any) => r.id === 1);
              console.log('Found review with ID 1:', testReview);
              
              showMessage('Check console for debug info');
            }}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
          >
            Debug Info
          </button>
          <button
            onClick={() => {
              const testReview = {
                id: Date.now(),
                name: "Test User",
                rating: 5,
                date: "Just now",
                comment: "This is a test review to verify operations",
                helpful: 0,
                isVisible: true,
                status: 'approved',
                userId: null,
                createdAt: new Date().toISOString()
              };
              addReview(testReview);
              showMessage('Test review added successfully!');
            }}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
          >
            Add Test Review
          </button>
          <button
            onClick={() => {
              // Force sync all data
              if ((window as any).dataManager) {
                (window as any).dataManager.forceSyncAll();
                showMessage('Forced sync to all tabs');
              } else {
                showMessage('DataManager not available');
              }
            }}
            className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
          >
            Force Sync
          </button>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Average Rating</p>
            <div className="flex items-center justify-center mt-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <p className="text-2xl font-bold text-gray-900 ml-1">{stats.averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Reviews</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Hidden</p>
            <p className="text-2xl font-bold text-red-600">{stats.hidden}</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review: any) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                  <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                    review.status === 'approved' ? 'bg-green-100 text-green-800' :
                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {review.status}
                  </span>
                </div>
                
                <div className="flex items-center mb-2">
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
                
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>{review.helpful} people found this helpful</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4 border-t">
              {review.status === 'pending' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    approveReview(review.id);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Approve
                </button>
              )}
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleVisibility(review.id);
                }}
                className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center ${
                  review.isVisible
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {review.isVisible ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Show
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteReview(review.id);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reviews found</p>
          <p className="text-gray-400">Reviews will appear here when customers submit them</p>
        </div>
      )}
    </div>
  );
}