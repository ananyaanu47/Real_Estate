import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }
    const separatorIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, '');
    }
  }
}

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4001);
const uploadsRoot = path.resolve(__dirname, '../../uploads');
const imagesRoot = path.join(uploadsRoot, 'images');
const videosRoot = path.join(uploadsRoot, 'videos');
const propertyMediaRoot = path.join(uploadsRoot, 'properties');

fs.mkdirSync(imagesRoot, { recursive: true });
fs.mkdirSync(videosRoot, { recursive: true });
fs.mkdirSync(propertyMediaRoot, { recursive: true });

function ensurePropertyMediaFolder(propertyId: string, mediaType: 'image' | 'video') {
  const folder = path.join(propertyMediaRoot, propertyId, mediaType === 'video' ? 'videos' : 'images');
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

function getPropertyMediaRelativePath(propertyId: string, mediaType: 'image' | 'video', fileName: string) {
  return path.posix.join('uploads', 'properties', propertyId, mediaType === 'video' ? 'videos' : 'images', fileName);
}

function getAbsoluteMediaPath(filePath: string) {
  return path.resolve(__dirname, '../../', filePath);
}

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function getNextPropertyStorageName(existingNames?: string[]) {
  const names = existingNames ?? (await prisma.property.findMany({ select: { name: true } })).map((property) => property.name);
  const numbers = names
    .map((name) => {
      const match = /^prop_(\d+)$/i.exec(name?.trim() || '');
      return match ? Number.parseInt(match[1], 10) : null;
    })
    .filter((value): value is number => Number.isInteger(value));

  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `prop_${String(nextNumber).padStart(2, '0')}`;
}

async function migrateExistingMedia() {
  const mediaItems = await prisma.propertyMedia.findMany();

  for (const item of mediaItems) {
    const absolutePath = getAbsoluteMediaPath(item.filePath);
    const shouldMigrate = !item.filePath.includes('/properties/') && fs.existsSync(absolutePath);

    if (!shouldMigrate) {
      continue;
    }

    const destinationDir = ensurePropertyMediaFolder(item.propertyId, item.mediaType === 'video' ? 'video' : 'image');
    const destinationPath = path.join(destinationDir, item.fileName);

    if (!fs.existsSync(destinationPath)) {
      fs.copyFileSync(absolutePath, destinationPath);
    }

    const newPath = getPropertyMediaRelativePath(item.propertyId, item.mediaType === 'video' ? 'video' : 'image', item.fileName);
    await prisma.propertyMedia.update({
      where: { id: item.id },
      data: { filePath: newPath }
    });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const propertyId = getRouteParam(req.params?.id);
    const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';

    if (!propertyId) {
      const fallback = mediaType === 'video' ? videosRoot : imagesRoot;
      callback(null, fallback);
      return;
    }

    const target = ensurePropertyMediaFolder(propertyId, mediaType);
    callback(null, target);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname) || '';
    const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    callback(null, `${baseName}${extension}`);
  }
});

const upload = multer({ storage });

