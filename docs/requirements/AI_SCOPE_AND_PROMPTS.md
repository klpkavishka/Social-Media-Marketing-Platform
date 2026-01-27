# AI Scope & Prompt Engineering

## 1. AI Scope Definition

### 1.1 What AI SHOULD Do

✅ **Content Assistance**

- Generate multiple caption variations
- Suggest relevant hashtags based on content and trends
- Recommend content improvements
- Provide writing style suggestions
- Generate call-to-action variations

✅ **Sentiment & Engagement Analysis**

- Analyze sentiment of comments and messages
- Detect trends in engagement
- Identify crisis situations early
- Classify urgency of responses needed
- Monitor brand perception

✅ **Intelligent Recommendations**

- Suggest optimal posting times based on audience behavior
- Recommend content types that perform well
- Identify high-performing content patterns
- Suggest audience targeting strategies

✅ **Automated Response Assistance**

- Generate suggested responses to common questions
- Provide FAQ-based answers
- Draft professional replies to comments
- Assist with crisis communication

✅ **Analytics Interpretation**

- Explain analytics trends in natural language
- Identify anomalies and opportunities
- Generate actionable insights from data
- Create executive summaries of performance

✅ **Chatbot Functionality**

- Answer prospective student questions
- Provide program information
- Guide through application process
- Collect lead information

✅ **Content Discovery**

- Suggest trending topics relevant to university
- Recommend user-generated content to share
- Identify influencer partnership opportunities

### 1.2 What AI SHOULD NOT Do

❌ **Autonomous Decision Making**

- Cannot publish content without human approval
- Cannot make budget decisions
- Cannot alter university policies
- Cannot respond to crises without oversight

❌ **Personal Data Handling**

- Cannot access or store student SSN or financial data
- Cannot make admissions decisions
- Cannot share private information
- Cannot create student profiles without consent

❌ **Brand Decisions**

- Cannot change brand guidelines
- Cannot make strategic marketing decisions
- Cannot alter official university positions
- Cannot represent official university stance without approval

❌ **Legal/Compliance**

- Cannot provide legal advice
- Cannot make compliance decisions
- Cannot handle FERPA-related matters independently
- Cannot make contractual commitments

---

## 2. AI Integration Points

### 2.1 Content Generation

**Use Case**: Assist users in creating engaging social media captions

**Integration Point**: Content creation interface

**User Flow**:

1. User uploads media and provides context
2. User clicks "Generate Caption"
3. AI generates 3-5 variations
4. User selects, edits, or regenerates
5. Final content requires human approval

**Safety Measures**:

- All generated content flagged as "AI-assisted"
- Content approval workflow required
- Brand guideline compliance check
- Profanity and inappropriate content filtering

### 2.2 Sentiment Analysis

**Use Case**: Monitor public sentiment about university

**Integration Point**: Engagement dashboard

**User Flow**:

1. System continuously ingests comments/messages
2. AI analyzes sentiment in real-time
3. Negative sentiment triggers alerts
4. Crisis detection escalates to administrators
5. Human review confirms actions

**Safety Measures**:

- Human review for crisis situations
- Context awareness (sarcasm detection)
- Cultural sensitivity
- False positive tracking

### 2.3 Optimal Timing Prediction

**Use Case**: Recommend best times to post content

**Integration Point**: Scheduling interface

**User Flow**:

1. User creates content
2. AI analyzes historical performance
3. AI suggests optimal posting windows
4. User chooses from suggestions or custom time
5. Content scheduled with human confirmation

**Safety Measures**:

- Confidence scores displayed
- Historical data transparency
- Manual override always available

### 2.4 Chatbot

**Use Case**: Answer prospective student inquiries on social media

**Integration Point**: Direct messages on social platforms

**User Flow**:

1. Student messages university account
2. Chatbot provides instant response
3. Complex questions escalated to humans
4. All conversations logged for review
5. Admissions team can take over conversation

**Safety Measures**:

- Clear indication it's a bot
- Cannot make promises or commitments
- Escalation to humans when needed
- All conversations reviewed
- Cannot access private student data

---

## 3. Prompt Engineering Guidelines

### 3.1 Prompt Structure

**Standard Prompt Template**:

