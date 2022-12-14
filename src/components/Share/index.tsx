import { Button } from '../Button';
import { ReactComponent as ShareIcon } from '../../icons/share.svg';
import { ReactComponent as Screenshot} from '../../icons/screenshot.svg';
import { useEffect, useRef, useState } from 'react';
import { cover } from '../../icons/cover';
import { Track } from '../../interfaces/Spotify';
import { getTotalDuration } from '../../services/tracks';
import { clickSaveScreenshot, clickShare } from '../../services/gtm';
import * as Sentry from "@sentry/browser";

const titleSize = 62;
const subtitleSize = 28;
const trackNameSize = 30;
const lineSize = 31;
const marginBottom = 16;

export interface ShareProps {
  selectedTracks: Track[];
  spotifyPlaylist: string;
};

export const Share = ({ selectedTracks, spotifyPlaylist }: ShareProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File>();
  const [shareLoading, setShareLoading] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);

  useEffect(() => {
    const img = document.createElement('img');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1080;
      canvas.height = 1920;

      if(ctx) {
        ctx.fillStyle = '#222945';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 70, 35, 300, 300);

        let positionX = 70 + 300 + 35;
        let positionY = 35 + 35 + titleSize;
        ctx.font = `bold ${titleSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('The Eras Tour setlist',
          positionX,
          positionY
        );

        positionY += titleSize;
        ctx.font = `${subtitleSize}px Arial`;
        ctx.fillText(`${selectedTracks.length} song${selectedTracks.length === 1 ? '' : 's'}`,
          positionX,
          positionY
        );

        positionY += titleSize;
        ctx.font = `${subtitleSize}px Arial`;
        ctx.fillText(getTotalDuration(selectedTracks),
          positionX,
          positionY
        );

        positionX = 70;

        positionY = 35 + 300 + 70;

        for (let i = 0; i < selectedTracks.length; i++) {
          const track = selectedTracks[i];
          const name = track.name.replace(/\(Taylor's.*$/, '');

          ctx.font = `${trackNameSize}px Arial`;
          ctx.fillText(`${i + 1}`,
            positionX,
            positionY
          );

          const linePositionX = positionX + ctx.measureText(`${i + 1}   `).width;
          
          ctx.font = `bold ${trackNameSize}px Arial`;
          ctx.fillText(name,
            linePositionX,
            positionY
          );

          positionY += lineSize;
          positionY += marginBottom;
        }

        ctx.textAlign = 'center';

        ctx.font = `${subtitleSize}px Arial`;
        ctx.fillText('Make your own setlist',
        1080 / 2,
        1920 - subtitleSize - marginBottom - 38
        );
        
        ctx.font = `bold ${36}px Arial`;
        ctx.fillText('https://theerastour.vercel.app/',
          1080 / 2,
          1920 - subtitleSize - marginBottom
        );

        const dataUrl = canvas.toDataURL('image/jpeg');
        
        setImageUrl(dataUrl);

        if(canvas.toBlob) {
          canvas.toBlob((blob) => {
            if (!blob) return;
            const fileFromBlob = new File([blob], 'theerastour.jpg', {type: 'image/jpeg'});
            if(navigator.canShare?.({files: [fileFromBlob]})) {
              setImageFile(fileFromBlob);
            }
          });
        }
      }
    };
    img.src = cover;
  }, [selectedTracks]);

  const handleSaveScreenshot = async () => {
    setScreenshotLoading(true);
    const a = document.createElement('a');
    a.target = '_blank';
    a.download = 'theerastour.jpg';
    a.href = imageUrl;
    a.click();
    setScreenshotLoading(false);
    clickSaveScreenshot();
  };

  const handleShare = async () => {
    setShareLoading(true);
    
    let text = `${spotifyPlaylist ? spotifyPlaylist + '\n\n' : ''}`;
    text += `https://theerastour.vercel.app/`;

    navigator.share({
      text: text,
      files: imageFile && [imageFile],
      title: 'The Eras Tour',
    })
    .then(() => {
      
    })
    .catch((error) => {
      Sentry.captureException(error);
    });

    setShareLoading(false);
    clickShare();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {imageUrl && navigator.canShare({title: 'The Eras Tour'}) &&
        <Button
          loading={shareLoading}
          onClick={handleShare}
        >
          <div className="flex gap-2">
            <div className="w-5 h-5">
              <ShareIcon />
            </div>
            <div className="text-sm">
              Share
            </div>
          </div>
        </Button>
      }
      {imageUrl &&
        <Button
          loading={screenshotLoading}
          onClick={handleSaveScreenshot}
        >
          <div className="flex gap-2">
            <div className="w-5 h-5">
              <Screenshot />
            </div>
            <div className="text-sm">
              Save screenshot
            </div>
          </div>
        </Button>
      }
    </div>
  );
};
