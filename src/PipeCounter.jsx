import React, { useState, useRef, useEffect, useCallback } from 'react';
import './PipeCounter.css';

const MARKER_TYPES = {
  PIPE: { id: 'pipe', label: 'Pipe', color: '#4CAF50' },
  JOINT: { id: 'joint', label: 'Joint', color: '#2196F3' },
  VALVE: { id: 'valve', label: 'Valve', color: '#f44336' },
  METER: { id: 'meter', label: 'Meter', color: '#9C27B0' },
  SENSOR: { id: 'sensor', label: 'Sensor', color: '#FF9800' },
  PUMP: { id: 'pump', label: 'Pump', color: '#795548' }
};

function PipeCounter() {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [truckNumber, setTruckNumber] = useState('');
  const [showTruckInput, setShowTruckInput] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        if (canvasRef.current && containerRef.current) {
          const canvas = canvasRef.current;
          const container = containerRef.current;
          
          // Set canvas size to match container
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
          
          // Calculate initial scale to fit image
          const scaleX = container.clientWidth / img.naturalWidth;
          const scaleY = container.clientHeight / img.naturalHeight;
          const initialScale = Math.min(scaleX, scaleY) * 0.9; // Slightly smaller to show borders
          
          // Center the image
          setScale(initialScale);
          setPosition({
            x: (container.clientWidth - img.naturalWidth * initialScale) / 2,
            y: (container.clientHeight - img.naturalHeight * initialScale) / 2
          });
          
          setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
          imageRef.current = img;
          
          // Initial render
          requestAnimationFrame(renderCanvas);
        }
      };
    }
  }, [image]);

  // Render function for canvas
  const renderCanvas = useCallback(() => {
    if (!imageRef.current || !canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    const img = imageRef.current;
    
    // Update canvas size if container size changed
    if (canvas.width !== container.clientWidth || canvas.height !== container.clientHeight) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    // Clear canvas with light gray background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Enable image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Calculate scale to fit image
    const scaleX = container.clientWidth / img.naturalWidth;
    const scaleY = container.clientHeight / img.naturalHeight;
    const baseScale = Math.min(scaleX, scaleY);
    
    // Draw image
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(baseScale * scale, baseScale * scale);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    
    // Draw markers with numbers
    markers.forEach((marker, index) => {
      const markerX = position.x + marker.x * baseScale * scale;
      const markerY = position.y + marker.y * baseScale * scale;
      const markerSize = Math.min(10, 20 * baseScale * scale);
      
      // Draw marker
      ctx.beginPath();
      ctx.arc(markerX, markerY, markerSize, 0, 2 * Math.PI);
      ctx.fillStyle = MARKER_TYPES[marker.type.toUpperCase()]?.color || '#666';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw marker number
      ctx.font = `${Math.max(12, 16 * baseScale * scale)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.strokeText(index + 1, markerX, markerY);
      ctx.fillText(index + 1, markerX, markerY);
    });
  }, [scale, position, markers]);

  useEffect(() => {
    requestAnimationFrame(renderCanvas);
  }, [renderCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && imageRef.current) {
        const container = containerRef.current;
        const img = imageRef.current;
        
        // Recalculate scale and position
        const scaleX = container.clientWidth / img.naturalWidth;
        const scaleY = container.clientHeight / img.naturalHeight;
        const newScale = Math.min(scaleX, scaleY) * 0.9;
        
        setScale(newScale);
        setPosition({
          x: (container.clientWidth - img.naturalWidth * newScale) / 2,
          y: (container.clientHeight - img.naturalHeight * newScale) / 2
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setMarkers([]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle wheel event for zooming
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (!imageRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom factor based on wheel delta
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = scale * zoomFactor;

    // Limit zoom scale
    if (newScale < 0.1 || newScale > 10) return;

    // Calculate new position to zoom towards mouse cursor
    const newPosition = {
      x: mouseX - (mouseX - position.x) * zoomFactor,
      y: mouseY - (mouseY - position.y) * zoomFactor
    };

    setScale(newScale);
    setPosition(newPosition);
  }, [scale, position]);

  // Add wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel);
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) {  // Left mouse button for panning
      const rect = canvasRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  }, []);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e) => {
    if (isDragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setDragStart({ x: mouseX, y: mouseY });
    }
  }, [isDragging, dragStart]);

  // Handle mouse up for panning
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Check if click is near a marker
  const findNearbyMarker = useCallback((x, y, markers, threshold = 20) => {
    const container = containerRef.current;
    const img = imageRef.current;
    const scaleX = container.clientWidth / img.naturalWidth;
    const scaleY = container.clientHeight / img.naturalHeight;
    const baseScale = Math.min(scaleX, scaleY);

    return markers.findIndex(marker => {
      const markerScreenX = position.x + marker.x * baseScale * scale;
      const markerScreenY = position.y + marker.y * baseScale * scale;
      
      const distance = Math.sqrt(
        Math.pow(x - markerScreenX, 2) + 
        Math.pow(y - markerScreenY, 2)
      );
      
      return distance <= threshold;
    });
  }, [position, scale]);

  // Handle click for adding or removing markers
  const handleClick = useCallback((e) => {
    if (!isDragging && canvasRef.current && containerRef.current && imageRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if clicked on existing marker
      const nearbyMarkerIndex = findNearbyMarker(mouseX, mouseY, markers);
      if (nearbyMarkerIndex !== -1) {
        // Remove the marker if clicked
        setMarkers(prev => prev.filter((_, index) => index !== nearbyMarkerIndex));
        return;
      }
      
      // If not clicking on existing marker, add new marker
      const container = containerRef.current;
      const img = imageRef.current;
      
      // Convert click coordinates to image coordinates
      const scaleX = container.clientWidth / img.naturalWidth;
      const scaleY = container.clientHeight / img.naturalHeight;
      const baseScale = Math.min(scaleX, scaleY);
      
      const imageX = (mouseX - position.x) / (baseScale * scale);
      const imageY = (mouseY - position.y) / (baseScale * scale);
      
      // Only add marker if click is within image bounds
      if (imageX >= 0 && imageX <= img.naturalWidth && imageY >= 0 && imageY <= img.naturalHeight) {
        const newMarker = {
          x: imageX,
          y: imageY,
          type: 'pipe'
        };
        setMarkers(prev => [...prev, newMarker]);
      }
    }
  }, [isDragging, position, scale, markers, findNearbyMarker]);

  const handleDownload = () => {
    if (!truckNumber) {
      setShowTruckInput(true);
      return;
    }

    const canvas = document.createElement('canvas');
    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');

    // Draw the image
    ctx.drawImage(img, 0, 0);

    // Set text properties
    const fontSize = Math.min(40, img.naturalWidth / 20);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 2;

    // Draw markers
    markers.forEach((marker, index) => {
      const markerSize = Math.min(40, img.naturalWidth / 30);
      const x = marker.x;
      const y = marker.y;

      // Draw text with white border
      ctx.strokeStyle = 'white';
      ctx.strokeText(index + 1, x, y);
      
      // Draw text in black
      ctx.fillStyle = 'black';
      ctx.fillText(index + 1, x, y);
    });

    // Add truck number and total count at the top
    ctx.font = `bold ${fontSize * 1.2}px Arial`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, img.naturalWidth, fontSize * 2);
    ctx.fillStyle = 'white';
    ctx.fillText(`Truck Number: ${truckNumber} Total Pipes: ${markers.length}`, img.naturalWidth / 2, fontSize * 1.2);

    // Create download link
    const link = document.createElement('a');
    link.download = `truck_${truckNumber}_pipes_${markers.length}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="pipe-counter">
      <div className="toolbar">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        
        {!image ? (
          <button 
            className="upload-button"
            onClick={() => fileInputRef.current?.click()}
          >
            📸 Upload Truck Image
          </button>
        ) : (
          <>
            <div className="center-tools">
              <div className="zoom-controls">
                <button onClick={() => setScale(s => Math.min(s + 0.1, 10))} title="Zoom In">
                  🔍+
                </button>
                <span>{Math.round(scale * 100)}%</span>
                <button onClick={() => setScale(s => Math.max(s - 0.1, 0.1))} title="Zoom Out">
                  🔍-
                </button>
              </div>
            </div>

            <div className="right-tools">
              <div className="total-count">
                Total Pipes: {markers.length}
              </div>
              <button onClick={handleDownload}>
                💾 Save Image
              </button>
            </div>
          </>
        )}
      </div>

      {showTruckInput && (
        <div className="truck-input-overlay">
          <div className="truck-input-modal">
            <h3>Enter Truck Number</h3>
            <input
              type="text"
              value={truckNumber}
              onChange={(e) => setTruckNumber(e.target.value)}
              placeholder="Enter truck number"
            />
            <div className="modal-buttons">
              <button onClick={() => setShowTruckInput(false)}>Cancel</button>
              <button 
                onClick={() => {
                  if (truckNumber.trim()) {
                    setShowTruckInput(false);
                    handleDownload();
                  }
                }}
                disabled={!truckNumber.trim()}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {!image && (
        <div className="upload-prompt">
          <h2>Upload a truck loading image to start counting pipes</h2>
          <button onClick={() => fileInputRef.current?.click()}>
            Choose Image
          </button>
        </div>
      )}

      {image && (
        <div 
          className="image-container"
          ref={containerRef}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleClick}
          />
        </div>
      )}
    </div>
  );
}

export default PipeCounter;