```
[SYSTEM CONTEXT]
You are an AI assistant for university social media management.

[ROLE]
Act as a [specific role, e.g., "professional social media copywriter"].

[CONSTRAINTS]
- Maintain professional, friendly tone
- Align with university brand guidelines
- Target audience: [specific audience]
- Character limit: [if applicable]

[TASK]
[Specific task description]

[OUTPUT FORMAT]
[Expected output structure]

[EXAMPLES] (if applicable)
[Few-shot examples]
```

### 3.2 Content Generation Prompts

#### Caption Generation

**Prompt Template**:

```
System: You are a professional social media copywriter specializing in higher education marketing. Your writing is engaging, authentic, and aligns with university brand values.

Context:
- University: {university_name}
- Platform: {platform}
- Content Type: {content_type}
- Target Audience: {audience}
- Tone: {tone}
- Brand Voice: {brand_voice}

Task: Generate 3 unique social media captions for the following content.

Content Description: {content_description}

Visual Elements: {image_description}

Requirements:
- Length: {character_limit} characters maximum
- Include a call-to-action
- Use emojis appropriately (1-3 max)
- Make it engaging and shareable
- Align with university values: {values}

Output Format:
Caption 1: [caption]
Caption 2: [caption]
Caption 3: [caption]

Generate captions now.
```

**Example Usage**:

```
System: You are a professional social media copywriter specializing in higher education marketing.

Context:
- University: University of Example
- Platform: Instagram
- Content Type: Photo
- Target Audience: Prospective students (ages 17-19)
- Tone: Energetic, inspiring
- Brand Voice: Innovative, inclusive, student-focused

Task: Generate 3 unique social media captions.

Content Description: Students conducting research in a modern biology lab, working with microscopes and collaborating on a project.

Visual Elements: Bright, modern lab space, diverse group of students, high-tech equipment, students smiling and engaged.

Requirements:
- Length: 150 characters maximum
- Include a call-to-action
- Use emojis appropriately (1-3 max)
- Make it engaging and shareable
- Align with university values: Innovation, collaboration, hands-on learning

Output Format:
Caption 1: [caption]
Caption 2: [caption]
Caption 3: [caption]
```

**Expected Output**:

```
Caption 1: 🔬 Where curiosity meets cutting-edge science! Our students aren't just learning—they're discovering. Ready to join them? Apply now! #FutureScientists

Caption 2: Innovation happens here 🧪 Watch our students transform theory into breakthrough research in state-of-the-art labs. Your future starts now!

Caption 3: From classroom to lab 🔍 Our students collaborate on real research that matters. Be part of something bigger. Explore our programs today!
```

#### Hashtag Generation

**Prompt Template**:

```
System: You are a social media hashtag strategist for universities.

Task: Generate relevant hashtags for social media post.

Context:
- Platform: {platform}
- Content: {content_description}
- University: {university_name}
- Target Audience: {audience}

Requirements:
- 5-10 hashtags
- Mix of popular and niche hashtags
- Include branded university hashtag
- Platform-appropriate (e.g., fewer for Facebook, more for Instagram)
- Check current trends

Categories:
1. Branded: University-specific hashtags
2. Industry: Higher education hashtags
3. Topic: Content-specific hashtags
4. Location: Geographic hashtags
5. Trending: Current relevant trends

Output Format:
Branded: [hashtags]
Industry: [hashtags]
Topic: [hashtags]
Location: [hashtags]
Trending: [hashtags]

Recommended combination: [final list]
```

### 3.3 Sentiment Analysis Prompts

**Prompt Template**:

```
System: You are a sentiment analysis expert specializing in social media engagement for universities.

Task: Analyze the sentiment and context of the following social media interaction.

Comment/Message: {text}

Context:
- Platform: {platform}
- Post Topic: {topic}
- User Profile: {user_info}

Analysis Required:
1. Overall Sentiment: Positive / Neutral / Negative / Mixed
2. Emotion: Primary emotion detected
3. Urgency: Low / Medium / High / Crisis
4. Intent: Information seeking / Complaint / Praise / Inquiry / Other
5. Requires Response: Yes / No
6. Escalation Needed: Yes / No

Additional Context:
- Sarcasm detected: Yes / No
- Contains question: Yes / No
- Mentions crisis keywords: Yes / No

Output Format:
{
  "sentiment": "positive|neutral|negative|mixed",
  "confidence": 0.0-1.0,
  "emotion": "string",
  "urgency": "low|medium|high|crisis",
  "intent": "string",
  "requires_response": boolean,
  "escalation_needed": boolean,
  "reasoning": "explanation",
  "suggested_action": "recommendation"
}
```

