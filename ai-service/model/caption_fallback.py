"""
Simple Caption Fallback Generator

When the full caption model fails to load, use a lightweight rule-based 
caption generator that analyzes image colors and attributes.

This provides reasonable captions without requiring TensorFlow/Keras H5 loading.
"""

import logging
from PIL import Image
import numpy as np

logger = logging.getLogger(__name__)


class SimpleCaptionGenerator:
    """Generate captions using image analysis without requiring model loading."""

    def __init__(self):
        """Initialize the simple caption generator (no model loading)."""
        self.ready = True
        logger.info("✅ Simple caption generator initialized")

    def _analyze_image_colors(self, image: Image.Image) -> dict:
        """Analyze dominant colors in the image."""
        img = image.convert("RGB").resize((64, 64))
        arr = np.array(img)
        
        # Get average color
        avg_color = arr.mean(axis=(0, 1))
        
        # Classify color
        r, g, b = avg_color
        if r > 150 and g > 100 and b < 100:
            color = "warm"
            color_desc = "warm-toned"
        elif r < 100 and g > 150 and b < 100:
            color = "green"
            color_desc = "green"
        elif r < 100 and g < 100 and b > 150:
            color = "cool"
            color_desc = "cool-toned"
        elif r > 150 and g > 150 and b > 150:
            color = "bright"
            color_desc = "bright"
        elif r < 100 and g < 100 and b < 100:
            color = "dark"
            color_desc = "dark"
        else:
            color = "neutral"
            color_desc = "neutral-toned"
        
        return {"color": color, "color_desc": color_desc}

    def _analyze_brightness(self, image: Image.Image) -> str:
        """Analyze overall brightness."""
        img = image.convert("L")
        arr = np.array(img)
        brightness = arr.mean()
        
        if brightness > 180:
            return "well-lit"
        elif brightness > 120:
            return "brightly lit"
        elif brightness > 80:
            return "moderately lit"
        else:
            return "dimly lit"

    def _generate_caption(self, analysis: dict, brightness: str) -> str:
        """Generate caption from analysis."""
        color_desc = analysis["color_desc"]
        
        templates = [
            f"A {brightness} {color_desc} scene",
            f"A {color_desc} composition that is {brightness}",
            f"This image features {color_desc} tones in a {brightness} environment",
            f"A {brightness} photograph with {color_desc} elements",
            f"An artistic {color_desc} image that is {brightness}",
        ]
        
        # Rotate through templates
        import random
        caption = random.choice(templates)
        return caption

    def predict(self, image: Image.Image) -> str:
        """Generate a simple caption based on image analysis."""
        try:
            analysis = self._analyze_image_colors(image)
            brightness = self._analyze_brightness(image)
            caption = self._generate_caption(analysis, brightness)
            logger.info(f"📝 Caption generated (fallback): {caption}")
            return caption
        except Exception as e:
            logger.error(f"❌ Caption generation failed: {e}")
            return "An interesting image"
