import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

const logoUrl = '/logo.jpg';
const ownerPortraitUrl = '/Owner.png';

type PropertyMediaItem = {
  id: string;
  propertyId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  mediaType: 'image' | 'video';
  filePath: string;
};

type PropertyItem = {
  id: string;
  name: string;
  status: string;
  price: string;
  dimension?: string | null;
  location: string;
  propertyType: string;
  description?: string | null;
  area?: string | null;
  facing?: string | null;
  mapsUrl?: string | null;
  landType?: string | null;
  siteNo?: string | null;
  createdAt?: string;
  media?: PropertyMediaItem[];
};

type LeadMessageItem = {
  id: string;
  leadId: string;
  direction: 'inbound' | 'outbound' | 'system';
  body: string;
  provider?: string | null;
  rawPayload?: string | null;
  createdAt: string;
};

type LeadReminderItem = {
  id: string;
  leadId: string;
  type: string;
  title: string;
  body: string;
  dueAt: string;
  completed: boolean;
  createdAt: string;
};

type LeadItem = {
  id: string;
  name?: string | null;
  phone?: string | null;
  source?: string | null;
  status: string;
  budget?: string | null;
  preferredArea?: string | null;
  propertyType?: string | null;
  notes?: string | null;
  lastMessage?: string | null;
  conversationCount: number;
  nextFollowUpAt?: string | null;
  createdAt: string;
  updatedAt: string;
  messages: LeadMessageItem[];
  reminders: LeadReminderItem[];
};

type PropertyCategory = 'Commercial Land' | 'Commercial Property' | 'Residential Land' | 'Residential Property' | 'Other';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = isLocalhost ? 'http://localhost:4001/api' : '/api';
const MEDIA_BASE_URL = isLocalhost ? 'http://localhost:4001' : '';
const getMediaUrl = (filePath: string) => {
  const normalized = filePath.replace(/^\/+/, '');
  return `${MEDIA_BASE_URL}/${normalized}`.replace(/([^:\/])\/{2,}/g, '$1/');
};

const getDirectionsUrl = (location: string) => {
  if (!location) {
    return 'https://www.google.com/maps';
  }

  if (/^https?:\/\//i.test(location)) {
    return location;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
};

const isValidUrl = (value?: string | null) => typeof value === 'string' && /^https?:\/\//i.test((value || '').trim());

const normalizeLocationValue = (value?: string | null) => {
  const cleaned = value?.trim() || '';
  if (!cleaned || cleaned.toLowerCase() === 'location to be added' || cleaned.toLowerCase() === 'location provided') {
    return '';
  }
  return cleaned;
};

const getDisplayLocation = (property: PropertyItem) => {
  return normalizeLocationValue(property.location) || normalizeLocationValue(property.area) || '';
};

const company = {
  name: 'Shreyas Associates',
  tagline: 'Real Estate Consultancy',
  location: 'Mysuru, Karnataka',
  mapsUrl: 'https://maps.app.goo.gl/GapogD1ypNuhPzj67',
  legacy: 'Trusted Since 1990',
  services: 'Buy • Sell • Invest',
  founder: 'Mr. Kengegowda',
  heir: 'Shreyas Gowda',
  story: 'A family-led consultancy built on trust, market insight and a long record of successful property transitions.',
  email: 'shreyasassociates.consult@gmail.com',
  phone: '+91 8217378560',
  instagram: 'https://www.instagram.com/shreyasassociates.mysuru'
};

const services = [
  {
    title: 'Property advisory',
    description: 'End-to-end guidance for buyers, sellers and investors with clear pricing, market context and careful negotiation support.'
  },
  {
    title: 'Portfolio presentation',
    description: 'A refined, presentation-ready property experience that helps every listing feel polished, easy to understand and premium.'
  },
  {
    title: 'Local market insight',
    description: 'Deep familiarity with Mysuru and surrounding areas, helping clients move confidently with dependable local knowledge.'
  }
];

const getPropertyCategory = (propertyType: string): PropertyCategory => {
  const normalized = propertyType.toLowerCase();

  if (normalized.includes('commercial') && normalized.includes('land')) {
    return 'Commercial Land';
  }

  if (normalized.includes('commercial')) {
    return 'Commercial Property';
  }

  if (normalized.includes('residential') && normalized.includes('land')) {
    return 'Residential Land';
  }

  if (normalized.includes('residential')) {
    return 'Residential Property';
  }

  return 'Other';
};

const getDimensionValue = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : '30x40 ft';
};

const getPropertyDimension = (property: PropertyItem) => {
  const dimension = property.dimension?.trim();
  if (dimension) {
    return dimension;
  }

  // Fall back to a sensible default size instead of using price as the dimension.
  return getDimensionValue();
};

  type PropertyFormState = {
    name: string;
    status: string;
    price: string;
    dimension: string;
    location: string;
    propertyType: string;
    description: string;
    area: string;
    facing: string;
    mapsUrl: string;
    landType: string;
    siteNo: string;
  };

  const emptyForm: PropertyFormState = {
    name: '',
    status: 'Available',
    price: '',
    dimension: '',
    location: '',
    propertyType: 'Other',
    description: '',
    area: '',
    facing: '',
    mapsUrl: '',
    landType: '',
    siteNo: ''
  };

  type AppTheme = 'light' | 'dark';

