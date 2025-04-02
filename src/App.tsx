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

  const upgradeRaccoon = (id: number) => {
    setRaccoons(prev => 
      prev.map(raccoon => 
        raccoon.id === id ? { ...raccoon, trashPerSecond: raccoon.trashPerSecond + 0.5 } : raccoon
      )
    );
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
        setBonusMessage(`${luckyRaccoon.name} #${luckyRaccoon.id} found a treasure! +${bonusAmount} trash`);
        setTrash(prev => prev + bonusAmount);
        setShowBonus(true);
        setTimeout(() => setShowBonus(false), 3000);
      }
    }, 5000);

    return () => clearInterval(bonusInterval);
  }, [raccoons]);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Raccoon Trash Collectors</h1>
        <div className="trash-count">Trash Collected: {Math.floor(trash)}</div>
        
        <button
          onClick={collectTrash}
          className="collect-button"
        >
          <Trash2 className="icon" />
          Collect Trash
        </button>

        {showBonus && (
          <div className="bonus-message">
            <Crown className="icon" />
            {bonusMessage}
          </div>
        )}
      </div>

      <div className="hire-section">
        <div className="hire-header">
          <h2>Hire Raccoons</h2>
          <button
            onClick={hireRaccoon}
            disabled={trash < baseRaccoonCost * (raccoons.length + 1)}
            className="hire-button"
          >
            <Plus className="icon" />
            Hire ({baseRaccoonCost * (raccoons.length + 1)} trash)
          </button>
        </div>

        <div className="raccoon-list">
          {raccoons.map(raccoon => (
            <div key={raccoon.id} className="raccoon-card">
              <img 
                src={raccoon.imageUrl} 
                alt={raccoon.name}
                className="raccoon-image"
              />
              <div className="raccoon-info">
                <h3 className="raccoon-name">{raccoon.name}</h3>
                <p className="raccoon-stats">Collects {raccoon.trashPerSecond} trash/second</p>
              </div>

              <button className="upgrade-button" onClick={() => upgradeRaccoon(raccoon.id)}>
                Upgrade
              </button>

              <div className="raccoon-id">#{raccoon.id}</div>
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
  );
}

export default App;