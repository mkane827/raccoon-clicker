import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Crown } from 'lucide-react';
import banditUrl from './raccoons/bandit.jpeg';
import rascalUrl from './raccoons/rascal.jpeg';
import scoutUrl from './raccoons/scout.jpeg';
import shadowUrl from './raccoons/shadow.jpeg';
import midnightUrl from './raccoons/midnight.jpeg';
import dustyUrl from './raccoons/dusty.jpeg';
import scavengerUrl from './raccoons/scavenger.jpeg';
import nibblesUrl from './raccoons/nibbles.jpeg';
import whiskersUrl from './raccoons/whiskers.jpeg';
import rockyUrl from './raccoons/rocky.jpeg';

interface Raccoon {
  id: number;
  name: string;
  trashPerSecond: number;
  cost: number;
  imageUrl: string;
}

function App() {
  const [trash, setTrash] = useState(0);
  const [raccoons, setRaccoons] = useState<Raccoon[]>([]);
  const [nextRaccoonId, setNextRaccoonId] = useState(1);
  const [bonusMessage, setBonusMessage] = useState('');
  const [showBonus, setShowBonus] = useState(false);

  const baseRaccoonCost = 10;
  const raccoonProfiles = [
    { name: 'Bandit', imageUrl: banditUrl },
    { name: 'Rascal', imageUrl: rascalUrl },
    { name: 'Scout', imageUrl: scoutUrl },
    { name: 'Shadow', imageUrl: shadowUrl },
    { name: 'Midnight', imageUrl: midnightUrl },
    { name: 'Dusty', imageUrl: dustyUrl },
    { name: 'Scavenger', imageUrl: scavengerUrl },
    { name: 'Nibbles', imageUrl: nibblesUrl },
    { name: 'Whiskers', imageUrl: whiskersUrl },
    { name: 'Rocky', imageUrl: rockyUrl }, 
  ];

  const collectTrash = () => {
    setTrash(prev => prev + 1);
  };

  const hireRaccoon = () => {
    if (trash >= baseRaccoonCost * (raccoons.length + 1)) {
      const randomProfile = raccoonProfiles[Math.floor(Math.random() * raccoonProfiles.length)];
      
      const newRaccoon: Raccoon = {
        id: nextRaccoonId,
        name: randomProfile.name,
        trashPerSecond: 0.5,
        cost: baseRaccoonCost * (raccoons.length + 1),
        imageUrl: randomProfile.imageUrl
      };
      
      setTrash(prev => prev - newRaccoon.cost);
      setRaccoons(prev => [...prev, newRaccoon]);
      setNextRaccoonId(prev => prev + 1);
    }
  };

  // Automatic trash collection
  useEffect(() => {
    const interval = setInterval(() => {
      if (raccoons.length > 0) {
        const totalPerSecond = raccoons.reduce((acc, r) => acc + r.trashPerSecond, 0);
        setTrash(prev => prev + totalPerSecond);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [raccoons]);

  // Random bonus events
  useEffect(() => {
    const bonusInterval = setInterval(() => {
      if (raccoons.length > 0 && Math.random() < 0.1) { // 10% chance every 5 seconds
        const bonusAmount = Math.floor(Math.random() * 10) + 5;
        const luckyRaccoon = raccoons[Math.floor(Math.random() * raccoons.length)];
        setBonusMessage(`${luckyRaccoon.name} found a treasure! +${bonusAmount} trash`);
        setTrash(prev => prev + bonusAmount);
        setShowBonus(true);
        setTimeout(() => setShowBonus(false), 3000);
      }
    }, 5000);

    return () => clearInterval(bonusInterval);
  }, [raccoons]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Raccoon Trash Collectors</h1>
          <div className="text-2xl mb-4">
            Trash Collected: {Math.floor(trash)}
          </div>
          
          <button
            onClick={collectTrash}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 active:scale-95 mb-4"
          >
            <Trash2 className="inline-block mr-2" />
            Collect Trash
          </button>

          {showBonus && (
            <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black p-4 rounded-lg shadow-lg animate-bounce">
              <Crown className="inline-block mr-2" />
              {bonusMessage}
            </div>
          )}
        </div>

        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Hire Raccoons</h2>
            <button
              onClick={hireRaccoon}
              disabled={trash < baseRaccoonCost * (raccoons.length + 1)}
              className={`flex items-center px-4 py-2 rounded ${
                trash >= baseRaccoonCost * (raccoons.length + 1)
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              <Plus className="mr-2" />
              Hire ({baseRaccoonCost * (raccoons.length + 1)} trash)
            </button>
          </div>

          <div className="grid gap-4">
            {raccoons.map(raccoon => (
              <div key={raccoon.id} className="bg-gray-600 p-4 rounded-lg flex items-center gap-4">
                <img 
                  src={raccoon.imageUrl} 
                  alt={raccoon.name}
                  className="w-16 h-16 rounded-full object-cover bg-gray-500"
                />
                <div className="flex-1">
                  <h3 className="font-bold">{raccoon.name}</h3>
                  <p className="text-sm text-gray-300">Collects {raccoon.trashPerSecond} trash/second</p>
                </div>
                <div className="bg-gray-500 px-3 py-1 rounded-full text-sm">
                  #{raccoon.id}
                </div>
              </div>
            ))}
          </div>

          {raccoons.length === 0 && (
            <p className="text-center text-gray-400 py-4">
              No raccoons hired yet. Hire your first raccoon!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;