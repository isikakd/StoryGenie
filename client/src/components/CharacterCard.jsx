import React from 'react';
import './CharacterCard.css';

export default function CharacterCard({ character, selected, onToggle, lang, disabled, variant }) {
  const name = character.name[lang] || character.name.tr;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) onToggle(character);
  };

  return (
    <button
      className={`char-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${variant ? `char-card--${variant}` : ''}`}
      onClick={handleClick}
      type="button"
      title={name}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {/* Seçili highlight kutusu — pointer-events none ile tıklamayı bloke etmez */}
      {selected && <div className="char-selected-bg" style={{ pointerEvents: 'none' }} />}

      <div className="char-visual" style={{ pointerEvents: 'none' }}>
        <div className="char-glow" />
        <img
          src={`/assets/characters/${character.file}`}
          alt={name}
          style={{
            pointerEvents: 'none',
            ...(character.scale ? {
              transform: `scale(${character.scale})`,
              transformOrigin: 'center bottom',
            } : undefined)
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="char-emoji-fallback" style={{ display: 'none', pointerEvents: 'none' }}>
          {character.emoji}
        </div>
        {selected && (
          <div className="char-check" style={{ pointerEvents: 'none' }}>
            <span>✓</span>
          </div>
        )}
      </div>
      <span className="char-name" style={{ pointerEvents: 'none' }}>{name}</span>
    </button>
  );
}