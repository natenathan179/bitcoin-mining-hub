
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'cpu',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  brand text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  hashrate text NOT NULL DEFAULT '',
  power text NOT NULL DEFAULT '',
  efficiency text NOT NULL DEFAULT '',
  algorithm text NOT NULL DEFAULT 'SHA-256',
  condition text NOT NULL DEFAULT 'New',
  stock_status text NOT NULL DEFAULT 'In Stock',
  price numeric(12,2) NOT NULL DEFAULT 0,
  sale_price numeric(12,2),
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  images text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  rating int NOT NULL DEFAULT 5,
  title text NOT NULL DEFAULT '',
  body text NOT NULL,
  avatar_url text NOT NULL DEFAULT '',
  product_name text NOT NULL DEFAULT '',
  verified boolean NOT NULL DEFAULT true,
  approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews are publicly readable" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.categories (name, slug, description, icon, sort_order) VALUES
('Bitcoin Mining Machines','bitcoin-mining-machines','Complete SHA-256 bitcoin mining machines from every major manufacturer.','bitcoin',1),
('ASIC Miners','asic-miners','Application specific mining hardware built for maximum hashrate per watt.','cpu',2),
('Used & Refurbished Miners','used-refurbished-miners','Fully tested pre-owned miners with warranty and verified hashboards.','recycle',3),
('Mining Accessories','mining-accessories','Cables, controllers, PDUs, shelving and everything a mining site needs.','layers',4),
('Power Supplies','power-supplies','Genuine APW and PSU units for every miner model and voltage.','plug',5),
('Immersion Cooling','immersion-cooling','Single-phase immersion tanks, dielectric fluid and heat exchange kits.','snowflake',6),
('Hosting Solutions','hosting-solutions','Colocation in low-cost, high-uptime North American facilities.','server',7),
('Spare Parts','spare-parts','Hashboards, control boards, fans and connectors for fast repairs.','boxes',8);

INSERT INTO public.products (name, slug, brand, category_id, hashrate, power, efficiency, algorithm, condition, stock_status, price, short_description, description, specs, featured) VALUES
('Antminer S21 XP Hyd','antminer-s21-xp-hyd','Bitmain',(SELECT id FROM public.categories WHERE slug='bitcoin-mining-machines'),'473 TH/s','5676W','12 J/TH','SHA-256','New','In Stock',11499.00,
 'Bitmain flagship hydro-cooled miner delivering 473 TH/s at 12 J/TH for industrial farms.',
 'The Antminer S21 XP Hyd is Bitmain''s most efficient hydro-cooled bitcoin miner to date. Designed for large-scale operations running closed-loop liquid cooling, it delivers 473 TH/s of SHA-256 hashrate while holding an industry-leading 12 J/TH efficiency. Every unit shipped by Bitcoin Mining Depot is sourced directly through authorised channels, bench-tested for stable hashrate, and packed with original manufacturer accessories. Hydro cooling removes fan noise almost entirely and extends hashboard life by keeping junction temperatures low and stable, making the S21 XP Hyd the preferred choice for megawatt-scale deployments.',
 '{"Cooling":"Hydro","Voltage":"380V 3-phase","Warranty":"12 months","Dimensions":"430 x 195 x 209 mm","Weight":"20.7 kg","Noise":"50 dB"}'::jsonb,true),
('Antminer S21 Pro','antminer-s21-pro','Bitmain',(SELECT id FROM public.categories WHERE slug='asic-miners'),'234 TH/s','3510W','15 J/TH','SHA-256','New','In Stock',5899.00,
 'Air-cooled 234 TH/s workhorse with 15 J/TH efficiency for hosted and home deployments.',
 'The Antminer S21 Pro balances hashrate, efficiency and price better than any other air-cooled miner in its class. At 234 TH/s and 15 J/TH it produces meaningfully more revenue per kilowatt than the previous S19 generation while running on standard 220-240V single-phase power. That makes it equally suited to a hosted rack, a small commercial container or a properly ventilated garage. Each unit is inspected, firmware-verified and shipped with a 12 month warranty backed by our in-house repair lab.',
 '{"Cooling":"Air","Voltage":"200-240V","Warranty":"12 months","Dimensions":"400 x 195 x 290 mm","Weight":"14.6 kg","Noise":"75 dB"}'::jsonb,true),
