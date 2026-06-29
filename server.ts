/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY is not defined. Karuna AI Assistant will fall back to smart rule-based mock responses.");
}

// ----------------------------------------------------
// IN-MEMORY DATABASE & SEED DATA (Chennai localized)
// ----------------------------------------------------

let needRequests = [
  {
    id: "need-1",
    category: "Groceries",
    title: "Grocery kits for 8 blind elderly residents",
    description: "An informal shelter housing visually impaired elderly residents in Royapettah is facing a shortage of cooking provisions. They urgently need rice, dal, oil, and spices for the next 3 weeks.",
    location: "Royapettah, near Clock Tower",
    beneficiaryName: "Royapettah Blind Shelter (Reported by Kumar, Caretaker)",
    urgency: "High",
    status: "Pending",
    requestedAt: "2026-06-25T14:30:00Z",
  },
  {
    id: "need-2",
    category: "Education",
    title: "15 School kits for orphans entering 6th Grade",
    description: "Children of daily wage earners and orphans at a local community center in Perambur require school bags, notebooks, geometry boxes, and water bottles for the new academic term.",
    location: "Perambur Railway Colony Area",
    beneficiaryName: "Rising Stars Learning Center",
    urgency: "Medium",
    status: "Pledged",
    requestedAt: "2026-06-26T09:15:00Z",
    pledgedBy: "Lakshmi Narayanan (Volunteer Donor)",
  },
  {
    id: "need-3",
    category: "Medical Aid",
    title: "Nebulizer and basic diabetic medicine stock",
    description: "A free medical desk serving slums in Vyasarpadi needs 1 Nebulizer machine and a month's stock of basic insulin vials and Metformin for 12 elderly patients with no family support.",
    location: "Vyasarpadi Slum Board, Block C",
    beneficiaryName: "Vyasarpadi Health Desk",
    urgency: "High",
    status: "Pending",
    requestedAt: "2026-06-28T11:00:00Z",
  },
  {
    id: "need-4",
    category: "Dresses",
    title: "New festival dresses for 25 children in shelter home",
    description: "For the upcoming local festival, we want to bring smiles to 25 children (aged 5 to 14) living in our shelter by gifting them brand new traditional clothing (shirts, veshtis, and salwar suits).",
    location: "Tambaram West, Chennai",
    beneficiaryName: "Annai Karunai Illam Orphanage",
    urgency: "Medium",
    status: "Fulfilled",
    requestedAt: "2026-06-22T08:00:00Z",
    pledgedBy: "Chennai Tech Association",
    fulfillmentDetails: "25 sets of beautiful garments delivered and distributed directly on June 25th. Video logs uploaded to trust portal.",
    verificationPhoto: "https://picsum.photos/seed/dresses/400/300",
  },
  {
    id: "need-5",
    category: "Employment",
    title: "Part-time computer typist vacancy for a disabled youth",
    description: "Senthil, a bright 22-year-old youth with orthopaedic disability, has completed typing certification. Looking for a receptionist/data entry job in Adyar area with wheelchair access.",
    location: "Adyar, Chennai",
    beneficiaryName: "Senthil Kumar (Disabled Support Cell)",
    urgency: "Low",
    status: "Pending",
    requestedAt: "2026-06-28T16:20:00Z",
  },
];

