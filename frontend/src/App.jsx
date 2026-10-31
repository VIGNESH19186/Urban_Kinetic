import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Activity, ArrowDownUp, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Bike,
  Bus, Check, ChevronDown, HelpCircle, Clock3, CreditCard, LocateFixed,
  MapPin, Menu, Navigation, Plus, QrCode, Search, ShieldCheck, TrainFront,
  Wallet, X,
} from 'lucide-react';

const initialCenter = [40.7128, -74.006];
const routes = [
  { line: 'M2', color: '#0d9b78', title: 'Grand Central · Platform 2', detail: 'Central Line', time: '2 min', status: 'Low crowding', kind: 'train' },
  { line: '42', color: '#3869f6', title: 'River North Terminal', detail: 'Express Route', time: '4 min', status: 'On time', kind: 'bus' },
  { line: 'B8', color: '#009b8c', title: 'CityVille Dock 14', detail: 'Bike share · 3 bikes ready', time: '8 min', status: '12 min', kind: 'bike' },
  { line: 'M5', color: '#963df0', title: 'International Airport', detail: 'Airport Express', time: '6 min', status: 'Platform 3', kind: 'train' },
];

const pinIcon = L.divIcon({ className: 'map-pin-wrap', html: '<span class="map-pin"><span></span></span>', iconSize: [28, 36], iconAnchor: [14, 34] });
const stopIcon = (color) => L.divIcon({ className: 'stop-marker', html: `<span style="--pin-color:${color}"></span>`, iconSize: [17, 17], iconAnchor: [8, 8] });

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, Math.max(map.getZoom(), 14), { duration: 0.8 }); }, [center, map]);
  return null;
}

function TransitMap({ center, onLocate, compact = false }) {
  return (
    <div className={`map-frame ${compact ? 'map-compact' : ''}`}>
      <MapContainer center={center} zoom={14} scrollWheelZoom={false} zoomControl={!compact}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapRecenter center={center} />
        <Marker position={center} icon={pinIcon}><Popup>Your location</Popup></Marker>
        {[[40.718, -74.002, '#0d9b78'], [40.707, -74.012, '#3869f6'], [40.715, -73.992, '#963df0']].map(([lat, lng, color], i) => <Marker key={i} position={[lat, lng]} icon={stopIcon(color)}><Popup>{routes[i].title}</Popup></Marker>)}
      </MapContainer>
      <button className="map-locate" aria-label="Locate me" onClick={onLocate}><LocateFixed size={17} /></button>
    </div>
  );
}

