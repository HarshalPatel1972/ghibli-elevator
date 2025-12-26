'use client';

import { useState, useRef, useEffect } from 'react';
import useSound from 'use-sound';

// Placeholder sounds (free to use assets)
const SOUNDS = {
  // Classic elevator ding
  DING: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_544a47a115.mp3?filename=elevator-ding-100612.mp3',
  // Mechanical button click
  CLICK: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_145c36af49.mp3?filename=switch-light-04-82204.mp3',
  // Door slide mechanism (pneumatic)
  DOOR: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=sliding-door-100665.mp3',
  // Lo-Fi Background Loop (Chillhop)
  BGM: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' 
};

export const useAudioElement = () => {
  const [playDing] = useSound(SOUNDS.DING, { volume: 0.5 });
  const [playClick] = useSound(SOUNDS.CLICK, { volume: 0.3 });
  const [playDoor] = useSound(SOUNDS.DOOR, { volume: 0.4 });
  
  return { playDing, playClick, playDoor };
};

export function AudioController() {
    return null; // This component might manage global state later
}
