const axios = require('axios');
const { createCanvas } = require('canvas');
const fs = require('fs-extra');

// Ensure dist directory exists
fs.ensureDirSync('dist');

// GitHub API URL to get user stats
const username = 'kumudkode';
const apiUrl = `https://api.github.com/users/${username}`;

async function generatePixelCharacter() {
  try {
    // Get GitHub user data - fix the authentication
    const response = await axios.get(apiUrl, {
      headers: { 
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const userData = response.data;
    
    // Create a canvas for the pixel character
    const canvas = createCanvas(400, 400);
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, 400, 400);
    
    // Calculate character attributes based on GitHub stats
    const repoCount = userData.public_repos || 10;
    const followerCount = userData.followers || 5;
    const contributionLevel = Math.min(5, Math.floor(followerCount / 10) + 1);
    
    // Draw character based on stats
    drawPixelCharacter(ctx, repoCount, followerCount, contributionLevel);
    
    // Save the pixel character to the dist directory
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('dist/pixel-character.png', buffer);
    
    // Create SVG version for embedding
    const svgContent = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <image href="data:image/png;base64,${buffer.toString('base64')}" width="400" height="400"/>
      <text x="10" y="390" fill="white" font-family="monospace" font-size="12">Generated: ${new Date().toISOString()}</text>
    </svg>
    `;
    fs.writeFileSync('dist/pixel-character.svg', svgContent);
    
    console.log('Pixel character generated successfully!');
  } catch (error) {
    console.error('Error generating pixel character:', error);
    process.exit(1);
  }
}

function drawPixelCharacter(ctx, repoCount, followerCount, contributionLevel) {
  // Pixel size
  const pixelSize = 10;
  
  // Character color based on contribution level (1-5)
  const colors = [
    '#39d353', // Level 5 - Highest
    '#26a641', // Level 4
    '#006d32', // Level 3
    '#0e4429', // Level 2
    '#023a1d'  // Level 1 - Lowest
  ];
  const characterColor = colors[5 - contributionLevel];
  
  // Head size based on repository count
  const headSize = Math.min(15, Math.max(8, Math.floor(repoCount / 5) + 6));
  
  // Body height based on follower count
  const bodyHeight = Math.min(20, Math.max(10, Math.floor(followerCount / 3) + 8));
  
  // Draw character head
  ctx.fillStyle = characterColor;
  for (let y = 0; y < headSize; y++) {
    for (let x = 0; x < headSize; x++) {
      // Create a circular head shape
      if (Math.sqrt(Math.pow(x - headSize/2, 2) + Math.pow(y - headSize/2, 2)) <= headSize/2) {
        ctx.fillRect(
          200 - (headSize * pixelSize / 2) + (x * pixelSize), 
          100 + (y * pixelSize), 
          pixelSize, 
          pixelSize
        );
      }
    }
  }
  
  // Draw eyes
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(200 - pixelSize * 2, 100 + pixelSize * 5, pixelSize, pixelSize);
  ctx.fillRect(200 + pixelSize * 1, 100 + pixelSize * 5, pixelSize, pixelSize);
  
  // Draw mouth
  ctx.fillStyle = '#0d1117';
  const mouthWidth = contributionLevel + 1;
  for (let i = 0; i < mouthWidth; i++) {
    ctx.fillRect(200 - Math.floor(mouthWidth/2) * pixelSize + (i * pixelSize), 100 + pixelSize * 8, pixelSize, pixelSize);
  }
  
  // Draw body
  ctx.fillStyle = characterColor;
  for (let y = 0; y < bodyHeight; y++) {
    const width = Math.floor(headSize * 0.8);
    for (let x = 0; x < width; x++) {
      ctx.fillRect(
        200 - (width * pixelSize / 2) + (x * pixelSize), 
        100 + (headSize * pixelSize) + (y * pixelSize), 
        pixelSize, 
        pixelSize
      );
    }
  }
  
  // Draw arms
  const armLength = Math.min(12, Math.max(5, Math.floor(repoCount / 10) + 4));
  for (let i = 0; i < armLength; i++) {
    // Left arm
    ctx.fillRect(
      200 - (headSize * pixelSize / 2) - (i * pixelSize), 
      100 + (headSize * pixelSize) + (pixelSize * 5), 
      pixelSize, 
      pixelSize
    );
    // Right arm
    ctx.fillRect(
      200 + (headSize * pixelSize / 2) - pixelSize + (i * pixelSize), 
      100 + (headSize * pixelSize) + (pixelSize * 5), 
      pixelSize, 
      pixelSize
    );
  }
  
  // Draw legs
  const legLength = Math.min(15, Math.max(6, Math.floor(followerCount / 5) + 5));
  for (let i = 0; i < legLength; i++) {
    // Left leg
    ctx.fillRect(
      200 - pixelSize * 3, 
      100 + (headSize * pixelSize) + (bodyHeight * pixelSize) + (i * pixelSize), 
      pixelSize, 
      pixelSize
    );
    // Right leg
    ctx.fillRect(
      200 + pixelSize * 2, 
      100 + (headSize * pixelSize) + (bodyHeight * pixelSize) + (i * pixelSize), 
      pixelSize, 
      pixelSize
    );
  }
}

// Run the generator
generatePixelCharacter();
