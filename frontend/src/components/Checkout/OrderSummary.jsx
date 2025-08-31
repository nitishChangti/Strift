export default function OrderSummary({ onContinue }) {
    return (
        <div>
            <p>[Order summary details here]</p>
            <button onClick={onContinue} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                Continue to Payment
            </button>
        </div>
    );
}