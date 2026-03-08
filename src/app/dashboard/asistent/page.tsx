"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: `Bună! Sunt asistentul tău AI. Poți să mă întrebi orice despre firmele tale. De exemplu:

• „Arată clienții cu risc ridicat"
• „Care firme au datorii la ANAF?"
• „Generează un raport pentru SC Exemplu SRL"
• „Câte facturi am emis luna aceasta?"`,
  timestamp: new Date(),
};

function generateMockResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("risc ridicat") || msg.includes("risc mare") || msg.includes("riscant")) {
    return `Am identificat 2 firme cu risc ridicat în portofoliul tău:

1. **Mobitech Solutions SRL** (CUI: 27653198) — Scor: 15/100 (Critic)
   Motive: Insolvență depusă, inactivitate fiscală, revocare TVA

2. **Alim Fresh Distribution SRL** (CUI: 18215498) — Scor: 28/100 (Ridicat)
   Motive: Datorii ANAF crescute cu 340%, dosar instanță

Recomandare: Verifică expunerea financiară și ia în considerare oprirea livrărilor pe credit.`;
  }

  if (msg.includes("datorii") || msg.includes("anaf") || msg.includes("restant")) {
    return `Din firmele monitorizate, **Alim Fresh Distribution SRL** are datorii semnificative la ANAF:

• Datorii restante: **55.000 RON** (creștere de 340% în ultima lună)
• Ultima verificare: acum 2 ore

Celelalte firme din portofoliu nu au datorii restante semnificative la ANAF conform ultimei verificări.`;
  }

  if (msg.includes("raport") || msg.includes("report")) {
    return `Am pregătit un sumar rapid:

📊 **Raport portofoliu — Martie 2026**
• Firme monitorizate: 6
• Scor mediu risc: 57/100
• Alerte active: 4 necitite
• Firme cu risc critic: 1 (Mobitech Solutions SRL)

Pentru raportul complet în format PDF, accesează secțiunea **Rapoarte** din meniul lateral.`;
  }

  if (msg.includes("factur") || msg.includes("invoice")) {
    return `În luna martie 2026, ai emis **0 facturi** prin Firmatic.

Vrei să emiți o factură nouă? Poți accesa **Facturi → Factură nouă** din meniul lateral, sau spune-mi cui vrei să emiți și te ghidez prin proces.`;
  }

  if (msg.includes("insolventa") || msg.includes("insolvență") || msg.includes("insolvent")) {
    return `Am găsit 1 caz de insolvență în portofoliul tău:

**Mobitech Solutions SRL** (CUI: 27653198)
• Cerere de insolvență depusă: 08.03.2026
• Dosar: 1234/3/2026, Tribunalul București
• Scor risc actual: 15/100 (Critic)

Recomandare: Oprește orice livrare pe credit și verifică dacă ai creanțe de recuperat.`;
  }

  if (msg.includes("salut") || msg.includes("buna") || msg.includes("hello") || msg.includes("hey")) {
    return `Bună! Cu ce te pot ajuta astăzi? Pot să:

• Analizez riscul firmelor tale
• Caut informații despre o firmă specifică
• Generez rapoarte
• Răspund la întrebări despre facturi sau alerte`;
  }

  return `Am înțeles întrebarea ta. Pe baza datelor din portofoliul tău de 6 firme monitorizate, pot spune că:

• Situația generală a portofoliului este **moderată** (scor mediu: 57/100)
• Ai **4 alerte necitite** care necesită atenție
• Cel mai mare risc vine de la **Mobitech Solutions SRL** cu un scor de 15/100

Vrei să aprofundez pe un subiect anume? Pot analiza o firmă specifică sau genera un raport detaliat.`;
}

export default function AsistentPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateMockResponse(text);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, assistantMsg]);
    }, 1200);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Asistent AI</h1>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              Beta
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Întreabă orice despre firmele și datele tale
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div className="glass-card flex-1 overflow-hidden rounded-2xl">
        <div className="flex h-full flex-col">
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    msg.role === "assistant"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60"
                  }`}
                >
                  <p
                    className={`whitespace-pre-line text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {msg.content}
                  </p>
                  <p
                    className={`mt-1 text-[10px] ${
                      msg.role === "user"
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString("ro-RO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-muted/60 px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span
                      className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="inline-block h-2 w-2 animate-bounce rounded-full bg-muted-foreground/40"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                placeholder="Scrie un mesaj..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="h-10 flex-1 rounded-xl"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="btn-hover h-10 w-10 shrink-0 rounded-xl bg-primary p-0 text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Asistentul AI poate face greșeli. Verificați informațiile importante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
