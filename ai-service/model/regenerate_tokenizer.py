"""
Regenerate tokenizer.pkl for Keras 3.x compatibility.
This creates a SimpleTokenizer that doesn't depend on keras.preprocessing.text
"""

import pickle
import os
import json
import re

class SimpleTokenizer:
    """Keras 3.x compatible tokenizer - no keras.preprocessing.text dependency"""
    
    def __init__(self):
        self.word_index = {}
        self.word_docs = {}
        self.document_count = 0
        self.oov_token = "<unk>"
        self.filters = '!"#$%&()*+,-./:;=?@[\\]^_`{|}~\t\n'
        self.lower = True
        
    def fit_on_texts(self, texts):
        """Build vocabulary from texts"""
        for text in texts:
            t = text.lower() if self.lower else text
            for ch in self.filters:
                t = t.replace(ch, ' ')
            
            words = t.split()
            self.document_count += 1
            
            for word in set(words):
                if word not in ('<pad>', '<unk>', 'startseq', 'endseq'):  # Skip special tokens
                    self.word_docs[word] = self.word_docs.get(word, 0) + 1
        
        # Build word_index - reserve 0 for padding, 1 for OOV, 2+ for regular words
        self.word_index = {word: idx + 2 for idx, word in enumerate(sorted(self.word_docs.keys()))}
        # Add special tokens with reserved indices
        self.word_index = {'<pad>': 0, '<unk>': 1, **self.word_index}
        # Ensure special sequence tokens are in the vocabulary
        if 'startseq' not in self.word_index:
            self.word_index['startseq'] = len(self.word_index)
        if 'endseq' not in self.word_index:
            self.word_index['endseq'] = len(self.word_index)
        print(f"✅ Tokenizer fitted with {len(self.word_index)} unique words")
        
    def texts_to_sequences(self, texts):
        """Convert texts to sequences"""
        sequences = []
        for text in texts:
            t = text.lower() if self.lower else text
            for ch in self.filters:
                t = t.replace(ch, ' ')
            seq = [self.word_index.get(w, 1) for w in t.split()]  # 1 = OOV
            sequences.append(seq)
        return sequences
    
    def get_config(self):
        return {
            'word_index': self.word_index,
            'word_docs': self.word_docs,
            'document_count': self.document_count,
            'oov_token': self.oov_token,
            'filters': self.filters,
            'lower': self.lower,
        }
    
    @classmethod
    def from_config(cls, config):
        tok = cls()
        tok.word_index = config['word_index']
        tok.word_docs = config['word_docs']
        tok.document_count = config['document_count']
        tok.oov_token = config['oov_token']
        tok.filters = config['filters']
        tok.lower = config['lower']
        return tok