let volunteerDrives = [
  {
    id: "drive-1",
    title: "Mylapore Sunday Breakfast Distribution",
    description: "Help cook and pack 300 hot, nutritious Sambar Rice meals and distribute them directly to homeless elderly individuals sleeping in pavements around Mylapore Kapaleeshwarar temple.",
    date: "2026-07-05",
    time: "05:30 AM - 08:30 AM",
    location: "Mylapore Tank Community Kitchen, Chennai",
    category: "Food",
    spotsMax: 15,
    spotsRegistered: 11,
    coordinatorName: "Ramakrishnan S.",
    coordinatorPhone: "+91 95514 12420",
  },
  {
    id: "drive-2",
    title: "Vidya Deepam Teaching & Mentoring Day",
    description: "Become a mentor for a day! Help teach basic English and mathematics to 40 children of brick-kiln workers. Fun activities, educational games, and snacks distribution included.",
    date: "2026-07-12",
    time: "09:30 AM - 01:00 PM",
    location: "Food For All Chennai Trust Learning Center, Velachery",
    category: "Education",
    spotsMax: 20,
    spotsRegistered: 6,
    coordinatorName: "Deepa Priyadharshini",
    coordinatorPhone: "+91 73055 41420",
  },
  {
    id: "drive-3",
    title: "Vyasarpadi Community Health Camp Volunteer Support",
    description: "Support our medical doctors in organizing a free health screening camp. Responsibilities include patient registration, distributing height/weight tokens, and managing pharmaceutical queues.",
    date: "2026-07-19",
    time: "08:00 AM - 02:00 PM",
    location: "Corporation Primary School Hall, Vyasarpadi",
    category: "Medical Aid",
    spotsMax: 12,
    spotsRegistered: 9,
    coordinatorName: "Dr. Arvind Nathan",
    coordinatorPhone: "+91 95514 12420",
  },
];

let volunteerSignups: any[] = [
  { id: "v-1", driveId: "drive-1", name: "Anand R", email: "anand@gmail.com", phone: "9884123456", status: "Confirmed" },
  { id: "v-2", driveId: "drive-1", name: "Divya Balan", email: "divya@gmail.com", phone: "9176112233", status: "Confirmed" },
  { id: "v-3", driveId: "drive-3", name: "Ganesh K", email: "ganesh@yahoo.com", phone: "9940123987", status: "Confirmed" },
];

let campaigns = [
  {
    id: "camp-food",
    title: "Feed Chennai Daily Food Security",
    category: "Food",
    description: "Sponsor highly nutritious freshly prepared meals distributed twice daily to impoverished seniors, street vendors, and children. Just ₹40 supports one complete hot meal.",
    targetAmount: 500000,
    currentAmount: 382400,
    unit: "Meals Sponsored",
    costPerUnit: 40,
    image: "https://picsum.photos/seed/meals/600/400",
  },
  {
    id: "camp-edu",
    title: "Vidya Deepam Educational Kits Drive",
    category: "Education",
    description: "Empower kids of daily wage earners with uniforms, text books, custom stationeries, bags, and tuition support. ₹1,500 funds one child's annual education starter package.",
    targetAmount: 300000,
    currentAmount: 184500,
    unit: "Sustained Students",
    costPerUnit: 1500,
    image: "https://picsum.photos/seed/schoolkids/600/400",
  },
  {
    id: "camp-groceries",
    title: "Amudham Grocery Support Kits",
    category: "Groceries",
    description: "Sponsor a monthly dry grocery kit containing 10kg premium rice, 2kg dal, cooking oil, salt, wheat flour, and spices for impoverished single-mother households. ₹800 covers a whole month.",
    targetAmount: 200000,
    currentAmount: 144000,
    unit: "Families Supported",
    costPerUnit: 800,
    image: "https://picsum.photos/seed/provisions/600/400",
  },
  {
    id: "camp-medical",
    title: "Sanjeevani Elder Medical Aid",
    category: "Medical Aid",
    description: "Provide blood pressure cuffs, diabetic medicines, nebulizers, cataract checkups, and general geriatric consultation for destitute pavement dwellers. ₹1,200 funds a senior's medical needs.",
    targetAmount: 150000,
    currentAmount: 96000,
    unit: "Elderly Care Cycles",
    costPerUnit: 1200,
    image: "https://picsum.photos/seed/medicalcamp/600/400",
  },
];

