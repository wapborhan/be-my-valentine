import React, { useState, useEffect } from "react";
import loveImg from "./assets/love.png";
import { Toast, type ToastData } from "./components/Toast";
import { FloatingHearts } from "./components/FloatingHearts";
import "./App.css";

const LINES = [
  "কত যে সাগর নদী পেরিয়ে এলাম আমি, কত পথ হলাম যে পার, তোমারি মতন ওগো অপরূপ সুন্দর কাউকে তো দেখিনি গো আর।",
  "ভালোবাসা মানে একটা রাত না হয় না ঘুমিয়েই কাটালাম তাতে কি? প্রত্যেক প্রহরে আমি তোমার কথা ভেবেই জাগি।",
  "তোমাকে ভেবে পৃথিবী আমার অদেখা তবু এঁকে যাই, আমার ভেতর শুধু তুমি আর তো কিছু পায়নি ঠাই।",
  "তোমাকে অনুবাদ করেছি স্বপ্নে, তোমাকে অনুবাদ করেছি তৃষ্ণায়, তোমাকে অনুবাদ করেছি উদাসীনতায়।",
  "যতনে রেখেছি তোমায় আমারি বুকে, পারবেনা কেড়ে নিতে কেউ তোমাকে, কোথায় যাবো আমি কে আছে আমার, তুমি ছাড়া পৃথিবীটা এতই আধাঁর, এক পৃথিবী প্রেম আমি তোমাকে দেবো, জনমে জনমে আমি তোমারি রবো।",
  "❤ ভালোবাসি তোমাকে, \n অনেক অনেক ভালোবাসি গো ❤",
];

const INITIAL_TEXT =
  "আপনি এখানে আছেন? \nআরও বার্তা পড়তে নিচের হার্ট বাটনে ক্লিক করুন।";

interface BurstHeart {
  id: number;
  x: number;
  y: number;
  scale: number;
}

