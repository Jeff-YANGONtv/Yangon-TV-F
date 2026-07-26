export default function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-5xl mb-4">😞</div>
      <h3 className="text-xl font-semibold text-red-400 mb-2">{message}</h3>
      <p className="text-gray-400 text-sm mb-6">Please try again later.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
