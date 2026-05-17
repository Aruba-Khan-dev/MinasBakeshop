'use client';

import React, { useState } from 'react';

const themes = [
  { id: '1', name: 'Wedding', emoji: '💍', color: '#F283AE' },
  { id: '2', name: 'Eid', emoji: '✨', color: '#C59FBE' },
  { id: '3', name: 'Mehndi', emoji: '🎨', color: '#FAC1B5' },
  { id: '4', name: 'Baby Themes', emoji: '👶', color: '#98B8B9' },
  { id: '5', name: 'Anniversary', emoji: '💕', color: '#F283AE' },
  { id: '6', name: 'Vintage', emoji: '🌹', color: '#C6C870' },
  { id: '7', name: 'Bento Cakes', emoji: '📦', color: '#98B8B9' },
  { id: '8', name: 'Fondant', emoji: '🎂', color: '#C59FBE' },
];

export default function ThemeSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-[#F283AE] text-white p-3 rounded-full shadow-lg hover:bg-[#E86FA3]"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:sticky md:top-0 left-0 h-screen md:h-auto w-64 bg-white border-r border-gray-100 p-6 overflow-y-auto transition-transform duration-300 z-30 md:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#2C2C2C]">Browse by Theme</h3>
        </div>

        {/* Theme List */}
        <div className="space-y-2 mb-8">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setSelectedTheme(theme.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                selectedTheme === theme.id
                  ? 'bg-[#F0E8DF] border-l-4 border-[#F283AE]'
                  : 'hover:bg-[#F0E8DF]/50'
              }`}
            >
              <span className="text-xl">{theme.emoji}</span>
              <span className="text-sm font-medium text-[#2C2C2C]">{theme.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Order Section */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="bg-[#F283AE]/10 border border-[#F283AE]/30 rounded-lg p-4 mb-4">
            <p className="text-xs text-[#98898D] text-center">
              Can&apos;t find what you&apos;re looking for? Create a custom cake!
            </p>
          </div>

          <button className="w-full bg-[#F283AE] text-white font-semibold py-3 rounded-lg hover:bg-[#E86FA3] transition-colors">
            Custom Order
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