let financialDonations = [
  {
    id: "tx-101",
    donorName: "Venkatesh Prasad",
    amount: 12000,
    category: "Food",
    message: "Annadhanam on my father's birthday. Please feed 300 individuals Sambar Rice.",
    timestamp: "2026-06-29T04:12:00Z",
    transactionHash: "FFA-TX-79D20A1F5B4E32A1",
    frequency: "one-time",
  },
  {
    id: "tx-102",
    donorName: "Anonymous Donor",
    amount: 4500,
    category: "Education",
    message: "Sponsoring school kits for 3 students. Let education empower Chennai.",
    timestamp: "2026-06-28T15:30:00Z",
    transactionHash: "FFA-TX-11E54C9A22D310C9",
    frequency: "quarterly",
  },
  {
    id: "tx-103",
    donorName: "Meenakshi Sundaram",
    amount: 8000,
    category: "Groceries",
    message: "Providing grocery kits for 10 single-mother families. Grateful to help.",
    timestamp: "2026-06-28T09:44:00Z",
    transactionHash: "FFA-TX-44B889C7FE9821DA",
    frequency: "monthly",
  },
  {
    id: "tx-104",
    donorName: "Dr. K. Raghavan",
    amount: 25000,
    category: "Medical Aid",
    message: "Dedicated for basic medicines and free checkup drives in Vyasarpadi.",
    timestamp: "2026-06-27T10:15:00Z",
    transactionHash: "FFA-TX-88FF11DDA456F28E",
    frequency: "one-time",
  },
  {
    id: "tx-105",
    donorName: "Saritha Nair",
    amount: 2000,
    category: "General",
    message: "Where it is needed the most. Keep up the transparent work!",
    timestamp: "2026-06-26T18:22:00Z",
    transactionHash: "FFA-TX-33CCAA670B1D449F",
    frequency: "monthly",
  },
];

const impactStories = [
  {
    id: "story-1",
    title: "Senthil's Leap from Streets to Independence",
    category: "Employment",
    description: "Senthil, a wheelchair-bound youth from Royapettah, was trained in computer typing by our Trust. This month, we connected him with a clerical job at an Adyar export firm, paving a path of dignity.",
    statText: "Independent Career Secured",
    imageUrl: "https://picsum.photos/seed/senthil/500/350",
  },
  {
    id: "story-2",
    title: "Nourishing 50,000 Chennai Souls",
    category: "Food",
    description: "Through the generous support of our monthly food donors, our community kitchen has hit a landmark of distributing 50,000 fresh hot Sambar and Curd Rice meals with zero food waste.",
    statText: "50K+ Hot Meals Served",
    imageUrl: "https://picsum.photos/seed/communitykitchen/500/350",
  },
  {
    id: "story-3",
    title: "Vidya Deepam Ignites Preetha's Dreams",
    category: "Education",
    description: "Preetha, the daughter of a domestic help, was about to drop out of school due to unpaid fees. The Trust sponsored her tuition and school kit. This year, she passed with a staggering 92% in 10th grade.",
    statText: "Annual Scholarship Funded",
    imageUrl: "https://picsum.photos/seed/preethaschool/500/350",
  },
];

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// Get overall metrics
app.get("/api/metrics", (req, res) => {
  const totalFinancialReceived = financialDonations.reduce((acc, curr) => acc + curr.amount, 0);
  const mealsDistributed = 52430 + Math.floor(financialDonations.filter(d => d.category === 'Food').reduce((acc, curr) => acc + curr.amount, 0) / 40);
  const studentsSustained = 184 + Math.floor(financialDonations.filter(d => d.category === 'Education').reduce((acc, curr) => acc + curr.amount, 0) / 1500);
  const groceryKitsDistributed = 412 + Math.floor(financialDonations.filter(d => d.category === 'Groceries').reduce((acc, curr) => acc + curr.amount, 0) / 800);
  const medicalConsultations = 890 + Math.floor(financialDonations.filter(d => d.category === 'Medical Aid').reduce((acc, curr) => acc + curr.amount, 0) / 300);
  const clothesDistributed = 640 + Math.floor(financialDonations.filter(d => d.category === 'Dresses').reduce((acc, curr) => acc + (curr.category === 'Dresses' ? curr.amount : 0), 0) / 500);
  const successfulEmployments = 14;

  res.json({
    totalFinancialReceived,
    mealsDistributed,
    studentsSustained,
    groceryKitsDistributed,
    medicalConsultations,
    clothesDistributed,
    successfulEmployments,
  });
});

