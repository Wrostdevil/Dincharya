import React, { useState } from 'react';
import {
  Music,
  ExternalLink,
  Sliders,
  CloudRain,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Headphones,
  Check,
} from 'lucide-react';
import { NeuCard, NeuButton, NeuSlider, NeuInput } from './NeumorphicElements';
import { sound } from '../utils/audio';

interface SpotifyPlaylist {
  id: string;
  name: string;
  genre: string;
  embedUri: string;
  description: string;
  coverAccent: string;
}

const SPOTIFY_PLAYLISTS: SpotifyPlaylist[] = [
  {
    id: 'lofi-beats',
    name: 'Lofi Beats',
    genre: 'Chill Instrumental',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    description: 'Beats to relax, study, and code to.',
    coverAccent: 'from-amber-400 to-rose-400',
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    genre: 'Ambient Electronica',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ?utm_source=generator&theme=0',
    description: 'Keep calm and focus with ambient electronic soundscapes.',
    coverAccent: 'from-indigo-500 to-cyan-400',
  },
  {
    id: 'peaceful-piano',
    name: 'Peaceful Piano',
    genre: 'Classical & Acoustic',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0',
    description: 'Peaceful piano melodies for contemplation and deep clarity.',
    coverAccent: 'from-sky-400 to-indigo-600',
  },
  {
    id: 'vedic-meditation',
    name: 'Vedic Chants & 432Hz',
    genre: 'Circadian Harmonics',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX9uKNf5jGX6m?utm_source=generator&theme=0',
    description: 'Root grounding and pineal focus frequencies.',
    coverAccent: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'jazz-focus',
    name: 'Jazz in the Background',
    genre: 'Smooth Instrumental',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWVqfgj8NZEp1?utm_source=generator&theme=0',
    description: 'Soft coffeehouse instrumental jazz backdrop.',
    coverAccent: 'from-amber-500 to-orange-600',
  },
];