async function seedExistingMedia() {
  const propertyCount = await prisma.property.count();
  if (propertyCount > 0) {
    return;
  }

  const sampleProperties = [
    {
      name: 'Riverside Signature Villa',
      status: 'Available',
      price: '₹2.1 Cr',
      location: 'Mysuru',
      propertyType: 'Villa',
      description: 'Spacious villa with premium finishes, landscaped garden, and a private sit-out for evening gatherings.',
      facing: 'East',
      area: '2200 sqft',
      bedrooms: 3,
      bathrooms: 3,
      source: path.resolve(__dirname, '../../Prop_1.jpg')
    },
    {
      name: 'Skyline Residence',
      status: 'Reserved',
      price: '₹1.45 Cr',
      location: 'Bengaluru',
      propertyType: 'Apartment',
      description: 'Elegant apartment with panoramic city views, modular kitchen, and a serene balcony.',
      facing: 'South',
      area: '1450 sqft',
      bedrooms: 2,
      bathrooms: 2,
      source: path.resolve(__dirname, '../../Prop_2.jpg')
    },
    {
      name: 'Heritage Townhouse',
      status: 'Available',
      price: '₹1.8 Cr',
      location: 'Coorg',
      propertyType: 'Townhouse',
      description: 'Classic townhouse designed for comfortable family living with a warm, welcoming feel.',
      facing: 'West',
      area: '1800 sqft',
      bedrooms: 3,
      bathrooms: 2,
      source: path.resolve(__dirname, '../../Prop_3.jpg')
    },
    {
      name: 'Garden View Penthouse',
      status: 'Sold',
      price: '₹3.2 Cr',
      location: 'Mysuru',
      propertyType: 'Penthouse',
      description: 'Statement penthouse with rich interiors, private terrace, and top-floor privacy.',
      facing: 'North',
      area: '2600 sqft',
      bedrooms: 4,
      bathrooms: 3,
      source: path.resolve(__dirname, '../../Prop_4.jpg')
    },
    {
      name: 'Contemporary Luxury Home',
      status: 'Available',
      price: '₹2.6 Cr',
      location: 'Mysuru',
      propertyType: 'Villa',
      description: 'Modern villa with clean lines, open planning, and a striking outdoor lounge space.',
      facing: 'East',
      area: '2400 sqft',
      bedrooms: 4,
      bathrooms: 3,
      source: path.resolve(__dirname, '../../Prop_5.jpg')
    }
  ];

  const sampleVideo = { source: path.resolve(__dirname, '../../prop_1.mp4'), mediaType: 'video' };
  const createdProperties: Array<{ id: string }> = [];

  for (const sampleProperty of sampleProperties) {
    const property = await prisma.property.create({
      data: {
        name: sampleProperty.name,
        status: sampleProperty.status,
        price: sampleProperty.price,
        location: sampleProperty.location,
        propertyType: sampleProperty.propertyType,
        description: sampleProperty.description,
        facing: sampleProperty.facing,
        area: sampleProperty.area,
        bedrooms: sampleProperty.bedrooms,
        bathrooms: sampleProperty.bathrooms
      }
    });

    createdProperties.push(property);

    if (fs.existsSync(sampleProperty.source)) {
      const destinationRoot = ensurePropertyMediaFolder(property.id, 'image');
      const destinationPath = path.join(destinationRoot, `${property.id}-${path.basename(sampleProperty.source)}`);
      fs.copyFileSync(sampleProperty.source, destinationPath);

      await prisma.propertyMedia.create({
        data: {
          propertyId: property.id,
          fileName: path.basename(destinationPath),
          originalName: path.basename(sampleProperty.source),
          mimeType: 'image/jpeg',
          mediaType: 'image',
          filePath: getPropertyMediaRelativePath(property.id, 'image', path.basename(destinationPath))
        }
      });
    }
  }

  if (fs.existsSync(sampleVideo.source) && createdProperties.length > 0) {
    const property = createdProperties[0];
    const videoDestinationRoot = ensurePropertyMediaFolder(property.id, 'video');
    const videoDestinationPath = path.join(videoDestinationRoot, `${property.id}-${path.basename(sampleVideo.source)}`);
    fs.copyFileSync(sampleVideo.source, videoDestinationPath);

    await prisma.propertyMedia.create({
      data: {
        propertyId: property.id,
        fileName: path.basename(videoDestinationPath),
        originalName: path.basename(sampleVideo.source),
        mimeType: 'video/mp4',
        mediaType: 'video',
        filePath: getPropertyMediaRelativePath(property.id, 'video', path.basename(videoDestinationPath))
      }
    });
  }
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsRoot));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

app.get('/api/properties', async (_req, res) => {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: { media: true }
  });
  res.json(properties);
});

function extractJsonObject(raw: string): any {
  const candidates = new Set<string>();
  const trimmed = raw.trim();

  if (trimmed) {
    candidates.add(trimmed);
    candidates.add(trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, ''));
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // continue with fallback extraction
    }

    const startIndex = candidate.indexOf('{');
    const endIndex = candidate.lastIndexOf('}');
    if (startIndex >= 0 && endIndex > startIndex) {
      const extracted = candidate.slice(startIndex, endIndex + 1);
      try {
        return JSON.parse(extracted);
      } catch {
        // ignore and continue
      }
    }
  }

  return null;
}