// Need Requests endpoints
app.get("/api/needs", (req, res) => {
  res.json(needRequests);
});

app.post("/api/needs", (req, res) => {
  const { category, title, description, location, beneficiaryName, urgency } = req.body;
  if (!category || !title || !description || !location || !beneficiaryName) {
    return res.status(400).json({ error: "All fields are required to submit an aid request." });
  }

  const newNeed = {
    id: `need-${Date.now()}`,
    category,
    title,
    description,
    location,
    beneficiaryName,
    urgency: urgency || "Medium",
    status: "Pending" as const,
    requestedAt: new Date().toISOString(),
  };

  needRequests.unshift(newNeed);
  res.status(201).json(newNeed);
});

// Claim/Pledge a Need
app.post("/api/needs/:id/pledge", (req, res) => {
  const { id } = req.params;
  const { donorName } = req.body;

  if (!donorName) {
    return res.status(400).json({ error: "Donor name is required to pledge help." });
  }

  const need = needRequests.find((n) => n.id === id);
  if (!need) {
    return res.status(404).json({ error: "Request not found" });
  }

  if (need.status !== "Pending") {
    return res.status(400).json({ error: "This request has already been pledged or completed." });
  }

  need.status = "Pledged";
  need.pledgedBy = donorName;

  res.json(need);
});

// Fulfill/Complete a Need
app.post("/api/needs/:id/fulfill", (req, res) => {
  const { id } = req.params;
  const { details, verificationPhoto } = req.body;

  const need = needRequests.find((n) => n.id === id);
  if (!need) {
    return res.status(404).json({ error: "Request not found" });
  }

  need.status = "Fulfilled";
  need.fulfillmentDetails = details || "Fulfilled successfully by the community.";
  need.verificationPhoto = verificationPhoto || "https://picsum.photos/seed/verify/400/300";

  res.json(need);
});

// Volunteer Drives endpoints
app.get("/api/drives", (req, res) => {
  res.json(volunteerDrives);
});

app.post("/api/drives/:id/signup", (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: "All contact fields are required." });
  }

  const drive = volunteerDrives.find((d) => d.id === id);
  if (!drive) {
    return res.status(404).json({ error: "Volunteer drive not found" });
  }

  if (drive.spotsRegistered >= drive.spotsMax) {
    return res.status(400).json({ error: "This drive is already fully booked. Thank you!" });
  }

  const newSignup = {
    id: `signup-${Date.now()}`,
    driveId: id,
    name,
    email,
    phone,
    status: "Confirmed",
  };

  volunteerSignups.push(newSignup);
  drive.spotsRegistered += 1;

  res.status(201).json(newSignup);
});

// Campaigns list
app.get("/api/campaigns", (req, res) => {
  res.json(campaigns);
});

// Financial donations & transparency ledger
app.get("/api/donations", (req, res) => {
  res.json(financialDonations);
});

app.post("/api/donations", (req, res) => {
  const { donorName, amount, category, message, frequency } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Donation amount must be greater than zero." });
  }

  const verifiedDonor = donorName?.trim() ? donorName.trim() : "Anonymous Donor";
  const verifiedCategory = category || "General";
  const verifiedFrequency = frequency || "one-time";

  // Create cryptographic-looking transparent transaction hash
  const hex = Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, '0');
  const hex2 = Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, '0');
  const transactionHash = `FFA-TX-${hex}${hex2}`;

  const newDonation = {
    id: `tx-${Date.now()}`,
    donorName: verifiedDonor,
    amount: Number(amount),
    category: verifiedCategory,
    message: message || undefined,
    timestamp: new Date().toISOString(),
    transactionHash,
    frequency: verifiedFrequency,
  };

  financialDonations.unshift(newDonation);

  // Update corresponding campaign in memory if matching category
  const camp = campaigns.find(c => c.category === verifiedCategory);
  if (camp) {
    camp.currentAmount += Number(amount);
  }

  res.status(201).json(newDonation);
});