('Whatsminer M60S++','whatsminer-m60s-plus-plus','MicroBT',(SELECT id FROM public.categories WHERE slug='asic-miners'),'282 TH/s','5076W','18 J/TH','SHA-256','New','In Stock',6499.00,
 'MicroBT high-output air-cooled miner engineered for hot climates and 24/7 duty.',
 'MicroBT built the Whatsminer M60S++ for operators who need uptime in demanding environments. Its reinforced power supply, wide input voltage range and conservative thermal design let it run through summer ambient temperatures that force other machines to throttle. At 282 TH/s it is one of the highest hashrate air-cooled units available. Bitcoin Mining Depot supplies M60 series miners with genuine MicroBT firmware, full manufacturer warranty registration and optional hosting placement.',
 '{"Cooling":"Air","Voltage":"200-277V","Warranty":"12 months","Dimensions":"425 x 232 x 306 mm","Weight":"16.1 kg","Noise":"78 dB"}'::jsonb,true),
('Antminer S19j Pro+','antminer-s19j-pro-plus','Bitmain',(SELECT id FROM public.categories WHERE slug='used-refurbished-miners'),'122 TH/s','3355W','27.5 J/TH','SHA-256','Refurbished','In Stock',949.00,
 'Fully tested refurbished S19j Pro+ — the best entry point into bitcoin mining.',
 'The S19j Pro+ remains the most popular second-hand bitcoin miner in the world, and for good reason: cheap capital cost, plentiful spare parts and predictable 122 TH/s output. Every refurbished unit we sell is stripped, ultrasonically cleaned, re-pasted, fitted with new fans where needed and burn-in tested for a minimum of 48 hours at full load. We publish the tested hashrate and hashboard chip counts for each machine before it ships, and back it with a 6 month parts and labour warranty.',
 '{"Cooling":"Air","Voltage":"200-240V","Warranty":"6 months","Dimensions":"370 x 195 x 290 mm","Weight":"14.2 kg","Noise":"75 dB"}'::jsonb,true),
('Avalon A1466','avalon-a1466','Canaan',(SELECT id FROM public.categories WHERE slug='bitcoin-mining-machines'),'150 TH/s','3230W','21.5 J/TH','SHA-256','New','In Stock',2199.00,
 'Rugged Canaan Avalon miner with excellent tolerance for unstable grid power.',
 'Canaan''s Avalon A1466 is the machine of choice where grid quality is imperfect. Its power supply tolerates wide voltage swings, and the chassis is built around a straight-through airflow path that resists dust build-up. 150 TH/s at 21.5 J/TH places it between the used S19 fleet and current-generation hardware, which often makes it the strongest option on a dollars-per-terahash basis. Supplied new with a 12 month Canaan warranty.',
 '{"Cooling":"Air","Voltage":"176-264V","Warranty":"12 months","Dimensions":"331 x 195 x 292 mm","Weight":"13.8 kg","Noise":"75 dB"}'::jsonb,false),
('Whatsminer M50S','whatsminer-m50s','MicroBT',(SELECT id FROM public.categories WHERE slug='used-refurbished-miners'),'126 TH/s','3260W','26 J/TH','SHA-256','Used','In Stock',1099.00,
 'Hosted-fleet M50S units, tested and graded, ideal for value-focused buyers.',
 'These M50S miners come out of a single hosted North American fleet, which means consistent firmware, consistent maintenance history and no mixed-grade surprises. Each unit is tested on our bench for a full hashrate curve, hashboard temperature spread and PSU ripple before grading. The M50S is a great pick if your electricity is below roughly seven cents per kilowatt hour and you want maximum terahash for the smallest possible capital outlay.',
 '{"Cooling":"Air","Voltage":"200-240V","Warranty":"6 months","Dimensions":"425 x 195 x 292 mm","Weight":"14.5 kg","Noise":"75 dB"}'::jsonb,false),
('Bitmain APW12 Power Supply','bitmain-apw12-power-supply','Bitmain',(SELECT id FROM public.categories WHERE slug='power-supplies'),'-','3600W','-','-','New','In Stock',249.00,
 'Genuine Bitmain APW12 PSU for S19 series miners, 3600W at 220-240V.',
 'A failing power supply is the most common cause of a dead miner, and the APW12 is the correct genuine replacement for the entire S19 family. It supplies up to 3600W at 220-240V input and includes all ten 6-pin PCIe leads plus the control board lead. We stock APW12 units in volume for same-day dispatch because downtime, not hardware cost, is what really hurts a mining operation.',
 '{"Output":"3600W","Input":"200-240V","Connectors":"10 x 6-pin","Warranty":"12 months"}'::jsonb,false),
