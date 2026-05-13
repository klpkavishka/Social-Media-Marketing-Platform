import pickle
import sys
sys.path.insert(0, 'ai-service/model')

# Define SimpleTokenizer so pickle can find it
class SimpleTokenizer:
    def __init__(self):
        self.word_index = {}
        self.word_docs = {}
        self.document_count = 0
        self.oov_token = "<unk>"
        self.filters = '!"#$%&()*+,-./:;=?@[\\]^_`{|}~\t\n'
        self.lower = True

with open('ai-service/model/tokenizer.pkl', 'rb') as f:
    tok = pickle.load(f)
    
# Show what index 15 maps to
idx_to_word = {v: k for k, v in tok.word_index.items()}
print(f'Index 15 maps to: {idx_to_word.get(15, "NOT FOUND")}')

# Show first 30 indices
print('\nFirst 30 word indices:')
for i in range(30):
    word = idx_to_word.get(i, '?')
    print(f'  {i}: {word}')

# Count how many are real words vs synthetic
real_words = ['<pad>', '<unk>', 'pizza', 'cat', 'dog', 'bird', 'car', 'tree', 'flower', 'person']
real_count = sum(1 for word in tok.word_index.keys() if word in real_words or not word.startswith('word_'))
synthetic_count = sum(1 for word in tok.word_index.keys() if word.startswith('word_'))

print(f'\nTokenizer stats:')
print(f'  Real words: ~{real_count}')
print(f'  Synthetic filler words: {synthetic_count}')
print(f'  Total: {len(tok.word_index)}')
