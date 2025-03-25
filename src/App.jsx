import { useState, useRef, useEffect } from "react";
import { Video, Hash, TrendingUp, Sparkles, Send, Target, Clock, Users, BarChart3, BookOpen, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [contentType, setContentType] = useState("video");

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    // Add user question to chat history
    setChatHistory((prev) => [
      ...prev,
      { 
        type: "question", 
        content: currentQuestion,
        timestamp: new Date().toISOString(),
        contentType
      },
    ]);

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBKYzF53EBJyJ77qo2wxAj7sSwajsE6vR",
        method: "post",
        data: {
          contents: [{ parts: [{ text: currentQuestion }] }],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      
      // Enhanced analytics
      const analytics = {
        sentiment: {
          score: 0.85,
          label: "Positive",
          breakdown: {
            positive: 75,
            neutral: 20,
            negative: 5
          }
        },
        engagement: {
          score: 8.5,
          potential: "High",
          metrics: {
            readability: 92,
            uniqueness: 88,
            relevance: 95
          }
        },
        audience: {
          primary: "Tech enthusiasts",
          age: "25-34",
          interests: ["Technology", "Innovation", "Digital Culture"]
        },
        seo: {
          score: 89,
          keywords: ["content creation", "digital marketing", "social media"],
          readability: "Advanced"
        }
      };

      // Enhanced hashtag recommendations with categories
      const hashtags = {
        trending: ["#ContentCreator", "#DigitalMarketing"],
        niche: ["#TechInfluencer", "#ContentStrategy"],
        engagement: ["#CreatorEconomy", "#SocialMediaTips"],
        industry: ["#MarketingTips", "#ContentMarketing"]
      };

      setChatHistory((prev) => [
        ...prev,
        { 
          type: "answer", 
          content: aiResponse,
          analytics,
          hashtags,
          timestamp: new Date().toISOString(),
          contentType
        },
      ]);
    } catch (error) {
      console.error("Error generating answer:", error);
      setChatHistory((prev) => [
        ...prev,
        { 
          type: "answer", 
          content: "Sorry - Something went wrong. Please try again!",
          timestamp: new Date().toISOString()
        },
      ]);
    }
    setGeneratingAnswer(false);
  }

  const startNewChat = () => {
    setSelectedChat(null);
    setChatHistory([]);
  };

  const contentTypes = [
    { icon: Video, label: "Video", value: "video" },
    { icon: BookOpen, label: "Blog", value: "blog" },
    { icon: Users, label: "Social", value: "social" }
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-purple-50 to-blue-50 text-gray-900 flex font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-xl p-6 overflow-y-auto border-r border-gray-200 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <Video className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ContentFlow AI
          </h2>
        </div>
        
        <button
          onClick={startNewChat}
          className="w-full bg-purple-600 text-white rounded-lg p-3 mb-6 hover:bg-purple-700 transition-colors font-medium flex items-center justify-center group shadow-md"
        >
          <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
          New Content
        </button>

        <div className="space-y-2">
          {chatHistory
            .filter(chat => chat.type === "question")
            .map((chat, index) => (
              <div
                key={index}
                className="cursor-pointer p-3 hover:bg-purple-50 rounded-lg text-sm transition-colors flex items-center gap-2"
                onClick={() => setSelectedChat(index)}
              >
                {chat.contentType === "video" && <Video className="w-4 h-4 text-purple-600" />}
                {chat.contentType === "blog" && <BookOpen className="w-4 h-4 text-purple-600" />}
                {chat.contentType === "social" && <Users className="w-4 h-4 text-purple-600" />}
                <span className="text-gray-700">{chat.content.substring(0, 30)}...</span>
              </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 max-w-3xl shadow-lg border border-gray-200">
                <div className="flex justify-center mb-6">
                  <Video className="w-16 h-16 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
                  Welcome to ContentFlow AI
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Transform your ideas into engaging content with AI-powered insights
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Lightbulb, text: "Content Ideas" },
                    { icon: Target, text: "Audience Insights" },
                    { icon: BarChart3, text: "Performance Analytics" },
                    { icon: Clock, text: "Trending Topics" },
                  ].map((item, index) => (
                    <div key={index} className="bg-purple-50 p-4 rounded-lg shadow-sm text-left flex items-center gap-3 hover:bg-purple-100 transition-colors">
                      <item.icon className="w-6 h-6 text-purple-600" />
                      <span className="text-purple-900">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div key={index} className="space-y-4">
                  <div className={`flex ${
                    chat.type === "question" ? "justify-end" : "justify-start"
                  }`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      chat.type === "question"
                        ? "bg-purple-600 text-white"
                        : "bg-white/80 backdrop-blur-xl text-gray-800 shadow-md"
                    }`}>
                      <ReactMarkdown className="prose max-w-none text-sm">
                        {chat.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  {chat.type === "answer" && chat.analytics && (
                    <div className="grid grid-cols-2 gap-4 max-w-4xl">
                      {/* Enhanced Analytics Dashboard */}
                      <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-gray-200 shadow-md space-y-4">
                        <h3 className="text-purple-600 font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Content Analytics
                        </h3>
                        
                        {/* Sentiment Analysis */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Sentiment</h4>
                          <div className="flex gap-2">
                            {Object.entries(chat.analytics.sentiment.breakdown).map(([key, value]) => (
                              <div key={key} className="flex-1 bg-gray-100 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-full rounded-full"
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Engagement Metrics */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Engagement Metrics</h4>
                          {Object.entries(chat.analytics.engagement.metrics).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 capitalize">{key}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-100 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-full rounded-full"
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-900">{value}%</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Audience Insights */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Audience</h4>
                          <div className="flex flex-wrap gap-2">
                            {chat.analytics.audience.interests.map((interest, i) => (
                              <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Hashtag Recommendations */}
                      <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-gray-200 shadow-md">
                        <h3 className="text-purple-600 font-semibold mb-3 flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          Recommended Hashtags
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(chat.hashtags).map(([category, tags]) => (
                            <div key={category} className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-700 capitalize">{category}</h4>
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag, i) => (
                                  <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs hover:bg-purple-200 transition-colors cursor-pointer">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          {generatingAnswer && (
            <div className="flex justify-start">
              <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl animate-pulse text-sm flex items-center shadow-md">
                <svg className="animate-spin h-5 w-5 mr-3 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating content...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="bg-white/80 backdrop-blur-xl p-6 border-t border-gray-200 shadow-lg space-y-4">
          {/* Content Type Selection */}
          <div className="flex gap-4">
            {contentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setContentType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  contentType === type.value
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={generateAnswer}
            className="flex gap-4"
          >
            <div className="flex-1 relative">
              <textarea
                required
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg p-4 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none text-sm shadow-sm"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Describe your content idea..."
                rows="2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    generateAnswer(e);
                  }
                }}
              />
              <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                {question.length}/1000
              </span>
            </div>
            <button
              type="submit"
              className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center shadow-md ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              <Send className="h-5 w-5 mr-2" />
              Generate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