('Immersion Cooling Starter Tank (6 Miner)','immersion-cooling-starter-tank','Depot Systems',(SELECT id FROM public.categories WHERE slug='immersion-cooling'),'-','-','-','-','New','Made To Order',7450.00,
 'Single-phase immersion tank, pump, dry cooler and fluid for six ASIC miners.',
 'This turnkey single-phase immersion kit holds six standard-form-factor ASIC miners and includes the tank, circulation pump, plate heat exchanger, outdoor dry cooler, hoses, fittings and the first fill of dielectric fluid. Immersion cooling eliminates fan noise, removes dust failure modes entirely and lets you safely overclock hardware by 20-30% while extending hashboard life. Our engineering team provides the conversion guide and remote commissioning support with every kit.',
 '{"Capacity":"6 miners","Heat rejection":"30 kW","Fluid":"Included, 200L","Lead time":"3-4 weeks"}'::jsonb,false),
('S19 Series Replacement Hashboard','s19-replacement-hashboard','Bitmain',(SELECT id FROM public.categories WHERE slug='spare-parts'),'-','-','-','SHA-256','Refurbished','In Stock',179.00,
 'Tested replacement hashboard for Antminer S19 / S19j Pro repairs.',
 'Restore a downed S19 for a fraction of replacement cost. Every hashboard is chip-count verified, tested on a live control board, and graded before shipping. Include your miner model and control board version when ordering and our technicians will confirm compatibility before dispatch. Bulk pricing is available for repair shops and hosting providers.',
 '{"Compatibility":"S19 / S19j / S19j Pro","Testing":"Full chip count verified","Warranty":"90 days"}'::jsonb,false),
('Hosting - Per Miner Monthly Slot','hosting-per-miner-monthly','Bitcoin Mining Depot',(SELECT id FROM public.categories WHERE slug='hosting-solutions'),'-','Up to 3.5kW','-','-','New','Available',89.00,
 'Colocation slot in a tier-grade North American facility with 24/7 monitoring.',
 'Ship your miner to us and we handle the rest: racking, networking, pool configuration, firmware, monitoring and repairs. Pricing covers the rack slot, monitoring and remote hands; power is billed at the metered rate agreed in your hosting contract. You get a dashboard with per-machine hashrate and uptime, plus proactive alerts when a hashboard degrades. Minimum order is five miners for new hosting clients.',
 '{"Uptime target":"99%","Power":"Metered, contract rate","Minimum":"5 miners","Support":"24/7 remote hands"}'::jsonb,false);

