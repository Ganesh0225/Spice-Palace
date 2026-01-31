import { useRealtimeData } from '../hooks/useRealtimeData';
import { DATA_KEYS } from '../lib/dataManager';

const mockReviews = [
  {
    id: 1,
    name: "Test User 1",
    rating: 5,
    date: "2024-01-28",
    comment: "This is a test review",
    helpful: 0,
    isVisible: true,
    status: 'approved',
    userId: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Test User 2",
    rating: 4,
    date: "2024-01-27",
    comment: "Another test review",
    helpful: 0,
    isVisible: true,
    status: 'approved',
    userId: null,
    createdAt: new Date().toISOString()
  }
];

export default function ReviewDebugger() {
  const { data: reviews, updateItem, removeItem, addItem } = useRealtimeData(DATA_KEYS.REVIEWS, mockReviews);

  const testUpdate = () => {
    console.log('=== TESTING UPDATE ===');
    console.log('Current reviews:', reviews);
    
    const result = updateItem('1', (review: any) => {
      console.log('Updating review:', review);
      return {
        ...review,
        isVisible: !review.isVisible,
        comment: review.comment + ' [UPDATED]'
      };
    }, 'id');
    
    console.log('Update result:', result);
  };

  const testDelete = () => {
    console.log('=== TESTING DELETE ===');
    console.log('Current reviews:', reviews);
    
    const result = removeItem('2', 'id');
    console.log('Delete result:', result);
  };

  const testAdd = () => {
    console.log('=== TESTING ADD ===');
    
    const newReview = {
      id: Date.now(),
      name: "New Test User",
      rating: 3,
      date: "Just now",
      comment: "Newly added test review",
      helpful: 0,
      isVisible: true,
      status: 'approved',
      userId: null,
      createdAt: new Date().toISOString()
    };
    
    const result = addItem(newReview);
    console.log('Add result:', result);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Review Operations Debugger</h3>
      
      <div className="space-y-2 mb-4">
        <button 
          onClick={testUpdate}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Update (Toggle ID 1)
        </button>
        <button 
          onClick={testDelete}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Delete (Remove ID 2)
        </button>
        <button 
          onClick={testAdd}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Test Add (New Review)
        </button>
      </div>

      <div className="bg-white p-4 rounded">
        <h4 className="font-semibold mb-2">Current Reviews ({reviews.length}):</h4>
        <pre className="text-xs overflow-auto max-h-40">
          {JSON.stringify(reviews, null, 2)}
        </pre>
      </div>
    </div>
  );
}