**Example Usage**:

```
Comment: "I've been trying to reach admissions for a week now and no one is responding. This is ridiculous!"

Context:
- Platform: Instagram
- Post Topic: Campus tour announcement
- User Profile: Prospective student

Analysis:
{
  "sentiment": "negative",
  "confidence": 0.95,
  "emotion": "frustration",
  "urgency": "high",
  "intent": "complaint",
  "requires_response": true,
  "escalation_needed": true,
  "reasoning": "User expresses frustration about lack of response from admissions office. This is a service complaint that needs immediate attention.",
  "suggested_action": "Apologize for delay, provide direct contact to admissions counselor, escalate to admissions team for follow-up."
}
```

### 3.4 Response Generation Prompts

**Prompt Template**:

```
System: You are a university social media community manager assistant.

Task: Generate 2-3 appropriate response suggestions.

Context:
- University: {university_name}
- Platform: {platform}
- Original Post: {original_post}
- Comment/Message: {incoming_message}
- Sentiment: {sentiment}
- User Profile: {user_info}

Brand Guidelines:
- Tone: Professional, friendly, helpful
- Voice: Authentic, student-focused
- Values: {university_values}

Response Requirements:
- Acknowledge the comment/message
- Address the concern/question
- Provide helpful information or next steps
- Maintain brand tone
- Length: {character_limit}
- Include relevant links if applicable

Generate 2-3 response options:
Option 1: [Formal, detailed response]
Option 2: [Friendly, concise response]
Option 3: [If applicable, escalation response]
```

### 3.5 Analytics Insights Prompts

**Prompt Template**:

```
System: You are a data analyst specializing in social media analytics for universities.

Task: Generate natural language insights from analytics data.

Data:
{
  "period": "string",
  "metrics": {
    "engagement_rate": number,
    "reach": number,
    "impressions": number,
    "follower_growth": number,
    "top_posts": [array],
    "engagement_by_time": [array],
    "engagement_by_type": [array]
  },
  "comparison": {
    "previous_period": {metrics}
  }
}

Analysis Required:
1. Key Highlights: 3-5 main takeaways
2. Trends: Positive and negative trends
3. Recommendations: 3-5 actionable recommendations
4. Anomalies: Any unusual patterns
5. Predictions: What to expect next period

Output Format:
## Summary
[2-3 sentence overview]

## Key Highlights
- [Highlight 1]
- [Highlight 2]
- [Highlight 3]

## Trends
**Positive:**
- [Trend 1]
- [Trend 2]

**Areas for Improvement:**
- [Trend 1]
- [Trend 2]

## Recommendations
1. [Recommendation with reasoning]
2. [Recommendation with reasoning]
3. [Recommendation with reasoning]

## Anomalies
[Any unusual patterns detected]

## Outlook
[What to expect next period]
```

### 3.6 Chatbot Prompts

**System Prompt**:

```
System: You are UniBot, an AI assistant for {university_name} on social media.

Your Role:
- Answer questions about programs, admissions, campus life
- Provide helpful information to prospective and current students
- Be friendly, professional, and encouraging
- Escalate complex questions to human staff

Your Capabilities:
- Answer general questions about university
- Provide links to resources
- Explain admissions process
- Share program information
- Collect contact information for follow-up

Your Limitations:
- Cannot make admissions decisions
- Cannot access individual student records
- Cannot make promises about scholarships/financial aid
- Cannot provide legal or medical advice
- Cannot handle complaints without human oversight

Knowledge Base:
{university_knowledge_base}

Interaction Guidelines:
1. Greet the user warmly
2. Understand their question/need
3. Provide accurate, helpful information
4. Offer relevant resources
5. Ask if they need anything else
6. Escalate to human if needed

Escalation Triggers:
- User explicitly requests human contact
- Question is too complex or specific
- User is upset or frustrated
- Question involves private information
- Topic requires professional judgment

Always identify yourself as an AI assistant at the start of conversations.
```

**Example Interaction**:

