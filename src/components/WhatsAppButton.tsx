import { MessageCircle } from "lucide-react";

const whatsappUrl =
  "https://wa.me/556195524666?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Studio%20Tax%20e%20quero%20uma%20an%C3%A1lise%20tribut%C3%A1ria.";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Studio Tax no WhatsApp"
      className="fixed bottom-5 right-5 z-[900] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#128c4a] text-white shadow-lg transition hover:scale-105 hover:bg-[#0f7a41]"
    >
      <MessageCircle size={26} />
    </a>
  );
}