function cleanExtractedArea(value: string) {
  return (value || '')
    .replace(/^\s*(?:in|near\s+to|near|around|at|for|from|the)\s+/i, '')
    .replace(/\b(?:area|layout|locality|colony|neighborhood|road|street|location)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCustomerProfile(message: string) {
  const text = (message || '').trim();
  const lowered = text.toLowerCase();

  const budgetMatch = text.match(/(?:under|within|budget)\s*(?:₹|rs\.?|inr)?\s*([0-9][0-9,]*(?:\s*(?:lakh|lac|crore|cr|k|m))?)/i);
  const areaMatch = text.match(/(?:in|near\s+to|near|around|at|for|from)\s+(?:the\s+)?([a-z][a-z0-9\s&.,'-]{1,80})(?=\s+(?:under|within|budget|for|and|bhk|flat|villa|apartment|plot|land|commercial|office|shop|home|house|site|property|properties|list|show|me|please|can|you|will|with|is|are|near|around|located)\b|$)/i)
    || text.match(/(?:area|layout|locality|colony|neighborhood|road|street|location)\s*[:\-]?\s*([a-z0-9\s&.,'-]{2,60})/i)
    || text.match(/([a-z][a-z0-9\s&.,'-]{1,50}?)\s*(?:area|layout|locality|colony|neighborhood|road|street|location)\b/i);
  const propertyMatch = text.match(/\b(?:2\s*bhk|3\s*bhk|4\s*bhk|flat|villa|apartment|plot|land|commercial|shop|office|house|home|site)\b/i);

  let propertyType = 'property options';
  if (/(plot|land|site)/i.test(text)) {
    propertyType = 'land options';
  } else if (/(commercial|office|shop|warehouse)/i.test(text)) {
    propertyType = 'commercial property options';
  } else if (/(villa|flat|apartment|house|home|bhk)/i.test(text)) {
    propertyType = 'residential property options';
  }

  const extractedArea = areaMatch ? areaMatch[1] : '';
  const greetingOnlyPattern = /^(?:hi|hello|hey|hii|hey there|namaste|good morning|good afternoon|good evening)(?:[!?.\s]*)$/i;
  const isGreetingOnly = greetingOnlyPattern.test(lowered) && !/(?:\b(?:under|within|budget|area|layout|locality|colony|neighborhood|road|street|location|bhk|flat|villa|apartment|plot|land|commercial|shop|office|house|home|site|property)\b|₹|rs\.?|inr)/i.test(text);

  return {
    budget: budgetMatch ? budgetMatch[0].replace(/^.*?(under|within|budget)\s*/i, '').trim() : '',
    area: cleanExtractedArea(extractedArea),
    propertyType,
    isGreetingOnly
  };
}

function buildFallbackAssistantReply(customerInput: {
  customerMessage?: string;
  customerName?: string;
  budget?: string;
  area?: string;
  propertyType?: string;
  notes?: string;
}, properties: Array<{ name: string; propertyType?: string | null; area?: string | null; location?: string | null; status?: string | null; price?: string | null }>) {
  const rawMessage = (customerInput.customerMessage || '').trim();
  const cleanText = rawMessage || 'Customer is interested in a property.';
  const profile = extractCustomerProfile(cleanText);
  const normalizedBudget = customerInput.budget && customerInput.budget.trim() ? customerInput.budget.trim() : (profile.budget || '');
  const normalizedArea = customerInput.area && customerInput.area.trim() ? customerInput.area.trim() : (profile.area || '');
  const normalizedType = customerInput.propertyType && customerInput.propertyType.trim() ? customerInput.propertyType.trim() : profile.propertyType;

  const isGreetingOnly = profile.isGreetingOnly;
  const hasRealPropertyIntent = isPropertyQueryIntent(cleanText);

  const matches = hasRealPropertyIntent && !isGreetingOnly
    ? properties
        .filter((property) => {
          const query = cleanText.toLowerCase();
          const type = (property.propertyType || '').toLowerCase();
          const area = (property.area || property.location || '').toLowerCase();
          const targetArea = normalizedArea.toLowerCase();
          if (!targetArea) {
            return query.includes('bhk') ? type.includes('residential') : true;
          }
          return query.includes('bhk') ? type.includes('residential') || area.includes(targetArea) : area.includes(targetArea) || type.includes(targetArea);
        })
        .slice(0, 3)
        .map((property) => property.name)
    : [];

  const name = customerInput.customerName || 'Customer';
  const areaPart = normalizedArea ? ` in ${normalizedArea}` : '';
  const budgetPart = normalizedBudget ? ` within ${normalizedBudget}` : '';
  const typePart = normalizedType ? ` for ${normalizedType.toLowerCase()}` : '';

  const draftReply = !hasRealPropertyIntent
    ? `Hi ${name}! 👋 I’m here to help shortlist properties. Please share your preferred area, budget, and property type and I’ll check the available listings.`
    : isGreetingOnly
      ? `Hi ${name}! 👋 Thanks for reaching out to Shreyas Associates. Please share your preferred area, budget, and property type, and I’ll shortlist the best options for you.`
      : normalizedArea && !normalizedBudget && !normalizedType
        ? `I can help with properties${areaPart}. Please share your budget or preferred property type, and I’ll shortlist the best options for you.`
        : `I can help with${typePart}${areaPart}${budgetPart}. I’ll shortlist the most suitable options and share the best matches for follow-up.`;

  return {
    summary: !hasRealPropertyIntent
      ? 'Customer is greeting the assistant and needs a quick clarification for property search.'
      : isGreetingOnly
        ? 'Customer is starting a property enquiry and wants help with the next steps.'
        : `Customer is asking for property options${areaPart}${budgetPart}.`,
    matches,
    draftReply,
    action: 'follow-up'
  };
}

function parseEmbeddingValues(raw: string): number[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value) => Number.isFinite(value)).map((value) => Number(value));
  } catch {
    return [];
  }
}

function cosineSimilarity(left: number[], right: number[]) {
  const minLength = Math.min(left.length, right.length);
  if (minLength === 0) {
    return 0;
  }

  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (let index = 0; index < minLength; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;
    dot += leftValue * rightValue;
    leftNorm += leftValue * leftValue;
    rightNorm += rightValue * rightValue;
  }

  if (leftNorm === 0 || rightNorm === 0) {
    return 0;
  }

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

async function generateTextEmbedding(text: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'models/gemini-embedding-001',
      content: {
        parts: [{ text }]
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API failed: ${errorText}`);
  }

  const payload = await response.json() as { embedding?: { values?: number[] } };
  const values = payload.embedding?.values;
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Gemini returned an empty embedding.');
  }

  return values;
}

function buildPropertyEmbeddingText(property: {
  id?: string;
  name: string;
  status?: string | null;
  price?: string | null;
  location?: string | null;
  propertyType?: string | null;
  description?: string | null;
  area?: string | null;
  facing?: string | null;
  landType?: string | null;
  siteNo?: string | null;
}) {
  const parts = [
    property.name,
    property.status || '',
    property.price || '',
    property.location || '',
    property.propertyType || '',
    property.area || '',
    property.facing || '',
    property.landType || '',
    property.siteNo || '',
    property.description || ''
  ].filter((value) => value && String(value).trim());

  return parts.join(' | ');
}

async function syncPropertyEmbeddings(property: { id: string; name: string; status?: string | null; price?: string | null; location?: string | null; propertyType?: string | null; description?: string | null; area?: string | null; facing?: string | null; landType?: string | null; siteNo?: string | null }) {
  const text = buildPropertyEmbeddingText(property);
  const chunkText = text.length > 300 ? text.slice(0, 300) : text;

  if (!chunkText.trim()) {
    return;
  }

  const embeddingValues = await generateTextEmbedding(chunkText);

  await prisma.propertyEmbedding.deleteMany({ where: { propertyId: property.id } });
  await prisma.propertyEmbedding.create({
    data: {
      propertyId: property.id,
      chunkIndex: 0,
      chunkText,
      embedding: JSON.stringify(embeddingValues)
    }
  });
}

async function reindexAllPropertyEmbeddings() {
  const properties = await prisma.property.findMany();

  for (const property of properties) {
    try {
      await syncPropertyEmbeddings(property);
    } catch (error) {
      console.warn('Property embedding sync failed for', property.id, error);
    }
  }

  return properties.length;
}

function normalizeAssistantText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isPropertyQueryIntent(query: string) {
  const text = (query || '').trim();
  if (!text) {
    return false;
  }

  const normalized = normalizeAssistantText(text);
  if (!normalized) {
    return false;
  }

  const genericConversation = /^(hi|hello|hey|hii|hey there|namaste|good morning|good afternoon|good evening|thanks|thank you|what are you doing|what are you|who are you|how are you|what do you do|tell me about yourself|how can you help|hey there)$/i;
  if (genericConversation.test(normalized)) {
    return false;
  }

  const propertySignals = /\b(?:list|show|find|search|looking|need|want|get|property|properties|villa|flat|apartment|house|home|plot|land|site|commercial|office|shop|location|area|layout|locality|near|around|budget|under|within|price|sale|residential|saleable|bhk)\b/i;
  return propertySignals.test(normalized);
}

function extractSearchFilters(query: string) {
  const text = (query || '').trim();
  if (!text) {
    return { area: '', propertyType: '' };
  }

  const areaMatch = text.match(/(?:in|near\s+to|near|around|at|for|from)\s+(?:the\s+)?([a-z][a-z0-9\s&.,'-]{2,80})(?=\s+(?:under|within|budget|for|and|bhk|flat|villa|apartment|plot|land|commercial|office|shop|house|home|site|property|properties|list|show|me|please|can|you|will|with|is|are|near|around|located)\b|$)/i)
    || text.match(/(?:area|layout|locality|colony|neighborhood|road|street|location)\s*[:\-]?\s*([a-z0-9\s&.,'-]{2,60})/i)
    || text.match(/\b([a-z][a-z0-9\s&.,'-]{2,40})\s+(?:area|layout|locality|colony|neighborhood)\b/i);
  const propertyTypeMatch = text.match(/(?:property\s*type|type)\s*[:\-]?\s*([a-z0-9\s&.,'-]{2,40})/i)
    || text.match(/\b(?:residential|commercial|villa|flat|apartment|plot|land|house|site|shop|office)\b/i);

  const area = cleanExtractedArea(areaMatch ? areaMatch[1] : '');
  const propertyType = propertyTypeMatch ? propertyTypeMatch[1] ? propertyTypeMatch[1].replace(/\s+/g, ' ').trim() : propertyTypeMatch[0].replace(/.*(?:property\s*type|type)\s*[:\-]?\s*/i, '').replace(/\s+/g, ' ').trim() : '';

  return {
    area,
    propertyType
  };
}

function scorePropertyMatch(query: string, property: any) {
  const normalizedQuery = normalizeAssistantText(query);
  const propertyText = normalizeAssistantText([
    property.name,
    property.propertyType,
    property.area,
    property.location,
    property.description,
    property.facing,
    property.landType,
    property.siteNo,
    property.status,
    property.price
  ].filter(Boolean).join(' '));

  if (!normalizedQuery || !propertyText) {
    return 0;
  }

  let score = 0;
  const queryTokens = normalizedQuery.split(' ').filter(Boolean);
  const propertyTokens = new Set(propertyText.split(' ').filter(Boolean));

  for (const token of queryTokens) {
    if (!token) continue;

    if (propertyTokens.has(token)) {
      score += 2.5;
    }

    if (propertyText.includes(token)) {
      score += 1.2;
    }
  }

  const hasResidentialIntent = /bhk|flat|villa|apartment|residential|home/.test(normalizedQuery);
  const propertyTypeText = normalizeAssistantText(property.propertyType || '');
  if (hasResidentialIntent && /(residential|villa|apartment|flat|home|bhk)/.test(propertyTypeText)) {
    score += 3;
  }

  const hasCommercialIntent = /commercial|office|shop|plot|land/.test(normalizedQuery);
  if (hasCommercialIntent && /(commercial|land|plot|office|shop)/.test(propertyTypeText)) {
    score += 3;
  }

  const areaText = normalizeAssistantText([property.area, property.location].filter(Boolean).join(' '));
  if (normalizedQuery.includes('mysuru') && areaText.includes('mysuru')) {
    score += 2;
  }

  if (normalizedQuery.includes('near') && areaText.length > 0) {
    score += 1;
  }

  return score;
}

async function findRelevantProperties(query: string, limit = 5) {
  if (!query.trim() || !isPropertyQueryIntent(query)) {
    return [] as Array<{ property: any; score: number }>;
  }

  const filters = extractSearchFilters(query);
  const directMatches = await prisma.property.findMany({
    where: {
      ...(filters.area ? {
        OR: [
          { area: { contains: filters.area } },
          { location: { contains: filters.area } }
        ]
      } : {}),
      ...(filters.propertyType ? { propertyType: { contains: filters.propertyType } } : {})
    },
    orderBy: { createdAt: 'desc' },
    include: { media: true },
    take: limit * 3
  });

  const directScored = directMatches
    .map((property) => ({ property, score: scorePropertyMatch(query, property) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit) as Array<{ property: any; score: number }>;

  if (directScored.length > 0) {
    return directScored;
  }

  try {
    if (process.env.GEMINI_API_KEY) {
      const queryEmbedding = await generateTextEmbedding(query.trim());
      const records = await prisma.propertyEmbedding.findMany();

      const scored: Array<{ propertyId: string; score: number; chunkText: string }> = [];

      for (const record of records) {
        const embedding = parseEmbeddingValues(record.embedding);
        if (embedding.length === 0) {
          continue;
        }

        scored.push({
          propertyId: record.propertyId,
          score: cosineSimilarity(queryEmbedding, embedding),
          chunkText: record.chunkText
        });
      }

      const topByProperty = new Map<string, { propertyId: string; score: number; chunkText: string }>();

      for (const entry of scored) {
        const current = topByProperty.get(entry.propertyId);
        if (!current || entry.score > current.score) {
          topByProperty.set(entry.propertyId, entry);
        }
      }

      const ranked = Array.from(topByProperty.values())
        .sort((left, right) => right.score - left.score)
        .slice(0, limit);

      const propertyIds = ranked.map((entry) => entry.propertyId);
      const properties = await prisma.property.findMany({
        where: { id: { in: propertyIds } },
        include: { media: true }
      });

      const lookup = new Map(properties.map((property) => [property.id, property]));

      const embeddingMatches = ranked
        .map((entry) => ({ property: lookup.get(entry.propertyId), score: entry.score }))
        .filter((entry) => entry.property)
        .slice(0, limit) as Array<{ property: any; score: number }>;

      if (embeddingMatches.length > 0) {
        return embeddingMatches;
      }
    }
  } catch (error) {
    console.warn('Embedding-based property search failed, falling back to local matching.', error);
  }

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: { media: true },
    take: 50
  });

  return properties
    .map((property) => ({ property, score: scorePropertyMatch(query, property) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit) as Array<{ property: any; score: number }>;
}

async function generateGeminiReply(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Set it in the backend environment before using the AI assistant.');
  }

  const preferredModels = Array.from(new Set([
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-3.6-flash'
  ].filter((value): value is string => Boolean(value && value.trim()))));

  let lastError: Error | null = null;

  for (const model of preferredModels) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300,
            responseMimeType: 'application/json'
          }
        })
      });

      const responseText = await response.text();
      if (!response.ok) {
        lastError = new Error(`Gemini API call failed for ${model}: ${responseText}`);
        continue;
      }

      if (!responseText.trim()) {
        throw new Error('Gemini returned an empty response.');
      }

      let data: any;
      try {
        data = JSON.parse(responseText) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
        };
      } catch {
        const jsonStart = responseText.indexOf('{');
        const jsonEnd = responseText.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd <= jsonStart) {
          throw new Error('Gemini returned a non-JSON response.');
        }
        data = JSON.parse(responseText.slice(jsonStart, jsonEnd + 1));
      }

      const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join(' ') ?? '';
      if (!text.trim()) {
        throw new Error('Gemini returned an empty response.');
      }

      return text.trim();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Gemini response could not be processed.');
    }
  }

  throw lastError ?? new Error('Gemini returned an empty response.');
}

app.post('/api/assistant/reply', async (req, res) => {
  try {
    const { customerMessage, customerName, budget, area, propertyType, notes } = req.body ?? {};
    const relevantMatches = await findRelevantProperties(customerMessage || '', 5);
    const properties = relevantMatches.map((entry) => entry.property).filter(Boolean);
    const propertyMatches = properties.map((property) => property.name).filter(Boolean);

    const listingContext = (properties.length > 0 ? properties : await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { media: true }
    })).map((property) => ({
      name: property.name,
      status: property.status,
      price: property.price,
      dimension: property.dimension ?? 'Not specified',
      area: property.area ?? 'Not specified',
      propertyType: property.propertyType,
      facing: property.facing ?? 'Not specified',
      landType: property.landType ?? 'Not specified',
      siteNo: property.siteNo ?? 'Not specified',
      location: property.location,
      description: property.description ?? ''
    }));

    const topRelevantChunks = listingContext.map((property) => (
      `- ${property.name} | area: ${property.area} | location: ${property.location} | type: ${property.propertyType} | price: ${property.price} | status: ${property.status} | description: ${property.description || 'No description'}`
    )).join('\n');

    const prompt = `You are an expert real-estate assistant for Shreyas Associates in Mysuru. Use the property shortlist below as your only source of truth. Do not invent properties or prices. If the customer is greeting or not asking for a listing, ask one clarifying question instead of inventing matches.\n\nCustomer context:\n- Name: ${customerName || 'Not provided'}\n- Message: ${customerMessage || 'No message provided'}\n- Budget: ${budget || 'Not provided'}\n- Area: ${area || 'Not provided'}\n- Property type: ${propertyType || 'Not provided'}\n- Notes: ${notes || 'No extra notes'}\n\nTop relevant property context:\n${topRelevantChunks || 'No matching properties found in the current database context.'}\n\nReturn JSON with exactly this shape:\n{\n  "summary": "short summary of the buyer need",\n  "matches": ["property name 1", "property name 2"],\n  "draftReply": "a polished WhatsApp-style reply to the customer",\n  "action": "suggested next step: follow-up, share listings, ask budget, or schedule visit"\n}`;

    let geminiReply: string;
    try {
      geminiReply = await generateGeminiReply(prompt);
    } catch (error) {
      const fallback = buildFallbackAssistantReply({
        customerMessage: customerMessage || '',
        customerName: customerName || '',
        budget: budget || '',
        area: area || '',
        propertyType: propertyType || '',
        notes: notes || ''
      }, properties);
      res.json({
        summary: fallback.summary,
        matches: fallback.matches,
        draftReply: fallback.draftReply,
        action: fallback.action,
        raw: fallback.draftReply,
        fallback: true,
        error: error instanceof Error ? error.message : 'Assistant unavailable.'
      });
      return;
    }

    const parsed = extractJsonObject(geminiReply);
    const fallback = buildFallbackAssistantReply({
      customerMessage: customerMessage || '',
      customerName: customerName || '',
      budget: budget || '',
      area: area || '',
      propertyType: propertyType || '',
      notes: notes || ''
    }, properties);

    const result = parsed && typeof parsed === 'object'
      ? parsed
      : fallback;

    const resolvedMatches = Array.isArray(result.matches) && result.matches.length > 0
      ? result.matches
      : propertyMatches.length > 0
        ? propertyMatches
        : fallback.matches;

    res.json({
      summary: result.summary || fallback.summary,
      matches: resolvedMatches,
      draftReply: result.draftReply || fallback.draftReply,
      action: result.action || fallback.action,
      raw: geminiReply,
      fallback: !parsed || typeof parsed !== 'object'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not generate a reply.';
    res.status(500).json({ error: message });
  }
});

app.get('/api/leads', async (_req, res) => {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { messages: true, reminders: true }
  });
  res.json(leads);
});

app.get('/api/reminders', async (_req, res) => {
  const reminders = await prisma.leadReminder.findMany({
    orderBy: { dueAt: 'asc' },
    include: { lead: true }
  });
  res.json(reminders);
});

app.post('/api/leads', async (req, res) => {
  const { name, phone, source, status, budget, preferredArea, propertyType, notes, lastMessage } = req.body ?? {};

  const lead = await prisma.lead.create({
    data: {
      name: typeof name === 'string' ? name : null,
      phone: typeof phone === 'string' ? phone : null,
      source: typeof source === 'string' ? source : 'website',
      status: typeof status === 'string' ? status : 'new',
      budget: typeof budget === 'string' ? budget : null,
      preferredArea: typeof preferredArea === 'string' ? preferredArea : null,
      propertyType: typeof propertyType === 'string' ? propertyType : null,
      notes: typeof notes === 'string' ? notes : null,
      lastMessage: typeof lastMessage === 'string' ? lastMessage : null
    },
    include: { messages: true, reminders: true }
  });

  res.status(201).json(lead);
});

app.get('/api/leads/:id', async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id },
    include: { messages: true, reminders: true }
  });

  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  res.json(lead);
});

app.post('/api/leads/:id/messages', async (req, res) => {
  const { direction, body, provider, rawPayload } = req.body ?? {};
  const leadId = req.params.id;

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  const message = await prisma.leadMessage.create({
    data: {
      leadId,
      direction: typeof direction === 'string' ? direction : 'inbound',
      body: typeof body === 'string' ? body : '',
      provider: typeof provider === 'string' ? provider : 'website',
      rawPayload: typeof rawPayload === 'string' ? rawPayload : null
    }
  });

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      lastMessage: typeof body === 'string' ? body : lead.lastMessage,
      conversationCount: lead.conversationCount + 1,
      updatedAt: new Date()
    }
  });

  res.status(201).json(message);
});

app.post('/api/leads/:id/reminders', async (req, res) => {
  const { type, title, body, dueAt } = req.body ?? {};
  const leadId = req.params.id;

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  const reminder = await prisma.leadReminder.create({
    data: {
      leadId,
      type: typeof type === 'string' ? type : 'follow_up',
      title: typeof title === 'string' ? title : 'Follow up',
      body: typeof body === 'string' ? body : '',
      dueAt: dueAt ? new Date(String(dueAt)) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
    }
  });

  res.status(201).json(reminder);
});

app.post('/api/reindex-embeddings', async (_req, res) => {
  try {
    const count = await reindexAllPropertyEmbeddings();
    res.json({ ok: true, indexed: count });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Embedding reindex failed.' });
  }
});

app.post('/api/vector-search', async (req, res) => {
  try {
    const { query, limit = 5 } = req.body ?? {};
    if (typeof query !== 'string' || !query.trim()) {
      res.status(400).json({ error: 'A search query is required.' });
      return;
    }

    const results = await findRelevantProperties(query, limit);
    res.json({ results: results.map((entry) => ({
      propertyId: entry.property.id,
      name: entry.property.name,
      score: entry.score,
      propertyType: entry.property.propertyType,
      area: entry.property.area,
      location: entry.property.location,
      status: entry.property.status,
      price: entry.property.price
    })) });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Vector search failed.' });
  }
});

app.post('/api/leads/:id/draft-reply', async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id },
    include: { messages: true }
  });

  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { media: true }
  });

  const latestMessages = [...(lead.messages ?? [])].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const messageContext = latestMessages.slice(-5).map((message) => `${message.direction}: ${message.body}`).join('\n');

  const prompt = `You are the lead-assistant for Shreyas Associates. Use only the property catalogue below. Draft a friendly WhatsApp response for the lead. Be warm, concise, and professional. Do not claim anything unverified.\n\nLead details:\nName: ${lead.name || 'Not provided'}\nPhone: ${lead.phone || 'Not provided'}\nBudget: ${lead.budget || 'Not provided'}\nArea: ${lead.preferredArea || 'Not provided'}\nProperty type: ${lead.propertyType || 'Not provided'}\nNotes: ${lead.notes || 'Not provided'}\n\nRecent conversation:\n${messageContext || 'No previous conversation'}\n\nCatalogue:\n${JSON.stringify(properties.map((property) => ({
  name: property.name,
  status: property.status,
  price: property.price,
  area: property.area,
  location: property.location,
  propertyType: property.propertyType,
  facing: property.facing,
  landType: property.landType,
  description: property.description
})), null, 2)}\n\nReturn only the drafted WhatsApp message text.`;

  try {
    const draft = await generateGeminiReply(prompt);
    res.json({ draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate draft';
    res.status(500).json({ error: message });
  }
});

app.post('/api/leads/:id/approve-draft', async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
  if (!lead) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }

  const { draft, channel = 'whatsapp' } = req.body ?? {};
  const approved = typeof draft === 'string' && draft.trim() ? draft.trim() : 'Thank you for your interest. I will share the best options and follow up shortly.';

  const message = await prisma.leadMessage.create({
    data: {
      leadId: lead.id,
      direction: 'outbound',
      body: approved,
      provider: channel,
      rawPayload: JSON.stringify({ approvedBy: 'admin', approvedAt: new Date().toISOString() })
    }
  });

  const reminder = await prisma.leadReminder.create({
    data: {
      leadId: lead.id,
      type: 'follow_up',
      title: 'Follow up after approval',
      body: 'Review the approved outbound message and continue the conversation if needed.',
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)
    }
  });

  await prisma.lead.update({
    where: { id: lead.id },
    data: { lastMessage: approved, status: 'contacted' }
  });

  res.status(201).json({ message, reminder });
});

app.post('/api/whatsapp/webhook', async (req, res) => {
  const body = req.body ?? {};
  const value = body.entry?.[0]?.changes?.[0]?.value ?? {};
  const message = value.messages?.[0];
  const from = message?.from;
  const text = message?.text?.body ?? 'Incoming WhatsApp message';

  if (!from) {
    res.status(200).json({ ok: true, ignored: true });
    return;
  }

  let lead = await prisma.lead.findFirst({ where: { phone: from } });
  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        phone: from,
        source: 'whatsapp',
        status: 'new',
        lastMessage: text,
        notes: 'Created from WhatsApp webhook.'
      }
    });
  }

  await prisma.leadMessage.create({
    data: {
      leadId: lead.id,
      direction: 'inbound',
      body: text,
      provider: 'whatsapp',
      rawPayload: JSON.stringify(body)
    }
  });

  await prisma.lead.update({
    where: { id: lead.id },
    data: { lastMessage: text, conversationCount: lead.conversationCount + 1 }
  });

  res.status(200).json({ ok: true, leadId: lead.id });
});

app.get('/api/properties/:id', async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: { media: true }
  });
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json(property);
});

const normalizeStoredLocation = (locationValue?: unknown, areaValue?: unknown, mapsUrlValue?: unknown) => {
  const normalizedLocation = typeof locationValue === 'string' ? locationValue.trim() : '';
  if (normalizedLocation && normalizedLocation.toLowerCase() !== 'location to be added' && normalizedLocation.toLowerCase() !== 'location provided') {
    return normalizedLocation;
  }

  const normalizedArea = typeof areaValue === 'string' ? areaValue.trim() : '';
  if (normalizedArea) {
    return normalizedArea;
  }

  // Do not synthesize placeholder strings for missing location data.
  // Return empty string so callers can treat absence explicitly in the UI.
  return '';
};

app.post('/api/properties', async (req, res) => {
  const { name, status, price, dimension, location, propertyType, description, area, facing, mapsUrl, landType, siteNo } = req.body;
  const normalizedName = typeof name === 'string' && name.trim() ? name.trim() : 'Untitled property';
  const normalizedStatus = typeof status === 'string' && status.trim() ? status.trim() : 'Available';
  const normalizedPrice = typeof price === 'string' && price.trim() ? price.trim() : 'Price on request';
  const normalizedDimension = typeof dimension === 'string' && dimension.trim() ? dimension.trim() : null;
  // store nearby location (location) explicitly; if missing, save empty string
  const normalizedLocation = typeof location === 'string' && location.trim() ? location.trim() : '';
  const normalizedPropertyType = typeof propertyType === 'string' && propertyType.trim() ? propertyType.trim() : 'Other';

  const storageName = await getNextPropertyStorageName();
  const property = await prisma.property.create({
    data: {
      name: storageName,
      status: normalizedStatus,
      price: normalizedPrice,
      dimension: normalizedDimension,
      location: normalizedLocation,
      propertyType: normalizedPropertyType,
      description: typeof description === 'string' ? description : null,
      area: area ?? null,
      facing: facing ?? null,
      mapsUrl: typeof mapsUrl === 'string' && mapsUrl.trim() ? mapsUrl.trim() : null,
      landType: typeof landType === 'string' && landType.trim() ? landType.trim() : null,
      siteNo: typeof siteNo === 'string' && siteNo.trim() ? siteNo.trim() : null
    },
    include: { media: true }
  });

  res.status(201).json(property);
});

app.put('/api/properties/:id', async (req, res) => {
  const { name, status, price, dimension, location, propertyType, description, area, facing, mapsUrl, landType, siteNo } = req.body;
  const propertyId = getRouteParam(req.params.id);
  const normalizedName = typeof name === 'string' && name.trim() ? name.trim() : 'Untitled property';
  const normalizedStatus = typeof status === 'string' && status.trim() ? status.trim() : 'Available';
  const normalizedPrice = typeof price === 'string' && price.trim() ? price.trim() : 'Price on request';
  const normalizedDimension = typeof dimension === 'string' && dimension.trim() ? dimension.trim() : null;
  const normalizedLocation = typeof location === 'string' && location.trim() ? location.trim() : '';
  const normalizedPropertyType = typeof propertyType === 'string' && propertyType.trim() ? propertyType.trim() : 'Other';

  if (!propertyId) {
    res.status(400).json({ error: 'Property id is required' });
    return;
  }

  const existingProperty = await prisma.property.findUnique({ where: { id: propertyId }, select: { name: true } });
  const storageName = existingProperty?.name?.match(/^prop_\d+$/i)
    ? existingProperty.name
    : await getNextPropertyStorageName();

  const property = await prisma.property.update({
    where: { id: propertyId },
    data: {
      name: normalizedName,
      status: normalizedStatus,
      price: normalizedPrice,
      dimension: normalizedDimension,
      location: normalizedLocation,
      propertyType: normalizedPropertyType,
      description: typeof description === 'string' ? description : null,
      area: area ?? null,
      facing: facing ?? null,
      mapsUrl: typeof mapsUrl === 'string' && mapsUrl.trim() ? mapsUrl.trim() : null,
      landType: typeof landType === 'string' && landType.trim() ? landType.trim() : null,
      siteNo: typeof siteNo === 'string' && siteNo.trim() ? siteNo.trim() : null
    },
    include: { media: true }
  });

  res.json(property);
});

app.post('/api/properties/:id/media', upload.array('files', 20), async (req, res) => {
  const propertyId = getRouteParam(req.params.id);

  if (!propertyId) {
    res.status(400).json({ error: 'Property id is required' });
    return;
  }

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }

  const files = Array.isArray(req.files) ? req.files : [];
  const mediaItems = await Promise.all(
    files.map(async (file) => {
      const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
      return prisma.propertyMedia.create({
        data: {
          propertyId: property.id,
          fileName: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          mediaType,
          filePath: getPropertyMediaRelativePath(property.id, mediaType, file.filename)
        }
      });
    })
  );

  res.status(201).json(mediaItems);
});

app.get('/api/properties/:id/media', async (req, res) => {
  const propertyId = getRouteParam(req.params.id);
  if (!propertyId) {
    res.status(400).json({ error: 'Property id is required' });
    return;
  }

  const media = await prisma.propertyMedia.findMany({ where: { propertyId } });
  res.json(media);
});

app.delete('/api/properties/:id/media/:mediaId', async (req, res) => {
  const mediaId = getRouteParam(req.params.mediaId);
  if (!mediaId) {
    res.status(400).json({ error: 'Media id is required' });
    return;
  }

  const mediaItem = await prisma.propertyMedia.findUnique({ where: { id: mediaId } });
  if (!mediaItem) {
    res.status(404).json({ error: 'Media not found' });
    return;
  }

  const absolutePath = getAbsoluteMediaPath(mediaItem.filePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  await prisma.propertyMedia.delete({ where: { id: mediaId } });
  res.status(204).send();
});

app.delete('/api/properties/:id', async (req, res) => {
  const propertyId = getRouteParam(req.params.id);
  if (!propertyId) {
    res.status(400).json({ error: 'Property id is required' });
    return;
  }

  const property = await prisma.property.findUnique({ where: { id: propertyId }, include: { media: true } });
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }

  for (const item of property.media) {
    const absolutePath = getAbsoluteMediaPath(item.filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }

  fs.rmSync(path.join(propertyMediaRoot, propertyId), { recursive: true, force: true });

  await prisma.property.delete({ where: { id: propertyId } });
  res.status(204).send();
});

async function startServer() {
  await migrateExistingMedia();
  await seedExistingMedia();
  await reindexAllPropertyEmbeddings();

  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Backend startup failed', error);
  process.exit(1);
});