export const SpotifyPlayer: React.FC = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist>(SPOTIFY_PLAYLISTS[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [activeEmbedUrl, setActiveEmbedUrl] = useState(SPOTIFY_PLAYLISTS[0].embedUri);

  // Ambient sound mixer channels (0 - 100)
  const [ambientVolumes, setAmbientVolumes] = useState<{
    rain: number;
    whitenoise: number;
    binaural: number;
  }>({
    rain: 0,
    whitenoise: 0,
    binaural: 0,
  });

  const handleSelectPlaylist = (pl: SpotifyPlaylist) => {
    sound.playClick('press');
    setSelectedPlaylist(pl);
    setActiveEmbedUrl(pl.embedUri);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick('press');
    if (!customUrl.trim()) return;

    let clean = customUrl.trim();
    if (clean.includes('open.spotify.com') && !clean.includes('/embed/')) {
      clean = clean.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    setActiveEmbedUrl(clean);
  };

  const handleAmbientSlider = (type: 'rain' | 'whitenoise' | 'binaural', val: number) => {
    setAmbientVolumes((prev) => ({ ...prev, [type]: val }));
    if (val > 0) {
      sound.startAmbient(type, val / 100);
      sound.setAmbientVolume(type, val / 100);
    } else {
      sound.stopAmbient(type);
    }
  };

  const handleToggleAmbient = (type: 'rain' | 'whitenoise' | 'binaural') => {
    sound.playClick('press');
    const current = ambientVolumes[type];
    if (current > 0) {
      handleAmbientSlider(type, 0);
    } else {
      handleAmbientSlider(type, 40);
    }
  };

  const handleResetAmbient = () => {
    sound.playClick('press');
    setAmbientVolumes({ rain: 0, whitenoise: 0, binaural: 0 });
    sound.stopAllAmbient();
  };

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600">
            <Headphones className="w-4 h-4" />
            <span>Acoustic Focus Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
            Spotify & Soundscapes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Immerse yourself in deep-work playlists and procedural biophilic soundscapes.
          </p>
        </div>

        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-white/95 text-xs font-bold text-slate-700 hover:text-emerald-600 shadow-xs hover:bg-white flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <span>Open Spotify Web</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Spotify Player Embed) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Player Embed Card */}
          <NeuCard className="p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-xs">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {selectedPlaylist.name}
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    {selectedPlaylist.genre}
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 uppercase tracking-wider">
                Spotify Web Player
              </span>
            </div>

            {/* Responsive Spotify Embed iframe */}
            <div className="w-full rounded-2xl overflow-hidden border border-slate-200/70 shadow-xs bg-slate-950">
              <iframe
                title="Spotify Embed"
                src={activeEmbedUrl}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl min-h-[260px] sm:min-h-[352px]"
              />
            </div>

            {/* Custom Spotify URL Bar */}
            <form onSubmit={handleApplyCustomUrl} className="mt-4 flex gap-2">
              <NeuInput
                placeholder="Paste any Spotify playlist, album, or track URL..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="text-xs"
              />
              <NeuButton
                type="submit"
                shape="pill"
                size="sm"
                variant="primary"
                className="font-bold flex-shrink-0"
              >
                Load
              </NeuButton>
            </form>
          </NeuCard>

          {/* Curated Productivity Playlists Selector */}
          <NeuCard className="p-6">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              Curated Deep Work Playlists
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SPOTIFY_PLAYLISTS.map((pl) => {
                const isSelected = selectedPlaylist.id === pl.id;

                return (
                  <div
                    key={pl.id}
                    onClick={() => handleSelectPlaylist(pl)}
                    className={`rounded-2xl p-4 cursor-pointer transition-all select-none border ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-400/80 shadow-xs ring-2 ring-indigo-500/20'
                        : 'bg-white/70 backdrop-blur-md border-white/90 hover:bg-white hover:border-white shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-sm text-slate-800">
                        {pl.name}
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-indigo-600 mt-0.5">
                      {pl.genre}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      {pl.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </NeuCard>
        </div>

        {/* Right Column (Layerable Ambient Soundscapes Mixer) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <NeuCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-black uppercase tracking-tight text-slate-800">
                  Ambient Audio Synthesizer
                </span>
              </div>

              <NeuButton
                shape="circle"
                size="sm"
                onClick={handleResetAmbient}
                title="Silence all ambient layers"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              </NeuButton>
            </div>

            <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">
              Layer procedural audio synthesis alongside Spotify for distraction-free flow states:
            </p>

            {/* Slider 1: Gentle Rain & Thunder */}
            <div className="flex flex-col gap-3.5">
              <div className="bg-white/80 backdrop-blur-md border border-white/95 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CloudRain className="w-4 h-4 text-sky-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Gentle Rain
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {ambientVolumes.rain}%
                    </span>
                    <button
                      onClick={() => handleToggleAmbient('rain')}
                      className={`p-1.5 rounded-xl border transition-all ${
                        ambientVolumes.rain > 0
                          ? 'bg-sky-50 text-sky-600 border-sky-200'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {ambientVolumes.rain > 0 ? (
                        <Volume2 className="w-3.5 h-3.5" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <NeuSlider
                  value={ambientVolumes.rain}
                  min={0}
                  max={100}
                  onChange={(val) => handleAmbientSlider('rain', val)}
                />
              </div>

              {/* Slider 2: 432Hz Binaural Waves */}
              <div className="bg-white/80 backdrop-blur-md border border-white/95 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      432Hz Alpha Waves
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {ambientVolumes.binaural}%
                    </span>
                    <button
                      onClick={() => handleToggleAmbient('binaural')}
                      className={`p-1.5 rounded-xl border transition-all ${
                        ambientVolumes.binaural > 0
                          ? 'bg-purple-50 text-purple-600 border-purple-200'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {ambientVolumes.binaural > 0 ? (
                        <Volume2 className="w-3.5 h-3.5" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <NeuSlider
                  value={ambientVolumes.binaural}
                  min={0}
                  max={100}
                  onChange={(val) => handleAmbientSlider('binaural', val)}
                />
              </div>

              {/* Slider 3: Smooth Brown Noise */}
              <div className="bg-white/80 backdrop-blur-md border border-white/95 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Radio className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Brown Sound Barrier
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {ambientVolumes.whitenoise}%
                    </span>
                    <button
                      onClick={() => handleToggleAmbient('whitenoise')}
                      className={`p-1.5 rounded-xl border transition-all ${
                        ambientVolumes.whitenoise > 0
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      {ambientVolumes.whitenoise > 0 ? (
                        <Volume2 className="w-3.5 h-3.5" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <NeuSlider
                  value={ambientVolumes.whitenoise}
                  min={0}
                  max={100}
                  onChange={(val) => handleAmbientSlider('whitenoise', val)}
                />
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-xs text-slate-600 leading-relaxed shadow-xs">
              💡 <strong>Cognitive Tip</strong>: Blending 30% Rain with 432Hz Alpha waves stabilizes electrical neural oscillations, dampening sensory distractors and increasing focus duration.
            </div>
          </NeuCard>
        </div>
      </div>
    </div>
  );
};
