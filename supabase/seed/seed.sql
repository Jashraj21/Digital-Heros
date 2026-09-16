-- =====================================================================
-- DIGITAL HEROES PLATFORM - COMPREHENSIVE SEED DATA
-- =====================================================================

-- Insert Charities
INSERT INTO public.charities (id, name, slug, category, description, mission_statement, logo_url, cover_image_url, featured, total_raised, supporter_count, website_url, events)
VALUES
('c0000000-0000-0000-0000-000000000001', 'Fairways for Youth', 'fairways-for-youth', 'Youth & Grassroots', 
 'Empowering disadvantaged young people through golf mentoring, junior equipment grants, and life skills coaching across underserved communities.',
 'Breaking down social and economic barriers to open the game of golf to thousands of underprivileged youth every year.',
 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=200&auto=format&fit=crop&q=80',
 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1200&auto=format&fit=crop&q=80',
 TRUE, 18450.00, 420, 'https://fairwaysforyouth.org',
 '[{"id": "event-1", "title": "Junior Masters Charity Golf Day 2026", "date": "2026-04-18", "location": "Woburn Golf Club, Milton Keynes", "description": "18-hole scramble tournament pairing juniors with tour pros, followed by charity auction.", "eventType": "golf_day"}]'::jsonb),

('c0000000-0000-0000-0000-000000000002', 'Hero Wings & Adaptive Golf', 'hero-wings-adaptive-golf', 'Veterans & Adaptive Sports',
 'Rehabilitating wounded military veterans and adaptive athletes through specialized golf equipment, therapeutic coaching, and community support.',
 'Restoring confidence, mobility, and camaraderie to injured service personnel on the golf course.',
 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=200&auto=format&fit=crop&q=80',
 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1200&auto=format&fit=crop&q=80',
 TRUE, 24780.00, 560, 'https://herowingsadaptive.org',
 '[{"id": "event-3", "title": "Armed Forces Cup Invitational", "date": "2026-05-24", "location": "Celtic Manor Resort, Newport", "description": "Annual celebrity and veteran Ryder-cup style charity match.", "eventType": "golf_day"}]'::jsonb),

('c0000000-0000-0000-0000-000000000003', 'Green Greens Foundation', 'green-greens-foundation', 'Environmental & Conservation',
 'Pioneering ecological preservation, native biodiversity, and zero-chemical water stewardship on community open spaces and golf courses.',
 'Transforming sporting landscapes into flourishing ecological sanctuaries and wildlife corridors.',
 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&auto=format&fit=crop&q=80',
 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
 TRUE, 14200.00, 310, 'https://greengreens.org',
 '[{"id": "event-4", "title": "Eco-Links Tree Planting Golf Day", "date": "2026-04-30", "location": "Royal St Georges, Sandwich", "description": "Planting 500 indigenous trees along coastal links.", "eventType": "golf_day"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;
