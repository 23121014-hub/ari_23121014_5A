const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("message");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const message = messageInput.value.trim();

  console.log("📨 Pesan dikirim:", message);

  if (!message) {
    console.warn("⚠️ Pesan kosong");
    return;
  }

  addMessage(message, "user");
  messageInput.value = "";

  try {
    console.log("🌐 Mengirim ke n8n...");

    const response = await fetch("https://n8n-re9macilutpq.kol.sumopod.my.id/webhook/website-chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    console.log("📥 Response status:", response.status);

    // Jika response bukan 200
    if (!response.ok) {
      throw new Error("HTTP Error " + response.status);
    }

    const text = await response.text();
    console.log("📄 Raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ JSON Parse Error:", e);
      throw new Error("Response bukan JSON");
    }

    console.log("✅ Parsed JSON:", data);

    addMessage(data.output || "Pesan diterima 🍞", "bot");

  } catch (error) {
    console.error("🔥 ERROR TERJADI:", error);
    addMessage("❌ Terjadi kesalahan. Cek console.", "bot");
  }
}