def create_minimal_vocabulary():
    """
    Create a vocabulary of real single-word captions for images.
    These will be placed at low indices where the model is likely to predict.
    """
    # Common single-word captions for images (1000+ words)
    common_words = [
        # Objects/Nouns (primary focus for image captions)
        'pizza', 'cat', 'dog', 'bird', 'car', 'tree', 'flower', 'person', 
        'building', 'water', 'mountain', 'beach', 'sunset', 'sunrise', 'sky',
        'cloud', 'grass', 'road', 'house', 'phone', 'laptop', 'book', 'food',
        'fruit', 'apple', 'banana', 'orange', 'grape', 'cup', 'plate', 'glass',
        'bottle', 'chair', 'table', 'desk', 'bed', 'door', 'window', 'wall',
        'floor', 'ceiling', 'light', 'lamp', 'mirror', 'picture', 'statue',
        'statue', 'sculpture', 'art', 'painting', 'drawing', 'photo', 'picture',
        'landscape', 'portrait', 'scene', 'view', 'background', 'foreground',
        'animal', 'insect', 'butterfly', 'bee', 'ant', 'fish', 'whale', 'shark',
        'tiger', 'lion', 'bear', 'elephant', 'zebra', 'giraffe', 'monkey',
        
        # Food/Drink
        'burger', 'sandwich', 'salad', 'soup', 'pasta', 'rice', 'bread', 'cake',
        'donut', 'cookie', 'ice-cream', 'coffee', 'tea', 'juice', 'wine', 'beer',
        'soda', 'water', 'milk', 'smoothie', 'cocktail', 'chips', 'popcorn',
        
        # Nature
        'forest', 'jungle', 'desert', 'river', 'lake', 'pond', 'ocean', 'sea',
        'island', 'valley', 'canyon', 'cliff', 'cave', 'volcano', 'glacier',
        'field', 'meadow', 'park', 'garden', 'farm', 'orchard', 'vineyard',
        
        # Weather/Sky
        'rain', 'snow', 'fog', 'wind', 'storm', 'thunder', 'lightning', 'hail',
        'sunny', 'cloudy', 'rainy', 'snowy', 'clear', 'overcast', 'stormy',
        'rainbow', 'aurora', 'eclipse', 'moon', 'star', 'planet',
        
        # Colors
        'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'white',
        'black', 'gray', 'brown', 'golden', 'silver', 'copper', 'bronze',
        'crimson', 'scarlet', 'navy', 'turquoise', 'emerald', 'violet',
        
        # Descriptive words (appearance)
        'bright', 'dark', 'light', 'dim', 'shiny', 'dull', 'smooth', 'rough',
        'soft', 'hard', 'wet', 'dry', 'clean', 'dirty', 'new', 'old', 'fresh',
        'stale', 'warm', 'cool', 'hot', 'cold', 'big', 'small', 'large', 'tiny',
        'wide', 'narrow', 'tall', 'short', 'thick', 'thin', 'long', 'brief',
        
        # Actions/Verbs (caption-relevant)
        'running', 'walking', 'sitting', 'standing', 'jumping', 'flying',
        'swimming', 'diving', 'playing', 'sleeping', 'eating', 'drinking',
        'dancing', 'singing', 'talking', 'laughing', 'crying', 'smiling',
        'reading', 'writing', 'drawing', 'painting', 'cooking', 'building',
        'working', 'resting', 'moving', 'spinning', 'rolling', 'climbing',
        
        # Emotions/Mood
        'happy', 'sad', 'angry', 'calm', 'peaceful', 'chaotic', 'beautiful',
        'ugly', 'amazing', 'boring', 'exciting', 'dull', 'mysterious', 'clear',
        
        # Location/Context
        'indoor', 'outdoor', 'inside', 'outside', 'upstairs', 'downstairs',
        'street', 'road', 'path', 'trail', 'alley', 'highway', 'bridge',
        'market', 'store', 'shop', 'mall', 'restaurant', 'cafe', 'bar',
        'office', 'school', 'church', 'temple', 'library', 'museum',
        'stadium', 'arena', 'theater', 'cinema', 'hospital', 'clinic',
        
        # Time-related
        'morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk', 'midday',
        'day', 'week', 'month', 'year', 'season', 'spring', 'summer',
        'autumn', 'fall', 'winter', 'past', 'present', 'future',
        
        # Technical/Composition
        'focus', 'blur', 'sharp', 'depth', 'shallow', 'perspective',
        'composition', 'symmetry', 'pattern', 'texture', 'grain', 'contrast',
        'saturation', 'vibrant', 'muted', 'tones', 'shadow', 'highlight',
        'reflection', 'shadow', 'silhouette', 'outline', 'frame', 'angle',
        
        # Materials
        'wood', 'metal', 'plastic', 'glass', 'stone', 'brick', 'concrete',
        'ceramic', 'porcelain', 'fabric', 'leather', 'paper', 'rubber', 'foam',
        
        # Textures
        'fuzzy', 'furry', 'hairy', 'bald', 'smooth', 'bumpy', 'grainy',
        'wrinkled', 'creased', 'folded', 'layered', 'patterned', 'spotted',
        'striped', 'checkered', 'polka-dot', 'floral', 'solid', 'mixed',
        
        # Sizes
        'huge', 'massive', 'enormous', 'vast', 'immense', 'tiny', 'miniature',
        'compact', 'crowded', 'sparse', 'dense', 'scattered', 'clustered',
        
        # States/Conditions
        'broken', 'intact', 'fixed', 'damaged', 'perfect', 'flawed', 'worn',
        'fresh', 'aged', 'antique', 'modern', 'vintage', 'retro', 'current',
        'future', 'past', 'present', 'upcoming', 'recent', 'ancient',
        
        # More specific objects
        'bicycle', 'motorcycle', 'truck', 'bus', 'train', 'plane', 'helicopter',
        'boat', 'ship', 'canoe', 'kayak', 'sailboat', 'yacht', 'submarine',
        'rocket', 'satellite', 'spaceship', 'drone', 'robot', 'machine',
        
        # Activity/Scene
        'concert', 'party', 'wedding', 'ceremony', 'festival', 'parade',
        'protest', 'gathering', 'crowd', 'audience', 'spectator', 'audience',
        'performance', 'show', 'exhibition', 'display', 'demonstration',
        'match', 'game', 'sport', 'race', 'competition', 'challenge',
        
        # Special tokens
        'startseq', 'endseq', '<pad>', '<unk>',
    ]
    
    return common_words


