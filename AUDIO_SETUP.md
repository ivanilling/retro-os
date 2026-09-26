# 🎵 Audio Files Setup for Music Player

## Quick Setup

To enable music playback in the Retro OS Music Player, follow these simple steps:

### 1. Create the audio directory
```bash
mkdir -p public/audio
```

### 2. Add your MP3 files
Place your MP3 files in the `public/audio/` directory with these **exact filenames**:

```
public/audio/
├── creep.mp3
├── just.mp3
└── no-surprises.mp3
```

### 3. (Optional) Add cover art
Place cover images in `public/covers/` directory:

```
public/covers/
├── pablo-honey.jpg    (300x300px recommended)
├── the-bends.jpg
└── ok-computer.jpg
```

## Important Notes

- **Filenames must match exactly** (case-sensitive)
- Files must be in MP3 format
- If files are missing, the player will show a warning message but will still work with procedural noise
- Cover images are optional - a pixel-art cassette will be shown if missing

## Verification

After adding files, you can verify they're accessible:
```bash
# Check if files exist
ls -la public/audio/

# Should show:
# creep.mp3
# just.mp3
# no-surprises.mp3
```

## Troubleshooting

### Player shows "Audio files missing!" warning
- Check that files are in `public/audio/` directory
- Verify filenames match exactly (lowercase, with .mp3 extension)
- Rebuild the project: `npm run build`

### Files not playing
- Ensure MP3 files are valid and not corrupted
- Check browser console for error messages
- Verify file permissions allow reading

## File Sources

You can use:
- Your own MP3 files (renamed to match the required filenames)
- Royalty-free music from sites like:
  - Free Music Archive
  - Incompetech
  - Pixabay Music

## Technical Details

The Music Player component:
- Automatically checks for file existence on load
- Shows friendly warning if files are missing
- Falls back to procedural vinyl noise
- Supports play/pause, next/previous, loop, and volume control
- Displays pixel-art cassette when cover art is missing

---

**Note:** The player works perfectly without audio files - it generates procedural pink noise and vinyl crackles for a lo-fi atmosphere!