function App() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('All');
  const [propertyCategoryFilter, setPropertyCategoryFilter] = useState<'All' | PropertyCategory>('All');
  const [form, setForm] = useState<PropertyFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(() => (localStorage.getItem('theme') as AppTheme) || 'light');
  const [adminMode, setAdminMode] = useState<boolean>(false);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/properties`);
      if (!response.ok) {
        throw new Error('Unable to load properties');
      }
      const data = await response.json();
      setProperties(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    loadProperties()
      .catch(() => setError('Could not load properties from the server.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent): Promise<PropertyItem | null> => {
    event.preventDefault();
    const confirmed = window.confirm(editingId ? 'Save these changes to the property?' : 'Create this new property?');
    if (!confirmed) {
      return null;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...form,
        name: form.name.trim() || 'Untitled property',
        // store fields explicitly: `location` is nearby location, `area` is area, `mapsUrl` is map link
        location: form.location.trim() || '',
        price: form.price.trim() || 'Price on request',
        dimension: form.dimension.trim() || null,
        propertyType: form.propertyType.trim() || 'Other',
        status: form.status.trim() || 'Available',
        area: form.area || null,
        facing: form.facing || null,
        mapsUrl: form.mapsUrl || null,
        landType: form.landType || null,
        siteNo: form.siteNo || null
      };

      const response = editingId
        ? await fetch(`${API_BASE}/properties/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        : await fetch(`${API_BASE}/properties`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

      if (!response.ok) {
        const detailText = await response.text();
        throw new Error(detailText || 'Unable to save property');
      }

      const savedProperty = await response.json() as PropertyItem;
      setForm(emptyForm);
      setEditingId(null);
      await loadProperties();
      return savedProperty;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The property could not be saved right now.';
      setError(message);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this property permanently? This cannot be undone.');
    if (!confirmed) {
      return;
    }

    const response = await fetch(`${API_BASE}/properties/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setError('The property could not be deleted.');
      return;
    }
    await loadProperties();
  };

  const handleEdit = (property: PropertyItem) => {
    setEditingId(property.id);
    setForm({
      name: property.name,
      status: property.status,
      price: property.price,
      dimension: property.dimension ?? '',
      location: normalizeLocationValue(property.location) || '',
      propertyType: property.propertyType,
      description: property.description ?? '',
      area: normalizeLocationValue(property.area) || '',
      facing: property.facing ?? '',
      mapsUrl: normalizeLocationValue(property.mapsUrl) || '',
      landType: property.landType ?? '',
      siteNo: property.siteNo ?? ''
    });
  };

  return (
    <BrowserRouter>
      <div className={`app-shell theme-${theme}`}>
        <Header theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage properties={properties} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/inbox" element={<LeadInboxPage />} />
            <Route path="/reminders" element={<ReminderPage />} />
            <Route
              path="/listings"
              element={
                <ListingsPage
                  properties={properties}
                  loading={loading}
                  error={error}
                  form={form}
                  editingId={editingId}
                  submitting={submitting}
                  searchTerm={searchTerm}
                  areaFilter={areaFilter}
                  onSearchChange={setSearchTerm}
                  onAreaChange={setAreaFilter}
                  propertyCategoryFilter={propertyCategoryFilter}
                  onPropertyCategoryChange={setPropertyCategoryFilter}
                  onFormChange={setForm}
                  onSubmit={handleSubmit}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  adminMode={false}
                  onAdminModeChange={() => undefined}
                  showAdminControls={false}
                  onReset={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                  }}
                />
              }
            />
            <Route
              path="/manage"
              element={
                <PropertiesPage
                  properties={properties}
                  loading={loading}
                  error={error}
                  form={form}
                  editingId={editingId}
                  submitting={submitting}
                  searchTerm={searchTerm}
                  areaFilter={areaFilter}
                  onSearchChange={setSearchTerm}
                  onAreaChange={setAreaFilter}
                  propertyCategoryFilter={propertyCategoryFilter}
                  onPropertyCategoryChange={setPropertyCategoryFilter}
                  onFormChange={setForm}
                  onSubmit={handleSubmit}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  adminMode={adminMode}
                  onAdminModeChange={(value) => {
                    setAdminMode(value);
                    if (value) {
                      setForm(emptyForm);
                      setEditingId(null);
                    }
                  }}
                  showAdminControls={true}
                  onReset={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                  }}
                  onReloadProperties={loadProperties}
                />
              }
            />
            {/* Redirect old /properties route to /manage for compatibility */}
            <Route path="/properties" element={<Navigate to="/manage" replace />} />
            <Route path="/reports" element={<ReportsPage properties={properties} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

        <SiteAssistantWidget />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function SiteAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [assistantTyping, setAssistantTyping] = useState(false);

  const onAskAssistant = async () => {
    if (!question.trim()) {
      setError('Please enter a customer question or requirement.');
      return;
    }

    const userMessage = question.trim();
    setLoading(true);
    setAssistantTyping(true);
    setError(null);
    setChat((current) => [...current, { role: 'user', text: userMessage }]);
    setQuestion('');

    try {
      const response = await fetch(`${API_BASE}/assistant/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerMessage: userMessage,
          customerName: 'Customer',
          budget: '',
          area: '',
          propertyType: '',
          notes: 'Customer is asking for property guidance and wants a follow-up conversation.'
        })
      });

      const responseText = await response.text();
      let data: any = {};
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error('The assistant returned an invalid response.');
        }
      }

      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate response.');
      }

      const assistantReply = data.draftReply || 'I can help with a follow-up message soon.';
      const matchedPropertyNames = Array.isArray(data.matches)
        ? data.matches.filter((entry: unknown): entry is string => typeof entry === 'string' && entry.trim().length > 0)
        : [];

      const propertySearchText = matchedPropertyNames.length > 0
        ? `${assistantReply}\n\nMatching properties:\n${matchedPropertyNames.map((propertyName: string) => `• ${propertyName}`).join('\n')}`
        : assistantReply;

      setChat((current) => [...current, { role: 'assistant', text: propertySearchText }]);
    } catch (assistantError) {
      setError(assistantError instanceof Error ? assistantError.message : 'The assistant could not generate a response.');
    } finally {
      setLoading(false);
      setAssistantTyping(false);
    }
  };

  return (
    <div className="assistant-widget-root">
      <button
        type="button"
        className="assistant-toggle"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
        title={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        <span className="assistant-icon">✦</span>
      </button>

      {isOpen ? (
        <div className="assistant-panel card">
          <div className="assistant-header">
            <div className="assistant-brand-mark">✦</div>
            <div className="assistant-title-wrap">
              <div className="assistant-title-line">
                <h3>Shreyas Assistant</h3>
                <button
                  type="button"
                  className="assistant-close-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close assistant"
                  title="Close assistant"
                >
                  ×
                </button>
              </div>
              <p>Property guidance</p>
            </div>
          </div>

          <div className="assistant-thread">
            {chat.length === 0 ? (
              <div className="assistant-empty-state">Property search is ready.</div>
            ) : (
              chat.map((entry, index) => (
                <div key={`${entry.role}-${index}`} className={`assistant-message ${entry.role}`}>
                  <span className="assistant-message-label">{entry.role === 'user' ? 'You' : 'Assistant'}</span>
                  <p>{entry.text}</p>
                </div>
              ))
            )}

            {assistantTyping ? (
              <div className="assistant-message assistant assistant-typing">
                <span className="assistant-message-label">Assistant</span>
                <div className="assistant-typing-bubbles" aria-label="Assistant is typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : null}
          </div>

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={4}
            placeholder="Type your property requirement here..."
          />

          <div className="assistant-actions-row">
            <button type="button" className="primary-btn assistant-action" onClick={() => void onAskAssistant()} disabled={loading}>
              {loading ? 'Searching…' : 'Ask'}
            </button>
          </div>

          {error ? <div className="error-banner">{error}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

function Header({ theme, onToggleTheme }: { theme: AppTheme; onToggleTheme: () => void }) {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/listings', label: 'Listings' },
    { path: '/manage', label: 'Manage' }
  ];

  return (
    <header className="site-header">
      <div className="site-brand">
        <Link to="/" className="brand-block">
          <img src={logoUrl} alt="Shreyas Associates logo" className="brand-logo" />
          <div>
            <h1>{company.name}</h1>
            <p>{company.tagline}</p>
          </div>
        </Link>
      </div>
      <nav className="site-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link${location.pathname === item.path ? ' nav-link-active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        className="ghost-btn icon-toggle"
        onClick={onToggleTheme}
        aria-label={theme === 'light' ? 'Enable dark mode' : 'Enable light mode'}
      >
        {theme === 'light' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </header>
  );
}

function Footer() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (!isHome) {
    return (
      <footer className="site-footer compact-footer">
        <div className="footer-bottom compact">
          <div className="footer-legal">
            <p>© 2026 Shreyas Associates. All rights reserved.</p>
          </div>
          <div className="footer-legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-column footer-brand">
          <div className="footer-brand-heading">
            <span className="footer-logo">🏢</span>
            <strong>Shreyas Associates</strong>
          </div>
          <p className="footer-description">
            Your trusted real estate consultancy in Mysuru, guided by integrity, market insight, and personal client care.
          </p>
        </div>

        <div className="footer-column footer-links">
          <p className="footer-heading">Quick Links</p>
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
            <Link to="/listings">Listings</Link>
            <Link to="/manage">Manage</Link>
          </nav>
        </div>

        <div className="footer-column footer-contact">
          <p className="footer-heading">Contact</p>
          <a href={`mailto:${company.email}`} className="footer-contact-link">✉️ {company.email}</a>
          <a href={`tel:${company.phone}`} className="footer-contact-link">📞 {company.phone}</a>
          <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="footer-contact-link">📍 {company.location}</a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="footer-contact-link">📷 Instagram</a>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-legal">
          <p>© 2026 Shreyas Associates. All rights reserved.</p>
        </div>
        <div className="footer-legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ properties }: { properties: PropertyItem[] }) {
  const featured = [...properties].slice(0, 3);

  return (
    <section className="marketing-page">
      <section className="hero-section home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Shreyas Associates</p>
          <h1>Bringing calm, clear, and premium guidance to every property journey.</h1>
          <p className="hero-description">Discover exceptional homes, strategic land parcels and investment-ready opportunities with a trusted local consultancy.</p>
          <div className="hero-actions">
            <Link to="/listings" className="primary-btn">View listings</Link>
            <Link to="/about" className="ghost-btn">Meet the advisors</Link>
          </div>
        </div>
      </section>

      <section className="section-grid about-preview">
        <div className="card feature-card about-feature-card">
          <div>
            <p className="eyebrow">About the firm</p>
            <h3>Led by {company.founder} and {company.heir}</h3>
            <p className="muted">The firm brings a family-led, trustworthy approach to every transaction, from first conversations to final handover. With decades of local real estate experience and a hands-on, personal approach to client engagement, we've built lasting relationships across Mysuru — guided by integrity, market insight, and genuine care for every buyer, seller, and tenant we work with.</p>
          </div>
          <Link to="/about" className="secondary-btn">Learn more</Link>
        </div>
        <div className="portrait-card">
          <img src={ownerPortraitUrl} alt="Owner portrait" />
        </div>
      </section>

      <section className="section-block">
        <div className="hero-card card dashboard-hero">
          <div className="dashboard-hero-grid">
            <div className="dashboard-hero-left">
              <div className="dashboard-hero-copy">
                <p className="eyebrow">Executive overview</p>
                <h3>Trusted Real Estate Guidance Across Mysuru</h3>
                <p className="hero-copy">Shreyas Associates is led by <strong>{company.founder}</strong>, Founder and Managing Partner, whose decades of experience in local real estate have built the firm on a foundation of integrity and long-term relationships.</p>
                <p className="hero-copy">Alongside him, <strong>{company.heir}</strong>, Partner and Client Relations, leads day-to-day operations and client engagement, ensuring every buyer, seller, and tenant receives personal attention throughout their journey.</p>
                <p className="hero-copy">Together, they bring a family-led, trustworthy approach to every transaction, from first conversations to final handover.</p>
              </div>
            </div>
            <aside className="dashboard-hero-right">
              <div className="dashboard-hero-info-card">
                <span>
                  📍
                  <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="info-link">
                    {company.location}
                  </a>
                </span>
                <span>🏛️ Trusted since 1990</span>
                <span>🤝 Family-led consultancy</span>
              </div>
              <div className="dashboard-hero-card-actions">
                <Link to="/listings" className="primary-btn">Browse listings</Link>
                <Link to="/manage" className="ghost-btn">Open full property view</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured listings</p>
            <h3>Handpicked properties presented with clarity and polish.</h3>
          </div>
          <Link to="/listings" className="secondary-btn">Explore all</Link>
        </div>
        <div className="property-grid">
          {featured.map((property) => {
            const primaryImage = property.media?.find((item) => item.mediaType === 'image');
            return (
              <article key={property.id} className="card property-card">
                <img className="listing-image" src={primaryImage ? getMediaUrl(primaryImage.filePath) : logoUrl} alt={property.name} />
                <div className="property-card-body">
                  <div className="property-card-header">
                    <h3>{property.name}</h3>
                    <span className={`status-badge ${property.status.toLowerCase()}`}>{property.status}</span>
                  </div>
                  <div className="dimension-row">
                    <span className="dimension-label">Dimension</span>
                    <strong className="dimension-value">{getPropertyDimension(property)}</strong>
                  </div>
                  <div className="listing-location">
                    <span className="location-text">{getDisplayLocation(property) || 'Not provided'}</span>
                    {isValidUrl(property.mapsUrl) ? (
                      <a href={property.mapsUrl!.trim()} target="_blank" rel="noreferrer" className="location-link">Map</a>
                    ) : (
                      <span className="location-link muted">Map not available</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section-block services-preview">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Our services</p>
            <h3>Focused support for buying, selling and investing with confidence.</h3>
          </div>
          <Link to="/services" className="secondary-btn">Explore services</Link>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.title} className={`card service-card ${service.title.toLowerCase().includes('buy') ? 'buy' : service.title.toLowerCase().includes('sell') ? 'sell' : 'rent'}`}>
              <span className="service-card-badge">{service.title}</span>
              <h4>{service.title}</h4>
              <p className="muted">{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="marketing-page">
      <section className="hero-section compact-hero about-hero">
        <div className="hero-copy">
          <p className="eyebrow">About the firm</p>
          <h1>Trusted Guidance Shaped by Experience and Family Values.</h1>
          <p className="hero-description">{company.name} has built its reputation on thoughtful advisory, careful presentation and long-term client trust.</p>
        </div>
        <div className="portrait-card large">
          <img src={ownerPortraitUrl} alt="Owner portrait" />
        </div>
      </section>

      <section className="section-block">
        <div className="section-grid about-detail-grid">
          <div className="card feature-card">
            <h3>Meet {company.founder} and {company.heir}</h3>
            <p className="muted">The business has evolved through generations, but the promise remains the same: honest advice, elegant presentation and a genuine commitment to the client’s outcome.</p>
          </div>
          <div className="card stat-card">
            <strong>30+</strong>
            <span>Years of hands-on advisory</span>
            <p className="muted">Guiding clients through every stage of buying, selling, and renting across Mysuru.</p>
          </div>
          <div className="card stat-card">
            <strong>100%</strong>
            <span>Client-first presentation</span>
            <p className="muted">Every listing is personally reviewed and presented with complete transparency.</p>
          </div>
          <div className="card stat-card">
            <strong>Local</strong>
            <span>Market insight for Mysuru</span>
            <p className="muted">Deep familiarity with neighborhoods, pricing trends, and property value across the city.</p>
          </div>
        </div>
      </section>
    </section>
  );
}

function ServicesPage() {
  return (
    <section className="marketing-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Services</p>
          <h1>Professional Real Estate Services for Buying, Selling and Investing with Confidence</h1>
          <p className="hero-description">Every step is backed by local insight, clear presentation and a calm, client-focused approach.</p>
        </div>
      </section>

      <section className="section-block">
        <div className="services-grid">
          {[
            {
              title: 'Buy properties',
              description: 'Navigate the purchase process with confidence through trusted market guidance, property evaluation and strong negotiation support.',
              highlights: ['Property shortlisting', 'Price guidance', 'Site visits and negotiation']
            },
            {
              title: 'Sell properties',
              description: 'Present listings with clarity and strategy so owners can maximize value and connect with the right buyers.',
              highlights: ['Pricing strategy', 'Listing presentation', 'Buyer coordination']
            },
            {
              title: 'Invest with insight',
              description: 'Use local knowledge and clear portfolio thinking to make well-informed investment decisions.',
              highlights: ['Location insight', 'Future value review', 'Transaction support']
            }
          ].map((service) => (
            <div key={service.title} className={`card service-card ${service.title.toLowerCase().includes('buy') ? 'buy' : service.title.toLowerCase().includes('sell') ? 'sell' : 'rent'}`}>
              <span className="service-card-badge">{service.title}</span>
              <h4>{service.title}</h4>
              <p className="muted">{service.description}</p>
              <ul className="service-card-list">
                {service.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

    </section>
  );
}

function ListingsPage(props: PropertiesPageProps) {
  return (
    <section className="marketing-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Listings</p>
          <h1>Explore every property in a focused, premium listing view.</h1>
          <p className="hero-description">The browsing experience is designed to keep the important details visible: dimension, location, area, facing and media at a glance.</p>
        </div>
      </section>
      <PropertiesPage {...props} />
    </section>
  );
}

function Dashboard({ properties }: { properties: PropertyItem[] }) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  const stats = useMemo(() => {
    const available = properties.filter((property) => property.status === 'Available').length;
    const reserved = properties.filter((property) => property.status === 'Reserved').length;
    const sold = properties.filter((property) => property.status === 'Sold').length;
    return { available, reserved, sold, total: properties.length };
  }, [properties]);



  useEffect(() => {
    setSelectedMediaIndex(0);
  }, [selectedProperty]);

  const handleScrollToPortfolio = () => {
    document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeMediaItems = selectedProperty?.media ?? [];
  const activeMedia = activeMediaItems[selectedMediaIndex] ?? activeMediaItems[0];

  return (
    <section className="dashboard-shell">
      <div className="hero-card card dashboard-hero">
        <div className="dashboard-hero-grid">
          <div className="dashboard-hero-left">
            <div className="dashboard-hero-copy">
              <p className="eyebrow">Executive overview</p>
              <h3>Trusted Real Estate Guidance Across Mysuru</h3>
              <p className="hero-copy">Shreyas Associates is led by <strong>Mr. Kengegowda</strong>, Founder and Managing Partner, whose decades of experience in local real estate have built the firm on a foundation of integrity and long-term relationships.</p>
              <p className="hero-copy">Alongside him, <strong>Shreyas Gowda</strong>, Partner and Client Relations, leads day-to-day operations and client engagement, ensuring every buyer, seller, and tenant receives personal attention throughout their journey.</p>
              <p className="hero-copy">Together, they bring a family-led, trustworthy approach to every transaction, from first conversations to final handover.</p>
            </div>
          </div>
          <aside className="dashboard-hero-right">
            <div className="dashboard-hero-info-card">
              <span>
                📍
                <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="info-link">
                  {company.location}
                </a>
              </span>
              <span>🏛️ Trusted since 1990</span>
              <span>🤝 Family-led consultancy</span>
            </div>
            <div className="dashboard-hero-card-actions">
              <button type="button" className="primary-btn" onClick={handleScrollToPortfolio}>Browse listings</button>
              <a href="/manage" className="ghost-btn">Open full property view</a>
            </div>
          </aside>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card stat-card-accent"><strong>{stats.total}</strong><span>Total properties</span></div>
        <div className="card stat-card"><strong>{stats.available}</strong><span>Available</span></div>
        <div className="card stat-card"><strong>{stats.reserved}</strong><span>Reserved</span></div>
        <div className="card stat-card"><strong>{stats.sold}</strong><span>Sold</span></div>
      </div>

      {/* Featured listings removed from Dashboard — shown on Home only */}

      <div id="portfolio-section" className="dashboard-property-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Property portfolio</p>
            <h3>Browse all listings from the dashboard.</h3>
          </div>
        </div>
        <div className="dashboard-property-grid">
          {properties.map((property) => {
            const primaryImage = property.media?.find((item) => item.mediaType === 'image');
            return (
              <article key={property.id} className="dashboard-property-card" onClick={() => setSelectedProperty(property)}>
                {primaryImage ? (
                  <img className="dashboard-property-image" src={getMediaUrl(primaryImage.filePath)} alt={property.name} />
                ) : (
                  <div className="dashboard-property-image placeholder">🏡</div>
                )}
                <div className="dashboard-property-content">
                  <div className="property-list-title">
                    <span>{property.name}</span>
                    <span className={`status-badge ${property.status.toLowerCase()}`}>{property.status}</span>
                  </div>
                  <div className="dimension-row">
                    <span className="dimension-label">Dimension</span>
                    <strong className="dimension-value">{getPropertyDimension(property)}</strong>
                  </div>
                  <a href={getDirectionsUrl(property.mapsUrl?.trim() || getDisplayLocation(property))} target="_blank" rel="noreferrer" className="location-link">{getDisplayLocation(property) || 'Location to be added'}</a>
                  <p className="muted line-clamp">{property.description || 'Presented with maps, visuals and clear location context.'}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedProperty ? (
        <div className="media-modal" onClick={() => setSelectedProperty(null)}>
          <div className="media-modal-shell" onClick={(event) => event.stopPropagation()}>
            <div className="media-modal-gallery">
              <div id="media-stage-selected" className="media-modal-stage">
                <button type="button" className="media-modal-arrow media-modal-arrow-left" onClick={() => {
                  const nextIndex = selectedMediaIndex > 0 ? selectedMediaIndex - 1 : Math.max(activeMediaItems.length - 1, 0);
                  setSelectedMediaIndex(nextIndex);
                }} aria-label="Previous media">◀</button>
                {activeMedia?.mediaType === 'video' ? (
                  <video controls src={getMediaUrl(activeMedia.filePath)} autoPlay playsInline />
                ) : activeMedia ? (
                  <img src={getMediaUrl(activeMedia.filePath)} alt={activeMedia.originalName} />
                ) : (
                  <div className="property-thumb placeholder large">🏡</div>
                )}
                <button type="button" className="media-modal-arrow media-modal-arrow-right" onClick={() => {
                  const nextIndex = activeMediaItems.length > 0 && selectedMediaIndex < activeMediaItems.length - 1 ? selectedMediaIndex + 1 : 0;
                  setSelectedMediaIndex(nextIndex);
                }} aria-label="Next media">▶</button>
                <button type="button" className="media-fullscreen-btn" onClick={() => {
                  const el = document.getElementById('media-stage-selected');
                  if (!el) return;
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    // @ts-ignore
                    el.requestFullscreen?.();
                  }
                }} aria-label="Toggle fullscreen">⤢</button>
                <span className="media-counter media-counter-overlay">{activeMediaItems.length > 0 ? selectedMediaIndex + 1 : 0} / {activeMediaItems.length}</span>
              </div>
            </div>
            <aside className="media-modal-details">
              <div className="media-modal-detail-header">
                <div>
                  <p className="eyebrow">Property spotlight</p>
                  <h3>{selectedProperty.name}</h3>
                </div>
                <button type="button" className="secondary-btn close-btn" onClick={() => setSelectedProperty(null)}>Close</button>
              </div>
              <div className="detail-pill-row">
                <span className={`status-badge ${selectedProperty.status.toLowerCase()}`}>{selectedProperty.status}</span>
                <span className="pill">{getPropertyCategory(selectedProperty.propertyType)}</span>
              </div>
              <div className="detail-price-row">
                <div className="dimension-row">
                  <span className="dimension-label">Dimension</span>
                  <strong className="dimension-value">{getPropertyDimension(selectedProperty)}</strong>
                </div>
                <div className="location-link-wrap">
                  <span className="location-link-icon" aria-hidden="true">📍</span>
                  {isValidUrl(selectedProperty.mapsUrl) ? (
                    <a href={selectedProperty.mapsUrl!.trim()} target="_blank" rel="noreferrer" className="location-link">Map</a>
                  ) : (
                    <span className="location-link muted">Map not available</span>
                  )}
                </div>
              </div>
              <p className="detail-description">{selectedProperty.description || 'A premium listing presented with immersive imagery and a clear overview of the property highlights.'}</p>
              <div className="detail-grid">
                <div><span>Area</span><strong>{selectedProperty.area || 'Not provided'}</strong></div>
                <div><span>Nearby location</span><strong>{selectedProperty.location || 'Not provided'}</strong></div>
                <div><span>Property Type</span><strong>{selectedProperty.propertyType || 'Not provided'}</strong></div>
                <div><span>Price</span><strong>{selectedProperty.price || 'Not provided'}</strong></div>
                <div><span>Facing</span><strong>{selectedProperty.facing || 'Flexible'}</strong></div>
                <div><span>Authority</span><strong>{selectedProperty.landType || 'Not provided'}</strong></div>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
    </section>
  );
}

void Dashboard;

type PropertiesPageProps = {
  properties: PropertyItem[];
  loading: boolean;
  error: string | null;
  form: PropertyFormState;
  editingId: string | null;
  submitting: boolean;
  searchTerm: string;
  areaFilter: string;
  onSearchChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  propertyCategoryFilter: 'All' | PropertyCategory;
  onPropertyCategoryChange: (value: 'All' | PropertyCategory) => void;
  onFormChange: (value: PropertyFormState) => void;
  onSubmit: (event: FormEvent) => Promise<PropertyItem | null>;
  onEdit: (property: PropertyItem) => void;
  onDelete: (id: string) => void;
  adminMode: boolean;
  onAdminModeChange: (value: boolean) => void;
  showAdminControls: boolean;
  onReset: () => void;
  onReloadProperties?: () => Promise<void>;
};

function PropertiesPage({
  properties,
  loading,
  error,
  form,
  editingId,
  submitting,
  searchTerm,
  areaFilter,
  onSearchChange,
  onAreaChange,
  propertyCategoryFilter,
  onPropertyCategoryChange,
  onFormChange,
  onSubmit,
  onEdit,
  onDelete,
  adminMode,
  onAdminModeChange,
  showAdminControls,
  onReset,
  onReloadProperties
}: PropertiesPageProps) {
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [zoomedMedia, setZoomedMedia] = useState<{ property: PropertyItem; media: PropertyMediaItem; mediaList: PropertyMediaItem[] } | null>(null);
  const [activePropertyDetail, setActivePropertyDetail] = useState<{ property: PropertyItem; mediaList: PropertyMediaItem[]; selectedIndex: number } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!uploadMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      setUploadMessage(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [uploadMessage]);
  const [pendingMediaFiles, setPendingMediaFiles] = useState<File[]>([]);
  const [pendingMediaSummary, setPendingMediaSummary] = useState<string>('No files selected');
  const [pendingRemovedMediaIds, setPendingRemovedMediaIds] = useState<string[]>([]);

  const editMediaInputRef = useRef<HTMLInputElement>(null);
  const createMediaInputRef = useRef<HTMLInputElement>(null);

  const editingProperty = properties.find((property) => property.id === editingId) ?? null;
  const visibleEditingMedia = (editingProperty?.media ?? []).filter((item) => !pendingRemovedMediaIds.includes(item.id));
  const editingPreviewMedia = visibleEditingMedia.find((item) => item.mediaType === 'image') ?? visibleEditingMedia[0];

  const handleMediaSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files ?? []);
    const updatedFiles = [...pendingMediaFiles, ...newFiles];
    setPendingMediaFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      setPendingMediaSummary('No files selected');
      return;
    }
    const counts = updatedFiles.reduce<Record<string, number>>((acc, file) => {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    }, {});
    const detail = Object.entries(counts)
      .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
      .join(', ');
    setPendingMediaSummary(`${updatedFiles.length} file${updatedFiles.length > 1 ? 's' : ''} selected (${detail})`);
  };

  const removeFile = (index: number) => {
    const updatedFiles = pendingMediaFiles.filter((_, i) => i !== index);
    setPendingMediaFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      setPendingMediaSummary('No files selected');
      if (editMediaInputRef.current) {
        editMediaInputRef.current.value = '';
      }
      if (createMediaInputRef.current) {
        createMediaInputRef.current.value = '';
      }
    } else {
      const counts = updatedFiles.reduce<Record<string, number>>((acc, file) => {
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        acc[type] = (acc[type] ?? 0) + 1;
        return acc;
      }, {});
      const detail = Object.entries(counts)
        .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
        .join(', ');
      setPendingMediaSummary(`${updatedFiles.length} file${updatedFiles.length > 1 ? 's' : ''} selected (${detail})`);
    }
  };

  const uploadPendingMedia = async (propertyId: string) => {
    if (pendingMediaFiles.length === 0) {
      return;
    }

    const mediaFormData = new FormData();
    pendingMediaFiles.forEach((file) => mediaFormData.append('files', file));

    const uploadResponse = await fetch(`${API_BASE}/properties/${propertyId}/media`, {
      method: 'POST',
      body: mediaFormData
    });

    if (!uploadResponse.ok) {
      throw new Error('Property saved, but media upload failed.');
    }
  };

  useEffect(() => {
    if (!adminMode) {
      setShowCreateForm(false);
    }
  }, [adminMode]);

  const handleReset = () => {
    onReset();
    setShowCreateForm(false);
    setPendingMediaFiles([]);
    setPendingMediaSummary('No files selected');
    setPendingRemovedMediaIds([]);
    if (editMediaInputRef.current) {
      editMediaInputRef.current.value = '';
    }
    if (createMediaInputRef.current) {
      createMediaInputRef.current.value = '';
    }
  };

  const handleOpenCreateForm = () => {
    onReset();
    setShowCreateForm(true);
    setPendingMediaFiles([]);
    setPendingMediaSummary('No files selected');
    setPendingRemovedMediaIds([]);
  };

  const [sharing, setSharing] = useState(false);
  const [sharePreview, setSharePreview] = useState<{ property: PropertyItem; text: string } | null>(null);

  const buildShareCaption = (property: PropertyItem) => {
    const description = property.description?.trim() || 'A premium property opportunity with strong value and a clear location advantage.';
    const location = property.location?.trim() || property.area?.trim() || 'Mysuru';
    const captionLines = [
      'SHREYAS ASSOCIATES PRESENTS',
      '',
      `${property.status || 'Available'} • ${property.propertyType || 'Property'} • ${property.price || 'Price on request'}`,
      `Location: ${location}`,
      `Area: ${property.area || 'Not specified'}`,
      `Dimension: ${getPropertyDimension(property)}`,
      `Facing: ${property.facing || 'Not specified'}`,
      `Land type: ${property.landType || 'Not specified'}`,
      `Site no: ${property.siteNo || 'Not specified'}`,
      '',
      description,
      '',
      `For more details, contact ${company.phone}.`,
      `Instagram: ${company.instagram}`
    ];

    return captionLines.filter(Boolean).join('\n');
  };

  const shareProperty = (property: PropertyItem) => {
    setSharePreview({
      property,
      text: buildShareCaption(property)
    });
  };

  const handleShareAction = async (action: 'whatsapp' | 'copy' | 'native') => {
    if (!sharePreview) {
      return;
    }

    const { text } = sharePreview;
    setSharing(true);

    try {
      if (action === 'whatsapp') {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
      } else if (action === 'copy') {
        await navigator.clipboard.writeText(text);
        alert('The WhatsApp message has been copied. You can paste it into WhatsApp or Instagram.');
      } else if ((navigator as any).share) {
        await (navigator as any).share({
          title: sharePreview.property.name || 'Property listing',
          text,
        });
      } else {
        throw new Error('Native sharing is not available on this device.');
      }
    } catch (error) {
      if (action === 'copy') {
        alert('Copy failed. Please select and copy the message manually from the preview.');
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        alert('Unable to share automatically. The message is copied to your clipboard for manual send.');
      } catch (clipboardError) {
        alert('Unable to share automatically. Please copy the listing details manually from the preview.');
      }
    } finally {
      setSharing(false);
      setSharePreview(null);
    }
  };

  const handleRemoveExistingMedia = async (mediaId: string) => {
    if (!editingProperty) {
      return;
    }

    setPendingRemovedMediaIds((current) => (current.includes(mediaId) ? current : [...current, mediaId]));
    setUploadMessage('Media removed. Save changes to apply it.');
  };

  const handleCreateSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setUploadMessage('Creating property…');

    try {
      const payload = {
        ...form,
        name: form.name.trim() || 'Untitled property',
        // store fields explicitly: `location` is nearby location, `area` is area, `mapsUrl` is map link
        location: form.location.trim() || '',
        price: form.price.trim() || 'Price on request',
        dimension: form.dimension.trim() || null,
        propertyType: form.propertyType.trim() || 'Other',
        status: form.status.trim() || 'Available',
        area: form.area || null,
        facing: form.facing || null,
        mapsUrl: form.mapsUrl || null,
        landType: form.landType || null,
        siteNo: form.siteNo || null
      };

      const response = await fetch(`${API_BASE}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const detailText = await response.text();
        throw new Error(detailText || 'Unable to create property');
      }

      const createdProperty = await response.json() as PropertyItem;
      await uploadPendingMedia(createdProperty.id);
      await onReloadProperties?.();
      setUploadMessage(pendingMediaFiles.length > 0 ? 'Property created and media uploaded.' : 'Property created successfully.');

      handleReset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The property could not be created right now.';
      setUploadMessage(message);
    }
  };

  const visibleProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch = [property.name, property.location, property.propertyType, property.description, property.landType, property.siteNo]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const propertyArea = property.area?.trim() || '';
      const matchesArea = areaFilter === 'All' || propertyArea === areaFilter;
      const matchesCategory = propertyCategoryFilter === 'All' || getPropertyCategory(property.propertyType) === propertyCategoryFilter;
      return matchesSearch && matchesArea && matchesCategory;
    });
  }, [properties, searchTerm, areaFilter, propertyCategoryFilter]);

  return (
    <section className="manage-page-shell">
      {showAdminControls ? (
        <div className="manage-hero card">
          <div className="manage-hero-copy">
            <p className="eyebrow">Operations</p>
            <h2>Listings and portfolio management</h2>
            <p className="muted">A curated workspace for browsing, editing and presenting the full property archive in a cleaner format.</p>
          </div>
        </div>
      ) : null}

      {showAdminControls && !adminMode ? (
        <div className="view-only-banner card">
          <div>
            <span>Enable admin mode to edit, upload media, or remove listings.</span>
          </div>
          <button type="button" className="mode-icon" onClick={() => onAdminModeChange(true)} aria-label="Enable admin mode">⚙️</button>
        </div>
      ) : null}

      {showAdminControls && adminMode && editingId ? (
        <div className="media-modal" onClick={handleReset}>
          <div className="media-modal-shell edit-property-modal" onClick={(event) => event.stopPropagation()}>
            <div className="form-header">
              <h3>Edit property</h3>
              <div className="form-header-actions">
                <button type="button" className="secondary-btn compact-action-btn" onClick={handleReset} aria-label="Close edit form">✕</button>
              </div>
            </div>

            <div className="edit-property-preview">
              {editingPreviewMedia ? (
                <img className="edit-property-preview-image" src={getMediaUrl(editingPreviewMedia.filePath)} alt={editingProperty?.name ?? 'Property preview'} />
              ) : (
                <div className="edit-property-preview-image placeholder">🏡</div>
              )}
              <div className="edit-property-preview-copy">
                <p className="eyebrow">Selected property</p>
                <h4>{editingProperty?.name ?? 'Property'}</h4>
                <p className="muted">{editingProperty?.location ?? 'No location added'}</p>
              </div>
            </div>

            <form className="edit-property-form" onSubmit={async (event) => {
              event.preventDefault();
              const hasMediaChanges = pendingMediaFiles.length > 0 || pendingRemovedMediaIds.length > 0;
              if (editingProperty && !hasMediaChanges) {
                const normalizedForm = {
                  name: form.name.trim() || 'Untitled property',
                  // store nearby location explicitly
                  location: form.location.trim() || '',
                  price: form.price.trim() || 'Price on request',
                  dimension: form.dimension.trim() || null,
                  propertyType: form.propertyType.trim() || 'Other',
                  status: form.status.trim() || 'Available',
                  area: form.area || null,
                  facing: form.facing || null,
                  mapsUrl: form.mapsUrl || null,
                  landType: form.landType || null,
                  siteNo: form.siteNo || null,
                  description: form.description || null
                };

                const originalForm = {
                  name: editingProperty.name,
                  location: editingProperty.location,
                  price: editingProperty.price,
                  dimension: editingProperty.dimension ?? null,
                  propertyType: editingProperty.propertyType,
                  status: editingProperty.status,
                  area: editingProperty.area ?? null,
                  facing: editingProperty.facing ?? null,
                  mapsUrl: editingProperty.mapsUrl ?? null,
                  landType: editingProperty.landType ?? null,
                  siteNo: editingProperty.siteNo ?? null,
                  description: editingProperty.description ?? null
                };

                const isUnchanged = Object.keys(normalizedForm).every((key) => normalizedForm[key as keyof typeof normalizedForm] === originalForm[key as keyof typeof originalForm]);
                if (isUnchanged) {
                  setUploadMessage('No changes to save.');
                  return;
                }
              }

              try {
                const savedProperty = await onSubmit(event);
                if (savedProperty && pendingMediaFiles.length > 0) {
                  await uploadPendingMedia(savedProperty.id);
                }
                if (savedProperty && pendingRemovedMediaIds.length > 0) {
                  for (const mediaId of pendingRemovedMediaIds) {
                    const response = await fetch(`${API_BASE}/properties/${savedProperty.id}/media/${mediaId}`, { method: 'DELETE' });
                    if (!response.ok) {
                      throw new Error('One or more media files could not be removed.');
                    }
                  }
                }
                if (savedProperty) {
                  const message = pendingRemovedMediaIds.length > 0 && pendingMediaFiles.length > 0
                    ? 'Property saved and media updated.'
                    : pendingRemovedMediaIds.length > 0
                      ? 'Property saved and selected media removed.'
                      : pendingMediaFiles.length > 0
                        ? 'Property saved and media uploaded.'
                        : 'Property saved successfully.';
                  setUploadMessage(message);
                }
                await onReloadProperties?.();
                handleReset();
              } catch (error) {
                const message = error instanceof Error ? error.message : 'The property could not be saved right now.';
                setUploadMessage(message);
              }
            }}>
              <div className="form-grid">
                <label>
                  Name
                  <input value={form.name} onChange={(event) => onFormChange({ ...form, name: event.target.value })} placeholder="e.g.Krishna Property" />
                </label>
                <label>
                  Status
                  <select value={form.status} onChange={(event) => onFormChange({ ...form, status: event.target.value })}>
                    <option>Available</option>
                    <option>Reserved</option>
                    <option>Sold</option>
                  </select>
                </label>
                <label>
                  Price
                  <input value={form.price} onChange={(event) => onFormChange({ ...form, price: event.target.value })} placeholder="e.g. ₹1,20,00,000" />
                </label>
                <label>
                  Dimension
                  <input value={form.dimension} onChange={(event) => onFormChange({ ...form, dimension: event.target.value })} placeholder="e.g. 30x40 ft" />
                </label>
                <label>
                  Area
                  <input value={form.area} onChange={(event) => onFormChange({ ...form, area: event.target.value })} placeholder="e.g. Mysuru West" />
                </label>
                <label>
                  Property type
                  <select value={form.propertyType} onChange={(event) => onFormChange({ ...form, propertyType: event.target.value })}>
                    <option value="Residential Property">Residential Property</option>
                    <option value="Residential Land">Residential Land</option>
                    <option value="Commercial Property">Commercial Property</option>
                    <option value="Commercial Land">Commercial Land</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Authority
                  <select value={form.landType} onChange={(event) => onFormChange({ ...form, landType: event.target.value })}>
                    <option value="">Select authority</option>
                    <option value="MUDA">MUDA</option>
                    <option value="REVENUE">REVENUE</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label>
                  Site no
                  <input value={form.siteNo} onChange={(event) => onFormChange({ ...form, siteNo: event.target.value })} placeholder="e.g. 12/3" />
                </label>
                <label>
                  Facing
                  <select value={form.facing} onChange={(event) => onFormChange({ ...form, facing: event.target.value })}>
                    <option value="">Select direction</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                  </select>
                </label>
                <label>
                  Nearby location
                  <input value={form.location} onChange={(event) => onFormChange({ ...form, location: event.target.value })} placeholder="e.g. Telecom Layout" />
                </label>
                <label>
                  Map link
                  <input value={form.mapsUrl} onChange={(event) => onFormChange({ ...form, mapsUrl: event.target.value })} placeholder="https://maps.google.com/..." />
                </label>
              </div>
              <label className="upload-label">
                <span className="upload-label-text">Add media</span>
                <input ref={editMediaInputRef} type="file" multiple accept="image/*,video/*" name="files" onChange={handleMediaSelection} />
              </label>
              {pendingMediaFiles.length > 0 ? (
                <div className="upload-summary">
                  <strong>{pendingMediaFiles.length} file{pendingMediaFiles.length > 1 ? 's' : ''} selected</strong>
                  <ul>
                    {pendingMediaFiles.map((file, index) => (
                      <li key={`${file.name}-${file.size}-${index}`}>
                        <span>{file.name} <span>({file.type.startsWith('video/') ? 'Video' : 'Image'})</span></span>
                        <button type="button" className="file-remove-btn" onClick={() => removeFile(index)} aria-label="Remove file">✕</button>
                      </li>
                    ))}
                  </ul>
                  <div className="muted">{pendingMediaSummary}</div>
                </div>
              ) : null}
              {visibleEditingMedia.length > 0 ? (
                <div className="upload-summary">
                  <strong>Current media</strong>
                  <ul>
                    {visibleEditingMedia.map((mediaItem) => (
                      <li key={mediaItem.id}>
                        <span>{mediaItem.mediaType === 'video' ? '🎬' : '🖼️'} {mediaItem.originalName || mediaItem.fileName}</span>
                        <button type="button" className="file-remove-btn" onClick={() => void handleRemoveExistingMedia(mediaItem.id)} aria-label={`Remove ${mediaItem.originalName || mediaItem.fileName}`}>✕</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <label>
                Information
                <textarea value={form.description} onChange={(event) => onFormChange({ ...form, description: event.target.value })} rows={6} />
              </label>
              <div className="form-actions">
                <button type="button" className="secondary-btn compact-action-btn" onClick={handleReset}>Cancel</button>
                <button type="submit" className="compact-action-btn" disabled={submitting}>{submitting ? 'Saving…' : 'Save changes'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showAdminControls && adminMode && showCreateForm ? (
        <form className="card form-card" onSubmit={handleCreateSubmit}>
          <div className="form-header">
            <h3>Add property</h3>
            <div className="form-header-actions">
              <button type="button" className="secondary-btn compact-action-btn" onClick={handleReset}>Clear</button>
              <button type="button" className="secondary-btn compact-action-btn" onClick={handleReset} aria-label="Close create form">✕</button>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Name
              <input value={form.name} onChange={(event) => onFormChange({ ...form, name: event.target.value })} placeholder="e.g. Krishna Property" />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(event) => onFormChange({ ...form, status: event.target.value })}>
                <option>Available</option>
                <option>Reserved</option>
                <option>Sold</option>
              </select>
            </label>
            <label>
              Price
              <input value={form.price} onChange={(event) => onFormChange({ ...form, price: event.target.value })} placeholder="e.g. ₹1,20,00,000" />
            </label>
            <label>
              Dimension
              <input value={form.dimension} onChange={(event) => onFormChange({ ...form, dimension: event.target.value })} placeholder="e.g. 30x40 ft" />
            </label>
            <label>
              Property type
              <select value={form.propertyType} onChange={(event) => onFormChange({ ...form, propertyType: event.target.value })}>
                <option value="Residential Property">Residential Property</option>
                <option value="Residential Land">Residential Land</option>
                <option value="Commercial Property">Commercial Property</option>
                <option value="Commercial Land">Commercial Land</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Area
              <input value={form.area} onChange={(event) => onFormChange({ ...form, area: event.target.value })} placeholder="e.g. Mysuru West" />
            </label>
            <label>
              Nearby location
              <input value={form.location} onChange={(event) => onFormChange({ ...form, location: event.target.value })} placeholder="e.g. Telecom Layout" />
            </label>
            <label>
              Authority
              <select value={form.landType} onChange={(event) => onFormChange({ ...form, landType: event.target.value })}>
                <option value="">Select authority</option>
                <option value="MUDA">MUDA</option>
                <option value="REVENUE">REVENUE</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Site no
              <input value={form.siteNo} onChange={(event) => onFormChange({ ...form, siteNo: event.target.value })} placeholder="e.g. 12/3" />
            </label>
            <label>
              Facing
              <select value={form.facing} onChange={(event) => onFormChange({ ...form, facing: event.target.value })}>
                <option value="">Select direction</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North-East">North-East</option>
                <option value="North-West">North-West</option>
                <option value="South-East">South-East</option>
                <option value="South-West">South-West</option>
              </select>
            </label>
            <label>
              Map link
              <input value={form.mapsUrl} onChange={(event) => onFormChange({ ...form, mapsUrl: event.target.value })} placeholder="https://maps.google.com/..." />
            </label>
            <label className="upload-label">
              <span className="upload-label-text">Media</span>
              <input ref={createMediaInputRef} type="file" multiple accept="image/*,video/*" name="files" onChange={handleMediaSelection} />
            </label>
          </div>
          <label>
            Description
            <textarea value={form.description} onChange={(event) => onFormChange({ ...form, description: event.target.value })} rows={3} />
          </label>
          {pendingMediaFiles.length > 0 ? (
            <div className="upload-summary">
              <strong>{pendingMediaFiles.length} file{pendingMediaFiles.length > 1 ? 's' : ''} selected</strong>
              <ul>
                {pendingMediaFiles.map((file, index) => (
                  <li key={`${file.name}-${file.size}-${index}`}>
                    <span>{file.name} <span>({file.type.startsWith('video/') ? 'Video' : 'Image'})</span></span>
                    <button type="button" className="file-remove-btn" onClick={() => removeFile(index)} aria-label="Remove file">✕</button>
                  </li>
                ))}
              </ul>
              <div className="muted">{pendingMediaSummary}</div>
            </div>
          ) : null}
          <div className="form-actions">
            <button type="submit" className="compact-action-btn" disabled={submitting}>{submitting ? 'Saving…' : 'Create property'}</button>
          </div>
        </form>
      ) : null}

      {error ? <div className="error-banner">{error}</div> : null}
      {uploadMessage ? <div className="toast-banner">{uploadMessage}</div> : null}

      <div className="card toolbar-card">
        <div className="muted">Showing {visibleProperties.length} of {properties.length} properties</div>
        <div className="toolbar-actions">
          {adminMode ? (
            <button type="button" className="secondary-btn compact-action-btn" onClick={() => onAdminModeChange(false)} aria-label="Disable admin mode">Exit admin mode</button>
          ) : null}
          {adminMode ? (
            <button type="button" className="secondary-btn compact-action-btn" onClick={handleOpenCreateForm}>Add property</button>
          ) : null}
        </div>
        <input
          placeholder="Search properties"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <div className="toolbar-filters">
          <select value={areaFilter} onChange={(event) => onAreaChange(event.target.value)}>
            <option value="All">All areas</option>
            {Array.from(new Set(properties.map((property) => property.area?.trim() || '').filter(Boolean))).sort().map((areaName) => (
              <option key={areaName} value={areaName}>{areaName}</option>
            ))}
          </select>
          <select value={propertyCategoryFilter} onChange={(event) => onPropertyCategoryChange(event.target.value as 'All' | PropertyCategory)}>
            <option value="All">All property types</option>
            <option value="Residential Property">Residential Property</option>
            <option value="Residential Land">Residential Land</option>
            <option value="Commercial Property">Commercial Property</option>
            <option value="Commercial Land">Commercial Land</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {loading ? <div className="card">Loading listings…</div> : null}

      {activePropertyDetail ? (
        <div className="media-modal" onClick={() => setActivePropertyDetail(null)}>
          <div className="media-modal-shell media-modal-shell-detail" onClick={(event) => event.stopPropagation()}>
            <div className="media-modal-gallery">
              <div id="media-stage-detail" className="media-modal-stage">
                <button type="button" className="media-modal-arrow media-modal-arrow-left" onClick={() => {
                  const currentIndex = activePropertyDetail.selectedIndex;
                  const nextIndex = currentIndex > 0 ? currentIndex - 1 : Math.max(activePropertyDetail.mediaList.length - 1, 0);
                  setActivePropertyDetail({ ...activePropertyDetail, selectedIndex: nextIndex });
                }} aria-label="Previous media">◀</button>
                {activePropertyDetail.mediaList[activePropertyDetail.selectedIndex]?.mediaType === 'video' ? (
                  <video controls src={getMediaUrl(activePropertyDetail.mediaList[activePropertyDetail.selectedIndex].filePath)} autoPlay playsInline />
                ) : activePropertyDetail.mediaList[activePropertyDetail.selectedIndex] ? (
                  <img src={getMediaUrl(activePropertyDetail.mediaList[activePropertyDetail.selectedIndex].filePath)} alt={activePropertyDetail.property.name} />
                ) : (
                  <div className="property-thumb placeholder large">🏡</div>
                )}
                <button type="button" className="media-modal-arrow media-modal-arrow-right" onClick={() => {
                  const currentIndex = activePropertyDetail.selectedIndex;
                  const nextIndex = activePropertyDetail.mediaList.length > 0 && currentIndex < activePropertyDetail.mediaList.length - 1 ? currentIndex + 1 : 0;
                  setActivePropertyDetail({ ...activePropertyDetail, selectedIndex: nextIndex });
                }} aria-label="Next media">▶</button>
                <button type="button" className="media-fullscreen-btn" onClick={() => {
                  const el = document.getElementById('media-stage-detail');
                  if (!el) return;
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    // @ts-ignore
                    el.requestFullscreen?.();
                  }
                }} aria-label="Toggle fullscreen">⤢</button>
                <span className="media-counter media-counter-overlay">{Math.min(activePropertyDetail.selectedIndex + 1, activePropertyDetail.mediaList.length)} / {activePropertyDetail.mediaList.length}</span>
              </div>
              <div className="media-modal-thumbs">
                {activePropertyDetail.mediaList.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`media-thumb-button ${index === activePropertyDetail.selectedIndex ? 'active' : ''}`}
                    onClick={() => setActivePropertyDetail({ ...activePropertyDetail, selectedIndex: index })}
                  >
                    {item.mediaType === 'video' ? '▶' : '◉'}
                  </button>
                ))}
              </div>
            </div>
            <aside className="media-modal-details">
              <div className="media-modal-detail-header">
                <div>
                  <p className="eyebrow">Property details</p>
                  <h3>{activePropertyDetail.property.name}</h3>
                  <p className="muted small-copy">{activePropertyDetail.property.propertyType}</p>
                </div>
                <button type="button" className="secondary-btn close-btn" onClick={() => setActivePropertyDetail(null)}>Close</button>
              </div>
              <div className="detail-pill-row">
                <span className={`status-badge ${activePropertyDetail.property.status.toLowerCase()}`}>{activePropertyDetail.property.status}</span>
                <span className="pill">{getPropertyCategory(activePropertyDetail.property.propertyType)}</span>
              </div>
              <div className="detail-price-row">
                <div className="dimension-row">
                  <span className="dimension-label">Dimension</span>
                  <strong className="dimension-value">{getPropertyDimension(activePropertyDetail.property)}</strong>
                </div>
                <div className="location-link-wrap">
                  <span className="location-link-icon" aria-hidden="true">📍</span>
                  {isValidUrl(activePropertyDetail.property.mapsUrl) ? (
                    <a href={activePropertyDetail.property.mapsUrl!.trim()} target="_blank" rel="noreferrer" className="location-link">Map</a>
                  ) : (
                    <span className="location-link muted">Map not available</span>
                  )}
                </div>
              </div>
              <p className="detail-description">{activePropertyDetail.property.description || 'A premium listing presented with immersive imagery and a clear overview of the property highlights.'}</p>
              <div className="detail-grid">
                <div><span>Area</span><strong>{activePropertyDetail.property.area || 'Not provided'}</strong></div>
                <div><span>Nearby location</span><strong>{activePropertyDetail.property.location || 'Not provided'}</strong></div>
                <div><span>Property Type</span><strong>{activePropertyDetail.property.propertyType || 'Not provided'}</strong></div>
                <div><span>Price</span><strong>{activePropertyDetail.property.price || 'Not provided'}</strong></div>
                <div><span>Facing</span><strong>{activePropertyDetail.property.facing || 'Flexible'}</strong></div>
                <div><span>Authority</span><strong>{activePropertyDetail.property.landType || 'Not provided'}</strong></div>
              </div>
            </aside>
          </div>
        </div>
      ) : null}

      {zoomedMedia ? (
        <div className="media-modal" onClick={() => setZoomedMedia(null)}>
          <div className="media-modal-shell" onClick={(event) => event.stopPropagation()}>
            <div className="media-modal-gallery">
              <div id="media-stage-zoom" className="media-modal-stage">
                <button type="button" className="media-modal-arrow media-modal-arrow-left" onClick={() => {
                  const currentIndex = zoomedMedia.mediaList.findIndex((item) => item.id === zoomedMedia.media.id);
                  const nextIndex = currentIndex > 0 ? currentIndex - 1 : zoomedMedia.mediaList.length - 1;
                  setZoomedMedia({ property: zoomedMedia.property, media: zoomedMedia.mediaList[nextIndex], mediaList: zoomedMedia.mediaList });
                }} aria-label="Previous media">◀</button>
                {zoomedMedia.media.mediaType === 'video' ? (
                  <video controls src={getMediaUrl(zoomedMedia.media.filePath)} autoPlay playsInline />
                ) : (
                  <img src={getMediaUrl(zoomedMedia.media.filePath)} alt={zoomedMedia.media.originalName} />
                )}
                <button type="button" className="media-modal-arrow media-modal-arrow-right" onClick={() => {
                  const currentIndex = zoomedMedia.mediaList.findIndex((item) => item.id === zoomedMedia.media.id);
                  const nextIndex = currentIndex < zoomedMedia.mediaList.length - 1 ? currentIndex + 1 : 0;
                  setZoomedMedia({ property: zoomedMedia.property, media: zoomedMedia.mediaList[nextIndex], mediaList: zoomedMedia.mediaList });
                }} aria-label="Next media">▶</button>
                <button type="button" className="media-fullscreen-btn" onClick={() => {
                  const el = document.getElementById('media-stage-zoom');
                  if (!el) return;
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    // @ts-ignore
                    el.requestFullscreen?.();
                  }
                }} aria-label="Toggle fullscreen">⤢</button>
                <span className="media-counter media-counter-overlay">{zoomedMedia.mediaList.findIndex((item) => item.id === zoomedMedia.media.id) + 1} / {zoomedMedia.mediaList.length}</span>
              </div>
              <div className="media-modal-thumbs">
                {zoomedMedia.mediaList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`media-thumb-button ${item.id === zoomedMedia.media.id ? 'active' : ''}`}
                    onClick={() => setZoomedMedia({ property: zoomedMedia.property, media: item, mediaList: zoomedMedia.mediaList })}
                  >
                    {item.mediaType === 'video' ? '▶' : '◉'}
                  </button>
                ))}
              </div>
            </div>
            <aside className="media-modal-details">
              <div className="media-modal-detail-header">
                <div>
                  <p className="eyebrow">Featured listing</p>
                  <h3>{zoomedMedia.property.name}</h3>
                </div>
                <button type="button" className="secondary-btn close-btn" onClick={() => setZoomedMedia(null)}>Close</button>
              </div>
              <div className="detail-pill-row">
                <span className={`status-badge ${zoomedMedia.property.status.toLowerCase()}`}>{zoomedMedia.property.status}</span>
                <span className="pill">{getPropertyCategory(zoomedMedia.property.propertyType)}</span>
              </div>
              <div className="detail-price-row">
                <div className="dimension-row">
                  <span className="dimension-label">Dimension</span>
                  <strong className="dimension-value">{getPropertyDimension(zoomedMedia.property)}</strong>
                </div>
                <div className="location-link-wrap">
                  <span className="location-link-icon" aria-hidden="true">📍</span>
                  {isValidUrl(zoomedMedia.property.mapsUrl) ? (
                    <a href={zoomedMedia.property.mapsUrl!.trim()} target="_blank" rel="noreferrer" className="location-link">Map</a>
                  ) : (
                    <span className="location-link muted">Map not available</span>
                  )}
                </div>
              </div>
              <p className="detail-description">{zoomedMedia.property.description || 'A premium listing presented with immersive imagery and a clear overview of the property highlights.'}</p>
              <div className="detail-grid">
                <div><span>Area</span><strong>{zoomedMedia.property.area || 'Not provided'}</strong></div>
                <div><span>Nearby location</span><strong>{zoomedMedia.property.location || 'Not provided'}</strong></div>
                <div><span>Property Type</span><strong>{zoomedMedia.property.propertyType || 'Not provided'}</strong></div>
                <div><span>Price</span><strong>{zoomedMedia.property.price || 'Not provided'}</strong></div>
                <div><span>Facing</span><strong>{zoomedMedia.property.facing || 'Flexible'}</strong></div>
                <div><span>Authority</span><strong>{zoomedMedia.property.landType || 'Not provided'}</strong></div>
              </div>
            </aside>
          </div>
        </div>
      ) : null}

      {sharePreview ? (
        <div className="share-preview-backdrop" onClick={() => setSharePreview(null)}>
          <div className="share-preview-modal" onClick={(event) => event.stopPropagation()}>
            <div className="media-modal-detail-header">
              <div>
                <p className="eyebrow">Share preview</p>
                <h3>{sharePreview.property.name}</h3>
              </div>
              <button type="button" className="secondary-btn close-btn" onClick={() => setSharePreview(null)}>Close</button>
            </div>

            <textarea
              className="share-preview-text"
              value={sharePreview.text}
              rows={14}
              onChange={(event) => setSharePreview((current) => (current ? { ...current, text: event.target.value } : current))}
            />

            <div className="detail-actions share-preview-actions">
              <button type="button" className="primary-btn" onClick={() => void handleShareAction('whatsapp')} disabled={sharing}>
                {sharing ? 'Opening…' : 'Open WhatsApp'}
              </button>
              <button type="button" className="secondary-btn" onClick={() => void handleShareAction('copy')} disabled={sharing}>
                Copy text
              </button>
              {(navigator as any).share ? (
                <button type="button" className="secondary-btn" onClick={() => void handleShareAction('native')} disabled={sharing}>
                  Share from device
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="property-grid">
        {visibleProperties.map((property) => {
          const primaryMedia = property.media?.find((item) => item.mediaType === 'image') ?? property.media?.[0];
          return (
            <div className="card property-card" key={property.id}>
              <div className="property-image-wrap">
                {primaryMedia ? (
                  <img
                    className="listing-image"
                    src={getMediaUrl(primaryMedia.filePath)}
                    alt={property.name}
                    onClick={() => setZoomedMedia({ property, media: primaryMedia, mediaList: property.media ?? [] })}
                  />
                ) : (
                  <div className="listing-image placeholder">🏡</div>
                )}
                <span className={`status-badge ${property.status.toLowerCase()}`}>{property.status}</span>
              </div>

                <div className="property-card-body">
                <div className="property-card-header">
                    <div>
                    <h3>{property.name}</h3>
                  </div>
                  <div className="dimension-row">
                    <span className="dimension-label">Dimension</span>
                    <strong className="dimension-value">{getPropertyDimension(property)}</strong>
                  </div>
                </div>

                <div className="property-meta compact-meta">
                  <span>{getPropertyCategory(property.propertyType)}</span>
                  {property.landType ? <span>Land {property.landType}</span> : null}
                  {property.siteNo ? <span>Site No {property.siteNo}</span> : null}
                  {property.facing ? <span>Facing {property.facing}</span> : null}
                  <span>{property.area || 'Not provided'}</span>
                </div>

                <div className="property-card-actions">
                  <button type="button" className="secondary-btn compact-action-btn" onClick={() => setActivePropertyDetail({ property, mediaList: property.media ?? [], selectedIndex: 0 })}>
                    View details
                  </button>
                  <button
                    type="button"
                    className="secondary-btn compact-action-btn"
                    onClick={() => shareProperty(property)}
                    disabled={sharing}
                  >
                    {sharing ? 'Sharing...' : 'Share'}
                  </button>
                  {adminMode ? (
                    <>
                      <button type="button" className="secondary-btn compact-action-btn" onClick={() => onEdit(property)}>Edit</button>
                      <button type="button" className="danger-btn compact-action-btn" onClick={() => onDelete(property.id)}>Delete</button>
                    </>
                  ) : null}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LeadInboxPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/leads`);
      if (!response.ok) {
        throw new Error('Unable to load leads');
      }
      const data = await response.json() as LeadItem[];
      setLeads(data);
      if (!selectedLeadId && data.length > 0) {
        setSelectedLeadId(data[0].id);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) ?? null;

  const generateDraft = async () => {
    if (!selectedLead) {
      return;
    }

    try {
      setSending(true);
      const response = await fetch(`${API_BASE}/leads/${selectedLead.id}/draft-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (!response.ok) {
        throw new Error('Unable to generate draft');
      }
      const data = await response.json() as { draft?: string };
      setDraft(data.draft || '');
    } catch (draftError) {
      setError(draftError instanceof Error ? draftError.message : 'Unable to generate draft');
    } finally {
      setSending(false);
    }
  };

  const approveDraft = async () => {
    if (!selectedLead || !draft.trim()) {
      return;
    }

    try {
      setSending(true);
      const response = await fetch(`${API_BASE}/leads/${selectedLead.id}/approve-draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft, channel: 'whatsapp' })
      });

      if (!response.ok) {
        throw new Error('Unable to approve draft');
      }

      setDraft('');
      await loadLeads();
    } catch (approveError) {
      setError(approveError instanceof Error ? approveError.message : 'Unable to approve draft');
    } finally {
      setSending(false);
    }
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Inbox</p>
          <h2>WhatsApp lead inbox</h2>
        </div>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}

      {loading ? <div className="card">Loading inbox…</div> : (
        <div className="inbox-layout">
          <aside className="card inbox-list">
            {leads.length === 0 ? <p className="muted">No leads captured yet.</p> : leads.map((lead) => (
              <button
                key={lead.id}
                type="button"
                className={`inbox-item ${lead.id === selectedLeadId ? 'active' : ''}`}
                onClick={() => setSelectedLeadId(lead.id)}
              >
                <strong>{lead.name || lead.phone || 'Unknown lead'}</strong>
                <span>{lead.phone || 'No phone'}</span>
                <small>{lead.lastMessage || 'No message yet'}</small>
              </button>
            ))}
          </aside>

          <div className="card inbox-detail">
            {selectedLead ? (
              <>
                <div className="detail-pill-row">
                  <span className="pill">{selectedLead.source || 'Manual'}</span>
                  <span className={`status-badge ${selectedLead.status.toLowerCase()}`}>{selectedLead.status}</span>
                </div>
                <h3>{selectedLead.name || selectedLead.phone || 'Lead conversation'}</h3>
                <p className="muted">{selectedLead.phone || 'No phone'} • {selectedLead.preferredArea || 'Area not set'} • {selectedLead.budget || 'Budget not set'}</p>

                <div className="message-thread">
                  {selectedLead.messages.map((message) => (
                    <div key={message.id} className={`message-bubble ${message.direction}`}>
                      <small>{message.provider || message.direction}</small>
                      <p>{message.body}</p>
                    </div>
                  ))}
                </div>

                <div className="draft-panel">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={7}
                    placeholder="AI draft or approved reply"
                  />
                  <div className="form-actions">
                    <button type="button" className="secondary-btn compact-action-btn" onClick={() => void generateDraft()} disabled={sending}>{sending ? 'Generating…' : 'Generate AI draft'}</button>
                    <button type="button" className="compact-action-btn" onClick={() => void approveDraft()} disabled={sending || !draft.trim()}>Approve & queue</button>
                  </div>
                </div>
              </>
            ) : (
              <p className="muted">Select a lead to review the conversation.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ReminderPage() {
  const [reminders, setReminders] = useState<LeadReminderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const response = await fetch(`${API_BASE}/reminders`);
        if (!response.ok) {
          throw new Error('Unable to load reminders');
        }
        const data = await response.json() as LeadReminderItem[];
        setReminders(data);
      } catch (error) {
        console.error('Reminder load failed', error);
      } finally {
        setLoading(false);
      }
    };

    void loadReminders();
  }, []);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Follow-up</p>
          <h2>Reminder engine</h2>
        </div>
      </div>

      {loading ? <div className="card">Loading reminders…</div> : (
        <div className="card">
          {reminders.length === 0 ? <p className="muted">No reminders scheduled yet.</p> : <ul className="stack-list">
            {reminders.map((item) => (
              <li key={item.id}><span>{item.title}</span><strong>{new Date(item.dueAt).toLocaleDateString()}</strong></li>
            ))}
          </ul>}
        </div>
      )}
    </section>
  );
}

function ReportsPage({ properties }: { properties: PropertyItem[] }) {
  const byType = properties.reduce<Record<string, number>>((accumulator, property) => {
    accumulator[property.propertyType] = (accumulator[property.propertyType] || 0) + 1;
    return accumulator;
  }, {});

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Insights</p>
          <h2>Reports</h2>
        </div>
      </div>
      <div className="stats-grid">
        <div className="card">
          <strong>{Object.keys(byType).length}</strong>
          <span>Property types</span>
        </div>
        <div className="card">
          <strong>{properties.filter((property) => property.status === 'Sold').length}</strong>
          <span>Sold</span>
        </div>
        <div className="card">
          <strong>{properties.filter((property) => property.status === 'Reserved').length}</strong>
          <span>Reserved</span>
        </div>
      </div>
      <div className="card">
        <h3>Type breakdown</h3>
        <ul className="stack-list">
          {Object.entries(byType).map(([type, count]) => (
            <li key={type}><span>{type}</span><strong>{count}</strong></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SettingsPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Preferences</p>
          <h2>Settings</h2>
        </div>
      </div>
      <div className="card">
        <p>Owner name, contact details, branding, and backup preferences can be wired here as the product grows.</p>
      </div>
    </section>
  );
}

export default App;
