import pickle
import os

tokenizer_path = "ai-service/model/tokenizer.pkl"

try:
    with open(tokenizer_path, 'rb') as f:
        # Try to load 
        data = pickle.load(f)
        print(f"✅ Tokenizer loaded successfully")
        print(f"Type: {type(data)}")
        if hasattr(data, 'word_index'):
            print(f"Word index size: {len(data.word_index)}")
            print(f"Sample words: {list(data.word_index.items())[:10]}")
        else:
            print(f"Attributes: {[a for a in dir(data) if not a.startswith('_')]}")
except ModuleNotFoundError as e:
    print(f"❌ Module error: {e}")
    print(f"   This means tokenizer was pickled with a module that's no longer available")
    print(f"   You need to regenerate tokenizer.pkl by running the training notebook")
except Exception as e:
    print(f"❌ Error loading tokenizer: {e}")
    print(f"   Error type: {type(e).__name__}")