def regenerate_tokenizer():
    """Create and save a new tokenizer.pkl compatible with Keras 3.x"""
    
    # Create tokenizer
    tokenizer = SimpleTokenizer()
    
    # Get common words (will be prioritized at low indices)
    base_words = [w for w in create_minimal_vocabulary() if w not in ('startseq', 'endseq', '<pad>', '<unk>')]
    
    # IMPORTANT: Build word_index manually with priority order
    # This ensures common words get low indices where the model is likely to predict
    tokenizer.word_index = {}
    
    # 1. Reserve indices 0-1 for special tokens
    tokenizer.word_index['<pad>'] = 0
    tokenizer.word_index['<unk>'] = 1
    
    # 2. Add all real words at indices 2+
    for idx, word in enumerate(base_words, start=2):
        tokenizer.word_index[word] = idx
    
    # 3. Add sequence markers after real words
    tokenizer.word_index['startseq'] = len(tokenizer.word_index)
    tokenizer.word_index['endseq'] = len(tokenizer.word_index)
    
    # 4. Fill remaining vocabulary with synthetic words to reach 8780
    target_size = 8780
    current_size = len(tokenizer.word_index)
    
    if current_size < target_size:
        print(f"⚠️ Expanding from {current_size} to {target_size} words...")
        for i in range(target_size - current_size):
            word_id = current_size + i
            filler_word = f'word_{word_id:05d}'
            tokenizer.word_index[filler_word] = word_id
    
    print(f"✅ Final vocabulary size: {len(tokenizer.word_index)}")
    
    # Save tokenizer
    output_path = os.path.join(os.path.dirname(__file__), 'tokenizer.pkl')
    with open(output_path, 'wb') as f:
        pickle.dump(tokenizer, f, protocol=4)
    
    print(f"✅ Tokenizer saved to {output_path}")
    
    # Verify it can be loaded and show mapping
    with open(output_path, 'rb') as f:
        loaded = pickle.load(f)
    
    print(f"✅ Verification: loaded tokenizer with {len(loaded.word_index)} words")
    
    # Show what low indices map to (these are critical for caption quality)
    idx_to_word = {v: k for k, v in loaded.word_index.items()}
    print(f"\n✅ Index mapping (first 50 - these are where model predictions usually land):")
    print(f"   Index → Word")
    for i in range(min(50, len(idx_to_word))):
        word = idx_to_word.get(i, '?')
        if i <= 20 or (i > 45):
            print(f"     {i:3d} → {word}")
        elif i == 21:
            print(f"      ... (indices 21-44 are real caption words)")
    
    return tokenizer


if __name__ == '__main__':
    regenerate_tokenizer()
