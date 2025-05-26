import React, { useState } from 'react';
import Tile from './Tile';
import SavedGamesDropdown, { SavedSnapshot } from './SavedGamesDropdown';

const vowelPoolInit: Record<string, number> = { A:15,E:21,I:13,O:13,U:5 };
const consonantPoolInit: Record<string, number> = { B:2,C:3,D:6,F:2,G:3,H:2,J:1,K:1,L:5,M:4,N:8,P:4,Q:1,R:9,S:9,T:9,V:1,W:1,X:1,Y:1,Z:1 };

interface Props {
  onComplete(letters: string[]): void;
  saved: SavedSnapshot[];
  onLoad(id: number): void;
}

export default function CountdownBuilder({ onComplete, saved, onLoad }: Props) {
  const [vowels, setVowels] = useState({ ...vowelPoolInit });
  const [consonants, setConsonants] = useState({ ...consonantPoolInit });
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const pick = (pool: Record<string, number>, setter: React.Dispatch<React.SetStateAction<Record<string, number>>>) => {
    const choices = Object.entries(pool).flatMap(([l,c]) => Array(c).fill(l));
    if (!choices.length) return;
    const letter = choices[Math.floor(Math.random()*choices.length)];
    setter(prev => ({ ...prev, [letter]: prev[letter]-1 }));
    setSelected(s => [...s, letter]);
  };

  const canStart = selected.length === 9 || inputValue.trim().length > 0;

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex flex-wrap justify-center items-center mt-auto mb-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          selected[i] ? (
            <Tile key={i} id={`count-${i}`} char={selected[i]} ariaPressed={false} />
          ) : (
            <div key={i} className="btn tile-button placeholder" />
          )
        ))}
      </div>
      <div className="flex space-x-4 mb-8" >
        <button disabled={selected.length>=9} onClick={() => pick(vowels, setVowels)} className="btn space-button">Vowel</button>
        <button disabled={selected.length>=9} onClick={() => pick(consonants, setConsonants)} className="btn space-button">Consonant</button>
      </div>
      <div className="flex w-full gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Enter custom word …"
          className={`h-12 px-3 rounded border border-gray-300 text-black ${saved.length>0 ? 'basis-1/2' : 'w-full'}`}
        />
        {saved.length > 0 && (
          <SavedGamesDropdown saved={saved} onSelect={onLoad} className="basis-1/2" />
        )}
      </div>
      <button
        disabled={!canStart}
        onClick={() => {
          const letters = inputValue.trim().length > 0 ? inputValue.trim().split('') : selected;
          onComplete(letters);
        }}
        className="btn start-button disabled:opacity-50"
      >Start Game</button>
    </div>
  );
}