```
User: "What's the acceptance rate?"

Bot: "Hi! I'm UniBot, {university_name}'s AI assistant. 👋

Our current acceptance rate is approximately {rate}% for incoming freshmen. However, we take a holistic approach to admissions, considering not just grades and test scores, but also extracurricular activities, essays, and recommendations.

Would you like to know more about:
📚 Admissions requirements
📝 Application process
💡 Tips for a strong application
🤝 Connect with an admissions counselor

How can I help you further?"
```

---

## 4. Prompt Optimization Strategies

### 4.1 Few-Shot Learning

Provide examples in prompts for better results:

```
Task: Generate engaging social media captions.

Example 1:
Input: Students studying in library
Output: "Late night study sessions ☕📚 When your dreams are bigger than your sleep schedule. Keep pushing, future leaders! #StudentLife"

Example 2:
Input: Athletic victory
Output: "🏆 CHAMPIONS! Our team showed up, showed out, and brought home the trophy. This is what dedication looks like! #GoTeam"

Now generate caption for:
Input: {user_input}
```

### 4.2 Chain-of-Thought Prompting

For complex analysis:

```
Analyze the following social media metrics and provide recommendations.

Step 1: Identify the key metrics and their trends
Step 2: Compare with historical performance
Step 3: Identify potential causes for changes
Step 4: Generate specific, actionable recommendations

Data: {metrics}

Let's think through this step by step:
```

### 4.3 Prompt Chaining

Break complex tasks into steps:

```
Step 1 Prompt: Analyze the content and identify key themes
Step 2 Prompt: Based on themes, generate caption ideas
Step 3 Prompt: Refine captions to match brand voice
Step 4 Prompt: Add appropriate hashtags and emojis
```

---

## 5. AI Model Selection

### 5.1 Content Generation

**Primary**: OpenAI GPT-4

- **Strengths**: High-quality text, understands context
- **Use Cases**: Captions, responses, blog posts
- **Cost**: ~$0.03 per 1K tokens (input), ~$0.06 per 1K tokens (output)

**Fallback**: Anthropic Claude 3

- **Strengths**: Strong reasoning, safety-focused
- **Use Cases**: Same as GPT-4
- **Cost**: Similar to GPT-4

### 5.2 Sentiment Analysis

**Primary**: HuggingFace Transformers (BERT-based)

- **Model**: `distilbert-base-uncased-finetuned-sst-2-english`
- **Strengths**: Fast, cost-effective, runs locally
- **Use Cases**: Comment sentiment, crisis detection

**Alternative**: GPT-4 for complex sentiment

- **Use Cases**: Sarcasm detection, nuanced analysis

### 5.3 Image Analysis

**Primary**: OpenAI GPT-4 Vision

- **Strengths**: Excellent understanding of images
- **Use Cases**: Image tagging, content description

**Alternative**: Custom CV models

- **Use Cases**: Brand element detection

### 5.4 Embeddings & Search

**Primary**: OpenAI text-embedding-3-small

- **Use Cases**: Semantic search, similarity matching
- **Cost**: ~$0.02 per 1M tokens

---

## 6. Safety & Ethics

### 6.1 Content Moderation

- Filter inappropriate content
- Check against university policies
- Profanity detection
- Bias detection

### 6.2 Data Privacy

- No PII in AI prompts
- Anonymize data where possible
- Clear data retention policies
- User consent for AI features

### 6.3 Transparency

- Label AI-generated content
- Explain AI recommendations
- Allow human override
- Audit AI decisions

### 6.4 Bias Mitigation

- Diverse training data
- Regular bias audits
- Human oversight
- Feedback loops

---

## 7. Performance Monitoring

### 7.1 Metrics

- **Accuracy**: User acceptance rate of AI suggestions
- **Latency**: Response time for AI requests
- **Cost**: AI API costs per university
- **User Satisfaction**: Ratings on AI features
- **Error Rate**: Failed or inappropriate outputs

### 7.2 A/B Testing

- Test different prompts
- Compare model performance
- Optimize for cost vs quality

### 7.3 Continuous Improvement

- Collect user feedback
- Retrain models with new data
- Update prompts based on performance
- Monitor for drift

---

This comprehensive AI integration strategy ensures responsible, effective, and value-adding AI features throughout the platform.
