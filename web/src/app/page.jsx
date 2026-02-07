"use client";

import { useState, useCallback, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Volume2,
  Type,
  Contrast,
  Space,
  Plus,
  Minus,
  RotateCcw,
  LogOut,
  LogIn,
  Menu,
  X,
  BookOpen,
  Highlighter,
  AlignLeft,
  BookMarked,
  Settings,
  Save,
  Trash2,
  FileText,
} from "lucide-react";

export default function AccessibilityApp() {
  const { data: user, loading: userLoading } = useUser();
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [contrastMode, setContrastMode] = useState("normal");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [highlightColor, setHighlightColor] = useState("transparent");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [savingNote, setSavingNote] = useState(false);

  // Load notes when user logs in
  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setNotes([]);
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      } else {
        console.error("Failed to load notes");
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!text || !noteTitle.trim()) {
      alert("Please enter both a title and some text");
      return;
    }

    setSavingNote(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteTitle.trim(),
          content: text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes([data.note, ...notes]);
        setNoteTitle("");
        setShowSaveModal(false);
        setCurrentNoteId(data.note.id);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save note");
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleLoadNote = (note) => {
    setText(note.content);
    setCurrentNoteId(note.id);
  };

  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(notes.filter((n) => n.id !== noteId));
        if (currentNoteId === noteId) {
          setCurrentNoteId(null);
        }
      } else {
        alert("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    }
  };

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + 2, 48));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  }, []);

  const toggleContrast = useCallback(() => {
    setContrastMode((prev) => {
      if (prev === "normal") return "high";
      if (prev === "high") return "dark";
      return "normal";
    });
  }, []);

  const increaseSpacing = useCallback(() => {
    setLetterSpacing((prev) => Math.min(prev + 1, 10));
    setLineHeight((prev) => Math.min(prev + 0.2, 3));
  }, []);

  const decreaseSpacing = useCallback(() => {
    setLetterSpacing((prev) => Math.max(prev - 1, 0));
    setLineHeight((prev) => Math.max(prev - 0.2, 1));
  }, []);

  const increaseWordSpacing = useCallback(() => {
    setWordSpacing((prev) => Math.min(prev + 2, 20));
  }, []);

  const decreaseWordSpacing = useCallback(() => {
    setWordSpacing((prev) => Math.max(prev - 2, 0));
  }, []);

  const resetSettings = useCallback(() => {
    setFontSize(16);
    setContrastMode("normal");
    setLetterSpacing(0);
    setLineHeight(1.5);
    setWordSpacing(0);
    setDyslexiaFont(false);
    setShowRuler(false);
    setHighlightColor("transparent");
  }, []);

  const readAloud = useCallback(() => {
    if (!text) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  }, [text, isSpeaking]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getContrastStyles = () => {
    switch (contrastMode) {
      case "high":
        return {
          bg: "bg-white",
          text: "text-black",
          border: "border-black",
          button: "bg-black text-white hover:bg-gray-800",
          card: "bg-white border-black",
          sidebar: "bg-gray-50 border-black",
        };
      case "dark":
        return {
          bg: "bg-[#1a1a1a]",
          text: "text-[#ffffff]",
          border: "border-[#444444]",
          button: "bg-[#ffffff] text-[#000000] hover:bg-[#e0e0e0]",
          card: "bg-[#2a2a2a] border-[#444444]",
          sidebar: "bg-[#0f0f0f] border-[#444444]",
        };
      default:
        return {
          bg: "bg-[#f5f5f5]",
          text: "text-[#333333]",
          border: "border-[#cccccc]",
          button: "bg-[#4a90e2] text-white hover:bg-[#357abd]",
          card: "bg-white border-[#cccccc]",
          sidebar: "bg-white border-[#e0e0e0]",
        };
    }
  };

  const styles = getContrastStyles();

  return (
    <div
      className={`min-h-screen ${styles.bg} ${styles.text} transition-colors duration-300 font-inter flex`}
    >
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} border-r-2 ${styles.border} transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-0"
        } overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b-2 border-current">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings size={24} />
            Settings
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Section */}
          <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
            {userLoading ? (
              <p className="text-sm">Loading...</p>
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user.name
                      ? user.name[0].toUpperCase()
                      : user.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-sm opacity-70 truncate">{user.email}</p>
                  </div>
                </div>
                <a
                  href="/account/logout"
                  className={`flex items-center gap-2 justify-center ${styles.button} px-3 py-2 rounded-lg text-sm font-semibold transition-colors`}
                >
                  <LogOut size={16} />
                  Sign Out
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm opacity-70">Sign in to save your notes</p>
                <a
                  href="/account/signin"
                  className={`flex items-center gap-2 justify-center ${styles.button} px-3 py-2 rounded-lg text-sm font-semibold transition-colors`}
                >
                  <LogIn size={16} />
                  Sign In
                </a>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BookMarked size={18} />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={readAloud}
                disabled={!text}
                className={`w-full ${styles.button} px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isSpeaking ? "ring-2 ring-offset-2" : ""}`}
              >
                <Volume2 size={16} />
                {isSpeaking ? "Stop Reading" : "Read Aloud"}
              </button>
              <button
                onClick={resetSettings}
                className={`w-full ${styles.button} px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2`}
              >
                <RotateCcw size={16} />
                Reset All
              </button>
            </div>
          </div>

          {/* Dyslexia Font */}
          <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen size={18} />
              Reading Aids
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Dyslexia-Friendly Font</span>
                <input
                  type="checkbox"
                  checked={dyslexiaFont}
                  onChange={(e) => setDyslexiaFont(e.target.checked)}
                  className="w-5 h-5 rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Reading Ruler</span>
                <input
                  type="checkbox"
                  checked={showRuler}
                  onChange={(e) => setShowRuler(e.target.checked)}
                  className="w-5 h-5 rounded"
                />
              </label>
            </div>
          </div>

          {/* Highlight Color */}
          <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Highlighter size={18} />
              Text Highlight
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {["transparent", "#ffeb3b", "#80deea", "#a5d6a7", "#ef9a9a"].map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => setHighlightColor(color)}
                    className={`w-full h-10 rounded-lg border-2 ${
                      highlightColor === color
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : styles.border
                    }`}
                    style={{
                      backgroundColor: color === "transparent" ? "#fff" : color,
                    }}
                    aria-label={
                      color === "transparent"
                        ? "No highlight"
                        : `Highlight ${color}`
                    }
                  >
                    {color === "transparent" && (
                      <X size={16} className="mx-auto" />
                    )}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Saved Notes Section */}
          <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText size={18} />
              Saved Notes
            </h3>

            {!user ? (
              <p className="text-sm opacity-70 text-center py-2">
                Sign in to save notes
              </p>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => setShowSaveModal(true)}
                  disabled={!text}
                  className={`w-full ${styles.button} px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center`}
                >
                  <Save size={16} />
                  Save Current Note
                </button>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notes.length === 0 ? (
                    <p className="text-xs opacity-70 text-center py-4">
                      No saved notes yet
                    </p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-lg border ${
                          currentNoteId === note.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        } ${styles.card} cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={() => handleLoadNote(note)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {note.title}
                            </p>
                            <p className="text-xs opacity-70 truncate">
                              {note.content.substring(0, 50)}...
                            </p>
                            <p className="text-xs opacity-50 mt-1">
                              {new Date(note.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteNote(note.id, e)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            aria-label="Delete note"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Save Note Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${styles.card} rounded-lg p-6 max-w-md w-full border-2 ${styles.border}`}
          >
            <h3 className="text-xl font-bold mb-4">Save Note</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Note Title
                </label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Enter a title for your note..."
                  className={`w-full px-4 py-2 rounded-lg border-2 ${styles.border} ${styles.card} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote || !noteTitle.trim()}
                  className={`flex-1 ${styles.button} px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {savingNote ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setNoteTitle("");
                  }}
                  className={`flex-1 border-2 ${styles.border} px-4 py-2 rounded-lg font-semibold transition-colors hover:opacity-80`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`border-b-2 ${styles.border} p-4 md:p-6`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`${styles.button} p-2 rounded-lg transition-colors`}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Accessibility Text Editor
              </h1>
              <p className="text-sm md:text-base opacity-80">
                Customize your reading experience
              </p>
            </div>
          </div>
        </header>

        {/* Control Panel */}
        <div className="p-4 md:p-6 border-b-2 border-current">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Font Size */}
            <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <Type size={20} />
                <span className="font-semibold text-sm">
                  Font: {fontSize}px
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={decreaseFontSize}
                  className={`flex-1 ${styles.button} p-2 rounded-lg font-semibold transition-colors`}
                  aria-label="Decrease font size"
                >
                  <Minus size={16} className="mx-auto" />
                </button>
                <button
                  onClick={increaseFontSize}
                  className={`flex-1 ${styles.button} p-2 rounded-lg font-semibold transition-colors`}
                  aria-label="Increase font size"
                >
                  <Plus size={16} className="mx-auto" />
                </button>
              </div>
            </div>

            {/* Contrast */}
            <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <Contrast size={20} />
                <span className="font-semibold text-sm capitalize">
                  Contrast: {contrastMode}
                </span>
              </div>
              <button
                onClick={toggleContrast}
                className={`w-full ${styles.button} px-4 py-2 rounded-lg font-semibold transition-colors`}
              >
                Change
              </button>
            </div>

            {/* Letter Spacing */}
            <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <Space size={20} />
                <span className="font-semibold text-sm">
                  Letter: {letterSpacing}px
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={decreaseSpacing}
                  className={`flex-1 ${styles.button} p-2 rounded-lg font-semibold transition-colors`}
                  aria-label="Decrease spacing"
                >
                  <Minus size={16} className="mx-auto" />
                </button>
                <button
                  onClick={increaseSpacing}
                  className={`flex-1 ${styles.button} p-2 rounded-lg font-semibold transition-colors`}
                  aria-label="Increase spacing"
                >
                  <Plus size={16} className="mx-auto" />
                </button>
              </div>
            </div>

            {/* Word Spacing */}
            <div className={`p-4 rounded-lg border-2 ${styles.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <AlignLeft size={20} />
                <span className="font-semibold text-sm">
                  Word: {wordSpacing}px
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={decreaseWordSpacing}
                  className={`flex-1 ${styles.button} p-2 rounded-lg font-semibold transition-colors`}
                  aria-label="Decrease word spacing"
                >
                  <Minus size={16} className="mx-auto" />
                </button>
                <button
                  onClick={increaseWordSpacing}
                  className={`flex-1 ${styles.button} p-2 rounded-lg font-semibold transition-colors`}
                  aria-label="Increase word spacing"
                >
                  <Plus size={16} className="mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Text Editor */}
        <div className="flex-1 p-4 md:p-6">
          <div
            className={`h-full rounded-lg border-2 ${styles.border} overflow-hidden relative`}
          >
            {showRuler && (
              <div
                className="absolute left-0 right-0 h-1 bg-blue-500 opacity-50 pointer-events-none z-10"
                style={{ top: "50%" }}
              />
            )}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className={`w-full h-full p-6 ${styles.card} focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all resize-none`}
              style={{
                fontSize: `${fontSize}px`,
                letterSpacing: `${letterSpacing}px`,
                lineHeight: lineHeight,
                wordSpacing: `${wordSpacing}px`,
                fontFamily: dyslexiaFont
                  ? "Comic Sans MS, cursive"
                  : "Inter, sans-serif",
                backgroundColor:
                  highlightColor !== "transparent" ? highlightColor : undefined,
              }}
              aria-label="Text editor"
            />
          </div>
          <div className="mt-4 flex justify-between items-center opacity-70">
            <span className="text-sm">{text.length} characters</span>
            <span className="text-sm">
              {text.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