// Impact stories endpoint
app.get("/api/stories", (req, res) => {
  res.json(impactStories);
});

// ----------------------------------------------------
// KARUNA AI ROUTE (Gemini Integration)
// ----------------------------------------------------
app.post("/api/gemini/advisor", async (req, res) => {
  const { messages, userType } = req.body; // userType can be "donor" | "need" | "general"

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // Get the latest message text
  const latestMessage = messages[messages.length - 1]?.text;
  if (!latestMessage) {
    return res.status(400).json({ error: "Last message content cannot be empty." });
  }

  if (!ai) {
    // Elegant fallback if no key is loaded
    const low = latestMessage.toLowerCase();
    let reply = "Vanakkam! I am Karuna, your AI Trust Assistant for Food For All Chennai. ";
    let actionItem = null;

    if (low.includes("food") || low.includes("meal") || low.includes("eat") || low.includes("rice")) {
      reply += "I've routed your concern to our **Feed Chennai Daily Initiative**. We provide cooked meals for Rs. 40/meal, or distribute grocery kits. Would you like to sponsor meals, or do you know of a location needing food support?";
      actionItem = { type: "suggest_campaign", campaignId: "camp-food", category: "Food" };
    } else if (low.includes("school") || low.includes("book") || low.includes("education") || low.includes("teach") || low.includes("study")) {
      reply += "That falls directly under our **Vidya Deepam Education Campaign**. We supply uniforms, stationery kits (Rs. 1,500), or place mentors. Shall I guide you to the education sponsorship panel or volunteer driving options?";
      actionItem = { type: "suggest_campaign", campaignId: "camp-edu", category: "Education" };
    } else if (low.includes("job") || low.includes("work") || low.includes("employ") || low.includes("earn")) {
      reply += "This falls under our **Empower Chennai** livelihood program. We assist underprivileged individuals in securing receptionist, data entry, typing, or driving roles. Do you have a job vacancy to share, or does someone need placement?";
      actionItem = { type: "suggest_need_draft", category: "Employment", suggestedTitle: "Livelihood support vacancy / request" };
    } else if (low.includes("doctor") || low.includes("medicine") || low.includes("health") || low.includes("medical") || low.includes("ill")) {
      reply += "I will map this to our **Sanjeevani Elder Care Support**. We supply basic healthcare checkups and medicines for pavements dwellers in Chennai. Would you like to log a patient care request or sponsor medical kits?";
      actionItem = { type: "suggest_campaign", campaignId: "camp-medical", category: "Medical Aid" };
    } else if (low.includes("dress") || low.includes("clothes") || low.includes("shirt") || low.includes("wear")) {
      reply += "This falls under our **Vastra Clothes Distribution**. We collect wearable clothes and sponsor new uniform kits (Rs. 500). Let me know if you would like to initiate a clothing drive or contribute!";
      actionItem = { type: "suggest_need_draft", category: "Dresses", suggestedTitle: "Clothes donation mobilization" };
    } else {
      reply += "I am here to connect you with our primary trust support initiatives: Food security, Vidya Deepam Education, Amudham Groceries, Sanjeevani Medical support, and Empower Chennai livelihoods. Tell me: Are you looking to support an initiative today, or is there a community need you'd like to report?";
    }

    return res.json({
      text: reply,
      actionItem,
    });
  }

  try {
    // Generate context-aware system instruction
    const systemInstruction = `
You are "Karuna AI" (Compassion AI), a world-class, deeply empathetic, and smart trust assistant for "Food For All Chennai Trust", an NGO working in Chennai, India.
Your mission is to increase trust, explain where funds go, help donors structure their donations, and help community workers submit well-formatted aid requests.

CRITICAL BEHAVIORS:
1. Warmth & Localization: Greet sometimes with "Vanakkam!" (Tamil greeting). Be highly courteous. Reference Chennai localities (Adyar, T. Nagar, Mylapore, Tambaram, Royapettah, Velachery, Vyasarpadi, Perambur, Triplicane) when explaining logistics.
2. Direct Action Matching: Analyze the user's message.
   - If they are a DONOR offering help (e.g. "I have extra clothes", "I want to sponsor 50 meals", "I want to teach English"):
     - Identify which category it belongs to: 'Food', 'Education', 'Employment', 'Groceries', 'Medical Aid', 'Dresses', 'Financial'.
     - Warmly acknowledge.
     - Structure an "actionItem" in the JSON output suggesting they donate to a matching campaign or request, or coordinate physical collections.
   - If they are representing an AID REQUEST (someone in need, e.g., "we need groceries for a poor family in Mylapore" or "a disabled kid needs school notebooks"):
     - Empathize deeply.
     - Draft a structural "NeedRequest" proposal so they can create a ticket with 1 click.
     - Structure an "actionItem" of type "suggest_need_draft".
3. Response Format: You MUST output structured JSON matching the schema below.
   - You must NOT include raw markdown wrapping inside the text unless necessary.
   - Keep your main "text" response clean, reassuring, and helpful. Mention that 100% of donations go directly to beneficiaries with zero overhead.

JSON schema to return:
{
  "text": "Your warm conversational response in plain text or simple markdown.",
  "actionItem": null or {
    "type": "suggest_campaign" | "suggest_need_draft" | "direct_pledge",
    "category": "Food" | "Education" | "Employment" | "Groceries" | "Medical Aid" | "Dresses" | "Financial",
    "campaignId": "camp-food" | "camp-edu" | "camp-groceries" | "camp-medical" | null,
    "draftNeed": {
      "category": "Food" | "Education" | "Employment" | "Groceries" | "Medical Aid" | "Dresses" | "Financial",
      "title": "A short, compelling title for the need card",
      "description": "A well-structured description of the situation summarized from the user's input",
      "location": "Suggested Chennai neighborhood based on user input",
      "beneficiaryName": "Who needs it / Name of center mentioned",
      "urgency": "Low" | "Medium" | "High"
    }
  }
}

Example donor match response:
"Vanakkam! Thank you for your incredibly generous heart. Sponsoring 50 nutritious meals is a beautiful gesture. At Rs. 40 per meal, this completely funds a lunch drive for an entire pavement community in Velachery."
actionItem: { "type": "suggest_campaign", "category": "Food", "campaignId": "camp-food" }

Example aid request draft response:
"We hear you, and we want to help immediately. I have drafted an official aid request under our Sanjeevani Medical Desk for this nebulizer request in Mylapore. Please verify the drafted card below and click 'Submit' to publish it live on our Kindness Bridge."
actionItem: { "type": "suggest_need_draft", "category": "Medical Aid", "draftNeed": { "category": "Medical Aid", "title": "Nebulizer support for critical asthmatic patient", "description": "Asthmatic elderly lady needing urgent nebulizer care kit", "location": "Mylapore, near Temple", "beneficiaryName": "Mylapore local resident", "urgency": "High" } }
`;

    // Construct simple conversation prompt history
    const contents = messages.map(m => ({
      role: m.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);

  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    res.status(500).json({
      text: "Vanakkam! I experienced a small signal glitch, but my commitment to help remains strong. How can I assist you with supporting Food For All Chennai Trust today?",
      actionItem: null,
    });
  }
});

// ----------------------------------------------------
// VITE DEV SERVER MIDDLEWARE & STATIC SERVING
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Food For All Chennai Server booted successfully on port ${PORT}`);
    console.log(`🌍 URL: http://localhost:${PORT}`);
  });
}

startServer();