function App() {
  const [section, setSection] = useState('live');
  const [center, setCenter] = useState(initialCenter);
  const [gps, setGps] = useState('Ready to locate');
  const [origin, setOrigin] = useState('Current location');
  const [destination, setDestination] = useState('Tech Innovation District');
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState('All modes');
  const [menuOpen, setMenuOpen] = useState(false);
  const [passActive, setPassActive] = useState(true);

  const locate = () => {
    if (!navigator.geolocation) { setGps('GPS is unavailable in this browser'); return; }
    setGps('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setCenter([coords.latitude, coords.longitude]); setOrigin('Your current location'); setGps('Location updated'); },
      () => setGps('Location permission is off'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const notify = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600); };
  const navItems = [
    { id: 'live', label: 'Live Trip', icon: Navigation },
    { id: 'plan', label: 'Plan', icon: ArrowLeft },
    { id: 'nearby', label: 'Nearby', icon: MapPin },
    { id: 'wallet', label: 'Wallet', icon: CreditCard },
  ];
  const filteredRoutes = useMemo(() => mode === 'All modes' ? routes : routes.filter(r => mode === 'Train' ? r.kind === 'train' : mode === 'Bus' ? r.kind === 'bus' : r.kind === 'bike'), [mode]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={(e) => { e.preventDefault(); setSection('live'); }}><span className="brand-mark"><Activity size={20} /></span><span>Urban<span className="brand-light">Kinetic</span><small>MOVE WELL. ARRIVE BETTER.</small></span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setSection(id)} className={section === id ? 'nav-link active' : 'nav-link'}><Icon size={16} />{label}</button>)}</nav>
        <div className="top-actions"><span className="service-pill"><i /> Network live</span><button className="icon-button notification" aria-label="Notifications" onClick={() => notify('You’re all caught up')}><Bell size={18} /><b /></button><button className="avatar" onClick={() => notify('Signed in as Alex Morgan')}>AM</button><button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X /> : <Menu />}</button></div>
      </header>
      {menuOpen && <div className="mobile-nav">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSection(id); setMenuOpen(false); }}><Icon size={17} />{label}</button>)}</div>}

      <main className="page-wrap">
        <div className="page-heading"><div><p className="eyebrow">SATURDAY, OCTOBER 31 <span>·</span> GOOD MORNING, ALEX</p><h1>{section === 'live' ? 'Your city, in motion.' : section === 'plan' ? 'Find your best route.' : section === 'nearby' ? 'Transit around you.' : 'Your travel wallet.'}</h1><p className="heading-sub">{section === 'live' ? 'Your commute is looking good today.' : section === 'plan' ? 'Compare ways to get there, all in one place.' : section === 'nearby' ? 'Live departures and shared rides near your location.' : 'Your passes, tickets, and travel perks.'}</p></div><button className="gps-button" onClick={locate}><LocateFixed size={16} />{gps.includes('updated') ? 'GPS updated' : 'Use my location'}</button></div>

        {section === 'live' && <div className="content-grid">
          <section className="column-main">
            <article className="card trip-card"><div className="card-topline"><span className="live-tag"><i /> YOUR ACTIVE TRIP</span><button className="text-button" onClick={() => setSection('plan')}>Change trip <ArrowUpRight size={14} /></button></div><h2>Home to the office</h2><div className="route-summary"><div className="route-line"><span className="line-dot start-dot" /><span className="line-stem" /><span className="line-dot end-dot" /></div><div className="route-stops"><div><strong>{origin}</strong><small>Madison Sq · 8:42 AM</small></div><div><strong>{destination}</strong><small>17 River Street · 9:06 AM</small></div></div><div className="arrival"><b>24 <small>min</small></b><span>ARRIVING 9:06</span></div></div><div className="route-meta"><span><TrainFront size={15} /> M2 · Central Line</span><span className="meta-dot" /><span>2 stops</span><span className="meta-dot" /><span>4.8 km</span><span className="on-time"><Check size={13} /> On time</span></div><div className="trip-actions"><button className="button-primary" onClick={() => notify('Navigation started — follow the M2 Central Line')}><Navigation size={15} /> Start navigation <ArrowRight size={15} /></button><button className="button-quiet" onClick={locate}><LocateFixed size={16} /></button></div></article>
            <article className="card timeline-card"><div className="section-title"><div><span className="eyebrow">YOUR JOURNEY</span><h3>Next stops</h3></div><span className="small-muted">4 steps · 24 min</span></div><div className="timeline"><div className="timeline-item done"><span className="timeline-node"><Check size={11} /></span><div><b>Madison Square</b><small>Walk to Platform 2</small></div><time>8:42</time></div><div className="timeline-item current"><span className="timeline-node"><i /></span><div><b>34th St Exchange <em>BOARD NOW</em></b><small>M2 Central Line · Platform 2</small></div><time>Now</time></div><div className="timeline-item"><span className="timeline-node" /><div><b>Union Square Transfer Point</b><small>Change to Green Line</small></div><time>8:53</time></div><div className="timeline-item"><span className="timeline-node" /><div><b>Tech Innovation District</b><small>Walk to your destination</small></div><time>9:06</time></div></div></article>
            <div className="quick-grid"><button className="quick-action" onClick={() => notify('Share link copied')}><span className="quick-icon mint"><ArrowUpRight size={17} /></span><span><b>Share trip</b><small>Let someone follow along</small></span></button><button className="quick-action" onClick={() => notify('Safety check-in is ready')}><span className="quick-icon coral"><ShieldCheck size={17} /></span><span><b>Safety check-in</b><small>Travel with peace of mind</small></span></button><button className="quick-action" onClick={() => notify('Help center opened')}><span className="quick-icon lavender"><HelpCircle size={17} /></span><span><b>Get help</b><small>We’re here if you need us</small></span></button></div>
          </section>
          <aside className="column-side"><article className="map-card"><div className="map-heading"><div><span className="eyebrow">LIVE MAP</span><h3>Downtown, New York</h3></div><button className="map-expand" onClick={() => setSection('nearby')} aria-label="Open nearby map"><ArrowUpRight size={16} /></button></div><TransitMap center={center} onLocate={locate} compact /><div className="map-legend"><span><i className="legend-you" /> You</span><span><i className="legend-train" /> Transit stop</span><span className="map-scale">LIVE GPS</span></div></article><article className="advisory"><div className="advisory-icon"><Activity size={17} /></div><div><b>All lines running smoothly</b><p>No delays on your route. Enjoy the ride.</p></div><span className="advisory-check"><Check size={14} /></span></article><article className="card commute-card"><div className="section-title"><div><span className="eyebrow">YOUR IMPACT</span><h3>A lighter commute</h3></div><span className="leaf-icon">✳</span></div><div className="impact-stats"><div><b>24.6 <small>kg</small></b><span>CO₂ saved this month</span></div><div><b>45 <small>min</small></b><span>saved this week</span></div></div><div className="impact-progress"><span /></div><p className="tiny-note">You’ve taken 12 low-carbon trips this month. Nice work!</p></article></aside>
        </div>}

        {section === 'plan' && <div className="plan-layout"><section className="card plan-panel"><span className="eyebrow">ROUTE PLANNER</span><h2>Where to next?</h2><div className="location-fields"><label><span className="field-dot field-start" /><input value={origin} onChange={e => setOrigin(e.target.value)} aria-label="Starting point" /></label><button className="swap-button" onClick={() => { setOrigin(destination); setDestination(origin); }} aria-label="Swap locations"><ArrowDownUp size={16} /></button><label><span className="field-dot field-end" /><input value={destination} onChange={e => setDestination(e.target.value)} aria-label="Destination" /></label></div><div className="plan-controls"><label><Clock3 size={15} /><select aria-label="Departure time"><option>Leave now</option><option>Depart at…</option><option>Arrive by…</option></select><ChevronDown size={14} /></label><button className="button-primary" onClick={() => notify('Routes refreshed with live departures')}><Search size={15} /> Find routes</button></div><div className="results-heading"><div><span className="eyebrow">BEST OPTIONS</span><h3>3 ways to get there</h3></div><button className="text-button" onClick={() => notify('Sorted by fastest route')}>Fastest <ChevronDown size={14} /></button></div><div className="route-options"><article className="route-option recommended"><span className="recommend-label">✦ RECOMMENDED</span><div className="option-main"><span className="option-icon green"><TrainFront size={19} /></span><div><b>Metro · Central Line</b><small>M2 to Union Sq, then Green Line</small></div><strong>24 <small>min</small></strong></div><div className="option-foot"><span>Leaves in 2 min</span><span>2 transfers</span><b>$2.75</b></div></article><article className="route-option"><div className="option-main"><span className="option-icon blue"><Bus size={19} /></span><div><b>Bus · 42 Express</b><small>Direct · River North Terminal</small></div><strong>32 <small>min</small></strong></div><div className="option-foot"><span>Leaves in 7 min</span><span>Direct</span><b>$2.00</b></div></article><article className="route-option"><div className="option-main"><span className="option-icon purple"><Bike size={19} /></span><div><b>Bike + Metro</b><small>CityVille Dock 14 · 3 bikes ready</small></div><strong>18 <small>min</small></strong></div><div className="option-foot"><span>Ready now</span><span>Low traffic</span><b>$3.20</b></div></article></div></section><aside className="plan-map-column"><article className="map-card plan-map-card"><div className="map-heading"><div><span className="eyebrow">ROUTE OVERVIEW</span><h3>4.8 km · Downtown</h3></div><button className="map-expand" onClick={locate}><LocateFixed size={16} /></button></div><TransitMap center={center} onLocate={locate} /></article><div className="advisory"><div className="advisory-icon"><Check size={17} /></div><div><b>Good time to travel</b><p>All suggested routes are on schedule.</p></div></div></aside></div>}

        {section === 'nearby' && <div className="nearby-layout"><section className="card departures-panel"><div className="section-title"><div><span className="eyebrow">STOPS NEAR YOU</span><h2>Nearby departures</h2></div><button className="round-icon" onClick={locate}><LocateFixed size={17} /></button></div><div className="filter-row">{['All modes', 'Train', 'Bus', 'Bike'].map(item => <button key={item} className={mode === item ? 'filter-chip selected' : 'filter-chip'} onClick={() => setMode(item)}>{item === 'Train' ? <TrainFront size={13} /> : item === 'Bus' ? <Bus size={13} /> : item === 'Bike' ? <Bike size={13} /> : <span className="tiny-four">✣</span>}{item}</button>)}<span className="within-label">Within 2 km <ChevronDown size={13} /></span></div><div className="departures-list">{filteredRoutes.map(route => <button key={route.line} className="departure-row" onClick={() => notify(`${route.title} selected`)}><span className="line-badge" style={{ '--line-color': route.color }}>{route.line}</span><span className="departure-info"><b>{route.title}</b><small>{route.detail}</small><small className="crowd"><i /> {route.status}</small></span><span className="departure-time"><b>{route.time}</b><small>away</small></span><ArrowRight size={15} className="row-arrow" /></button>)}</div><button className="load-more" onClick={() => notify('You’re seeing all nearby departures')}>Explore all nearby stops <ArrowRight size={15} /></button></section><aside className="nearby-map-column"><article className="map-card"><div className="map-heading"><div><span className="eyebrow">EXPLORE</span><h3>Transit near you</h3></div><button className="map-expand" onClick={locate}><LocateFixed size={16} /></button></div><TransitMap center={center} onLocate={locate} /><div className="map-legend"><span><i className="legend-you" /> Your location</span><span><i className="legend-train" /> Stops</span><span className="map-scale">2 KM</span></div></article><p className="gps-caption"><LocateFixed size={13} /> {gps} · <button onClick={locate}>Refresh location</button></p></aside></div>}

        {section === 'wallet' && <div className="wallet-layout"><section className="wallet-main"><article className="wallet-hero"><div className="wallet-top"><span className="wallet-chip"><span /> {passActive ? 'ACTIVE PASS' : 'PASS PAUSED'}</span><span className="zone-tag">ZONE 1 TO 4</span><button className="autorenew" onClick={() => setPassActive(!passActive)}><span className={passActive ? 'toggle on' : 'toggle'} /> Auto-renew</button></div><p className="wallet-label">MetroPass Ultimate</p><div className="balance-caption">AVAILABLE BALANCE</div><div className="balance">$38.50 <small>USD</small></div><div className="wallet-bottom"><span>Alex Morgan<br /><small>Member since 2023</small></span><span className="card-number">CARD NO.<br /><b>•••• 8896</b></span></div></article><div className="wallet-actions"><button onClick={() => notify('Add money flow opened')}><span className="quick-icon mint"><Plus size={18} /></span><b>Add Money</b><small>Card / Reload</small></button><button onClick={() => notify('Monthly pass options opened')}><span className="quick-icon lavender"><CreditCard size={18} /></span><b>Buy Monthly Pass</b><small>Save 15%</small></button><button onClick={() => notify('Your QR ticket is ready')}><span className="quick-icon mint"><QrCode size={18} /></span><b>Show QR Ticket</b><small>Scan to board</small></button></div><article className="card ticket-card"><div className="section-title"><div><span className="eyebrow">TICKET INSPECTOR ACCESS</span><h3>Your travel pass</h3></div><span className="live-tag"><i /> VALID</span></div><div className="pass-valid"><Check size={13} /> Valid for unlimited rides · All zones</div><div className="qr-code" aria-label="Decorative ticket QR code"><span /><span /><span /><i /><i /><i /><i /><i /><i /><b /><b /><b /></div><p className="qr-caption">DYNAMIC SECURITY CODE · REFRESHES EVERY 30 SEC</p><div className="ticket-meta"><span>Valid thru <b>Nov 30, 2026</b></span><button onClick={() => notify('Pass details opened')}>View pass details <ArrowRight size={13} /></button></div></article></section><aside className="wallet-side"><article className="card impact-card"><div className="section-title"><div><span className="eyebrow">COMMUTER PERKS</span><h3>Your impact</h3></div><span className="leaf-icon">✳</span></div><div className="impact-stats"><div><span className="perk-icon blue"><ArrowUpRight size={15} /></span><b>45 <small>min</small></b><span>saved this week</span></div><div><span className="perk-icon mint"><Activity size={15} /></span><b>24.6 <small>kg</small></b><span>CO₂ saved this month</span></div></div></article><article className="card recent-card"><div className="section-title"><div><span className="eyebrow">YOUR ACTIVITY</span><h3>Recent trips & taps</h3></div><button className="text-button" onClick={() => notify('Showing all activity')}>View all</button></div>{[['M2', '34th St to Pier 17', 'Today 08:42 · NFC Tap In', '−$2.75', 'green'], ['B8', 'CityVille E-Bike', 'Yesterday 17:15 · 12 min unlock', '−$1.80', 'blue'], ['M5', 'Grand Central to Metro Center', 'Yesterday 09:12 · Free transfer', '$0.00', 'dark']].map(([line, title, meta, price, color]) => <div className="recent-trip" key={title}><span className={`recent-icon ${color}`}>{line}</span><span><b>{title}</b><small>{meta}</small></span><span className="trip-price">{price}<small>{price === '$0.00' ? 'Applied' : 'Settled'}</small></span></div>)}</article><div className="help-strip"><HelpCircle size={17} /><span><b>Need a hand?</b><small>Visit our travel help center</small></span><ArrowRight size={15} /></div></aside></div>}
      </main>

      <nav className="bottom-nav" aria-label="Mobile navigation">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setSection(id)} className={section === id ? 'bottom-item selected' : 'bottom-item'}><Icon size={18} /><span>{label}</span></button>)}</nav>
      {notice && <div className="toast"><Check size={16} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={14} /></button></div>}
    </div>
  );
}

export default App;