function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoxAnim, setIsBoxAnim] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [rawRecipientName, setRawRecipientName] = useState("");
  const [popupBtnText, setPopupBtnText] = useState<"Submit" | "Copy">("Submit");
  const [toast, setToast] = useState<ToastData | null>(null);

  // Main / Recipient View States
  const [currentText, setCurrentText] = useState(INITIAL_TEXT);
  const [lineIndex, setLineIndex] = useState(0);
  const [isContentAnim, setIsContentAnim] = useState(false);
  const [burstHearts, setBurstHearts] = useState<BurstHeart[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
      setCurrentText(INITIAL_TEXT);
      setLineIndex(0);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const showToast = (
    type: ToastData["type"],
    title: string,
    message: string,
  ) => {
    setToast({
      id: Date.now().toString(),
      type,
      title,
      message,
    });
  };

  // Open modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsBoxAnim(true);
    setNameInput("");
    setGeneratedLink("");
    setRawRecipientName("");
    setPopupBtnText("Submit");
    setTimeout(() => {
      setIsBoxAnim(false);
    }, 400);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNameInput("");
    setGeneratedLink("");
    setRawRecipientName("");
    setPopupBtnText("Submit");
  };

  const hasRecipient = Boolean(hash && hash.length > 1);
  const isCompleted = currentText === LINES[LINES.length - 1];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Fallback clipboard copying
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // fallback below
      }
    }

    try {
      const tempInput = document.createElement("textarea");
      tempInput.value = text;
      tempInput.style.position = "fixed";
      tempInput.style.opacity = "0";
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(tempInput);
      return successful;
    } catch {
      return false;
    }
  };

  // Submit / Copy handler
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (popupBtnText === "Copy") {
      const targetText = generatedLink || nameInput;
      const success = await copyToClipboard(targetText);
      if (success) {
        showToast(
          "success",
          "লিঙ্ক কপি সম্পন্ন হয়েছে!",
          "আপনার প্রিয় মানুষটিকে এই লিঙ্কটি পাঠিয়ে দিন এবং চমকে দিন ❤️",
        );
      } else {
        showToast(
          "error",
          "কপি ব্যর্থ হয়েছে",
          "দয়া করে লিঙ্কটি ম্যানুয়ালি কপি করুন।",
        );
      }
      handleCloseModal();
    } else {
      const trimmed = nameInput.trim();
      if (trimmed.length > 0) {
        const pageLink = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(trimmed)}`;
        setGeneratedLink(pageLink);
        setRawRecipientName(trimmed);
        setNameInput(pageLink);
        setPopupBtnText("Copy");
        showToast(
          "info",
          "লিঙ্ক প্রস্তুত!",
          'নিচের "কপি করুন" বাটনে ক্লিক করে শেয়ার করার জন্য লিঙ্কটি সংগ্রহ করুন।',
        );
      } else {
        showToast(
          "error",
          "সঠিক নাম লিখুন!",
          "ভালোবাসার মানুষটির নাম (যেমন: Anika অথবা Borhan + Anika) লিখুন।",
        );
      }
    }
  };

  // Share using Web Share API
  const handleShare = async () => {
    const targetText = generatedLink || nameInput;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ভালোবাসার কথা ❤️",
          text: "আপনার জন্য একটি বিশেষ ভালোবাসার বার্তা!",
          url: targetText,
        });
        showToast(
          "success",
          "শেয়ার সম্পন্ন!",
          "আপনার বার্তা সফলভাবে শেয়ার করা হয়েছে ❤️",
        );
      } catch {
        // cancelled by user
      }
    }
  };

  // Next quote handler with particle burst
  const handleNextLine = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsContentAnim(true);
    setCurrentText(LINES[lineIndex]);

    // Create heart particle burst effect
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newHearts: BurstHeart[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: centerX + (Math.random() - 0.5) * 70,
      y: centerY + (Math.random() - 0.5) * 70 - 25,
      scale: Math.random() * 0.6 + 0.7,
    }));
    setBurstHearts(newHearts);
    setTimeout(() => {
      setBurstHearts([]);
    }, 800);

    setTimeout(() => {
      setIsContentAnim(false);
    }, 450);

    if (lineIndex < LINES.length - 1) {
      setLineIndex((prev) => prev + 1);
    }
  };

  // Replay from start
  const handleReplay = () => {
    setCurrentText(INITIAL_TEXT);
    setLineIndex(0);
    setIsContentAnim(true);
    setTimeout(() => {
      setIsContentAnim(false);
    }, 450);
  };

  // Render recipient title with heart icon if '+' is present
  const renderTitle = () => {
    try {
      const decoded = decodeURIComponent(hash.slice(1));
      if (decoded.includes("+")) {
        const parts = decoded.split("+").map((p) => p.trim());
        return (
          <span className="recipient-title-combined">
            <span className="partner-name">{parts[0]}</span>
            <span className="heart-badge">
              <i className="fas fa-heart pulsating-heart"></i>
            </span>
            <span className="partner-name">{parts.slice(1).join(" + ")}</span>
          </span>
        );
      }
      return (
        <span className="recipient-title-single">
          <i className="fas fa-heart text-rose mr-2"></i>
          {decoded}
        </span>
      );
    } catch {
      return <span>{hash.slice(1)}</span>;
    }
  };

  // Formatted recipient display name for the wish card
  const getRecipientRawName = () => {
    try {
      const decoded = decodeURIComponent(hash.slice(1)).trim();
      if (decoded.includes("+")) {
        const parts = decoded.split("+").map((p) => p.trim());
        return `${parts[0]} & ${parts.slice(1).join(" & ")}`;
      }
      return decoded;
    } catch {
      return hash.slice(1);
    }
  };

  return (
    <div className="app-shell">
      <FloatingHearts />
      <Toast toast={toast} onClose={() => setToast(null)} />

      {hasRecipient ? (
        <main id="main" className="recipient-layout">
          <div
            className={`recipient-glass-card ${isCompleted ? "card-completed" : ""}`}
          >
            {/* Top Badge */}
            <div className="badge-pill">
              <i className="fas fa-sparkles mr-2 text-gold"></i>
              {isCompleted
                ? "ভালোবাসার শুভকামনা ✨"
                : "আপনার জন্য একটি বিশেষ ভালোবাসার বার্তা"}
            </div>

            {/* Title / Name */}
            <h1 className="modern-title recipient-heading">{renderTitle()}</h1>

            {/* Message Progress Dots */}
            <div className="message-tracker">
              <span className="tracker-label">
                {isCompleted
                  ? `সবগুলো বার্তা সম্পূর্ণ (${LINES.length}/${LINES.length})`
                  : `বার্তা ${currentText === INITIAL_TEXT ? 0 : lineIndex} / ${LINES.length}`}
              </span>
              <div className="tracker-dots">
                {LINES.map((_, i) => (
                  <span
                    key={i}
                    className={`tracker-dot ${
                      currentText !== INITIAL_TEXT &&
                      (isCompleted || i < lineIndex)
                        ? "active"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content Box */}
            <div
              className={`quote-box ${isContentAnim ? "content-anim" : ""} ${
                isCompleted ? "quote-box-final" : ""
              }`}
            >
              <div className="quote-icon quote-icon-left">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="quote-text">{currentText}</p>
              <div className="quote-icon quote-icon-right">
                <i className="fas fa-quote-right"></i>
              </div>
            </div>

            {/* Action Area: HIDE heart button when completed, show Perfect Wish instead */}
            {!isCompleted ? (
              <div className="action-button-wrapper">
                <button
                  className="heart-interactive-btn"
                  id="next-btn"
                  onClick={handleNextLine}
                  aria-label="পরবর্তী বার্তা দেখুন"
                >
                  <i className="fas fa-hand-holding-heart"></i>
                  {burstHearts.map((h) => (
                    <span
                      key={h.id}
                      className="burst-heart-particle"
                      style={{
                        left: `${h.x}px`,
                        top: `${h.y}px`,
                        transform: `scale(${h.scale})`,
                      }}
                    >
                      <i className="fas fa-heart"></i>
                    </span>
                  ))}
                </button>
                <span className="heart-btn-hint">
                  <i className="fas fa-hand-pointer mr-1"></i> হার্টে স্পর্শ
                  করুন
                </span>
              </div>
            ) : (
              /* Perfect Valentine Wish Card */
              <div className="perfect-wish-card">
                <div className="wish-celebration-badge">
                  <i className="fas fa-crown text-gold mr-2"></i>
                  চিরন্তন ভালোবাসার বন্ধন
                </div>

                <div className="wish-heart-glow">
                  <i className="fas fa-heart-pulse"></i>
                </div>

                <h2 className="wish-title">
                  Happy Valentine&apos;s Day!
                  <span className="wish-bangla">শুভ ভালোবাসা দিবস</span>
                </h2>

                <p className="wish-personalized-note">
                  প্রিয়{" "}
                  <span className="highlight-name">
                    {getRecipientRawName()}
                  </span>
                  , তুমি আমার জীবনের সবচেয়ে সুন্দর ও অমূল্য উপহার। প্রতিটি ক্ষণ
                  তোমার সাথে কাটুক অনাবিল সুখ, শান্তি আর অগাধ ভালোবাসায়।
                  সারাজীবন এভাবেই হাতটি ধরে পাশে থেকো।
                </p>

                <div className="wish-romantic-verse">
                  <i className="fas fa-feather-pointed mr-2 text-rose"></i>
                  “এক পলকের অনুভূতি থেকে আজন্ম প্রেমের শুরু, চিরকাল তুমিই থেকো
                  আমার হৃদয়ের সুর।”
                </div>

                <div className="wish-action-group">
                  <button className="wish-replay-btn" onClick={handleReplay}>
                    <i className="fas fa-rotate-left mr-2"></i> আবার পড়ুন
                  </button>
                  <button
                    className="wish-create-btn"
                    onClick={() => {
                      window.location.hash = "";
                      setHash("");
                    }}
                  >
                    <i className="fas fa-wand-magic-sparkles mr-2"></i> নিজের
                    বার্তা তৈরি করুন
                  </button>
                </div>
              </div>
            )}

            {/* Return / Create your own - only shown if not completed */}
            {!isCompleted && (
              <button
                className="create-own-btn"
                onClick={() => {
                  window.location.hash = "";
                  setHash("");
                }}
              >
                <i className="fas fa-wand-magic-sparkles mr-2"></i>
                নিজেও কাউকে এমন প্রস্তাব পাঠাতে চান? এখানে ক্লিক করুন
              </button>
            )}
          </div>

          <footer className="modern-footer">
            <p>
              Made with <i className="fas fa-heart text-rose"></i> by{" "}
              <a href="https://wapborhan.xyz/" target="_blank" rel="noreferrer">
                Borhan Uddin
              </a>
            </p>
          </footer>
        </main>
      ) : (
        <header id="header" className="generator-layout">
          {/* Top banner pill */}
          <div className="hero-top-bar">
            <div className="announcement-pill">
              <span className="pill-dot"></span>
              <span>ভ্যালেন্টাইন স্পেশাল ২০২৬ ✨</span>
            </div>
          </div>

          <div className="hero-container">
            <div className="hero-grid">
              {/* Left Column: Content */}
              <section className="hero-content">
                <div className="hero-badge">
                  <i className="fas fa-heart text-rose mr-2"></i>
                  চিরন্তন ভালোবাসার প্রকাশ
                </div>

                <h1 className="hero-title">
                  প্রিয় মানুষটিকে{" "}
                  <span className="gradient-highlight">ভালোবাসার</span> কথা বলতে
                  চান?
                </h1>

                <p className="hero-subtitle">
                  তাহলে আর দ্বিধা কিসের? এখনই নিচের বাটনে ক্লিক করে প্রিয়
                  মানুষটির জন্য একটি ম্যাজিক্যাল প্রেমের লিংক তৈরি করে ফেলুন।
                </p>

                <div className="hero-cta-group">
                  <button
                    id="propose-btn"
                    className="modern-primary-btn"
                    onClick={handleOpenModal}
                  >
                    <span className="btn-icon">
                      <i className="fas fa-heart-pulse"></i>
                    </span>
                    <span>Propose Now</span>
                    <i className="fas fa-arrow-right ml-2 btn-arrow"></i>
                  </button>
                </div>

                <div className="hero-features-list">
                  <div className="feature-item">
                    <i className="fas fa-check-circle text-rose"></i>
                    <span>সহজে লিঙ্ক কপি ও শেয়ার</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle text-rose"></i>
                    <span>রোমান্টিক বাংলা উক্তি</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-check-circle text-rose"></i>
                    <span>আকর্ষণীয় এনিমেশন</span>
                  </div>
                </div>
              </section>

              {/* Right Column: Visual Couple */}
              <section className="hero-visual">
                <div className="couple-frame">
                  <div className="couple-glow-circle"></div>
                  <img
                    src={loveImg}
                    alt="Couple in Love"
                    className="couple-image"
                  />
                  <div className="floating-badge badge-1">
                    <i className="fas fa-heart text-rose"></i>
                    <span>Love is in the air</span>
                  </div>
                  <div className="floating-badge badge-2">
                    <i className="fas fa-sparkles text-gold"></i>
                    <span>Forever & Always</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Modal Dialog */}
          {isModalOpen && (
            <div
              id="popup-form"
              className="modal-overlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleCloseModal();
                }
              }}
            >
              <div
                className={`modern-modal-card ${isBoxAnim ? "box-anim" : ""}`}
              >
                <div className="modal-header">
                  <div className="modal-title-group">
                    <div className="modal-icon-badge">
                      <i className="fas fa-envelope-open-heart"></i>
                    </div>
                    <div>
                      <h2 className="modal-title">ভালোবাসার লিঙ্ক তৈরি করুন</h2>
                      <p className="modal-desc">
                        যার জন্য তৈরি করতে চান তার নাম লিখুন
                      </p>
                    </div>
                  </div>
                  <button
                    className="modal-close-btn"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <form onSubmit={handleGenerate} className="modal-form">
                  <div className="input-field-group">
                    <label htmlFor="name" className="field-label">
                      ভালোবাসার মানুষটির নাম (ইংরেজিতে)
                    </label>
                    <div className="input-wrapper">
                      <i className="fas fa-user-heart input-icon"></i>
                      <input
                        type="text"
                        placeholder="যেমন: Anika অথবা Anis + Anika"
                        autoComplete="off"
                        className="modern-text-input"
                        name="name"
                        id="name"
                        value={nameInput}
                        onChange={(e) => {
                          setNameInput(e.target.value);
                          if (popupBtnText === "Copy") {
                            setPopupBtnText("Submit");
                            setGeneratedLink("");
                          }
                        }}
                        autoFocus
                      />
                    </div>
                    <span className="field-hint">
                      টিপ: দুজনার নাম যুক্ত করতে মাঝে <code>+</code> ব্যবহার
                      করতে পারেন।
                    </span>
                  </div>

                  {generatedLink && (
                    <div className="link-preview-box">
                      <span className="link-preview-label">
                        <i className="fas fa-link mr-1"></i> আপনার শেয়ারিং
                        লিঙ্ক:
                      </span>
                      <p className="link-preview-url">{generatedLink}</p>
                    </div>
                  )}

                  <div className="modal-actions">
                    <button
                      className="modern-submit-btn"
                      id="generate-btn"
                      type="submit"
                    >
                      {popupBtnText === "Copy" ? (
                        <>
                          <i className="fas fa-copy mr-2"></i> লিঙ্ক কপি করুন
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sparkles mr-2"></i> তৈরি করুন
                        </>
                      )}
                    </button>

                    {generatedLink && (
                      <div className="modal-secondary-actions">
                        {typeof navigator.share === "function" && (
                          <button
                            type="button"
                            className="secondary-action-btn share-btn"
                            onClick={handleShare}
                          >
                            <i className="fas fa-share-nodes mr-2"></i> শেয়ার
                            করুন
                          </button>
                        )}
                        <button
                          type="button"
                          className="secondary-action-btn preview-btn"
                          onClick={() => {
                            handleCloseModal();
                            window.location.hash =
                              encodeURIComponent(rawRecipientName);
                          }}
                        >
                          <i className="fas fa-eye mr-2"></i> প্রিভিউ দেখুন
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          <footer className="modern-footer">
            <p>
              Made with <i className="fas fa-heart text-rose"></i> by{" "}
              <a href="https://wapborhan.com/" target="_blank" rel="noreferrer">
                Borhan Uddin
              </a>
            </p>
          </footer>
        </header>
      )}
    </div>
  );
}

export default App;
