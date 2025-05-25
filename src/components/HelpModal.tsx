interface Props { onClose(): void }
export default function HelpModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-11/12 max-w-md relative">
        <button
          className="btn absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >×</button>
        <h2 className="text-xl font-bold mb-4">How to Play</h2>
        {/* TODO: Insert instructions here */}
      </div>
    </div>
  );
}