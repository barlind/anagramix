import { Bars3Icon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface Props {
  onLogoClick(): void;
  onHelpClick(): void;
}

export default function TopMenuBar({ onLogoClick, onHelpClick }: Props) {
  return (
    <div className="relative flex items-center px-4 h-12 bg-gray-900 text-white">
      <button aria-label="Menu" className="p-2">
        <Bars3Icon className="h-6 w-6" />
      </button>
      <button
        onClick={onLogoClick}
        className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold text-white"
      >Anagramix</button>
      <div className="flex items-center ml-auto">
        <button onClick={onHelpClick} aria-label="Help" className="p-2">
          <QuestionMarkCircleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}