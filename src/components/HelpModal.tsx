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
        <ul className="list-disc list-inside space-y-2 text-gray-200">
          <li><strong>Pick Letters:</strong> On the start screen, click “Vowel” or “Consonant” 9 times to build a letter pool, or type your own word.</li>
          <li><strong>Arrange Tiles:</strong> Drag or tap tiles between the upper and lower rows to form words or phrases.</li>
          <li><strong>Swipe Alignment:</strong> Swipe the upper or lower row up, middle, or down to reposition the rows.</li>
          <li><strong>Insert Spaces:</strong> Use the “Space” button below to add blank tiles into your anagram.</li>
          <li><strong>Lock Tiles:</strong> Toggle the lock icon to freeze the current lower-row tiles in place while you rearrange the rest.</li>
          <li><strong>Placeholders:</strong> Removed letters leave dashed placeholders—tap them to highlight where they went.</li>
        </ul>
      </div>
    </div>
  );
}