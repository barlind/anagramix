import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import {
  DndContext,
  closestCenter,
  useDroppable,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import Tile from './components/Tile'
import SpaceButton from './components/SpaceButton'
import LockToggle from './components/LockToggle';
import TopMenuBar from './components/TopMenuBar';
import CountdownBuilder from './components/CountdownBuilder';
import HelpModal from './components/HelpModal';
import DemarcationLine from './components/DemarcationLine';

interface TileType { id: number; char: string }

export default function App() {
  // start with no tiles until CountdownBuilder provides them
  const [initial, setInitial] = useState<TileType[]>([])
  const [removed, setRemoved] = useState<number[]>([])
  const [lower, setLower] = useState<TileType[]>([])
  const [locked, setLocked] = useState<number[]>([])
  const [view, setView] = useState<'countdown'|'game'|'help'>('countdown');
  const [upperAlign, setUpperAlign] = useState<'flex-start'|'middle'|'flex-end'>('flex-start');
  const [lowerAlign, setLowerAlign] = useState<'flex-start'|'middle'|'flex-end'>('flex-end');
  const touchStartY = useRef<number>(0);
  const upperInnerRef = useRef<HTMLDivElement>(null);
  const lowerInnerRef = useRef<HTMLDivElement>(null);
  const [upperMax, setUpperMax] = useState(0);
  const [lowerMax, setLowerMax] = useState(0);
  const [activeTile, _] = useState<TileType | null>(null);
  const [glowIds, setGlowIds] = useState<number[]>([]);

  const { setNodeRef: setUpperRef } = useDroppable({ id: 'upper-container' });
  const { setNodeRef: setLowerRef } = useDroppable({ id: 'lower-container' });

  const handleDragEnd = (event: { active: any; over: any; }) => {
    const { active, over } = event;
    if (!over) return;
    const [listType, id] = active.id.split('-');
    const [targetType, _] = over.id.split('-');

    // Reordering within same list
    if (listType === targetType) {
      const list = listType === 'upper' ? initial : lower;
      const setter = listType === 'upper' ? setInitial : setLower;
      const oldIndex = list.findIndex(t => `${listType}-${t.id}` === active.id);
      const newIndex = list.findIndex(t => `${targetType}-${t.id}` === over.id);
      setter(arrayMove(list, oldIndex, newIndex));
      return;
    }

    // Moving between lists
    if (listType === 'upper' && (targetType === 'lower' || over.id === 'lower-container')) {
      const tile = initial.find(t => t.id === id);
      if (!tile || tile.char.trim() === '') return;
      setInitial(initial.filter(t => t.id !== id));
      setLower([...lower, tile]);
    } else if (listType === 'lower' && (targetType === 'upper' || over.id === 'upper-container')) {
      const tile = lower.find(t => t.id === id);
      if (!tile || tile.char.trim() === '') return;
      setLower(lower.filter(t => t.id !== id));
      setInitial([...initial, tile]);
    }
  }

  const moveUp = (tile: TileType) => {
    if (tile.char.trim() === '') {
      // remove empty space tiles
      setLower(lower.filter(t => t.id !== tile.id));
      return;
    }

    // ignore locked tiles
    if (locked.includes(tile.id)) return;

    // move tile back to upper row
    setLower(lower.filter(t => t.id !== tile.id));
    setRemoved(removed.filter(id => id !== tile.id));
    setInitial([...initial, tile]);
  }

  const moveDown = (tile: TileType) => {
    if (tile.char.trim() === '') return; // ignore spaces

    // remove from upper row first
    setInitial(initial.filter(t => t.id !== tile.id));

    // only add if not already in lower
    if (!lower.some(t => t.id === tile.id)) {
      setLower([...lower, tile]);
      setRemoved([...removed, tile.id]);
    }
  }

  const addSpace = () => {
    const id = Date.now()
    setLower([...lower, { id, char: ' ' }])
  }

  const toggleLock = () => {
    setLocked(locked.length ? [] : lower.map(t => t.id))
  }

  const handlePlaceholderClick = (id: number) => {
    setGlowIds(ids => [...ids, id]);
    setTimeout(() => {
      setGlowIds(ids => ids.filter(x => x !== id));
    }, 1000); // match animation duration
  }

  const onDragStart = (e: React.PointerEvent | React.TouchEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartY.current = clientY;
  };
  
  const onDragEndUpper = (e: React.PointerEvent | React.TouchEvent) => {
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.PointerEvent).clientY;
    const delta = clientY - touchStartY.current;
    if (delta > 30) {
      // swipe down: top -> middle -> bottom
      if (upperAlign === 'flex-start') setUpperAlign('middle');
      else if (upperAlign === 'middle') setUpperAlign('flex-end');
    } else if (delta < -30) {
      // swipe up: bottom -> middle -> top
      if (upperAlign === 'flex-end') setUpperAlign('middle');
      else if (upperAlign === 'middle') setUpperAlign('flex-start');
    }
  };
  
  const onDragEndLower = (e: React.PointerEvent | React.TouchEvent) => {
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.PointerEvent).clientY;
    const delta = clientY - touchStartY.current;
    if (delta > 30) {
      // swipe down
      if (lowerAlign === 'flex-start') setLowerAlign('middle');
      else if (lowerAlign === 'middle') setLowerAlign('flex-end');
    } else if (delta < -30) {
      // swipe up
      if (lowerAlign === 'flex-end') setLowerAlign('middle');
      else if (lowerAlign === 'middle') setLowerAlign('flex-start');
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') addSpace()
      if (/^[a-z]$/i.test(e.key)) {
        const target = e.key === e.key.toUpperCase()
          ? lower.find(t => t.char.toUpperCase() === e.key)
          : initial.find(t => t.char.toLowerCase() === e.key)
        if (target) {
          e.key === e.key.toUpperCase() ? moveUp(target) : moveDown(target)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [initial, lower, locked])

  useLayoutEffect(() => {
    if (upperInnerRef.current) {
      const parentH = upperInnerRef.current.parentElement!.clientHeight;
      const contentH = upperInnerRef.current.scrollHeight;
      setUpperMax(Math.max(parentH - contentH-30, 0));
    }
    if (lowerInnerRef.current) {
      const parentH = lowerInnerRef.current.parentElement!.clientHeight;
      const contentH = lowerInnerRef.current.scrollHeight;
      setLowerMax(Math.max(parentH - contentH-20, 0));
    }
  }, [initial, lower]);

  const allMovedToLower = initial.length > 0 && initial.every(tile => removed.includes(tile.id));

  return (
    <DndContext
      sensors={useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
      )}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
      <TopMenuBar
        onLogoClick={() => {
          if (view === 'game' && !window.confirm('Do you want to abandon the current game?')) return;
          setView('countdown');
        }}
        onHelpClick={() => setView('help')}
      />
        {view === 'countdown' && <CountdownBuilder onComplete={letters => { setInitial(letters.map((c,i)=>({id:i,char:c}))); setView('game'); }} />}
        {view === 'game' && (
          <div className="flex flex-col h-full">
        {/* Upper region */}
        <div
          ref={setUpperRef}
          className="relative overflow-hidden p-4"
          style={{ height: '40dvh', touchAction: 'none' }}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEndUpper}
          onPointerDown={onDragStart}
          onPointerUp={onDragEndUpper}
        >
          <SortableContext id="upper-context" items={initial.map(t=>`upper-${t.id}`)} strategy={horizontalListSortingStrategy}>
            <div
          ref={upperInnerRef}
          id="upper-container"
          className="flex flex-wrap justify-center"
          style={{
            transform: upperAlign === 'flex-start'
              ? 'translateY(0)'
              : upperAlign === 'middle'
              ? `translateY(${upperMax/2}px)`
              : `translateY(${upperMax}px)`,
            transition: 'transform 800ms ease'
          }}
            >
          {initial.map(tile => (
            removed.includes(tile.id)
              ? (
                <div
                  key={tile.id}
                  className={`tile-button placeholder ${allMovedToLower ? 'placeholder-original' : ''}`}
                  onClick={() => handlePlaceholderClick(tile.id)}
                >
                  { tile.char}
                </div>
              )
              : <Tile key={tile.id} id={`upper-${tile.id}`} char={tile.char} disabled={removed.includes(tile.id)} ariaPressed={false} onClick={()=>moveDown(tile)}/>
          ))}
            </div>
          </SortableContext>
        </div>
        {/* Separator */}
        <DemarcationLine />
        {/* Lower region */}
        <div
          ref={setLowerRef}
          className="relative overflow-hidden p-4"
          style={{ height: '40dvh', touchAction: 'none' }}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEndLower}
          onPointerDown={onDragStart}
          onPointerUp={onDragEndLower}
        >
          <SortableContext id="lower-context" items={lower.map(t=>`lower-${t.id}`)} strategy={horizontalListSortingStrategy}>
            <div
          ref={lowerInnerRef}
          id="lower-container"
          className="flex flex-wrap justify-center"
          style={{
            transform: lowerAlign === 'flex-start'
              ? 'translateY(0)'
              : lowerAlign === 'middle'
              ? `translateY(${lowerMax/2}px)`
              : `translateY(${lowerMax}px)`,
            transition: 'transform 800ms ease'
          }}
            >
          {lower.map(tile => (
            <Tile key={tile.id} id={`lower-${tile.id}`} char={tile.char} ariaPressed={false} onClick={()=>moveUp(tile)} className={glowIds.includes(tile.id)?'glow':''}/>
          ))}
            </div>
          </SortableContext>
        </div>
        {/* Buttons */}
        <div className="bottom-row flex items-center gap-2 mb-4 px-4">
          <LockToggle onClick={toggleLock} locked={locked.length>0}/>
          <SpaceButton onClick={addSpace} className="flex-1">Space</SpaceButton>
        </div>
          </div>
        )}
        {view === 'help' && <HelpModal onClose={() => setView('game')} />}
        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
        }}>
          {activeTile ? <Tile char={activeTile.char} id={''} ariaPressed={false} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}