INSERT INTO public.reviews (name, location, rating, title, body, avatar_url, product_name, created_at) VALUES
('Michael Turner','Calgary, Canada',5,'Fast shipping, machine hashing in 2 days','Ordered two S21 Pro units on a Monday and they cleared customs and were hashing in my rack by Wednesday. Both units hit rated hashrate immediately. The tracking updates from the team were genuinely useful.','https://randomuser.me/api/portraits/men/32.jpg','Antminer S21 Pro','2026-06-02'),
('Sofia Martinez','Austin, TX, USA',5,'Best wholesale pricing I found','I compared six vendors before placing a 40 unit order. Bitcoin Mining Depot beat everyone on price and were the only ones who would put the hashboard test reports in writing before payment.','https://randomuser.me/api/portraits/women/44.jpg','Whatsminer M60S++','2026-05-21'),
('Daniel Okafor','Lagos, Nigeria',5,'They actually answer the phone','Support walked me through PSU voltage issues on a Sunday evening. That level of service is rare in this industry. Two more orders placed since.','https://randomuser.me/api/portraits/men/76.jpg','Bitmain APW12 Power Supply','2026-05-14'),
('Emma Novak','Prague, Czechia',5,'Refurbished units better than expected','Bought four refurbished S19j Pro+ machines. They arrived immaculately cleaned with new fans and all four are running above the quoted hashrate. Excellent value.','https://randomuser.me/api/portraits/women/68.jpg','Antminer S19j Pro+','2026-05-09'),
('James Whitfield','Manchester, UK',4,'Great hardware, customs took a while','No complaints about the miner itself, it has been rock solid. UK import duty slowed things down by a week but the team pre-filled all the paperwork correctly.','https://randomuser.me/api/portraits/men/12.jpg','Avalon A1466','2026-05-03'),
('Yuki Tanaka','Osaka, Japan',5,'Immersion kit is superb','The starter tank arrived complete, nothing missing, and their engineer joined a video call to walk through commissioning. Noise in the workshop dropped to nothing.','https://randomuser.me/api/portraits/women/23.jpg','Immersion Cooling Starter Tank (6 Miner)','2026-04-27'),
('Andre Silva','Sao Paulo, Brazil',5,'Second order, same quality','Repeat customer. Both orders arrived exactly as described with real serial numbers matching the invoice. That consistency is why I keep coming back.','https://randomuser.me/api/portraits/men/55.jpg','Whatsminer M50S','2026-04-22'),
('Hannah Berg','Stockholm, Sweden',5,'Hosting has been flawless','Put ten machines into their hosting programme six months ago. Uptime dashboard is honest and they replaced a failed hashboard without me having to chase them.','https://randomuser.me/api/portraits/women/90.jpg','Hosting - Per Miner Monthly Slot','2026-04-18'),
('Robert Chen','Vancouver, Canada',5,'Genuine Bitmain units, verified','Registered the warranty directly with the manufacturer with no issues, which tells you the units are legitimate. Plenty of sellers cannot say that.','https://randomuser.me/api/portraits/men/86.jpg','Antminer S21 XP Hyd','2026-04-11'),
('Priya Nair','Dubai, UAE',5,'Handled a 100 unit deployment','They coordinated freight, spare parts stock and a commissioning checklist for our container build. Project came in on schedule.','https://randomuser.me/api/portraits/women/12.jpg','Antminer S21 Pro','2026-04-05'),
('Marcus Lindqvist','Oslo, Norway',4,'Solid machines, wish stock lasted longer','Popular models sell out quickly. Once I got on their restock notification list it was straightforward. Machines are performing well through winter.','https://randomuser.me/api/portraits/men/40.jpg','Whatsminer M60S++','2026-03-29'),
('Grace Adeyemi','Accra, Ghana',5,'Repair service saved two miners','Sent in two dead S19s expecting to write them off. Both came back hashing at full rate for less than a third of replacement cost.','https://randomuser.me/api/portraits/women/33.jpg','S19 Series Replacement Hashboard','2026-03-24'),
('Thomas Meier','Zurich, Switzerland',5,'Transparent about used grades','They sent photos and test logs for each used unit before I paid. No surprises on delivery. This is how used hardware should be sold.','https://randomuser.me/api/portraits/men/22.jpg','Whatsminer M50S','2026-03-18'),
('Laura Bennett','Melbourne, Australia',5,'Shipped to Australia without drama','Freight to Australia is usually painful. They used a forwarder that knew what they were doing and everything arrived undamaged and correctly declared.','https://randomuser.me/api/portraits/women/57.jpg','Antminer S19j Pro+','2026-03-12'),
('Ahmed Farouk','Cairo, Egypt',5,'Good advice, not just a sales pitch','They talked me out of a more expensive machine because my power cost made a cheaper unit more profitable. Honest advice earns repeat business.','https://randomuser.me/api/portraits/men/64.jpg','Avalon A1466','2026-03-06'),
('Nina Kowalski','Warsaw, Poland',5,'Accessories in stock when nobody else had them','Needed PSUs urgently after a surge event. They had genuine APW12 units in stock and dispatched the same day.','https://randomuser.me/api/portraits/women/75.jpg','Bitmain APW12 Power Supply','2026-02-28'),
('David Kimani','Nairobi, Kenya',5,'Great first mining purchase','As a first-time buyer I had a lot of questions. They answered all of them without making me feel like a nuisance and the machine has been mining since day one.','https://randomuser.me/api/portraits/men/17.jpg','Antminer S19j Pro+','2026-02-20'),
('Isabella Rossi','Milan, Italy',5,'Invoicing and compliance were easy','Proper VAT invoice, correct HS codes, company details on everything. Our accountant had zero follow-up questions, which never happens.','https://randomuser.me/api/portraits/women/85.jpg','Antminer S21 Pro','2026-02-14'),
('Chris Boateng','Toronto, Canada',4,'Very good, minor packaging scuff','One outer carton was scuffed in transit but the miner inside was untouched and tested perfect. Support followed up unprompted to check.','https://randomuser.me/api/portraits/men/91.jpg','Whatsminer M60S++','2026-02-07'),
('Elena Petrova','Almaty, Kazakhstan',5,'Reliable partner for our farm','We have bought over 300 machines through them across two years. Pricing, logistics and after-sales support have all stayed consistent.','https://randomuser.me/api/portraits/women/29.jpg','Antminer S21 XP Hyd','2026-01-30');
