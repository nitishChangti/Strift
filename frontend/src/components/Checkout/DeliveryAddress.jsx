export default function DeliveryAddress({ onContinue }) {
    return (
        <div>
            <p>[Delivery Address Form here]</p>
            <button onClick={onContinue} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                Continue
            </button>
        </div>
    );
}