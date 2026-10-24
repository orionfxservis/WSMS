import React, { useState, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';

export interface NewsItem {
  title: string;
  link?: string;
}

const DEFAULT_NEWS: NewsItem[] = [
  {
    title: 'Sindh CS reviews Nehr-e-Khayyam project',
    link: 'https://www.nation.com.pk/20-Oct-2026/sindh-cs-reviews-nehr-e-khayyam-project',
  },
  {
    title: 'Karachi temperature expected to remain above normal in November: Met Office',
    link: 'https://www.geo.tv/latest/687256-karachi-temperature-expected-to-remain-above-normal-in-november-met-office',
  },
  {
    title: 'Karachi mayor vows uninterrupted development, announces new road link to ease traffic in Natha Khan',
    link: 'https://www.nation.com.pk/20-Oct-2026/karachi-mayor-vows-uninterrupted-development-announces-new-road-link-ease-traffic-natha-khan',
  },
  {
    title: 'Major diesel theft plot foiled, stolen diesel worth lacs recovered',
    link: 'https://www.nation.com.pk/20-Oct-2026/major-diesel-theft-plot-foiled-stolen-diesel-worth-lacs-recovered',
  },
  {
    title: 'Sindh raises age limit for CCE exams to 33 years',
    link: 'https://www.geo.tv/latest/687435-sindh-raises-age-limit-for-competitive-exams-to-33-years',
  },
  {
    title: 'IBA Karachi, AKU, Habib University join hands to advance AI-driven teaching, learning',
    link: 'https://www.geo.tv/latest/687339-iba-karachi-aku-habib-university-join-hands-to-advance-ai-driven-teaching-learning',
  },
  {
    title: 'Karachi Water Board (KW&SB): Dhabeji pumping station operating normally across all 6 feeders',
  },
];

interface NewsTickerProps {
  className?: string;
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ className = '' }) => {
  const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live news from WSMS API non-blockingly with cache and 1.2s timeout
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const fetchNews = async () => {
      // Check cache first
      try {
        const cached = sessionStorage.getItem('wsms_news_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed.items) && parsed.items.length > 0 && Date.now() - parsed.timestamp < 10 * 60 * 1000) {
            if (isMounted) setNews(parsed.items);
            return;
          }
        }
      } catch {
        // Ignore cache parse error
      }

      try {
        const res = await fetch('https://orionpixels.com/wsms/api/news.php', {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted && data?.success && Array.isArray(data.data) && data.data.length > 0) {
          const items: NewsItem[] = data.data
            .map((item: { title?: string; link?: string }) => ({
              title: item.title || '',
              link: item.link || '',
            }))
            .filter((item: NewsItem) => item.title.trim().length > 0);

          if (items.length > 0) {
            const hasNehr = items.some((i) => i.title.includes('Nehr-e-Khayyam'));
            if (!hasNehr) {
              items.unshift(DEFAULT_NEWS[0]);
            } else {
              const nehrIdx = items.findIndex((i) => i.title.includes('Nehr-e-Khayyam'));
              if (nehrIdx > 0) {
                const [nehrItem] = items.splice(nehrIdx, 1);
                items.unshift(nehrItem);
              }
            }
            setNews(items);
            try {
              sessionStorage.setItem('wsms_news_cache', JSON.stringify({ items, timestamp: Date.now() }));
            } catch {
              // ignore storage limit
            }
          }
        }
      } catch {
        // Fallback gracefully without blocking
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchNews();
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // Auto rotate every 4 seconds (matching dashboard.html setInterval(rotate, 4000))
  useEffect(() => {
    if (isPaused || news.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, news.length]);

  const currentNews = news[currentIndex] || DEFAULT_NEWS[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  return (
    <div
      id="newsTicker"
      className={`relative group bg-white border border-[#eef2f7] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[6px] transition-all hover:border-[#0077cc]/30 ${className}`}
      style={{
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        overflow: 'hidden',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '12px',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="marquee"
      aria-live="polite"
      aria-label="Karachi live news ticker"
    >
      <div className="flex items-center justify-between w-full gap-2">
        {/* Ticker Content */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0 overflow-hidden">
          {currentNews.link ? (
            <a
              href={currentNews.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#222222] hover:text-[#0077cc] transition-colors truncate focus:outline-none focus:underline"
              title={`${currentNews.title} (opens in new tab)`}
            >
              {currentNews.title}
            </a>
          ) : (
            <span className="text-[#222222] truncate">{currentNews.title}</span>
          )}
        </div>

        {/* Micro-controls (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {currentNews.link && (
            <a
              href={currentNews.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-[#666666] hover:text-[#0077cc] rounded hover:bg-slate-100 transition-colors"
              title="Open full news article"
              aria-label="Open full news article"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 text-[#666666] hover:text-[#0077cc] rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="Previous headline"
            aria-label="Previous headline"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-1 text-[#666666] hover:text-[#0077cc] rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="Next headline"
            aria-label="Next headline"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
